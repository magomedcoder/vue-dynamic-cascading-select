<script lang="ts" setup>
import { onMounted } from 'vue'
import type { Address } from './types'
import { useDynamicCascadingSelect } from './useDynamicCascadingSelect'
import { ElSelect, ElButton, ElOption } from 'element-plus'

const props = defineProps<{
  initialId?: number | null
  mode: 'create' | 'view' | 'edit'
  fetchOptions: (parentId: number | null, query?: string) => Promise<Address[]>
  fetchAncestry: (id: number) => Promise<Address[]>
  showAddButton?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedId', id: number | null): void
  (e: 'addNew', index: number | null): void
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
} = useDynamicCascadingSelect(props, emit)

const handleAddClick = (index: number | null) => {
  emit('addNew', index)
}

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <div class="dynamic-cascading-select">
    <div
      v-for="(treeId, index) in treeIds"
      :key="index"
      class="select-wrapper"
    >
      <el-select
        v-model="treeIds[index]"
        :options="options[index]"
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
      <el-button
        v-if="!isViewMode && props.showAddButton"
        :loading="loading"
        @click="handleAddClick(treeIds[index])"
        style="margin-left: 8px;"
        circle
        size="small"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="currentColor"
            d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"></path>
        </svg>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.dynamic-cascading-select {
  padding: 10px;
  border: 1px solid #e4e7ed;
}

.select-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.select-wrapper:last-child {
  margin-bottom: 0;
}

svg {
  height: 1em;
  width: 1em;
}
</style>
