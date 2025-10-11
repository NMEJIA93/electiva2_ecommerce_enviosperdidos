import { IPreorderRepository } from "../../domain/repositories/IPreorder-repository";
import { Preorder } from "../../domain/entities/Preorder";
import { PreorderModel } from "../database/preorden-mongo";
import { IPreorder } from "../../domain/models/interfaces/IPreorder";

export class MongoPreorderRepository implements IPreorderRepository {

    async save(preorder: Preorder): Promise<Preorder> {
        const created = await PreorderModel.create(preorder);
        const plainPreorder = created.toObject();

        if (plainPreorder._id && typeof plainPreorder._id !== 'string') {
            plainPreorder._id = String(plainPreorder._id);
        }


        return new Preorder(plainPreorder as IPreorder);
    }

    async findById(id: string): Promise<Preorder | null> {
        const preorderDoc = await PreorderModel.findById(id);

        if (!preorderDoc) return null;

        const plainPreorder = preorderDoc.toObject();

        if (plainPreorder._id && typeof plainPreorder._id !== 'string') {
            plainPreorder._id = String(plainPreorder._id);
        }

        return new Preorder(plainPreorder as IPreorder);
    }

    async update(id: string, preorder: Preorder): Promise<Preorder | null> {
        const updatedDoc = await PreorderModel.findByIdAndUpdate(
            id,
            { ...preorder, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedDoc) return null;

        const plainPreorder = updatedDoc.toObject();

        if (plainPreorder._id && typeof plainPreorder._id !== 'string') {
            plainPreorder._id = String(plainPreorder._id);
        }

        return new Preorder(plainPreorder as IPreorder);
    }
}