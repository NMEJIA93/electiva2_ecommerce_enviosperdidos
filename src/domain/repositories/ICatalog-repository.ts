import { Catalog } from "../entities/Catalog";

export interface ICatalogRepository {
    getCatalog(page?: number, limit?: number): Promise<{
    catalogs: Catalog[],
    total: number,
    totalPages: number,
    page: number,
    limit: number
  }>;
}