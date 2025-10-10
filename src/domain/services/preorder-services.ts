import { IPreorder } from "../models/interfaces/IPreorder";
import { Preorder } from "../entities/Preorder";
import { IPreorderRepository } from "../repositories/IPreorder-repository";
import {validateStock} from './business-rules/preorder-rules';

export const savePreOrder = async (preorderRepo: IPreorderRepository,preorderData: IPreorder, inventoryRepo: IInventoryRepository): Promise<Preorder> => {
    try {

        await validateStock(preorderData.products, inventoryRepo);

        const preorder = new Preorder(preorderData);
        const result = await preorderRepo.save(preorder);
        return result;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving preorder: ${error}`);
    }
}