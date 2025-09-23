export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  description?: string;
};

export type TodosState = {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
  sortOrder: 'asc' | 'desc';
  sortBy: 'createdAt' | 'updatedAt' | 'title';
};
