//导入request.js请求工具
import request from '@/utils/request.js'

// 获取所有订单数据
export const ordersInfoService = async () => {
  try {
    const response = await request.get('/api/orders');
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

// 删除订单
export const deleteOrderService = async (id) => {
  try {
    const response = await request.delete(`/orders/delete?id=${id}`);
    return {
      code: 0,
      message: '删除订单成功',
      data: response.data
    };
  } catch (error) {
    console.error('删除订单失败:', error);
    return {
      code: -1,
      message: '删除订单失败',
      data: null
    };
  }
};

