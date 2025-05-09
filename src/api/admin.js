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

// 修改管理员密码
export const adminPwdUpdateService = async (data) => {
    try {
      const response = await request.patch('/admin/updatePwd', data);
      return {
        code: 0,
        message: '密码修改成功',
        data: response.data
      };
    } catch (error) {
      console.error('密码修改失败:', error);
      return {
        code: -1,
        message: '密码修改失败',
        data: null
      };
    }
  };

// 获取所有管理员
export const getAdmins = async () => {
  try {
    const response = await request.get('/admin/all');
    return {
      code: 0,
      message: '获取管理员数据成功',
      data: response.data
    };
  } catch (error) {
    console.error('获取管理员数据失败:', error);
    return {
      code: -1,
      message: '获取管理员数据失败',
      data: []
    };
  }
};

// 添加管理员
export const addAdminService = async (data) => {
  try {
    const response = await request.post('/admin/add', data);
    return response.data;
  } catch (error) {
    console.error('添加管理员失败:', error);
    throw error;
  }
};

// 删除管理员
export const deleteAdminService = async (id) => {
  try {
    const response = await request.delete(`/admin/delete?id=${id}`);
    return {
      code: 0,
      message: '删除管理员成功',
      data: response.data
    };
  } catch (error) {
    console.error('删除管理员失败:', error);
    return {
      code: -1,
      message: '删除管理员失败',
      data: null
    };
  }
};