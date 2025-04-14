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

// 处理反馈
export const processFeedback = async (id, answer, answerName) => {
  try {
    const response = await request.patch(`/feedback/updateAnswer?id=${id}&answer=${answer}&answerName=${answerName}`);
    return {
      code: 0,
      message: '处理反馈成功',
      data: response.data
    };
  } catch (error) {
    console.error('处理反馈失败:', error);
    return {
      code: -1,
      message: '处理反馈失败',
      data: null
    };
  }
};
