<template>
  <div style="width: 100%;">
    <!-- 状态筛选 -->
    <el-select
      v-model="filterStatus"
      placeholder="请选择订单状态"
      clearable
      style="margin-bottom: 20px; width: 200px;"
    >
      <el-option label="未接单" value="1" />
      <el-option label="进行中" value="2" />
      <el-option label="已完成" value="3" />
    </el-select>

    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="订单ID" width="100" />
      <el-table-column prop="pickupPoint" label="取件地点"/>
      <el-table-column prop="location" label="存放位置" />
      <el-table-column prop="sendAt" label="配送时间" />
      <el-table-column prop="publisherName" label="发布者" />
      <el-table-column prop="phoneNumber" label="联系电话" />
      <el-table-column prop="description" label="取件码" />
      <el-table-column prop="amount" label="金额" width="100">
        <template #default="{ row }">
          ¥{{ row.amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="160">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button 
            link 
            type="danger" 
            size="small" 
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ordersInfoService, deleteOrderService } from '@/api/order'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/format'

const loading = ref(true)
const tableData = ref([])
const filterStatus = ref('') // 筛选状态

// 获取订单数据
const fetchOrders = async () => {
  try {
    const res = await ordersInfoService()
    if (res.code === 0) {
      tableData.value = res.data
    }
  } catch (error) {
    console.error('获取订单失败:', error)
  } finally {
    loading.value = false
  }
}

// 状态标签类型
const statusTagType = (status) => {
  switch (status) {
    case '1': return 'info'
    case '2': return 'warning'
    case '3': return 'success'
    default: return 'info'
  }
}

// 状态文本
const statusText = (status) => {
  switch (status) {
    case '1': return '未接单'
    case '2': return '进行中'
    case '3': return '已完成'
    default: return '未知'
  }
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteOrderService(row.id)
        .then(() => {
          ElMessage.success('删除成功');
          fetchOrders();
        })
        .catch(error => {
          console.error('删除失败:', error);
          ElMessage.error('删除失败');
        });
    })
    .catch(() => {
      ElMessage.info('删除已取消');
    });
}

// 筛选后的数据
const filteredData = computed(() => {
  let data = tableData.value

  // 状态筛选
  if (filterStatus.value) {
    data = data.filter(item => item.status === filterStatus.value)
  }

  return data
})

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}

.el-tag {
  margin: 2px;
}
</style>