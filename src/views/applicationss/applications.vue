<template>
  <div style="width: 100%;">
    <!-- 筛选区域 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <!-- 学号搜索 -->
      <el-input
        v-model="searchStudentId"
        placeholder="请输入学号"
        clearable
        style="width: 200px;"
      />
      <!-- 状态筛选 -->
      <el-select
        v-model="filterStatus"
        placeholder="请选择状态"
        clearable
        style="width: 200px;"
      >
        <el-option label="通过" value="3" />
        <el-option label="拒绝" value="4" />
      </el-select>
    </div>

    <!-- 申请列表 -->
    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="studentId" label="学号" />
      <el-table-column prop="applyReason" label="申请理由" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reviewerName" label="审核人姓名" />
      <el-table-column prop="remark" label="审核备注" />
      <el-table-column prop="appliedAt" label="申请时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.appliedAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="reviewedAt" label="审核时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.reviewedAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="openProcessDialog(row)"
          >
            处理申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 处理申请弹窗 -->
    <el-dialog v-model="processDialogVisible" title="处理申请" width="30%">
      <el-form :model="processForm" label-width="80px">
        <el-form-item label="状态">
          <el-select v-model="processForm.status" placeholder="请选择状态">
            <el-option label="通过" value="3" />
            <el-option label="拒绝" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="processForm.remark" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProcess">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getApplications, updateApplicationStatus } from '@/api/applications'
import { useTokenStore } from '@/stores/token' // 导入 token.js 的 store
import { ElMessage } from 'element-plus'

const loading = ref(true)
const tableData = ref([])
const searchStudentId = ref('') // 学号搜索
const filterStatus = ref('') // 状态筛选
const processDialogVisible = ref(false) // 控制弹窗显示
const processForm = ref({
  status: '',
  remark: ''
})
const currentRow = ref(null) // 当前处理的申请
const tokenStore = useTokenStore()

// 获取申请数据
const fetchApplications = async () => {
  try {
    const res = await getApplications()
    if (res.code === 0) {
      tableData.value = res.data
    } else {
      ElMessage.error(res.message || '获取申请数据失败')
    }
  } catch (error) {
    console.error('获取申请数据失败:', error)
    ElMessage.error('获取申请数据失败')
  } finally {
    loading.value = false
  }
}

// 状态标签类型
const statusTagType = (status) => {
  switch (status) {
    case '1': return 'warning' // 已申请
    case '2': return 'info' // 未申请
    case '3': return 'success' // 通过
    case '4': return 'danger' // 拒绝
    default: return 'info'
  }
}

// 状态文本
const statusText = (status) => {
  switch (status) {
    case '1': return '已申请'
    case '2': return '未申请'
    case '3': return '通过'
    case '4': return '拒绝'
    default: return '未知'
  }
}

// 打开处理申请弹窗
const openProcessDialog = (row) => {
  currentRow.value = row
  processForm.value = {
    status: row.status === '1' ? '' : row.status, // 如果状态是1（已申请），则默认不选择
    remark: row.remark || ''
  }
  processDialogVisible.value = true
}

// 提交处理申请
const submitProcess = async () => {
  const { status, remark } = processForm.value
  if (!status) {
    ElMessage.warning('请选择状态')
    return
  }

  // 打印调试信息
  console.log('tokenStore.adminInfo:', tokenStore.adminInfo)
  console.log('tokenStore.adminInfo.username:', tokenStore.adminInfo.username)

  if (!tokenStore.adminInfo || !tokenStore.adminInfo.username) {
    ElMessage.error('无法获取审核人信息，请重新登录')
    return
  }

  try {
    const res = await updateApplicationStatus(
      currentRow.value.studentId,
      status,
      remark,
      tokenStore.adminInfo.username
    )

    if (res.code === 0) {
      ElMessage.success('处理成功')
      currentRow.value.status = status
      currentRow.value.remark = remark
      currentRow.value.reviewerName = tokenStore.adminInfo.username
      processDialogVisible.value = false
    } else {
      ElMessage.error(res.message || '处理失败')
    }
  } catch (error) {
    console.error('处理失败:', error)
    ElMessage.error('处理失败')
  }
}

// 筛选后的数据
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    // 学号搜索
    if (searchStudentId.value && !item.studentId.includes(searchStudentId.value)) {
      return false
    }
    // 状态筛选
    if (filterStatus.value && item.status !== filterStatus.value) {
      return false
    }
    return true
  })
})

// 格式化时间
const formatDateTime = (dateString) => {
  if (!dateString) return '未审核'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

onMounted(() => {
  fetchApplications()
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