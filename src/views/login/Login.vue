<template>
  <div class="login-container">
    <h2>管理员登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          type="password"
          id="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          required
        />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { adminLoginService } from '@/api/admin.js'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const router = useRouter()
    const tokenStore = useTokenStore()

    const loginForm = ref({
      username: '',
      password: ''
    })
    const errorMessage = ref('')

    const handleLogin = async () => {
      try {
        // 调用登录接口
        const response = await adminLoginService(loginForm.value)
        console.log('完整登录响应:', response)
        
        // 确保 token 存在
        if (response.data) {
          // 直接使用 response.data 作为 token
          tokenStore.setToken(response.data)
          console.log('Token 已存储:', tokenStore.token)

          // 设置管理员信息 - 从 token 中解析
          try {
            const tokenPayload = JSON.parse(atob(response.data.split('.')[1]))
            tokenStore.setAdminInfo({
              username: tokenPayload.claims.username || loginForm.value.username,
              avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642ab5acc11d8d85jpeg.jpeg'
            })

            // 登录成功提示
            ElMessage.success('登录成功')
            
            // 登录成功后跳转到首页
            router.push('/home')
          } catch (parseError) {
            console.error('解析 token 失败:', parseError)
            ElMessage.error('登录信息解析失败')
          }
        } else {
          ElMessage.error('登录失败：未获取到有效 token')
          console.error('未找到 token')
        }
      } catch (error) {
        // 处理登录失败
        ElMessage.error('登录失败，请检查用户名和密码')
        console.error('登录失败', error)
      }
    }

    return {
      loginForm,
      errorMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #3aa876;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
