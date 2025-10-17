import { ICategories } from "../models/interfaces/ICategories";

export class Categories implements ICategories {
    id: string;
    name: string;
    constructor(category: ICategories & { id?: string }) {
        this.id = category.id;
        this.name = category.name;
    }
}
