import { Order } from "../entities/Order";

export interface IOrderRepository {
    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByOrderNumber(orderNumber: string): Promise<Order | null>;
    findByPreorderId(preorderId: string): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[]>;
    update(id: string, order: Order): Promise<Order | null>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<Order[]>;
}
