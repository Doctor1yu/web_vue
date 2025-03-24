<template>
  <div style="width: 100%;">
    <!-- 状态筛选 -->
    <el-select
      v-model="filterStatus"
      placeholder="请选择反馈状态"
      clearable
      style="margin-bottom: 20px; width: 200px;"
    >
      <el-option label="未处理" :value="1" />
      <el-option label="处理中" :value="2" />
      <el-option label="已处理" :value="3" />
    </el-select>

    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="反馈ID" width="100" />
      <el-table-column prop="subject" label="主题" width="120"/>
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="联系电话" width="120"/>
      <el-table-column prop="studentId" label="学号" width="120"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleUpdateStatus(row)"
          >
            修改状态
          </el-button>
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
import { getFeedbacks, deleteFeedback, updateFeedbackStatus } from '@/api/feedback'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(true)
const tableData = ref([])
const filterStatus = ref('') // 筛选状态

// 获取反馈数据
const fetchFeedbacks = async () => {
  try {
    const res = await getFeedbacks()
    if (res.code === 0) {
      tableData.value = res.data
    }
  } catch (error) {
    console.error('获取反馈失败:', error)
    ElMessage.error('获取反馈失败')
  } finally {
    loading.value = false
  }
}

// 状态标签类型
const statusTagType = (status) => {
  switch (status) {
    case 1: return 'info'
    case 2: return 'warning'
    case 3: return 'success'
    default: return 'info'
  }
}

// 状态文本
const statusText = (status) => {
  switch (status) {
    case 1: return '未处理'
    case 2: return '处理中'
    case 3: return '已处理'
    default: return '未知'
  }
}

// 修改状态
const handleUpdateStatus = (row) => {
  ElMessageBox.prompt('请输入状态 (1:未处理, 2:处理中, 3:已处理)', '修改状态', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[1-3]$/,
    inputErrorMessage: '请输入 1（未处理）、2（处理中）或 3（已处理）'
  })
    .then(async ({ value }) => {
      const newStatus = Number(value)
      try {
        const res = await updateFeedbackStatus(row.id, newStatus)
        if (res.code === 0) {
          ElMessage.success('状态修改成功')
          // 更新表格中的状态
          row.status = newStatus
        } else {
          ElMessage.error(res.message || '状态修改失败')
        }
      } catch (error) {
        console.error('状态修改失败:', error)
        ElMessage.error('状态修改失败')
      }
    })
    .catch(() => {
      ElMessage.info('修改状态已取消')
    })
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该反馈吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteFeedback(row.id)
        .then(() => {
          ElMessage.success('删除成功');
          fetchFeedbacks(); // 删除成功后重新获取反馈数据
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
  if (!filterStatus.value) return tableData.value
  return tableData.value.filter(item => item.status === filterStatus.value)
})

// 格式化时间
const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

onMounted(() => {
  fetchFeedbacks()
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