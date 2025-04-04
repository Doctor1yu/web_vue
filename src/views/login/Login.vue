<template>
  <div class="login-container">
    <div class="login-box">
      <el-card class="login-card">
        <template #header>
          <h2 class="login-title">管理员登录</h2>
        </template>
        <el-form 
          :model="loginForm" 
          ref="loginFormRef"
          :rules="rules"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" class="login-button">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { adminLoginService } from '@/api/admin.js'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const tokenStore = useTokenStore()
const loginFormRef = ref(null)

const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await adminLoginService(loginForm.value)
        
        if (response.data) {
          tokenStore.setToken(response.data)

          try {
            const tokenPayload = JSON.parse(atob(response.data.split('.')[1]))
            tokenStore.setAdminInfo({
              ...tokenStore.adminInfo,
              username: tokenPayload.claims.username || loginForm.value.username
            })

            ElMessage.success('登录成功')
            router.push('/home')
          } catch (parseError) {
            console.error('解析 token 失败:', parseError)
            ElMessage.error('登录信息解析失败')
          }
        } else {
          ElMessage.error('登录失败：未获取到有效 token')
        }
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码')
        console.error('登录失败', error)
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('http://stm89m2wy.hd-bkt.clouddn.com/back/image/green.jpg') no-repeat center center;
  background-size: cover;
}

.login-box {
  width: 400px;
  margin: auto;
}

.login-card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px;
}

.login-title {
  text-align: center;
  color: #409EFF;
  font-size: 24px;
  margin: 0;
  padding: 10px 0;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 4px 11px !important;
  height: 30px !important;
}

:deep(.el-input__inner) {
  height: 100% !important;
  line-height: 35px !important;
  font-size: 15px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409EFF inset;
}

.login-button {
  width: 100%;
  padding: 12px 0;
}

:deep(.el-card__header) {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
</style>
