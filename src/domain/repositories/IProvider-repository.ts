import { Provider } from "../entities/Providier";

export interface IProviderRepository {
    save(provider: Provider): Promise<Provider>;
    findAll(): Promise<Provider[]>;
    findById(id: string): Promise<Provider>;
    update(provider: Provider): Promise<Provider>;
    delete(id: string): Promise<void>;
}