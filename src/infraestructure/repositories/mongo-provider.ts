import { IProviderRepository } from '../../domain/repositories/IProvider-repository';
import { Provider } from '../../domain/entities/Providier';
import { ProviderModel } from '../database/provider-mongo';
import { IProvider } from '../../domain/models/interfaces/IProvidier';
import { ProductModel } from '../database/Product-mongo';

export class MongoProviderReposiitory implements IProviderRepository {
    async save(provider: Provider): Promise<Provider> {
        const created = await ProviderModel.create(provider);
        const plainProvider = created.toObject();
        if (plainProvider._id && typeof plainProvider._id !== 'string') {
            plainProvider._id = plainProvider._id.toString();
        } 
        return new Provider({
                id: plainProvider._id ? plainProvider._id.toString() : '',
                name: plainProvider.name
            });
    }
    async findAll(): Promise<Provider[]> {
        const providers = await ProviderModel.find().exec();
        console.log('Fetched providers from DB:', providers); // Debugging line
        return providers.map(p => {
            const plainProvider = p.toObject();
            return new Provider({
                id: plainProvider._id ? plainProvider._id.toString() : '',
                name: plainProvider.name
            });
        });
    }
    async findById(id: string): Promise<Provider> {
        const provider = await ProviderModel.findById(id).exec();
        if (!provider) {
            throw new Error('Provider not found');
        }
        const plainProvider = provider.toObject();
        return new Provider({
            id: plainProvider._id ? plainProvider._id.toString() : '',
            name: plainProvider.name
        });
    }
    async update(provider: Provider): Promise<Provider> {
        const updated = await ProviderModel.findByIdAndUpdate(provider.id, provider, { new: true }).exec();
        if (!updated) {
            throw new Error('Provider not found for update');
        }
        const plainProvider = updated.toObject();
        return new Provider({
            id: plainProvider._id ? plainProvider._id.toString() : '',
            name: plainProvider.name
        });
    }
    async delete(id: string): Promise<void> {
        const result = await ProviderModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new Error('Provider not found for deletion');
        }
        await ProductModel.updateMany(
            { providers: id },
            { $pull: { providers: id } }
        );
    }
}