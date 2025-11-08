export enum TrackingStatus {
  PENDIENTE = 'PENDIENTE',
  PREPARANDO = 'PREPARANDO',
  EN_TRANSITO = 'EN_TRANSITO',
  EN_ENTREGA = 'EN_ENTREGA',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export interface StatusHistory {
  status: TrackingStatus;
  timestamp: Date;
  changedBy?: string;
}

export interface NotificationHistory {
  type: string;
  message: string;
  timestamp: Date;
  sent: boolean;
  retries: number;
}

export class Tracking {
  trackingNumber: string;
  orderNumber: string;
  userId: string;
  currentStatus: TrackingStatus;
  statusHistory: StatusHistory[];
  notifications: NotificationHistory[];

  constructor(init: Partial<Tracking>) {
    Object.assign(this, init);
  }
}
