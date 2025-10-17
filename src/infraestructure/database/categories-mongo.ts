import mongoose from "mongoose";
import { ICategoriesDocument } from '../interface/ICategories-mongo';

const CategoriesSchema = new mongoose.Schema<ICategoriesDocument>({
    name: { type: String, required: true }
});

export const CategoriesModel = mongoose.model<ICategoriesDocument>('Categories', CategoriesSchema);

