//导入request.js请求工具
import request from '@/utils/request.js'

// 获取所有用户数据
export const getUsers = async () => {
  try {
    const response = await request.get('/api/users');
    return {
      code: 0,
      message: '获取用户数据成功',
      data: response.data
    };
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return {
      code: -1,
      message: '获取用户数据失败',
      data: []
    };
  }
};

// 重置用户密码
export const resetUserPassword = async (studentId) => {
  try {
    const response = await request.patch(`/users/password?studentId=${studentId}`);
    return {
      code: 0,
      message: '重置密码成功',
      data: response.data
    };
  } catch (error) {
    console.error('重置密码失败:', error);
    return {
      code: -1,
      message: '重置密码失败',
      data: null
    };
  }
};

// 限制用户登录
export const restrictUserLogin = async (studentId, status) => {
  try {
    const response = await request.patch(`/users/status?studentId=${studentId}&status=${status}`);
    return {
      code: 0,
      message: '限制登录成功',
      data: response.data
    };
  } catch (error) {
    console.error('限制登录失败:', error);
    return {
      code: -1,
      message: '限制登录失败',
      data: null
    };
  }
};

// 删除用户
export const deleteUser = async (id) => {
  try {
    const response = await request.delete(`/users/delete?id=${id}`);
    return {
      code: 0,
      message: '删除用户成功',
      data: response.data
    };
  } catch (error) {
    console.error('删除用户失败:', error);
    return {
      code: -1,
      message: '删除用户失败',
      data: null
    };
  }
};