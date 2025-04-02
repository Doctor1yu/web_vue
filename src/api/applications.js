//导入request.js请求工具
import request from '@/utils/request.js'

// 获取所有申请数据
export const getApplications = async () => {
  try {
    const response = await request.get('/api/applications');
    return {
      code: 0,
      message: '获取申请数据成功',
      data: response.data
    };
  } catch (error) {
    console.error('获取申请数据失败:', error);
    return {
      code: -1,
      message: '获取申请数据失败',
      data: []
    };
  }
};

// 更新申请状态
export const updateApplicationStatus = async (studentId, status, remark, reviewerName) => {
  try {
    const response = await request.patch(
      `/applications/status?studentId=${studentId}&status=${status}&remark=${remark}&reviewerName=${reviewerName}`
    );
    return {
      code: 0,
      message: '处理申请成功',
      data: response.data
    };
  } catch (error) {
    console.error('处理申请失败:', error);
    return {
      code: -1,
      message: '处理申请失败',
      data: null
    };
  }
};

