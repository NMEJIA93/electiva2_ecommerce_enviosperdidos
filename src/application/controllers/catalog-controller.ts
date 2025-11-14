import { Request, Response } from 'express';
import { findCatalog } from "../../domain/services/catalog-services";
import { MongoCatalogRepository } from "../../infraestructure/repositories/mongo-catalog";
import cache from '../../infraestructure/cache/node-cache';

const catalogRepo = new MongoCatalogRepository()

export const getCatalog = async (request: Request, response: Response)=>{
    try{
        const key = `catalog:all${JSON.stringify(request.query)}`;

        const cached = cache.get(key);
        if (cached) {
            return response.status(200).json({ok: true, catalog: cached, cached: true});
        }
        const catalog = await findCatalog(catalogRepo);
        cache.set(key, catalog)
        response.status(200).json({ok: true, catalog, cached: false});
    }catch (error){
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        })
    }
}