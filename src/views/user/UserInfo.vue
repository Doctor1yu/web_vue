<template>
  <div style="width: 100%;">
    <!-- 状态筛选 -->
    <el-select
      v-model="filterStatus"
      placeholder="请选择用户状态"
      clearable
      style="margin-bottom: 20px; width: 200px;"
    >
      <el-option label="正常" value="1" />
      <el-option label="限制登录" value="0" />
    </el-select>

    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="用户ID" width="100" />
      <el-table-column prop="studentId" label="学号" />
      <el-table-column prop="phoneNumber" label="联系电话" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="rule" label="角色" width="140">
        <template #default="{ row }">
          <el-tag :type="ruleTagType(row.rule)">
            {{ ruleText(row.rule) }}
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
import { getUsers } from '@/api/data' // 假设接口封装在data.js中
import { ElMessageBox, ElMessage } from 'element-plus' // 导入 Element Plus 组件

const loading = ref(true)
const tableData = ref([])
const filterStatus = ref('') // 筛选状态

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
const ruleTagType = (rule) => {
  switch (rule) {
    case '1': return 'info' // 普通用户显示灰色
    case '2': return 'success' // 接单员显示绿色
    default: return 'info'
  }
}

// 角色文本
const ruleText = (rule) => {
  switch (rule) {
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
    .then(() => {
      // 这里可以调用重置密码接口
      console.log('重置密码:', row);
      ElMessage.success('重置密码成功');
    })
    .catch(() => {
      ElMessage.info('重置密码已取消');
    });
}

// 限制登录
const handleRestrictLogin = (row) => {
  const action = row.status === '1' ? '限制登录' : '解除限制';
  ElMessageBox.confirm(`确定${action}该用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里可以调用限制登录接口
      console.log(`${action}:`, row);
      ElMessage.success(`${action}成功`);
    })
    .catch(() => {
      ElMessage.info(`${action}已取消`);
    });
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里可以调用删除用户接口
      console.log('删除用户:', row);
      ElMessage.success('删除成功');
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