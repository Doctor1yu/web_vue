//导入request.js请求工具
import request from '@/utils/request.js'

//获取所有订单数据
export const ordersInfoService = async () => {
    try {
        const response = await request.get('/api/orders')
        return {
            code: 0,
            message: '获取订单数据成功',
            data: response.data
        }
    } catch (error) {
        console.error('获取订单数据失败:', error)
        return {
            code: -1,
            message: '获取订单数据失败',
            data: []
        }
    }
}

// 获取所有反馈数据
export const getFeedbacks = async () => {
  try {
    const response = await request.get('/api/feedbacks')
    return {
      code: 0,
      message: '获取反馈数据成功',
      data: response.data
    }
  } catch (error) {
    console.error('获取反馈数据失败:', error)
    return {
      code: -1,
      message: '获取反馈数据失败',
      data: []
    }
  }
}

// 修改反馈状态（wait）
export const updateFeedbackStatus = async (id, status) => {
  try {
    const response = await request.put(`/api/feedbacks/${id}/status`, { status })
    return {
      code: 0,
      message: '修改反馈状态成功',
      data: response.data
    }
  } catch (error) {
    console.error('修改反馈状态失败:', error)
    return {
      code: -1,
      message: '修改反馈状态失败',
      data: null
    }
  }
}

// 删除反馈（wait）
export const deleteFeedback = async (id) => {
  try {
    const response = await request.delete(`/api/feedbacks/${id}`)
    return {
      code: 0,
      message: '删除反馈成功',
      data: response.data
    }
  } catch (error) {
    console.error('删除反馈失败:', error)
    return {
      code: -1,
      message: '删除反馈失败',
      data: null
    }
  }
}

// 获取所有用户数据
export const getUsers = async () => {
  try {
    const response = await request.get('/api/users')
    return {
      code: 0,
      message: '获取用户数据成功',
      data: response.data
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    return {
      code: -1,
      message: '获取用户数据失败',
      data: []
    }
  }
}

// 重置用户密码(wait)
export const resetUserPassword = async (id) => {
  try {
    const response = await request.put(`/api/users/${id}/reset-password`)
    return {
      code: 0,
      message: '重置密码成功',
      data: response.data
    }
  } catch (error) {
    console.error('重置密码失败:', error)
    return {
      code: -1,
      message: '重置密码失败',
      data: null
    }
  }
}

// 限制用户登录(wait)
export const restrictUserLogin = async (id, status) => {
  try {
    const response = await request.put(`/api/users/${id}/restrict-login`, { status })
    return {
      code: 0,
      message: '限制登录成功',
      data: response.data
    }
  } catch (error) {
    console.error('限制登录失败:', error)
    return {
      code: -1,
      message: '限制登录失败',
      data: null
    }
  }
}

// 删除用户(wait)
export const deleteUser = async (id) => {
  try {
    const response = await request.delete(`/api/users/${id}`)
    return {
      code: 0,
      message: '删除用户成功',
      data: response.data
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    return {
      code: -1,
      message: '删除用户失败',
      data: null
    }
  }
}