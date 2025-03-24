<template>
  <div style="width: 100%;">
    <!-- 操作按钮 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="handleAddAdmin">添加管理员</el-button>
    </div>

    <!-- 管理员信息表格 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="password" label="密码" />

      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>

      <el-table-column prop="updateAt" label="修改时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updateAt) }}
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

    <!-- 添加管理员弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加管理员" width="30%">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddAdmin">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addAdminService, deleteAdminService, getAdmins } from '@/api/admin'

const loading = ref(true)
const tableData = ref([])
const addDialogVisible = ref(false) // 控制弹窗显示
const addFormRef = ref(null) // 表单引用

// 添加管理员表单数据
const addForm = reactive({
  username: '',
  password: ''
})

// 添加管理员表单验证规则
const addFormRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
})

// 获取管理员数据
const fetchAdmins = async () => {
  try {
    const res = await getAdmins()
    if (res.code === 0) {
      console.log('管理员数据:', res.data) // 打印数据
      tableData.value = res.data
    } else {
      ElMessage.error(res.message || '获取管理员数据失败')
    }
  } catch (error) {
    console.error('获取管理员数据失败:', error)
    ElMessage.error('获取管理员数据失败')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatDateTime = (dateString) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 打开添加管理员弹窗
const handleAddAdmin = () => {
  addDialogVisible.value = true
}

// 提交添加管理员表单
const submitAddAdmin = async () => {
  try {
    // 验证表单
    await addFormRef.value.validate()
    // 调用添加管理员 API
    const res = await addAdminService({
      username: addForm.username,
      password: addForm.password
    })
    if (res.code === 0) {
      ElMessage.success('添加管理员成功')
      addDialogVisible.value = false // 关闭弹窗
      fetchAdmins() // 重新获取管理员数据
      addFormRef.value.resetFields() // 重置表单
    } else {
      ElMessage.error(res.message || '添加管理员失败')
    }
  } catch (error) {
    console.error('添加管理员失败:', error)
    ElMessage.error('添加管理员失败')
  }
}

// 删除管理员
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该管理员吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteAdminService(row.id) // 调用删除管理员的 API
        if (res.code === 0) {
          ElMessage.success('删除管理员成功')
          fetchAdmins() // 删除成功后重新获取数据
        } else {
          ElMessage.error(res.message || '删除管理员失败')
        }
      } catch (error) {
        console.error('删除管理员失败:', error)
        ElMessage.error('删除管理员失败')
      }
    })
    .catch(() => {
      ElMessage.info('删除已取消')
    })
}

onMounted(() => {
  fetchAdmins()
})
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>