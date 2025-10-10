import { IPreorderRepository } from "../../domain/repositories/IPreorder-repository";
import { Preorder } from "../../domain/entities/Preorder";
import { PreorderModel } from "../database/preorden-mongo";

export class MongoPreorderRepository implements IPreorderRepository {
    async save(preorder: Preorder): Promise<Preorder> {
        const created = await PreorderModel.create(preorder);
        const plainPreorder = created.toObject();
        if (plainPreorder._id && typeof plainPreorder._id !== 'string') {
            plainPreorder._id = plainPreorder._id.toString();
        }
        return new Preorder(plainPreorder);
    }

    async findById(id: string): Promise<Preorder | null> {
        const preorderDoc = await PreorderModel.findById(id);
        if (!preorderDoc) return null;
        const plainPreorder = preorderDoc.toObject();
        if (plainPreorder._id && typeof plainPreorder._id !== 'string') {
            plainPreorder._id = plainPreorder._id.toString();
        }
        return new Preorder(plainPreorder);
    }
}