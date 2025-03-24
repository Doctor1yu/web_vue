//导入request.js请求工具
import request from '@/utils/request.js'

// 获取所有反馈数据
export const getFeedbacks = async () => {
  try {
    const response = await request.get('/api/feedbacks');
    return {
      code: 0,
      message: '获取反馈数据成功',
      data: response.data
    };
  } catch (error) {
    console.error('获取反馈数据失败:', error);
    return {
      code: -1,
      message: '获取反馈数据失败',
      data: []
    };
  }
};

// 修改反馈状态
export const updateFeedbackStatus = async (id, status) => {
  try {
    const response = await request.put(`/feedback/update?id=${id}&status=${status}`);
    return {
      code: 0,
      message: '修改反馈状态成功',
      data: response.data
    };
  } catch (error) {
    console.error('修改反馈状态失败:', error);
    return {
      code: -1,
      message: '修改反馈状态失败',
      data: null
    };
  }
};

// 删除反馈
export const deleteFeedback = async (id) => {
  try {
    const response = await request.delete(`/feedback/delete?id=${id}`);
    return {
      code: 0,
      message: '删除反馈成功',
      data: response.data
    };
  } catch (error) {
    console.error('删除反馈失败:', error);
    return {
      code: -1,
      message: '删除反馈失败',
      data: null
    };
  }
};