<template>
	<custom-layout>
		<view class="content-statistics">
			<!-- 日期范围选择 -->
			<view class="date-header">
				<!-- 快捷选择标签 -->
				<view class="quick-tabs">
					<view 
						class="tab-item" 
						:class="{ active: dateMode === 'day' }"
						@click="setDateMode('day')"
					>
						<text>日</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: dateMode === 'month' }"
						@click="setDateMode('month')"
					>
						<text>月</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: dateMode === 'year' }"
						@click="setDateMode('year')"
					>
						<text>年</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: dateMode === 'custom' }"
						@click="setDateMode('custom')"
					>
						<text>自定义</text>
					</view>
				</view>
				
				<!-- 日期显示与选择 -->
				<view class="date-selector">
					<view class="date-nav" @click="changeDatePrev">
						<icon class="iconfont icon-zuojiantou"></icon>
					</view>
					<view class="date-display" @click="openDatePicker">
						<text>{{ displayDateText }}</text>
						<icon class="iconfont icon-xiajiantou"></icon>
					</view>
					<view class="date-nav" @click="changeDateNext">
						<icon class="iconfont icon-youjiantou"></icon>
					</view>
				</view>
			</view>

			<!-- 总览卡片 -->
			<view class="summary-card">
				<view class="summary-item">
					<text class="label">{{ periodLabel }}支出</text>
					<text class="value expense">¥{{ formatMoney(summaryData.totalExpense) }}</text>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-item">
					<text class="label">{{ periodLabel }}收入</text>
					<text class="value income">¥{{ formatMoney(summaryData.totalIncome) }}</text>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-item">
					<text class="label">{{ periodLabel }}结余</text>
					<text class="value" :class="summaryData.balance >= 0 ? 'income' : 'expense'">
						¥{{ formatMoney(summaryData.balance) }}
					</text>
				</view>
			</view>

			<!-- 趋势图表（非日视图显示） -->
			<view class="chart-section" v-if="dateMode !== 'day'">
				<view class="section-header">
					<text class="section-title">{{ trendTitle }}</text>
					<text class="section-total">{{ trendSubtitle }}</text>
				</view>
				<view class="bar-chart">
					<view class="chart-bars">
						<view 
							v-for="(item, index) in trendData" 
							:key="index"
							class="bar-item"
							@click="selectTrendItem(index)"
						>
							<view class="bar-wrapper">
								<view 
									class="bar" 
									:class="{ active: selectedTrendIndex === index }"
									:style="{ height: getBarHeight(item.expense) + '%' }"
								></view>
							</view>
							<text class="bar-label">{{ item.label }}</text>
						</view>
					</view>
					<view class="trend-detail" v-if="selectedTrendIndex !== null && trendData[selectedTrendIndex]">
						<text class="detail-date">{{ trendData[selectedTrendIndex].fullLabel }}</text>
						<text class="detail-amount">支出 ¥{{ formatMoney(trendData[selectedTrendIndex].expense) }}</text>
					</view>
				</view>
			</view>

			<!-- 当日明细（日视图显示） -->
			<view class="chart-section" v-if="dateMode === 'day'">
				<view class="section-header">
					<text class="section-title">当日明细</text>
					<text class="section-total">共 {{ dayDetailList.length }} 笔</text>
				</view>
				<view class="day-detail-list">
					<view 
						v-for="(item, index) in dayDetailList" 
						:key="index"
						class="detail-item"
					>
						<view class="detail-left">
							<view class="detail-icon">
								<icon class="iconfont" :class="item.icon"></icon>
							</view>
							<view class="detail-info">
								<text class="detail-category">{{ item.category }}</text>
								<text class="detail-time">{{ item.time }}</text>
							</view>
						</view>
						<text class="detail-amount" :class="item.type">
							{{ item.type === 'expense' ? '-' : '+' }}¥{{ formatMoney(item.amount) }}
						</text>
					</view>
					<view class="empty-tip" v-if="dayDetailList.length === 0">
						<text>暂无记录</text>
					</view>
				</view>
			</view>

			<!-- 分类饼图 -->
			<view class="chart-section">
				<view class="section-header">
					<text class="section-title">支出分类</text>
				</view>
				<view class="pie-chart-container">
					<view class="pie-chart">
						<view class="pie-center">
							<text class="pie-total-label">总支出</text>
							<text class="pie-total-value">¥{{ formatMoney(summaryData.totalExpense) }}</text>
						</view>
						<view 
							class="pie-ring"
							:style="{ background: getPieGradient() }"
						></view>
					</view>
				</view>
				<!-- 分类列表 -->
				<view class="category-list">
					<view 
						v-for="(item, index) in categoryData" 
						:key="item.category"
						class="category-item"
					>
						<view class="category-info">
							<view class="category-dot" :style="{ backgroundColor: pieColors[index % pieColors.length] }"></view>
							<text class="category-name">{{ item.name }}</text>
						</view>
						<view class="category-data">
							<text class="category-amount">¥{{ formatMoney(item.amount) }}</text>
							<text class="category-percent">{{ item.percent }}%</text>
						</view>
						<view class="category-bar-bg">
							<view 
								class="category-bar" 
								:style="{ 
									width: item.percent + '%',
									backgroundColor: pieColors[index % pieColors.length]
								}"
							></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>

			<!-- 日期选择器弹窗 -->
			<wd-popup v-model="datePickerVisible" position="bottom" custom-style="padding: 20rpx;">
				<view class="picker-header">
					<text class="picker-cancel" @click="datePickerVisible = false">取消</text>
					<text class="picker-title">选择日期</text>
					<text class="picker-confirm" @click="confirmDatePicker">确定</text>
				</view>
				<wd-datetime-picker-view 
					v-model="tempDate" 
					:type="pickerType"
				/>
			</wd-popup>

			<!-- 自定义日期范围选择 -->
			<wd-popup v-model="customRangeVisible" position="bottom" custom-style="padding: 20rpx;">
				<view class="picker-header">
					<text class="picker-cancel" @click="customRangeVisible = false">取消</text>
					<text class="picker-title">选择日期范围</text>
					<text class="picker-confirm" @click="confirmCustomRange">确定</text>
				</view>
				<view class="custom-range-picker">
					<view class="range-row">
						<text class="range-label">开始日期</text>
						<view class="range-value" @click="selectRangeDate('start')">
							<text>{{ formatDate(customStartDate) }}</text>
						</view>
					</view>
					<view class="range-row">
						<text class="range-label">结束日期</text>
						<view class="range-value" @click="selectRangeDate('end')">
							<text>{{ formatDate(customEndDate) }}</text>
						</view>
					</view>
				</view>
				<wd-datetime-picker-view 
					v-model="tempRangeDate" 
					type="date"
				/>
			</wd-popup>
		</view>
	</custom-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// 日期模式
