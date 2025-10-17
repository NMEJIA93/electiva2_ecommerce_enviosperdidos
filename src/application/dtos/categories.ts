import { ICategories } from "../../domain/models/interfaces/ICategories";

export interface CategoriesRequest {
    name: string;
}

export function buildCategoriesRequest(dto: CategoriesRequest): ICategories {
    return {
        id: '',
        name: dto.name
    }
}
