### A Vue 3 component for selecting addresses through multi-level dropdowns.

#### Props

The component accepts the following props:

- **`initialId`** (`number | null`) -  the initial identifier used to load initial data when the component is mounted.

- **`mode`** (`create |'view | edit`) - determines the mode of the component. In 'view' mode, data modification is not allowed. In 'edit' and 'create' modes, data can be modified.

- **`fetchOptions`** (`(parentId: number | null, query?: string) => Promise<Address[]>`) - function to load options for the select. It takes parentId (identifier of the parent item) and query (a string for filtering options).

- **`fetchAncestry`** (`(id: number) => Promise<Address[]>`) - function to load the entire chain of ancestors for a given id. Used to initialize the component in edit and view modes.

- **`showAddButton`** (`boolean`) - determines whether the button to create a new item should be displayed.

#### Events

The component emits the following events:

- **`update:selectedId`** (`id: number | null`) - event that is emitted when the selected item changes. The id of the selected item or null is passed if the selection is cleared.

- **`addNew`** (`index: number | null`) - event that is emitted when the button to create a new item is clicked. The index of the current level or null is passed.

### Example

```ts
import AddressSelector from './components/AddressSelector.vue'

const baseUrl = 'https://66be58a374dfc195586f3a53.mockapi.io/api/v1'

const fetchOptions = async (parentId: number | null, query?: string) => {
  try {
    const url = new URL(`${baseUrl}/address`)
    if (parentId != null) {
      url.searchParams.set('parent_id', parentId)
    }
    if (query != undefined) {
      url.searchParams.set('query', query)
    }
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Network error')
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

const fetchAncestry = async (id: number) => {
  const ancestry = []
  let currentId = id
  while (currentId !== null) {
    try {
      const res = await fetch(`${baseUrl}/address/${currentId}`)
      if (!res.ok) {
        throw new Error('Network error')
      }
      const data = await res.json()
      ancestry.unshift(data)
      currentId = data.parent_id
    } catch (error) {
      console.error(error)
      break
    }
  }
  return ancestry
}

const handleSelectedId = (id: number | null): void => {
  console.log(id)
}

const handleAddNew = (id: number | null): void => {
  alert(id)
}
```

```vue

<el-row :gutter="20">
  <el-col :span="8">
    <el-text>View</el-text>
    <AddressSelector
      mode="view"
      :initialId="3"
      :fetchOptions="fetchOptions"
      :fetchAncestry="fetchAncestry"
    />
  </el-col>
  <el-col :span="8">
    <el-text>Edit</el-text>
    <AddressSelector
      mode="edit"
      :initialId="6"
      :fetchOptions="fetchOptions"
      :fetchAncestry="fetchAncestry"
      @update:selectedId="handleSelectedId"
      @addNew="handleAddNew"
      showAddButton
    />
  </el-col>
  <el-col :span="8">
    <el-text>Create</el-text>
    <AddressSelector
      mode="create"
      :fetchOptions="fetchOptions"
      :fetchAncestry="fetchAncestry"
      @update:selectedId="handleSelectedId"
      @addNew="handleAddNew"
    />
  </el-col>
</el-row>
```
