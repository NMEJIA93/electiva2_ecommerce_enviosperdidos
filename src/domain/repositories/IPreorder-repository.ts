import { Preorder } from "../entities/Preorder";

export interface IPreorderRepository {
    save(preorder: Preorder): Promise<Preorder>;
    findById(id: string): Promise<Preorder | null>;
    update(id: string, preorder: Preorder): Promise<Preorder | null>;
}