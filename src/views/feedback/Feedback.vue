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
      <el-option label="已完成" :value="3" />
    </el-select>

    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="反馈ID" width="80" />
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
      <el-table-column prop="answer" label="处理内容" show-overflow-tooltip />
      <el-table-column prop="answerName" label="处理人" width="120" />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="处理时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleProcessFeedback(row)"
          >
            处理反馈
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

    <!-- 处理反馈弹窗 -->
    <el-dialog v-model="processFeedbackDialogVisible" title="处理反馈" width="30%">
      <el-form :model="processFeedbackForm" label-width="80px">
        <el-form-item label="处理内容">
          <el-input
            v-model="processFeedbackForm.content"
            type="textarea"
            placeholder="请输入处理内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processFeedbackDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProcessFeedback">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getFeedbacks, deleteFeedback, processFeedback } from '@/api/feedback'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDateTime } from '@/utils/format'
import { useTokenStore } from '@/stores/token'

const loading = ref(true)
const tableData = ref([])
const filterStatus = ref('') // 筛选状态
const processFeedbackDialogVisible = ref(false) // 控制处理反馈弹窗显示
const processFeedbackForm = ref({
  content: '' // 处理内容
})
const currentFeedbackRow = ref(null) // 当前处理的反馈

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
    case 3: return '已完成'
    default: return '未知'
  }
}

// 打开处理反馈弹窗
const handleProcessFeedback = (row) => {
  currentFeedbackRow.value = row;
  processFeedbackForm.value = {
    content: '' // 清空处理内容
  };
  processFeedbackDialogVisible.value = true;
}

// 提交处理反馈
const submitProcessFeedback = async () => {
  const { content } = processFeedbackForm.value;
  if (!content) {
    ElMessage.warning('请输入处理内容');
    return;
  }

  try {
    const tokenStore = useTokenStore();
    const answerName = tokenStore.adminInfo.username; // 获取处理人用户名
    const res = await processFeedback(currentFeedbackRow.value.id, content, answerName);
    if (res.code === 0) {
      ElMessage.success('处理反馈成功');
      processFeedbackDialogVisible.value = false;
      fetchFeedbacks(); // 提交成功后刷新界面
    } else {
      ElMessage.error(res.message || '处理反馈失败');
    }
  } catch (error) {
    console.error('处理反馈失败:', error);
    ElMessage.error('处理反馈失败');
  }
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