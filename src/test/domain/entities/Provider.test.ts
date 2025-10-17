import { Provider } from '../../../domain/entities/Providier';
import { IProvider } from '../../../domain/models/interfaces/IProvidier';

describe('Provider Entity', () => {
  test('should create a Provider instance with all properties', () => {
    const providerData: IProvider = {
      id: 'prov-123',
      name: 'Test Provider Inc.'
    };

    const provider = new Provider(providerData);

    expect(provider.id).toBe('prov-123');
    expect(provider.name).toBe('Test Provider Inc.');
  });

  test('should create a Provider with different data', () => {
    const providerData: IProvider = {
      id: 'prov-456',
      name: 'Another Provider LLC'
    };

    const provider = new Provider(providerData);

    expect(provider.id).toBe('prov-456');
    expect(provider.name).toBe('Another Provider LLC');
  });

  test('should handle empty strings', () => {
    const providerData: IProvider = {
      id: '',
      name: ''
    };

    const provider = new Provider(providerData);

    expect(provider.id).toBe('');
    expect(provider.name).toBe('');
  });

  test('should handle special characters in provider names', () => {
    const providerData: IProvider = {
      id: 'prov-special-123',
      name: 'Proveedor Español S.A. & Co. !@#$%'
    };

    const provider = new Provider(providerData);

    expect(provider.id).toBe('prov-special-123');
    expect(provider.name).toBe('Proveedor Español S.A. & Co. !@#$%');
  });

  test('should handle very long provider names', () => {
    const longName = 'Very Long Provider Name '.repeat(10);
    const providerData: IProvider = {
      id: 'prov-long',
      name: longName.trim()
    };

    const provider = new Provider(providerData);

    expect(provider.name).toBe(longName.trim());
    expect(provider.name.length).toBeGreaterThan(100);
  });

  test('should handle numeric-like IDs and names', () => {
    const providerData: IProvider = {
      id: '12345',
      name: '999 Supplies Company'
    };

    const provider = new Provider(providerData);

    expect(provider.id).toBe('12345');
    expect(provider.name).toBe('999 Supplies Company');
  });

  test('should handle provider with UUID-like ID', () => {
    const providerData: IProvider = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'UUID Provider Corp'
    };

    const provider = new Provider(providerData);

    expect(provider.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(provider.name).toBe('UUID Provider Corp');
  });

  test('should handle provider names with different languages', () => {
    const providers = [
      { id: 'prov-en', name: 'English Provider Ltd.' },
      { id: 'prov-es', name: 'Proveedor Español S.L.' },
      { id: 'prov-fr', name: 'Fournisseur Français SA' },
      { id: 'prov-de', name: 'Deutscher Lieferant GmbH' }
    ];

    providers.forEach(providerData => {
      const provider = new Provider(providerData);
      expect(provider.id).toBe(providerData.id);
      expect(provider.name).toBe(providerData.name);
    });
  });
});