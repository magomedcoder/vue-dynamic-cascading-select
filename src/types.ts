export interface Address {
  id: number
  name: string
  parentId: number | null
}

export interface UseDynamicCascadingSelectProps {
  initialId?: number | null
  mode: 'create' | 'view' | 'edit'
  fetchOptions: (parentId: number | null, query?: string) => Promise<Address[]>
  fetchAncestry: (id: number) => Promise<Address[]>
  showAddButton?: boolean
}

export interface UseDynamicCascadingSelectEmit {
  (e: 'update:selectedId', id: number | null): void
  (e: 'addNew', index: number | null): void
}
