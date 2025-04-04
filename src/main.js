import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import router from '@/router/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 引入 echarts
import * as echarts from 'echarts'

const app = createApp(App);
const pinia = createPinia();

// 使用持久化插件，并配置选项
pinia.use(piniaPluginPersistedstate)

// 将 echarts 挂载到全局属性
app.config.globalProperties.$echarts = echarts

app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale });
app.mount('#app')
