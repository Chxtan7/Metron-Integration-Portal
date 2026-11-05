export interface CategoryDefinition {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Category extends CategoryDefinition {
  count: number;
}

export interface Integration {
  id: string;
  name: string;
  initials: string;
  image?: string;
  categoryIds: string[];
  description: string;
  status: 'Available' | 'Coming soon';
}