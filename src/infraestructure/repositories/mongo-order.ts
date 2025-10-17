import { Order } from '../../domain/entities/Order';
import { IOrderRepository } from '../../domain/repositories/IOrder-repository';
import { OrderModel } from '../database/order-mongo';
import { IOrder } from '../../domain/models/interfaces/IOrder';

export class MongoOrderRepository implements IOrderRepository {
    async save(order: Order): Promise<Order> {
        try {
            const created = await OrderModel.create(order);
            const plainOrder = created.toObject();
            if (plainOrder._id && typeof plainOrder._id !== 'string') {
                plainOrder._id = plainOrder._id.toString();
            }
            return new Order(plainOrder as IOrder);
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error saving order: ${error}`);
        }
    }

    async findById(id: string): Promise<Order | null> {
        try {
            const order = await OrderModel.findById(id);
            if (!order) return null;
            
            const plainOrder = order.toObject();
            if (plainOrder._id && typeof plainOrder._id !== 'string') {
                plainOrder._id = plainOrder._id.toString();
            }
            return new Order(plainOrder as IOrder);
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error finding order by ID: ${error}`);
        }
    }

    async findByOrderNumber(orderNumber: string): Promise<Order | null> {
        try {
            const order = await OrderModel.findOne({ orderNumber });
            if (!order) return null;
            
            const plainOrder = order.toObject();
            if (plainOrder._id && typeof plainOrder._id !== 'string') {
                plainOrder._id = plainOrder._id.toString();
            }
            return new Order(plainOrder as IOrder);
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error finding order by number: ${error}`);
        }
    }

    async findByPreorderId(preorderId: string): Promise<Order | null> {
        try {
            const order = await OrderModel.findOne({ preorderId });
            if (!order) return null;
            
            const plainOrder = order.toObject();
            if (plainOrder._id && typeof plainOrder._id !== 'string') {
                plainOrder._id = plainOrder._id.toString();
            }
            return new Order(plainOrder as IOrder);
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error finding order by preorder ID: ${error}`);
        }
    }

    async findByUserId(userId: string): Promise<Order[]> {
        try {
            const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
            return orders.map(order => {
                const plainOrder = order.toObject();
                if (plainOrder._id && typeof plainOrder._id !== 'string') {
                    plainOrder._id = plainOrder._id.toString();
                }
                return new Order(plainOrder as IOrder);
            });
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error finding orders by user ID: ${error}`);
        }
    }

    async update(id: string, order: Order): Promise<Order | null> {
        try {
            const updated = await OrderModel.findByIdAndUpdate(
                id, 
                { ...order, updatedAt: new Date() }, 
                { new: true }
            );
            
            if (!updated) return null;
            
            const plainOrder = updated.toObject();
            if (plainOrder._id && typeof plainOrder._id !== 'string') {
                plainOrder._id = plainOrder._id.toString();
            }
            return new Order(plainOrder as IOrder);
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error updating order: ${error}`);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await OrderModel.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error deleting order: ${error}`);
        }
    }

    async findAll(): Promise<Order[]> {
        try {
            const orders = await OrderModel.find().sort({ createdAt: -1 });
            return orders.map(order => {
                const plainOrder = order.toObject();
                if (plainOrder._id && typeof plainOrder._id !== 'string') {
                    plainOrder._id = plainOrder._id.toString();
                }
                return new Order(plainOrder as IOrder);
            });
        } catch (error) {
            throw new Error(`[ERROR TO REPOSITORY] - Error finding all orders: ${error}`);
        }
    }
}
