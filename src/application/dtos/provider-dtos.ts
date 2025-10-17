import { IProvider } from "../../domain/models/interfaces/IProvidier";

export interface ProviderRequest {
    name: string;
}

export function buildProviderRequest(dto: ProviderRequest): IProvider {
    return {
        id: '',
        name: dto.name
    }
}