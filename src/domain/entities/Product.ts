import { IProduct } from "../models/interfaces/IProduct";

export class Product implements IProduct {
    name: string;
    description: string;
    cost: number;
    categoryId: string;
    images: string[];
    id: string;
    providers: string[];
    reservedStock?: number;
    classification?: string;

    constructor(product: IProduct & { id?: string }) {
        this.id = product.id || '';
        this.name = product.name;
        this.description = product.description;
        this.cost = product.cost;
        this.categoryId = product.categoryId;
        this.images = product.images;
        this.providers = product.providers || [];
        this.classification = product.classification || 'Vigenete';
    }
}
    
