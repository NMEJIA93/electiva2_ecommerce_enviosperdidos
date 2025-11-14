import { Request, Response } from 'express';
import { findCatalog } from "../../domain/services/catalog-services";
import { MongoCatalogRepository } from "../../infraestructure/repositories/mongo-catalog";

const catalogRepo = new MongoCatalogRepository()

export const getCatalog = async (request: Request, response: Response)=>{
    try{
        const catalog = await findCatalog(catalogRepo);
        response.status(200).json({ok: true, catalog});
    }catch (error){
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        })
    }
}