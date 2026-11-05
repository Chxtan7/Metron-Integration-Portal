import type { Category, CategoryDefinition, Integration } from '../types/integration.types';

export interface IntegrationCatalog {
  categories: Category[];
  integrations: Integration[];
}

interface CatalogResponse {
  categories: CategoryDefinition[];
  integrations: Integration[];
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001').replace(/\/+$/, '');

const fetchResource = async <T,>(resource: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}/${resource}`);
  if (!response.ok) throw new Error(`Catalog request failed (${response.status}): ${resource}`);
  return response.json() as Promise<T>;
};

const getCatalog = async (): Promise<IntegrationCatalog> => {
  const { categories: categoryData, integrations } = await fetchResource<CatalogResponse>('catalog');
  const categoryCounts = new Map<string, number>();

  integrations.forEach((integration) => {
    new Set(integration.categoryIds).forEach((categoryId) => {
      categoryCounts.set(categoryId, (categoryCounts.get(categoryId) ?? 0) + 1);
    });
  });

  return {
    categories: categoryData.map((category) => ({
      ...category,
      count: categoryCounts.get(category.id) ?? 0,
    })),
    integrations,
  };
};

export const integrationService = { getCatalog };