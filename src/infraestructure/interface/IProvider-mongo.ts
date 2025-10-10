import { Document } from "mongoose";

export interface IProviderDocument extends Document {
    id : string;
    name : string;
}