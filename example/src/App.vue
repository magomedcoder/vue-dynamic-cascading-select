<script setup lang="ts">
import { DynamicCascadingSelect } from 'vue-dynamic-cascading-select'
import 'vue-dynamic-cascading-select/dist/style.css'

const baseUrl = 'https://66be58a374dfc195586f3a53.mockapi.io/api/v1'

const fetchOptions = async (parentId: number | null, query?: string) => {
  try {
    const url = new URL(`${baseUrl}/address`)
    if (parentId != null) {
      url.searchParams.set('parentId', parentId)
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
      currentId = data.parentId
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
  alert(id ?? 'parent')
}

</script>

<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-text>View</el-text>
      <dynamic-cascading-select
        mode="view"
        :initial-id="3"
        :fetch-options="fetchOptions"
        :fetch-ancestry="fetchAncestry"
      />
    </el-col>
    <el-col :span="8">
      <el-text>Edit</el-text>
      <dynamic-cascading-select
        mode="edit"
        :initial-id="6"
        :fetch-options="fetchOptions"
        :fetch-ancestry="fetchAncestry"
        @update:selectedId="handleSelectedId"
        @add-new="handleAddNew"
        show-add-button
      />
    </el-col>
    <el-col :span="8">
      <el-text>Create</el-text>
      <dynamic-cascading-select
        mode="create"
        :fetch-options="fetchOptions"
        :fetch-ancestry="fetchAncestry"
        @update:selected-id="handleSelectedId"
        @add-new="handleAddNew"
      />
    </el-col>
  </el-row>
</template>

<style scoped>

</style>
