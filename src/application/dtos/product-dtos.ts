import { IProduct } from "../../domain/models/interfaces/IProduct";

export interface ProductRequest {
    name: string;
    description: string;
    cost: number;
    stock: number;
    categoryId: string;
    images?: string[];
    providers: string[];
    classification?: string;

}

export function buildProductRequest(dto: ProductRequest): IProduct {
    return {
        id: '',
        name: dto.name,
        description: dto.description,
        cost: dto.cost,
        categoryId: dto.categoryId,
        images: dto.images || [],
        providers: dto.providers || [],
        classification: dto.classification
    };
}