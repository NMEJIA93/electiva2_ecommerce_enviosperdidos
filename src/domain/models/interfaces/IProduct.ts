export interface IProduct {
    name: string;
    description: string;
    cost: number;
    categoryId: string;
    id?: string;
    images?: string[];
    providers: string[];
    isDiscontinued?: boolean;
}
