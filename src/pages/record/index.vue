<template>
	<custom-layout>
		<view class="content-record">
			<!-- 金额输入区域 -->
			<view class="amount-section">
				<view class="type-tabs">
					<view 
						class="type-tab" 
						:class="{ active: recordType === 'expense' }" 
						@click="recordType = 'expense'"
					>
						<text>支出</text>
					</view>
					<view 
						class="type-tab" 
						:class="{ active: recordType === 'income' }" 
						@click="recordType = 'income'"
					>
						<text>收入</text>
					</view>
				</view>
				<view class="amount-display">
					<text class="currency">¥</text>
					<input 
						class="amount-input" 
						type="digit" 
						v-model="amount" 
						placeholder="0.00"
						placeholder-class="amount-placeholder"
					/>
				</view>
			</view>

			<!-- 分类选择 -->
			<view class="form-section">
				<view class="section-title">选择分类</view>
				<view class="category-grid">
					<view 
						v-for="item in currentCategories" 
						:key="item.value"
						class="category-item"
						:class="{ active: category === item.value }"
						@click="category = item.value"
					>
						<view class="category-icon">
							<icon class="iconfont" :class="item.icon"></icon>
						</view>
						<text class="category-name">{{ item.label }}</text>
					</view>
				</view>
			</view>

			<!-- 日期选择 -->
			<view class="form-section">
				<view class="section-title">选择日期</view>
				<wd-cell 
					title="" 
					:value="formatDisplayDate(selectedDate)" 
					is-link 
					@click="openDatePicker"
					custom-class="date-cell"
				>
					<template #icon>
						<icon class="iconfont icon-rili date-icon"></icon>
					</template>
				</wd-cell>
			</view>

			<!-- 备注输入 -->
			<view class="form-section">
				<view class="section-title">备注</view>
				<view class="remark-input-wrap">
					<textarea 
						class="remark-input" 
						v-model="remark" 
						placeholder="添加备注信息（可选）"
						placeholder-class="remark-placeholder"
						:maxlength="100"
						auto-height
					/>
				</view>
			</view>

			<!-- 底部占位，防止内容被固定按钮遮挡 -->
			<view class="bottom-placeholder"></view>

			<!-- 日期选择器 -->
			<wd-datetime-picker-view
				v-if="datePickerVisible"
				v-model="tempDate"
				type="date"
			/>
			<wd-popup v-model="datePickerVisible" position="bottom" custom-style="padding: 20rpx;">
				<view class="picker-header">
					<text class="picker-cancel" @click="datePickerVisible = false">取消</text>
					<text class="picker-title">选择日期</text>
					<text class="picker-confirm" @click="confirmDate">确定</text>
				</view>
				<wd-datetime-picker-view v-model="tempDate" type="date" />
			</wd-popup>

			<!-- 提交成功提示 -->
			<wd-toast />

			<!-- 提交按钮 - 固定底部 -->
			<view class="submit-section" v-show="!datePickerVisible">
				<button class="submit-btn" :class="recordType" @click="handleSubmit">
					<text>{{ recordType === 'expense' ? '记一笔支出' : '记一笔收入' }}</text>
				</button>
			</view>
		</view>
	</custom-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useToast } from 'wot-design-uni';

const toast = useToast();

// 记账类型: expense-支出, income-收入
const recordType = ref<'expense' | 'income'>('expense');
const amount = ref('');
const category = ref('');
const remark = ref('');
const selectedDate = ref(Date.now());
const datePickerVisible = ref(false);
const tempDate = ref(Date.now());

// 支出分类
const expenseCategories = [
	{ label: '餐饮', value: 'food', icon: 'icon-canting' },
	{ label: '交通', value: 'transport', icon: 'icon-gongjiao' },
	{ label: '购物', value: 'shopping', icon: 'icon-gouwu' },
	{ label: '房租', value: 'rent', icon: 'icon-fangzu' },
	{ label: '娱乐', value: 'entertainment', icon: 'icon-yule' },
	{ label: '医疗', value: 'medical', icon: 'icon-yiliao' },
	{ label: '教育', value: 'education', icon: 'icon-jiaoyu' },
	{ label: '其它', value: 'other', icon: 'icon-qita' }
];

// 收入分类
const incomeCategories = [
	{ label: '工资', value: 'salary', icon: 'icon-gongzi' },
	{ label: '奖金', value: 'bonus', icon: 'icon-jiangjin' },
	{ label: '理财', value: 'investment', icon: 'icon-licai' },
	{ label: '兼职', value: 'parttime', icon: 'icon-jianzhi' },
	{ label: '红包', value: 'redpacket', icon: 'icon-hongbao' },
	{ label: '其它', value: 'other', icon: 'icon-qita' }
];

// 当前显示的分类
const currentCategories = computed(() => {
	return recordType.value === 'expense' ? expenseCategories : incomeCategories;
});

// 切换类型时清空分类选择
watch(recordType, () => {
	category.value = '';
});

