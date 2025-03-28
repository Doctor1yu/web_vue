import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/login/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import OrderInfoVue from '@/views/order/OrderInfo.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import RePwdVue from '@/views/admin/RePwd.vue'
import HomeVue from '@/views/home/Home.vue'
import AdminInfoVue from '@/views/admin/AdminInfo.vue'
import FeedbackVue from '@/views/feedback/Feedback.vue'

//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue, redirect: '/order', children: [
            { path: '/home', component: HomeVue },
            { path: '/order', component: OrderInfoVue },
            { path: '/feedback', component: FeedbackVue },
            { path: '/user', component: UserInfoVue },
            { path: '/admin/info', component: AdminInfoVue },
            { path: '/admin/repwd', component: RePwdVue }
            
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router
