<template>
  <div style="width: 100%;">
    <!-- 筛选区域 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <!-- 主题搜索 -->
      <el-input
        v-model="searchTheme"
        placeholder="请输入轮播图主题"
        clearable
        style="width: 200px;"
      />
      <!-- 添加轮播图按钮 -->
      <el-button type="primary" @click="addDialogVisible = true">添加轮播图</el-button>
    </div>

    <!-- 轮播图列表 -->
    <el-table :data="filteredData" style="width: 100%" v-loading="loading" fit>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="theme" label="主题" />
      <el-table-column prop="rotationUrl" label="轮播图">
        <template #default="{ row }">
          <el-image :src="row.rotationUrl" style="width: 200px; height: 120px;" fit="cover" />
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

    <!-- 添加轮播图弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加轮播图" width="30%">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="主题">
          <el-input v-model="addForm.theme" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="addForm.rotationUrl" placeholder="请输入轮播图URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddRotation">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getRotations, deleteRotation, addRotation } from '@/api/rotation'
import { ElMessageBox, ElMessage } from 'element-plus'

const loading = ref(true)
const tableData = ref([])
const searchTheme = ref('') // 主题搜索
const addDialogVisible = ref(false) // 控制弹窗显示
const addForm = ref({
  theme: '',
  rotationUrl: ''
})

// 获取轮播图数据
const fetchRotations = async () => {
  try {
    const res = await getRotations()
    if (res.code === 0) {
      tableData.value = res.data
    } else {
      ElMessage.error(res.message || '获取轮播图数据失败')
    }
  } catch (error) {
    console.error('获取轮播图数据失败:', error)
    ElMessage.error('获取轮播图数据失败')
  } finally {
    loading.value = false
  }
}

// 删除轮播图
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该轮播图吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteRotation(row.id)
        if (res.code === 0) {
          ElMessage.success('删除成功')
          fetchRotations() // 重新获取数据
        } else {
          ElMessage.error(res.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('删除已取消')
    })
}

// 提交添加轮播图
const submitAddRotation = async () => {
  const { theme, rotationUrl } = addForm.value
  if (!theme || !rotationUrl) {
    ElMessage.warning('请填写主题和URL')
    return
  }

  try {
    const res = await addRotation(theme, rotationUrl)
    if (res.code === 0) {
      ElMessage.success('添加轮播图成功')
      addDialogVisible.value = false // 关闭弹窗
      fetchRotations() // 重新获取数据
      addForm.value = { theme: '', rotationUrl: '' } // 重置表单
    } else {
      ElMessage.error(res.message || '添加轮播图失败')
    }
  } catch (error) {
    console.error('添加轮播图失败:', error)
    ElMessage.error('添加轮播图失败')
  }
}

// 筛选后的数据
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    // 主题搜索
    if (searchTheme.value && !item.theme.includes(searchTheme.value)) {
      return false
    }
    return true
  })
})

onMounted(() => {
  fetchRotations()
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