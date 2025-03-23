<script setup>
import {
    PieChart,
    Management,
    Promotion,
    Memo,
    UserFilled,
    User,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useTokenStore } from '@/stores/token'
import { useRouter } from 'vue-router'

const router = useRouter()
const tokenStore = useTokenStore()

// 使用计算属性获取头像和管理员名称
const avatarUrl = computed(() => tokenStore.adminInfo.avatarUrl)
const adminName = computed(() => tokenStore.adminInfo.username)

// Dropdown menu command handler
const handleCommand = (command) => {
  if (command === 'logout') {
    // 清除token和管理员信息
    tokenStore.removeToken()
    // 重置管理员信息为默认值
    tokenStore.setAdminInfo({
      username: ''
    })
    // 跳转到登录页
    router.push('/login')
  }
}
</script>

<template>
    <!-- element-plus中的容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- element-plus的菜单标签 -->
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
                <!-- 1、首页 -->
                <el-menu-item index="/home">
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>
                <!-- 2、订单 -->
                <el-menu-item index="/order">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>订单管理</span>
                </el-menu-item>
                <!-- 3、反馈管理 -->
                <el-menu-item index="/feedback">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>反馈管理</span>
                </el-menu-item>
                <!-- 3、用户 -->
                <el-menu-item index="/user">
                    <el-icon>
                        <Memo />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>
                <!-- 管理员中心 -->
                <el-sub-menu index="">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>管理员</span>
                    </template>
                    <!-- 1、管理员信息 -->
                    <el-menu-item index="/admin/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>管理员信息</span>
                    </el-menu-item>
                    <!-- 2、修改密码 -->
                    <el-menu-item index="/admin/repwd">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>修改密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header style="background-color: #8b8b8b;">
                <div>欢迎：<strong>{{ adminName }}</strong></div>
                <!-- 下拉菜单 -->
                <!-- command: 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatarUrl" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>快递代拿后台管理系统 ©2025 Created by CWN</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/images/summer2.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>