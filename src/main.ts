import { createApp} from 'vue'
import App from './App.vue'
import router from '@/router/index'
import pinia from '@/store/pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(mavonEditor)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')