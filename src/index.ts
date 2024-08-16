import { App } from 'vue'
import AddressSelector from './AddressSelector.vue'

export { AddressSelector }

export default {
  install(app: App) {
    app.component('AddressSelector', AddressSelector)
  }
}
