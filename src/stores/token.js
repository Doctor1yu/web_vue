//定义store
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useTokenStore = defineStore('token', () => {
    //1.响应式变量
    const token = ref('')
    const adminInfo = ref({
        username: '',
        avatarUrl: 'https://mp-b58e33c4-f164-4150-809d-6e1f78c8b7bb.cdn.bspapp.com/image/avatar11.jpg'
    })

    //2.定义一个函数,修改token的值
    const setToken = (newToken) => {
        token.value = newToken
    }

    //3.函数,移除token的值
    const removeToken = () => {
        token.value = ''
    }

    //4.设置管理员信息
    const setAdminInfo = (info) => {
        adminInfo.value = info
    }

    return {
        token,
        adminInfo,
        setToken,
        removeToken,
        setAdminInfo
    }
}, {
    // 使用函数返回持久化配置
    persist: () => ({
        storage: sessionStorage,
        paths: ['token', 'adminInfo']
    })
})