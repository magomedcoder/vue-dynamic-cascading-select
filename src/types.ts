export interface Address {
  id: number
  name: string
  parent_id: number | null
}

export interface UseAddressSelectorProps {
  initialId?: number | null
  mode: 'create' | 'view' | 'edit'
  fetchOptions: (parentId: number | null, query?: string) => Promise<Address[]>
  fetchAncestry: (id: number) => Promise<Address[]>
  showAddButton?: boolean
}

export interface UseAddressSelectorEmit {
  (e: 'update:selectedId', id: number | null): void
}
