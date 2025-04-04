import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token'

//导入组件
import LoginVue from '@/views/login/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import OrderInfoVue from '@/views/order/OrderInfo.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import RePwdVue from '@/views/admin/RePwd.vue'
import HomeVue from '@/views/home/Home.vue'
import AdminInfoVue from '@/views/admin/AdminInfo.vue'
import FeedbackVue from '@/views/feedback/Feedback.vue'
import applicationsVue from '@/views/applicationss/applications.vue'
import rotationVue from '@/views/rotation/rotation.vue'

//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue, redirect: '/order', children: [
            { path: '/home', component: HomeVue },
            { path: '/rotation', component: rotationVue },
            { path: '/order', component: OrderInfoVue },
            { path: '/feedback', component: FeedbackVue },
            { path: '/user', component: UserInfoVue },
            { path: '/applications', component: applicationsVue },
            { path: '/admin/info', component: AdminInfoVue },
            { path: '/admin/repwd', component: RePwdVue },
            
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

// 定义白名单路由
const whiteList = ['/login'] // 不需要登录就可以访问的路由

// 创建路由守卫
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  const token = tokenStore.token
  
  if (token) {
    // 有token
    if (to.path === '/login') {
      // 如果已登录，访问登录页则重定向到首页
      next({ path: '/home' })
    } else {
      next() // 正常访问
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接进入
      next()
    } else {
      // 不在白名单中，重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

//导出路由
export default router
