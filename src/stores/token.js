//定义store
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useTokenStore = defineStore('token', () => {
    //1.响应式变量
    const token = ref('')
    const adminInfo = ref({
        username: '',
        avatarUrl: 'http://image.starhub666.cn/back/image/avatar0.png'
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
        adminInfo.value = {
            ...adminInfo.value,
            ...info
        }
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