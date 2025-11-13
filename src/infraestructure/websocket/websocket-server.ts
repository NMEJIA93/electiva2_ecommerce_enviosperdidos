import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { TrackingService } from '../../domain/services/tracking-services';
import { MongoTrackingRepository } from '../repositories/mongo-tracking';
import { TrackingStatus } from '../../domain/entities/Tracking';

export class WebSocketServer {
    private io: SocketIOServer;
    private trackingService: TrackingService;
    private statusUpdateInterval: NodeJS.Timeout | null = null;

    constructor(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.trackingService = new TrackingService(new MongoTrackingRepository());
        this.setupSocketHandlers();
        this.startAutomaticStatusUpdates();
    }

    private setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`[WEBSOCKET] Client connected: ${socket.id}`);

            socket.on('join-tracking', (trackingNumber: string) => {
                socket.join(`tracking-${trackingNumber}`);
                console.log(`[WEBSOCKET] Client ${socket.id} joined tracking-${trackingNumber}`);
            });

            socket.on('join-user', (userId: string) => {
                socket.join(`user-${userId}`);
                console.log(`[WEBSOCKET] Client ${socket.id} joined user-${userId}`);
            });

            socket.on('disconnect', () => {
                console.log(`[WEBSOCKET] Client disconnected: ${socket.id}`);
            });
        });
    }

    private startAutomaticStatusUpdates() {
        const intervalSeconds = Number(process.env.WEBSOCKET_UPDATE_INTERVAL) || 120;
        const intervalMs = intervalSeconds * 1000;
        
        this.statusUpdateInterval = setInterval(async () => {
            await this.updateTrackingStatuses();
        }, intervalMs);

        console.log(`[WEBSOCKET] Automatic status updates started (every ${intervalSeconds} seconds)`);
    }

    private async updateTrackingStatuses() {
        try {
            const repo = new MongoTrackingRepository();
            const pendingTrackings = await repo.findTrackingsByStatus([
                TrackingStatus.PENDIENTE,
                TrackingStatus.PREPARANDO,
                TrackingStatus.EN_TRANSITO,
                TrackingStatus.EN_ENTREGA
            ]);

            for (const tracking of pendingTrackings) {
                const nextStatus = this.getNextStatus(tracking.currentStatus);
                if (nextStatus) {
                    const updated = await this.trackingService.updateStatus({
                        trackingNumber: tracking.trackingNumber!,
                        status: nextStatus
                    }, 'System-Auto');

                    this.io.to(`tracking-${tracking.trackingNumber}`).emit('status-updated', {
                        trackingNumber: tracking.trackingNumber,
                        oldStatus: tracking.currentStatus,
                        newStatus: nextStatus,
                        timestamp: new Date(),
                        updatedBy: 'System-Auto'
                    });

                    this.io.to(`user-${tracking.userId}`).emit('user-tracking-updated', {
                        trackingNumber: tracking.trackingNumber,
                        orderNumber: tracking.orderNumber,
                        status: nextStatus,
                        timestamp: new Date()
                    });

                    console.log(`[WEBSOCKET] Auto-updated ${tracking.trackingNumber}: ${tracking.currentStatus} → ${nextStatus}`);
                }
            }
        } catch (error) {
            console.error('[WEBSOCKET] Error updating tracking statuses:', error);
        }
    }

    private getNextStatus(currentStatus: TrackingStatus): TrackingStatus | null {
        const statusFlow = {
            [TrackingStatus.PENDIENTE]: TrackingStatus.PREPARANDO,
            [TrackingStatus.PREPARANDO]: TrackingStatus.EN_TRANSITO,
            [TrackingStatus.EN_TRANSITO]: TrackingStatus.EN_ENTREGA,
            [TrackingStatus.EN_ENTREGA]: TrackingStatus.ENTREGADO
        };

        return statusFlow[currentStatus] || null;
    }

    public async manualStatusUpdate(trackingNumber: string, status: TrackingStatus, changedBy: string) {
        try {
            const updated = await this.trackingService.updateStatus({
                trackingNumber,
                status
            }, changedBy);

            this.io.to(`tracking-${trackingNumber}`).emit('status-updated', {
                trackingNumber,
                newStatus: status,
                timestamp: new Date(),
                updatedBy: changedBy
            });

            this.io.to(`user-${updated.userId}`).emit('user-tracking-updated', {
                trackingNumber,
                orderNumber: updated.orderNumber,
                status,
                timestamp: new Date()
            });

            return updated;
        } catch (error) {
            console.error('[WEBSOCKET] Error in manual status update:', error);
            throw error;
        }
    }

    public stop() {
        if (this.statusUpdateInterval) {
            clearInterval(this.statusUpdateInterval);
            this.statusUpdateInterval = null;
        }
        this.io.close();
    }
}