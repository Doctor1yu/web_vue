<template>
    <div class="home-container">
        <div class="stats-wrapper">
            <el-card 
                class="stats-card" 
                v-for="(item, index) in statsItems" 
                :key="index"
                @click="handleCardClick(item.path)"
            >
                <div class="stats-value">{{ item.value }}</div>
                <div class="stats-label">{{ item.label }}</div>
            </el-card>
        </div>

        <el-card class="order-stats-card">
            <template #header>
                <div class="card-header">
                    <span>近30天订单状态分布</span>
                </div>
            </template>
            <div class="order-stats">
                <div class="order-stat-item">
                    <div class="stat-circle pending">
                        <span class="stat-number">{{ orderStats.pending }}</span>
                    </div>
                    <div class="stat-label">未接单</div>
                </div>
                <div class="order-stat-item">
                    <div class="stat-circle processing">
                        <span class="stat-number">{{ orderStats.processing }}</span>
                    </div>
                    <div class="stat-label">进行中</div>
                </div>
                <div class="order-stat-item">
                    <div class="stat-circle completed">
                        <span class="stat-number">{{ orderStats.completed }}</span>
                    </div>
                    <div class="stat-label">已完成</div>
                </div>
            </div>
        </el-card>

        <!-- 添加反馈分布柱状图 -->
        <el-card class="feedback-stats-card">
            <template #header>
                <div class="card-header">
                    <span>反馈问题类型分布</span>
                </div>
            </template>
            <div class="chart-container">
                <div ref="feedbackChartRef" class="feedback-chart"></div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getHomeDataService, getOrderStatusStatsService, getFeedbackStatsService } from '@/api/home.js'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const statsItems = ref([])
const orderStats = ref({
    pending: 0,
    processing: 0,
    completed: 0
})

// 添加反馈图表相关
const feedbackChartRef = ref(null)
let feedbackChart = null

const handleCardClick = (path) => {
    router.push(path)
}

const initHomeData = async () => {
    const res = await getHomeDataService()
    if (res.code === 0) {
        statsItems.value = [
            { label: '轮播图总数', value: res.data.rotationCount, path: '/rotation' },
            { label: '订单总数', value: res.data.orderCount, path: '/order' },
            { label: '反馈总数', value: res.data.feedbackCount, path: '/feedback' },
            { label: '用户总数', value: res.data.userCount, path: '/user' },
            { label: '申请接单数', value: res.data.applyCount, path: '/applications' },
        ]
    }
}

const initOrderStats = async () => {
    const res = await getOrderStatusStatsService()
    if (res.code === 0) {
        orderStats.value = {
            pending: res.data.pendingCount || 0,
            processing: res.data.processingCount || 0,
            completed: res.data.completedCount || 0
        }
    }
}

const initFeedbackChart = async () => {
    const res = await getFeedbackStatsService()
    if (res.code === 0) {
        const chartData = [
            { name: '快递员问题', value: res.data.courierIssueCount },
            { name: '平台问题', value: res.data.platformIssueCount },
            { name: '送货时间', value: res.data.deliveryTimeCount },
            { name: '金额问题', value: res.data.paymentIssueCount },
            { name: '其他问题', value: res.data.otherIssueCount }
        ]

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%', // 增加底部空间，防止x轴标签显示不全
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: chartData.map(item => item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 30 // 旋转标签，防止文字重叠
                }
            },
            yAxis: {
                type: 'value',
                name: '数量',
                minInterval: 1 // 保证y轴刻度为整数
            },
            series: [
                {
                    name: '反馈数量',
                    type: 'bar',
                    data: chartData.map(item => item.value),
                    itemStyle: {
                        color: '#409EFF'
                    },
                    barWidth: '40%',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            ]
        }

        feedbackChart = echarts.init(feedbackChartRef.value)
        feedbackChart.setOption(option)
    }
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
    feedbackChart && feedbackChart.resize()
}

onMounted(() => {
    initHomeData()
    initOrderStats()
    initFeedbackChart()
    window.addEventListener('resize', handleResize)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    feedbackChart && feedbackChart.dispose()
})
</script>

<style lang="scss" scoped>
.home-container {
    padding: 20px;
}

.stats-wrapper {
    display: flex;
    flex-wrap: nowrap;
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.stats-card {
    flex: 1;
    min-width: 180px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .stats-value {
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 10px;
    }

    .stats-label {
        font-size: 14px;
        color: #606266;
    }
}

.order-stats-card {
    margin-top: 20px;
    
    .card-header {
        font-weight: bold;
    }
}

.order-stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
}

.order-stat-item {
    text-align: center;
    
    .stat-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        
        &.pending {
            background-color: #E6A23C;
        }
        
        &.processing {
            background-color: #409EFF;
        }
        
        &.completed {
            background-color: #67C23A;
        }
        
        .stat-number {
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
    }
    
    .stat-label {
        font-size: 14px;
        color: #606266;
    }
}

.feedback-stats-card {
    margin-top: 20px;
    
    .card-header {
        font-weight: bold;
    }
}

.chart-container {
    display: flex;
    justify-content: center;
    padding: 10px;
}

.feedback-chart {
    height: 250px; // 减小图表高度
    width: 90%; // 适当调整宽度
}
</style>