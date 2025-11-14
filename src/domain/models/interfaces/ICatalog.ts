export interface ICatalog {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    categoryName: string;
    images?: [];
    isDiscontinued?: boolean;
    price: number;
    stock: number;
    reservedStock: number;

}