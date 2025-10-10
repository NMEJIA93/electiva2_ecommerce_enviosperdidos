import mongoose, { Document } from "mongoose";

export interface ICategoriesDocument extends Document {
    id : mongoose.Types.ObjectId;
    name : string;
}

