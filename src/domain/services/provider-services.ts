import { IProviderRepository } from "../repositories/IProvider-repository";
import { Provider } from "../entities/Providier";
import { IProvider } from "../models/interfaces/IProvidier";


export const saveProvider = async ( providerRepo: IProviderRepository, providerData: IProvider): Promise<Provider> => {
    try {
        const provider = new Provider(providerData);
        return await providerRepo.save(provider);
    } catch (error) {
        throw new Error(`Error saving provider: ${error}`);
    }
}

export const getAllProviders = async (providerRepo: IProviderRepository): Promise<Provider[]> => {
    try {
        return await providerRepo.findAll();
    } catch (error) {
        throw new Error(`Error retrieving providers: ${error}`);
    }
}

export const getProviderById = async (providerRepo: IProviderRepository, id: string): Promise<Provider> => {
    try {
        return await providerRepo.findById(id);
    } catch (error) {
        throw new Error(`Error retrieving provider by ID: ${error}`);
    }       
}