type DateMode = 'day' | 'month' | 'year' | 'custom';
const dateMode = ref<DateMode>('month');

// 当前选择的日期
const currentDate = ref(new Date());
const customStartDate = ref(new Date());
const customEndDate = ref(new Date());

// 弹窗控制
const datePickerVisible = ref(false);
const customRangeVisible = ref(false);
const tempDate = ref(Date.now());
const tempRangeDate = ref(Date.now());
const currentRangeType = ref<'start' | 'end'>('start');

// 趋势图选中
const selectedTrendIndex = ref<number | null>(null);

// 饼图颜色
const pieColors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#6b7280'];

// 日期选择器类型
const pickerType = computed(() => {
	switch (dateMode.value) {
		case 'day': return 'date';
		case 'month': return 'year-month';
		case 'year': return 'year';
		default: return 'date';
	}
});

// 周期标签
const periodLabel = computed(() => {
	switch (dateMode.value) {
		case 'day': return '当日';
		case 'month': return '本月';
		case 'year': return '本年';
		case 'custom': return '期间';
		default: return '';
	}
});

// 显示的日期文本
const displayDateText = computed(() => {
	const d = currentDate.value;
	switch (dateMode.value) {
		case 'day':
			return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
		case 'month':
			return `${d.getFullYear()}年${d.getMonth() + 1}月`;
		case 'year':
			return `${d.getFullYear()}年`;
		case 'custom':
			return `${formatDate(customStartDate.value)} ~ ${formatDate(customEndDate.value)}`;
		default:
			return '';
	}
});

