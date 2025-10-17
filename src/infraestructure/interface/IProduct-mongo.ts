import mongoose, { Document } from "mongoose";

export interface IProductDocument extends Document {
    name: string;
    description: string;
    cost: number;
    categoryId: mongoose.Types.ObjectId;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    providers: string[];
    isDiscontinued?: boolean;
}