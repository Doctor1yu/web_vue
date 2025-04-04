//导入request.js请求工具
import request from '@/utils/request.js'

// 获取所有订单数据
export const getHomeDataService = async () => {
    try {
      const response = await request.get('/home/count');
      return {
        code: 0,
        message: '获取订单数据成功',
        data: response.data
      };
    } catch (error) {
      console.error('获取订单数据失败:', error);
      return {
        code: -1,
        message: '获取订单数据失败',
        data: []
      };
    }
  };

// 获取近30天订单状态统计
export const getOrderStatusStatsService = async () => {
    try {
      const response = await request.get('/home/count/last30days');
      return {
        code: 0,
        message: '获取订单统计成功',
        data: response.data
      };
    } catch (error) {
      console.error('获取订单统计失败:', error);
      return {
        code: -1,
        message: '获取订单统计失败',
        data: null
      };
    }
  };

// 获取反馈类型统计数据
export const getFeedbackStatsService = async () => {
    try {
        const response = await request.get('/home/feedback/stats');
        return {
            code: 0,
            message: '获取反馈统计成功',
            data: response.data
        };
    } catch (error) {
        console.error('获取反馈统计失败:', error);
        return {
            code: -1,
            message: '获取反馈统计失败',
            data: null
        };
    }
};