// 趋势标题
const trendTitle = computed(() => {
	switch (dateMode.value) {
		case 'month': return '每日支出趋势';
		case 'year': return '每月支出趋势';
		case 'custom': return '支出趋势';
		default: return '支出趋势';
	}
});

// 趋势副标题
const trendSubtitle = computed(() => {
	const data = trendData.value;
	const total = data.reduce((sum, item) => sum + item.expense, 0);
	const avg = total / (data.length || 1);
	switch (dateMode.value) {
		case 'month': return `日均 ¥${formatMoney(avg)}`;
		case 'year': return `月均 ¥${formatMoney(avg)}`;
		default: return `平均 ¥${formatMoney(avg)}`;
	}
});

// 汇总数据
const summaryData = computed(() => {
	const totalExpense = dateMode.value === 'day' ? 256.50 : 
		dateMode.value === 'year' ? 64252.80 : 5354.40;
	const totalIncome = dateMode.value === 'day' ? 0 :
		dateMode.value === 'year' ? 105729.60 : 8810.80;
	return {
		totalExpense,
		totalIncome,
		balance: totalIncome - totalExpense
	};
});

// 趋势数据
const trendData = computed(() => {
	const data: Array<{label: string; fullLabel: string; expense: number}> = [];
	
	if (dateMode.value === 'month') {
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		for (let i = 1; i <= daysInMonth; i++) {
			data.push({
				label: String(i),
				fullLabel: `${month + 1}月${i}日`,
				expense: Math.random() * 500 + 50
			});
		}
	} else if (dateMode.value === 'year') {
		for (let i = 1; i <= 12; i++) {
			data.push({
				label: `${i}月`,
				fullLabel: `${currentDate.value.getFullYear()}年${i}月`,
				expense: Math.random() * 6000 + 2000
			});
		}
	} else if (dateMode.value === 'custom') {
		const start = customStartDate.value;
		const end = customEndDate.value;
		const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
		
		if (diffDays <= 31) {
			for (let i = 0; i < diffDays; i++) {
				const d = new Date(start);
				d.setDate(d.getDate() + i);
				data.push({
					label: String(d.getDate()),
					fullLabel: `${d.getMonth() + 1}月${d.getDate()}日`,
					expense: Math.random() * 500 + 50
				});
			}
		} else {
			const startMonth = start.getFullYear() * 12 + start.getMonth();
			const endMonth = end.getFullYear() * 12 + end.getMonth();
			for (let m = startMonth; m <= endMonth; m++) {
				const year = Math.floor(m / 12);
				const month = m % 12 + 1;
				data.push({
					label: `${month}月`,
					fullLabel: `${year}年${month}月`,
					expense: Math.random() * 6000 + 2000
				});
			}
		}
	}
	
	return data;
});

// 当日明细
const dayDetailList = computed(() => {
	return [
		{ category: '午餐', icon: 'icon-canting', type: 'expense', amount: 35.00, time: '12:30' },
		{ category: '地铁', icon: 'icon-gongjiao', type: 'expense', amount: 6.00, time: '08:15' },
		{ category: '咖啡', icon: 'icon-canting', type: 'expense', amount: 28.00, time: '14:20' },
		{ category: '超市', icon: 'icon-gouwu', type: 'expense', amount: 156.50, time: '19:45' },
		{ category: '地铁', icon: 'icon-gongjiao', type: 'expense', amount: 6.00, time: '18:30' },
		{ category: '奖金', icon: 'icon-gongzi', type: 'income', amount: 500.00, time: '10:00' }
	];
});

