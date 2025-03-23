//导入request.js请求工具
import request from '@/utils/request.js'

//提供调用登录接口的函数
export const adminLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/admin/login', params)
}

//修改密码
export const adminPwdUpdateService = (adminPwdDaya) => {
    return request.patch('/admin/updatePwd', adminPwdDaya)
}

// 获取管理员信息接口
export const getAdminInfoService = () => {
    return request.get('/admin/info')
}