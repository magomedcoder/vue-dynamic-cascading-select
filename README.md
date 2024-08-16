### Example address selector

```ts
import AddressSelector from './components/AddressSelector.vue'

const baseUrl = 'http://localhost:3000'

const fetchOptions = async (parentId: number | null, query?: string) => {
  try {
    const url = new URL(`${baseUrl}/address`)

    if (parentId != null){
      url.searchParams.set('parent_id', parentId)
    }

    if (query != undefined){
      url.searchParams.set('query', query)
    }

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Network error')
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Ошибка загрузки опций:', error)
    return []
  }
}

const fetchAncestry = async (id:number) => {
  const ancestry = []
  let currentId = id
  while (currentId !== null) {
    try {
      const res = await fetch(`${baseUrl}/address/${currentId}`)
      if (!res.ok) {
        throw new Error('Network error')
      }
      const data = await res.json()
      // Добавляем родителя в начало массива
      ancestry.unshift(data)
      // Переходим к следующему родителю
      currentId = data.parent_id
    } catch (error) {
      console.error('Ошибка загрузки родительских данных:', error)
      break
    }
  }
  return ancestry
}

const handleSelectedId = (id: number | null): void => {
  console.log(id)
}
```

```vue
<template>
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
          :initialId="7"
          :fetchOptions="fetchOptions"
          :fetchAncestry="fetchAncestry"
          @update:selectedId="handleSelectedId"
      />
    </el-col>
    <el-col :span="8">
      <el-text>Create</el-text>
      <AddressSelector
          mode="create"
          :fetchOptions="fetchOptions"
          :fetchAncestry="fetchAncestry"
          @update:selectedId="handleSelectedId"
      />
    </el-col>
  </el-row>
</template>
```