// 分类数据
const categoryData = computed(() => {
	const data = [
		{ category: 'food', name: '餐饮', amount: 1850.00 },
		{ category: 'transport', name: '交通', amount: 680.00 },
		{ category: 'shopping', name: '购物', amount: 1200.00 },
		{ category: 'rent', name: '房租', amount: 800.00 },
		{ category: 'entertainment', name: '娱乐', amount: 450.00 },
		{ category: 'other', name: '其它', amount: 374.40 }
	];
	
	const total = data.reduce((sum, item) => sum + item.amount, 0);
	return data.map(item => ({
		...item,
		percent: Math.round((item.amount / total) * 100)
	})).sort((a, b) => b.amount - a.amount);
});

// 获取柱状图高度
const getBarHeight = (expense: number) => {
	const max = Math.max(...trendData.value.map(d => d.expense));
	return max > 0 ? (expense / max) * 100 : 0;
};

// 选择趋势项
const selectTrendItem = (index: number) => {
	selectedTrendIndex.value = selectedTrendIndex.value === index ? null : index;
};

// 生成饼图渐变
const getPieGradient = () => {
	const data = categoryData.value;
	if (data.length === 0) return '#eee';
	
	let gradientParts: string[] = [];
	let currentAngle = 0;
	
	data.forEach((item, index) => {
		const angle = (item.percent / 100) * 360;
		const color = pieColors[index % pieColors.length];
		gradientParts.push(`${color} ${currentAngle}deg ${currentAngle + angle}deg`);
		currentAngle += angle;
	});
	
	return `conic-gradient(${gradientParts.join(', ')})`;
};

// 设置日期模式
const setDateMode = (mode: DateMode) => {
	dateMode.value = mode;
	selectedTrendIndex.value = null;
	
	if (mode === 'custom') {
		customRangeVisible.value = true;
	}
};

// 打开日期选择器
const openDatePicker = () => {
	if (dateMode.value === 'custom') {
		customRangeVisible.value = true;
	} else {
		tempDate.value = currentDate.value.getTime();
		datePickerVisible.value = true;
	}
};

// 确认日期选择
const confirmDatePicker = () => {
	currentDate.value = new Date(tempDate.value);
	datePickerVisible.value = false;
	selectedTrendIndex.value = null;
};

// 选择范围日期
const selectRangeDate = (type: 'start' | 'end') => {
	currentRangeType.value = type;
	tempRangeDate.value = type === 'start' ? 
		customStartDate.value.getTime() : 
		customEndDate.value.getTime();
};

// 确认自定义范围
const confirmCustomRange = () => {
	if (currentRangeType.value === 'start') {
		customStartDate.value = new Date(tempRangeDate.value);
	} else {
		customEndDate.value = new Date(tempRangeDate.value);
	}
	
	if (customStartDate.value > customEndDate.value) {
		const temp = customStartDate.value;
		customStartDate.value = customEndDate.value;
		customEndDate.value = temp;
	}
	
	customRangeVisible.value = false;
	selectedTrendIndex.value = null;
};

// 上一个周期
const changeDatePrev = () => {
	const d = new Date(currentDate.value);
	switch (dateMode.value) {
		case 'day':
			d.setDate(d.getDate() - 1);
			break;
		case 'month':
			d.setMonth(d.getMonth() - 1);
			break;
		case 'year':
			d.setFullYear(d.getFullYear() - 1);
			break;
		case 'custom':
			const diff = customEndDate.value.getTime() - customStartDate.value.getTime();
			customEndDate.value = new Date(customStartDate.value.getTime() - 1);
			customStartDate.value = new Date(customEndDate.value.getTime() - diff);
			break;
	}
	currentDate.value = d;
	selectedTrendIndex.value = null;
};

