import { App } from 'vue'
import DynamicCascadingSelect from './DynamicCascadingSelect.vue'

export { DynamicCascadingSelect }

export default {
  install(app: App) {
    app.component('DynamicCascadingSelect', DynamicCascadingSelect)
  }
}
