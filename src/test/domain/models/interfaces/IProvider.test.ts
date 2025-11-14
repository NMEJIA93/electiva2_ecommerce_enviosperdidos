import { IProvider } from '../../../../domain/models/interfaces/IProvidier';

describe('IProvider Interface', () => {
  test('should accept valid provider object', () => {
    const provider: IProvider = {
      id: 'provider-123',
      name: 'Test Provider'
    };

    expect(provider.id).toBe('provider-123');
    expect(provider.name).toBe('Test Provider');
  });

  test('should have required id property', () => {
    const provider: IProvider = {
      id: 'prov-456',
      name: 'Another Provider'
    };

    expect(provider).toHaveProperty('id');
    expect(typeof provider.id).toBe('string');
  });

  test('should have required name property', () => {
    const provider: IProvider = {
      id: 'prov-789',
      name: 'Provider Name'
    };

    expect(provider).toHaveProperty('name');
    expect(typeof provider.name).toBe('string');
  });

  test('should work with different string values', () => {
    const providers: IProvider[] = [
      { id: '1', name: 'Provider One' },
      { id: 'abc-123', name: 'Provider ABC' },
      { id: 'uuid-456-789', name: 'Long Provider Name Inc.' }
    ];

    providers.forEach(provider => {
      expect(provider.id).toBeDefined();
      expect(provider.name).toBeDefined();
      expect(typeof provider.id).toBe('string');
      expect(typeof provider.name).toBe('string');
    });
  });
});