// 下一个周期
const changeDateNext = () => {
	const d = new Date(currentDate.value);
	switch (dateMode.value) {
		case 'day':
			d.setDate(d.getDate() + 1);
			break;
		case 'month':
			d.setMonth(d.getMonth() + 1);
			break;
		case 'year':
			d.setFullYear(d.getFullYear() + 1);
			break;
		case 'custom':
			const diff = customEndDate.value.getTime() - customStartDate.value.getTime();
			customStartDate.value = new Date(customEndDate.value.getTime() + 24 * 60 * 60 * 1000);
			customEndDate.value = new Date(customStartDate.value.getTime() + diff);
			break;
	}
	currentDate.value = d;
	selectedTrendIndex.value = null;
};

// 格式化金额
const formatMoney = (num: number) => {
	return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 格式化日期
const formatDate = (date: Date) => {
	const y = date.getFullYear();
	const m = date.getMonth() + 1;
	const d = date.getDate();
	return `${y}/${m}/${d}`;
};

onShow(() => {
	console.log('总览页面');
});
</script>

<style lang="scss">
.content-statistics {
	padding: 20rpx;
	padding-top: 200rpx; // 为固定头部留出空间
	background-color: #f5f7fa;
	min-height: calc(100vh - 100rpx);
	box-sizing: border-box;

	// 日期头部 - 固定定位
	.date-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background-color: #f5f7fa;
		padding: 20rpx;
		padding-bottom: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.quick-tabs {
			display: flex;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 8rpx;
			margin-bottom: 20rpx;

			.tab-item {
				flex: 1;
				text-align: center;
				padding: 16rpx 0;
				border-radius: 12rpx;
				transition: all 0.3s;

				text {
					font-size: 26rpx;
					color: #666;
				}

				&.active {
					background-color: #3b82f6;

					text {
						color: #fff;
						font-weight: 600;
					}
				}
			}
		}

		.date-selector {
			display: flex;
			align-items: center;
			justify-content: center;

			.date-nav {
				padding: 16rpx 24rpx;
				
				.iconfont {
					font-size: 28rpx;
					color: #666;
				}
			}

			.date-display {
				display: flex;
				align-items: center;
				padding: 12rpx 24rpx;
				background-color: #fff;
				border-radius: 30rpx;
				
				text {
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
				}
				
				.iconfont {
					font-size: 24rpx;
					color: #999;
					margin-left: 8rpx;
				}
			}
		}
	}

	// 内容区域顶部间距（补偿固定头部）
	.summary-card:first-of-type {
		margin-top: 0;
	}

	// 总览卡片
	.summary-card {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
		margin-bottom: 24rpx;

		.summary-item {
			flex: 1;
			text-align: center;
			
			.label {
				display: block;
				font-size: 24rpx;
				color: #999;
				margin-bottom: 12rpx;
			}
			
			.value {
				display: block;
				font-size: 32rpx;
				font-weight: 700;
				color: #333;
				
				&.expense {
					color: #333;
				}
				
				&.income {
					color: #ef4444;
				}
			}
		}

		.summary-divider {
			width: 1rpx;
			height: 60rpx;
			background-color: #eee;
		}
	}

	// 图表区域
	.chart-section {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;

		.section-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.section-title {
				font-size: 28rpx;
				font-weight: 600;
				color: #333;
			}

			.section-total {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	// 柱状图
	.bar-chart {
		.chart-bars {
			display: flex;
			align-items: flex-end;
			height: 200rpx;
			padding: 0 10rpx;
			overflow-x: auto;
			
			&::-webkit-scrollbar {
				display: none;
			}

			.bar-item {
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				min-width: 48rpx;
				margin: 0 4rpx;

				.bar-wrapper {
					width: 100%;
					height: 160rpx;
					display: flex;
					align-items: flex-end;
					justify-content: center;

					.bar {
						width: 28rpx;
						background-color: #dbeafe;
						border-radius: 4rpx 4rpx 0 0;
						transition: all 0.3s;
						min-height: 4rpx;

						&.active {
							background-color: #3b82f6;
						}
					}
				}

				.bar-label {
					font-size: 18rpx;
					color: #999;
					margin-top: 8rpx;
					white-space: nowrap;
				}
			}
		}

		.trend-detail {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 20rpx;
			margin-top: 20rpx;
			padding: 16rpx;
			background-color: #f5f7fa;
			border-radius: 12rpx;

			.detail-date {
				font-size: 26rpx;
				color: #666;
			}

			.detail-amount {
				font-size: 26rpx;
				font-weight: 600;
				color: #3b82f6;
			}
		}
	}

	// 当日明细
	.day-detail-list {
		.detail-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}

			.detail-left {
				display: flex;
				align-items: center;

				.detail-icon {
					width: 64rpx;
					height: 64rpx;
					background-color: #f0f2f5;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 16rpx;

					.iconfont {
						font-size: 32rpx;
						color: #666;
					}
				}

				.detail-info {
					.detail-category {
						display: block;
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}

					.detail-time {
						display: block;
						font-size: 24rpx;
						color: #999;
						margin-top: 4rpx;
					}
				}
			}

			.detail-amount {
				font-size: 30rpx;
				font-weight: 600;

				&.expense {
					color: #333;
				}

				&.income {
					color: #ef4444;
				}
			}
		}

		.empty-tip {
			text-align: center;
			padding: 40rpx;
			
			text {
				color: #999;
				font-size: 26rpx;
			}
		}
	}

	// 环形图
	.pie-chart-container {
		display: flex;
		justify-content: center;
		margin-bottom: 30rpx;

		.pie-chart {
			position: relative;
			width: 280rpx;
			height: 280rpx;

			.pie-ring {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}

			.pie-center {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 160rpx;
				height: 160rpx;
				background-color: #fff;
				border-radius: 50%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.pie-total-label {
					font-size: 22rpx;
					color: #999;
				}

				.pie-total-value {
					font-size: 28rpx;
					font-weight: 700;
					color: #333;
					margin-top: 4rpx;
				}
			}
		}
	}

	// 分类列表
	.category-list {
		.category-item {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			padding: 16rpx 0;
			border-bottom: 1rpx solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}

			.category-info {
				display: flex;
				align-items: center;
				width: 40%;

				.category-dot {
					width: 16rpx;
					height: 16rpx;
					border-radius: 50%;
					margin-right: 12rpx;
				}

				.category-name {
					font-size: 26rpx;
					color: #333;
				}
			}

			.category-data {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				width: 60%;
				gap: 16rpx;

				.category-amount {
					font-size: 26rpx;
					font-weight: 600;
					color: #333;
				}

				.category-percent {
					font-size: 24rpx;
					color: #999;
					width: 60rpx;
					text-align: right;
				}
			}

			.category-bar-bg {
				width: 100%;
				height: 8rpx;
				background-color: #f0f2f5;
				border-radius: 4rpx;
				margin-top: 12rpx;

				.category-bar {
					height: 100%;
					border-radius: 4rpx;
					transition: width 0.3s;
				}
			}
		}
	}

	// 底部占位
	.bottom-placeholder {
		height: 20rpx;
	}

	// 弹窗样式
	.picker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 10rpx;
		border-bottom: 1rpx solid #eee;

		.picker-cancel {
			font-size: 28rpx;
			color: #999;
			padding: 10rpx 20rpx;
		}

		.picker-title {
			font-size: 30rpx;
			font-weight: 600;
			color: #333;
		}

		.picker-confirm {
			font-size: 28rpx;
			color: #3b82f6;
			font-weight: 600;
			padding: 10rpx 20rpx;
		}
	}

	.custom-range-picker {
		padding: 20rpx;

		.range-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f5f5f5;

			.range-label {
				font-size: 28rpx;
				color: #333;
			}

			.range-value {
				padding: 12rpx 24rpx;
				background-color: #f5f7fa;
				border-radius: 8rpx;

				text {
					font-size: 28rpx;
					color: #3b82f6;
				}
			}
		}
	}
}
</style>
