<template>
	<custom-layout>
		<view class="content-home">
			<!-- 本月开支展示 -->
			<view class="card-view">
				<view class="card-view-content">
					<view class="pullBtn">
						<wd-button type="icon" icon="refresh1" custom-class="pullClass"></wd-button>
					</view>
					<view class="balanceInfo">
						<text class="balance">本月结余</text>
						<text class="balanceNum">￥3,456.40</text>
					</view>
					<view class="balanceDetail">
						<view class="income">
							<text>本月收入</text>
							<text>￥8,810.80</text>
						</view>
						<view class="pay">
							<text>本月支出</text>
							<text>￥9,371.10</text>
						</view>
						<view class="budget">
							<text>预算剩余</text>
							<text>￥7,900.00</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 最近交易展示 -->
			<view class="tran-view">
				<view class="title-btn">
					<text class="title-txt">最近交易</text>
					<wd-button type="text">查看全部</wd-button>
				</view>
				<view class="tran-list" :style="{ height: scrollHeight + 'px' }">
					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-canting'"></icon>
							<view class="info-text">
								<text class="label">午餐</text>
								<text class="date">今天 12:30</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥450.00</view>
					</view>

					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-gongzi'"></icon>
							<view class="info-text">
								<text class="label">工资收入</text>
								<text class="date">昨天 19:55</text>
							</view>
						</view>
						<view class="num" :class="'income'">+¥54,450.00</view>
					</view>

					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-gouwu'"></icon>
							<view class="info-text">
								<text class="label">超市购物</text>
								<text class="date">今天 07:13</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥30.00</view>
					</view>
					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-fangzu'"></icon>
							<view class="info-text">
								<text class="label">房租</text>
								<text class="date">昨天 09:14</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥2,450.00</view>
					</view>
					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-gongjiao'"></icon>
							<view class="info-text">
								<text class="label">地铁</text>
								<text class="date">今天 10:56</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥5.00</view>
					</view>
					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-gongjiao'"></icon>
							<view class="info-text">
								<text class="label">地铁</text>
								<text class="date">今天 10:56</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥5.00</view>
					</view>
					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-qita'"></icon>
							<view class="info-text">
								<text class="label">其它收支</text>
								<text class="date">昨天 20:05</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥200.00</view>
					</view>

					<view class="tran-item">
						<view class="info">
							<icon class="iconfont" :class="'icon-qita'"></icon>
							<view class="info-text">
								<text class="label">其它收支</text>
								<text class="date">昨天 20:05</text>
							</view>
						</view>
						<view class="num" :class="'expense'">-¥200.00</view>
					</view>
				</view>
			</view>
		</view>
	</custom-layout>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import type { IHomeState } from './type';
import { reactive, ref, onMounted } from 'vue';
import { getDomHeight } from '@/utils/common';

let scrollHeight = ref(300);

onMounted(async () => {
	setListHeight();
});

// 动态设置列表最大高度，自适应滚动条
const setListHeight = async () => {
	const cardHeight = await getDomHeight('.card-view');
	const systemInfo = uni.getSystemInfoSync(); // 获取设备信息
	const windowHeight = systemInfo.windowHeight; // 可视区域总高度 - 不包括顶部状态栏
	const tabbarHeight = 50 + (systemInfo.safeAreaInsets?.bottom || 0); // 默认50，兼容部分机型底部小黑条导航 +34
	// 设置容器高度, 10为误差
	scrollHeight.value = windowHeight - cardHeight  - 36 - tabbarHeight - 10;
};
</script>

<style lang="scss">
.content-home {
	.card-view {
		padding: 16rpx;
		&-content {
			background-color: #4389f6;
			border-radius: 22rpx;
			color: #fff;
			padding: 30rpx;
			position: relative;
			.pullBtn {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				:deep() {
					.pullClass {
						width: 100%;
						height: 100%;
						.wd-button__content {
							color: #fff;
							.wd-icon {
								width: 50rpx;
								height: 50rpx;
								line-height: 48rpx;
								border-radius: 50%;
								background-color: rgba(255, 255, 255, 0.2);
							}
						}
					}
				}
			}
			.balanceInfo {
				text {
					display: block;
					line-height: 1;
				}
				.balance {
					font-size: 26rpx;
				}
				.balanceNum {
					margin-top: 16rpx;
					font-weight: 700;
					font-size: 48rpx;
				}
			}
			.balanceDetail {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 50rpx;
				text {
					display: block;
					line-height: 1.5;
					font-size: 26rpx;
				}
				view {
					text:nth-child(2) {
						font-weight: 700;
					}
				}
			}
		}
	}
	.button-view {
		display: flex;
		align-items: center;
		justify-content: space-around;
		text-align: center;
		padding: 20rpx;
		.btn {
			padding: 10rpx 20rpx;
			font-size: 24rpx;
			line-height: 2;
		}
		.mtbtn-class {
			border-radius: 50%;
		}
		.mtbtn-class::after {
			border: 1px solid #fff;
		}
		.add {
			background-color: #10b9811a;
			color: #10b981;
		}
		.decrease {
			background-color: #ef44441a;
			color: #ef4444;
		}
		.swap {
			background-color: #3b82f61a;
			color: #3b82f6;
		}
		.more {
			background-color: #f3e8ff;
			color: #a855f7;
			transform: rotate(90deg);
		}
		.mtbtn-hover-class {
			background-color: #eee;
		}
	}
	.tran-view {
		padding: 0 20rpx;
		.title-btn {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title-txt {
				font-weight: 600;
			}
		}
		.tran-list {
			overflow-y: auto;
			.tran-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #eeefff;
				padding: 36rpx 30rpx 16rpx;
				.info {
					display: flex;
					align-items: center;
					.iconfont {
						display: inline-block;
						font-size: 36rpx;
						height: 68rpx;
						line-height: 68rpx;
						padding: 0 16rpx;
						background: #51515120;
						border-radius: 50%;
					}
					.icon-canting {
						background-color: #ef444420;
					}
					.icon-gongzi {
						background-color: #10b98120;
					}
					.icon-gouwu {
						background-color: #3b82f620;
					}
					.icon-fangzu {
						background-color: #eab30820;
					}
					.icon-gongjiao {
						background-color: #706fd320;
					}

					&-text {
						margin-left: 20rpx;
						text {
							display: block;
							line-height: 1.5;
						}
						.label {
							font-weight: 500;
							color: #26303d;
							font-size: 28rpx;
						}
						.date {
							font-size: 24rpx;
							color: #999;
						}
					}
				}
				.num {
					font-weight: 600;
					font-size: 32rpx;
					color: #333;
				}
				.num.expense {
					color: #333;
				}
				.num.income {
					color: #ef4444;
				}
			}
			.tran-item:nth-child(1) {
				padding-top: 16rpx;
			}
		}
	}
}
</style>
