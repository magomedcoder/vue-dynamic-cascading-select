import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

//import DynamicCascadingSelect from 'vue-dynamic-cascading-select'
//import 'vue-dynamic-cascading-select/dist/style.css'

const app = createApp(App)
app.use(ElementPlus)

//app.use(DynamicCascadingSelect)
app.mount('#app')