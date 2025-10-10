import mongoose from "mongoose";
import { IProviderDocument } from '../interface/IProvider-mongo';

const ProviderSchema = new mongoose.Schema<IProviderDocument>({
    name: { type: String, required: true }
});

export const ProviderModel = mongoose.model<IProviderDocument>('Provider', ProviderSchema);