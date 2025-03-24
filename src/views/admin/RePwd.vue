<template>
    <div class="pwd-container">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
            <el-form-item label="当前密码" prop="old_pwd">
                <el-input v-model="form.old_pwd" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_pwd">
                <el-input v-model="form.new_pwd" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="re_pwd">
                <el-input v-model="form.re_pwd" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { adminPwdUpdateService } from '@/api/admin'
import { ElMessage } from 'element-plus'

// 表单数据
const form = reactive({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

// 验证确认密码是否一致
const validateRePwd = (rule, value, callback) => {
    if (value !== form.new_pwd) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

// 表单验证规则
const rules = reactive({
    old_pwd: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
    ],
    re_pwd: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { validator: validateRePwd, trigger: 'blur' }
    ]
})

// 表单引用
const formRef = ref(null)

// 提交表单
const submitForm = async () => {
    try {
        // 验证表单
        await formRef.value.validate()
        // 调用修改密码的 API
        const res = await adminPwdUpdateService({
            old_pwd: form.old_pwd,
            new_pwd: form.new_pwd,
            re_pwd: form.re_pwd
        })
        if (res.code === 0) {
            ElMessage.success(res.message || '密码修改成功')
            resetForm() // 重置表单
        } else {
            ElMessage.error(res.message || '密码修改失败')
        }
    } catch (error) {
        console.error('密码修改失败:', error)
        ElMessage.error('密码修改失败')
    }
}

// 重置表单
const resetForm = () => {
    formRef.value.resetFields()
}
</script>

<style lang="scss" scoped>
.pwd-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
}
</style>