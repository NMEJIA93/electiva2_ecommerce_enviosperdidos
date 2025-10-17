import { ICatalogRepository } from "../repositories/ICatalog-repository";
import { Catalog } from "../entities/Catalog";

export const findCatalog = async (catalogRepo: ICatalogRepository): Promise <Catalog[]> =>{
    try{
        return await catalogRepo.getCatalog();
    }catch(error){
        throw new Error(`[ERROR TO SERVICE] Error retrieving catalog: ${error}`);
    }
}