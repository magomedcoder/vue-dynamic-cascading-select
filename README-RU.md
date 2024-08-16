### Компонент Vue 3 для выбора адресов через многоуровневые выпадающие списки.

#### Props

Компонент принимает следующие пропсы:

- **`initialId`** (`number | null`) - начальный идентификатор, который используется для загрузки начальных данных при монтировании компонента.

- **`mode`** (`create |'view | edit`) - определяет режим работы компонента. В режиме 'view' (просмотр) изменение данных запрещено. В режиме 'edit' (редактирование) и 'create' (создание) можно изменять данные.

- **`fetchOptions`** (`(parentId: number | null, query?: string) => Promise<Address[]>`) - функция для загрузки опций для селекта. Принимает parentId (идентификатор родительского элемента) и query (строка запроса) для фильтрации опций.

- **`fetchAncestry`** (`(id: number) => Promise<Address[]>`) - функция для загрузки всей цепочки предков для данного id. Используется для инициализации компонента в режимах редактирования и просмотра.

- **`showAddButton`** (`boolean`) - определяет, должна ли отображаться кнопка создания нового элемента.

#### Events

Компонент эмитирует следующие события:

- **`update:selectedId`** (`id: number | null`) - событие, которое отправляется при изменении выбранного элемента. Передается id выбранного элемента или null, если выбор был очищен.

- **`addNew`** (`index: number | null`) - событие, которое отправляется при нажатии на кнопку создания нового элемента. Передается индекс текущего уровня или null.

### Пример

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
