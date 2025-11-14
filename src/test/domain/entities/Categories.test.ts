import { Categories } from '../../../domain/entities/Categories';
import { ICategories } from '../../../domain/models/interfaces/ICategories';

describe('Categories Entity', () => {
  test('should create a Categories instance with all properties', () => {
    const categoryData: ICategories = {
      id: 'cat-123',
      name: 'Electronics'
    };

    const category = new Categories(categoryData);

    expect(category.id).toBe('cat-123');
    expect(category.name).toBe('Electronics');
  });

  test('should create a Categories instance with different data', () => {
    const categoryData: ICategories = {
      id: 'cat-456',
      name: 'Books & Literature'
    };

    const category = new Categories(categoryData);

    expect(category.id).toBe('cat-456');
    expect(category.name).toBe('Books & Literature');
  });

  test('should handle empty strings', () => {
    const categoryData: ICategories = {
      id: '',
      name: ''
    };

    const category = new Categories(categoryData);

    expect(category.id).toBe('');
    expect(category.name).toBe('');
  });

  test('should handle special characters in category names', () => {
    const categoryData: ICategories = {
      id: 'cat-special-123',
      name: 'Electrónicos & Tecnología !@#$%'
    };

    const category = new Categories(categoryData);

    expect(category.id).toBe('cat-special-123');
    expect(category.name).toBe('Electrónicos & Tecnología !@#$%');
  });

  test('should handle very long category names', () => {
    const longName = 'A'.repeat(255);
    const categoryData: ICategories = {
      id: 'cat-long',
      name: longName
    };

    const category = new Categories(categoryData);

    expect(category.name).toBe(longName);
    expect(category.name.length).toBe(255);
  });

  test('should handle numeric-like strings', () => {
    const categoryData: ICategories = {
      id: '12345',
      name: '999 Items Category'
    };

    const category = new Categories(categoryData);

    expect(category.id).toBe('12345');
    expect(category.name).toBe('999 Items Category');
  });
});