//导入request.js请求工具
import request from '@/utils/request.js'

// 获取所有轮播图数据
export const getRotations = async () => {
  try {
    const response = await request.get('/api/rotations');
    return {
      code: 0,
      message: '获取轮播图数据成功',
      data: response.data
    };
  } catch (error) {
    console.error('获取轮播图数据失败:', error);
    return {
      code: -1,
      message: '获取轮播图数据失败',
      data: []
    };
  }
};

// 删除轮播图
export const deleteRotation = async (id) => {
  try {
    const response = await request.delete(`/rotation/delete?id=${id}`);
    return {
      code: 0,
      message: '删除轮播图成功',
      data: response.data
    };
  } catch (error) {
    console.error('删除轮播图失败:', error);
    return {
      code: -1,
      message: '删除轮播图失败',
      data: null
    };
  }
};

// 添加轮播图
export const addRotation = async (theme, file) => {
  try {
    const formData = new FormData();
    formData.append('theme', theme);
    formData.append('file', file);
    const response = await request.post('/rotation/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return {
      code: 0,
      message: '添加轮播图成功',
      data: response.data
    };
  } catch (error) {
    console.error('添加轮播图失败:', error);
    return {
      code: -1,
      message: '添加轮播图失败',
      data: null
    };
  }
};