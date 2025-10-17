import { Categories } from "../entities/Categories";

export interface ICategoriesRepository {
    save(category: Categories): Promise<Categories>;
    findAll(): Promise<Categories[]>;
    findById(id: string): Promise<Categories>;
    update(category: Categories): Promise<Categories>;
    delete(id: string): Promise<void>;
}