// 格式化显示日期
const formatDisplayDate = (timestamp: number) => {
	const date = new Date(timestamp);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	
	const isToday = date.toDateString() === today.toDateString();
	const isYesterday = date.toDateString() === yesterday.toDateString();
	
	const month = date.getMonth() + 1;
	const day = date.getDate();
	
	if (isToday) {
		return `今天 ${month}月${day}日`;
	} else if (isYesterday) {
		return `昨天 ${month}月${day}日`;
	} else {
		return `${date.getFullYear()}年${month}月${day}日`;
	}
};

// 打开日期选择器
const openDatePicker = () => {
	tempDate.value = selectedDate.value;
	datePickerVisible.value = true;
};

// 确认日期选择
const confirmDate = () => {
	selectedDate.value = tempDate.value;
	datePickerVisible.value = false;
};

// 提交记账
const handleSubmit = () => {
	// 验证金额
	if (!amount.value || parseFloat(amount.value) <= 0) {
		toast.warning('请输入有效金额');
		return;
	}
	
	// 验证分类
	if (!category.value) {
		toast.warning('请选择分类');
		return;
	}
	
	const recordData = {
		type: recordType.value,
		amount: parseFloat(amount.value),
		category: category.value,
		categoryLabel: currentCategories.value.find(c => c.value === category.value)?.label || '',
		remark: remark.value,
		date: selectedDate.value,
		createTime: Date.now()
	};
	
	console.log('记账数据:', recordData);
	
	// TODO: 保存到本地存储或后端
	
	toast.success('记账成功！');
	
	// 重置表单
	setTimeout(() => {
		amount.value = '';
		category.value = '';
		remark.value = '';
		selectedDate.value = Date.now();
	}, 500);
};

onShow(() => {
	console.log('记账页面');
});
</script>

<style lang="scss">
.content-record {
	padding: 20rpx;
	padding-bottom: 0;
	background-color: #f5f7fa;
	box-sizing: border-box;
	overflow: hidden;

	// 金额输入区域
	.amount-section {
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		border-radius: 20rpx;
		padding: 32rpx 24rpx 40rpx;
		margin-bottom: 20rpx;

		.type-tabs {
			display: flex;
			background-color: rgba(255, 255, 255, 0.2);
			border-radius: 12rpx;
			padding: 4rpx;
			margin-bottom: 30rpx;

			.type-tab {
				flex: 1;
				text-align: center;
				padding: 16rpx 0;
				border-radius: 10rpx;
				color: rgba(255, 255, 255, 0.7);
				font-size: 28rpx;
				transition: all 0.3s;

				&.active {
					background-color: #fff;
					color: #3b82f6;
					font-weight: 600;
				}
			}
		}

		.amount-display {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0;
			min-height: 80rpx;

			.currency {
				color: #fff;
				font-size: 40rpx;
				font-weight: 600;
				margin-right: 8rpx;
				line-height: 1;
			}

			.amount-input {
				color: #fff;
				font-size: 56rpx;
				font-weight: 700;
				text-align: center;
				width: 360rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: transparent;
			}

			.amount-placeholder {
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}

	// 表单区域通用样式
	.form-section {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.section-title {
			font-size: 26rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 16rpx;
		}
	}

	// 分类选择 - 响应式布局
	.category-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16rpx;

		.category-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 16rpx 0;
			border-radius: 12rpx;
			transition: all 0.2s;

			&.active {
				background-color: #e8f2ff;

				.category-icon {
					background-color: #3b82f6;
					
					.iconfont {
						color: #fff;
					}
				}

				.category-name {
					color: #3b82f6;
					font-weight: 600;
				}
			}

			.category-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 12rpx;
				background-color: #f0f2f5;
				transition: all 0.2s;

				.iconfont {
					font-size: 38rpx;
					color: #666;
				}
			}

			.category-name {
				font-size: 24rpx;
				color: #666;
				text-align: center;
			}
		}
	}

	// 日期选择
	.date-cell {
		background-color: #f5f7fa;
		border-radius: 12rpx;
		padding: 0 16rpx;
	}

	.date-icon {
		font-size: 32rpx;
		color: #3b82f6;
		margin-right: 12rpx;
	}

	// 备注输入
	.remark-input-wrap {
		background-color: #f5f7fa;
		border-radius: 12rpx;
		padding: 16rpx;

		.remark-input {
			width: 100%;
			min-height: 100rpx;
			font-size: 26rpx;
			color: #333;
			line-height: 1.6;
		}

		.remark-placeholder {
			color: #999;
		}
	}

	// 底部占位
	.bottom-placeholder {
		height: calc(120rpx + env(safe-area-inset-bottom));
	}

	// 日期选择器弹窗
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
}

// 提交按钮 - 固定底部
.submit-section {
	position: fixed;
	left: 0;
	right: 0;
	bottom: calc(100rpx + env(safe-area-inset-bottom));
	z-index: 100;
	padding: 16rpx 20rpx;
	background: linear-gradient(to top, #f5f7fa 80%, transparent);

	.submit-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);

		text {
			color: #fff;
			font-size: 30rpx;
			font-weight: 600;
		}

		&.expense {
			background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		}

		&.income {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		}

		&::after {
			border: none;
		}
	}
}
</style>
