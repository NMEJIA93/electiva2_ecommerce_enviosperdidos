import { IProvider } from "../models/interfaces/IProvidier";

export class Provider implements IProvider {
    id: string;
    name: string;

    constructor(provider: IProvider & { id?: string }) {
        this.id = provider.id;
        this.name = provider.name;
    }
}