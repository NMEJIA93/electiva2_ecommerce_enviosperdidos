import { ICatalog } from "../models/interfaces/ICatalog";

export class Catalog implements ICatalog{
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

    constructor(catalog: ICatalog & {id?: string}){
        this.id = catalog.id;
        this.name = catalog.name;
        this.description=catalog.description;
        this.categoryId=catalog.categoryId;
        this.categoryName=catalog.categoryName;
        this.images=catalog.images ;
        this.isDiscontinued=catalog.isDiscontinued;
        this.price=catalog.price;
        this.stock=catalog.stock;
        this.reservedStock=catalog.reservedStock;
    }
}