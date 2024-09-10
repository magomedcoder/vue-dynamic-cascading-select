import { computed, ref } from 'vue'
import type { Address, UseDynamicCascadingSelectEmit, UseDynamicCascadingSelectProps } from './types'

export function useDynamicCascadingSelect(props: UseDynamicCascadingSelectProps, emit: UseDynamicCascadingSelectEmit) {
  // Массив для хранения выбранных значений
  const treeIds = ref<(number | null)[]>([null])
  // Массив для хранения опций для каждого уровня
  const options = ref<Address[][]>([[]])

  const loading = ref(false)

  const isViewMode = computed(() => props.mode === 'view')
  const isEditMode = computed(() => props.mode === 'edit')
  const isCreateMode = computed(() => props.mode === 'create')

  // Обработчик изменения выбора
  const handleChange = async (index: number, value: number | null) => {
    // В режиме просмотра изменение запрещено
    if (isViewMode.value) return

    // Если выбор очищен, возвращаем ID родителя
    if (value === null || value == undefined) {
      const parentId = treeIds.value[index - 1] ?? null
      emit('update:selectedId', parentId)
      return
    }

    treeIds.value[index] = value
    treeIds.value = treeIds.value.slice(0, index + 1)
    options.value = options.value.slice(0, index + 1)

    // Загрузка опций для следующего уровня, если они есть
    const nextOptions = await props.fetchOptions(value)
    if (nextOptions.length > 0) {
      treeIds.value.push(null)
      options.value.push(nextOptions)
    }

    // Эмитируем событие с ID выбранного элемента
    emit('update:selectedId', value != undefined ? value : null)
  }

  // Обработчик очистки выбора
  const clearTree = (index: number) => {
    // В режиме просмотра изменения не допускаются
    if (isViewMode.value) return

    // Удаляем все последующие селекты, если есть
    treeIds.value = treeIds.value.slice(0, index + 1)
    options.value = options.value.slice(0, index + 1)
  }

  // Функция для поиска опций по запросу
  const searchOptions = (index: number) => async (query: string) => {
    const parentId = index === 0 ? null : treeIds.value[index - 1]
    options.value[index] = await props.fetchOptions(parentId, query)
  }

  const initialize = async () => {
    if (props.initialId && (isEditMode.value || isViewMode.value)) {
      // Загружаем всю цепочку родительских элементов при редактировании или просмотре
      const ancestry = await props.fetchAncestry(props.initialId)
      for (let i = 0; i < ancestry.length; i++) {
        treeIds.value[i] = ancestry[i].id
        options.value[i] = await props.fetchOptions(ancestry[i].parentId)
      }

      // Загружаем опции для последнего уровня
      const finalOptions = await props.fetchOptions(ancestry[ancestry.length - 1].id)
      options.value.push(finalOptions)
      if (isEditMode.value) {
        treeIds.value.push(null)
      }
    } else if (isCreateMode.value) {
      // Если режим создания, загружаем корневые опции
      options.value[0] = await props.fetchOptions(null)
    }
  }

  return {
    treeIds,
    options,
    loading,
    isViewMode,
    handleChange,
    clearTree,
    searchOptions,
    initialize
  }
}
