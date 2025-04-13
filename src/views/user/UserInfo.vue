<template>
  <div style="width: 100%;">
    <!-- 筛选区域 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <!-- 状态筛选 -->
      <el-select
        v-model="filterStatus"
        placeholder="请选择用户状态"
        clearable
        style="width: 200px;"
      >
        <el-option label="正常" value="1" />
        <el-option label="限制登录" value="2" />
      </el-select>

      <!-- 角色筛选 -->
      <el-select
        v-model="filterRole"
        placeholder="请选择用户角色"
        clearable
        style="width: 200px;"
      >
        <el-option label="普通用户" value="1" />
        <el-option label="接单员" value="2" />
      </el-select>

      <!-- 学号检索 -->
      <el-input
        v-model="searchStudentId"
        placeholder="请输入学号"
        clearable
        style="width: 200px;"
      />
    </div>

    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="用户ID" width="100" />
      <el-table-column prop="studentId" label="学号" />
      <el-table-column prop="phoneNumber" label="联系电话" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="role" label="角色" width="140">
        <template #default="{ row }">
          <el-tag :type="roleTagType(row.role)">
            {{ roleText(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
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
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleResetPassword(row)"
          >
            重置密码
          </el-button>
          <el-button
            link
            :type="row.status === '2' ? 'danger' : 'warning'"
            size="small"
            @click="handleRestrictLogin(row)"
          >
            {{ row.status === '1' ? '限制登录' : '解除限制' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getUsers, resetUserPassword, restrictUserLogin } from '@/api/user'
import { ElMessageBox, ElMessage } from 'element-plus' // 导入 Element Plus 组件
import { formatDateTime } from '@/utils/format'

const loading = ref(true)
const tableData = ref([])
const filterStatus = ref('') // 状态筛选
const filterRole = ref('') // 角色筛选
const searchStudentId = ref('') // 学号检索

// 获取用户数据
const fetchUsers = async () => {
  try {
    const res = await getUsers()
    if (res.code === 0) {
      tableData.value = res.data
    }
  } catch (error) {
    console.error('获取用户失败:', error)
    ElMessage.error('获取用户失败')
  } finally {
    loading.value = false
  }
}

// 角色标签类型
const roleTagType = (role) => {
  switch (role) {
    case '1': return 'info' // 普通用户显示灰色
    case '2': return 'success' // 接单员显示绿色
    default: return 'info'
  }
}

// 角色文本
const roleText = (role) => {
  switch (role) {
    case '1': return '普通用户'
    case '2': return '接单员'
    default: return '未知'
  }
}

// 状态标签类型
const statusTagType = (status) => {
  switch (status) {
    case '1': return 'success'
    case '2': return 'danger'
    default: return 'info'
  }
}

// 状态文本
const statusText = (status) => {
  switch (status) {
    case '1': return '正常'
    case '2': return '限制'
    default: return '未知'
  }
}

// 重置密码
const handleResetPassword = (row) => {
    ElMessageBox.confirm('确定重置该用户的密码吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await resetUserPassword(row.studentId);
        if (res.code === 0) {
          ElMessage.success('重置密码成功');
        } else {
          ElMessage.error(res.message || '重置密码失败');
        }
      } catch (error) {
        console.error('重置密码失败:', error);
        ElMessage.error('重置密码失败');
      }
    })
    .catch(() => {
      ElMessage.info('重置密码已取消');
    });
}

// 限制登录
const handleRestrictLogin = (row) => {
  const action = row.status === '1' ? '限制登录' : '解除限制';
  const newStatus = row.status === '1' ? '2' : '1';
  ElMessageBox.confirm(`确定${action}该用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await restrictUserLogin(row.studentId, newStatus);
        if (res.code === 0) {
          ElMessage.success(`${action}成功`);
          row.status = newStatus; // 更新本地状态
        } else {
          ElMessage.error(res.message || `${action}失败`);
        }
      } catch (error) {
        console.error(`${action}失败:`, error);
        ElMessage.error(`${action}失败`);
      }
    })
    .catch(() => {
      ElMessage.info(`${action}已取消`);
    });
}

// 筛选后的数据
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    // 状态筛选
    if (filterStatus.value && item.status !== filterStatus.value) {
      return false
    }
    // 角色筛选
    if (filterRole.value && item.role !== filterRole.value) {
      return false
    }
    // 学号检索
    if (searchStudentId.value && !item.studentId.includes(searchStudentId.value)) {
      return false
    }
    return true
  })
})

onMounted(() => {
  fetchUsers()
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