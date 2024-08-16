<script lang="ts" setup>
import { defineEmits, defineProps, onMounted } from 'vue'
import type { Address } from './types'
import { useAddressSelector } from './useAddressSelector'

const props = defineProps<{
  initialId?: number | null
  mode: 'create' | 'view' | 'edit'
  fetchOptions: (parentId: number | null, query?: string) => Promise<Address[]>
  fetchAncestry: (id: number) => Promise<Address[]>
}>()

const emit = defineEmits<{
  (e: 'update:selectedId', id: number | null): void
}>()

const {
  treeIds,
  options,
  loading,
  isViewMode,
  handleChange,
  clearTree,
  searchOptions,
  initialize
} = useAddressSelector(props, emit)

onMounted(async () => {
  // Инициализация при монтировании
  await initialize()
})
</script>

<template>
  <div
    v-for="(treeId, index) in treeIds"
    :key="index"
    class="select-wrapper"
  >
    <el-select
      v-model="treeIds[index]"
      :options="options[index]"
      class="w-100"
      :disabled="isViewMode"
      clearable
      filterable
      remote
      :remote-method="searchOptions(index)"
      :loading="loading"
      @change="handleChange(index, $event)"
      @clear="clearTree(index)"
    >
      <el-option
        v-for="option in options[index]"
        :key="option.id"
        :label="option.name"
        :value="option.id"
      />
    </el-select>
  </div>
</template>

<style scoped>
.w-100 {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
