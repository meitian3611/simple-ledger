<template>
	<custom-layout>
    <view class="content-record">
            <view class="chat-list" :style="{ height: chatListHeight + 'px' }">
                <view
                    v-for="(msg, idx) in messages"
                    :key="idx"
                    class="chat-item"
                    :class="msg.side"
                >
                    <view v-if="msg.side === 'left'" class="avatar"></view>
                    <view class="msg-wrap" :class="msg.side">
                        <view class="bubble" :class="msg.type === 'user' ? 'user' : ''">
                            <text v-if="msg.type === 'user'">{{ msg.text }}</text>
                            <view v-else class="record-card">
                                <text class="card-title">已为你记录：</text>
                                <view class="card-row"><text>类型：{{ msg.record?.kind }}</text></view>
                                <view class="card-row"><text>金额：¥{{ formatAmount(msg.record?.amount) }}</text></view>
                                <view class="card-row"><text>分类：{{ msg.record?.category }}</text></view>
                                <view class="card-row"><text>时间：{{ msg.record?.time }}</text></view>
                            </view>
                        </view>
                </view>
                </view>
            </view>

            <view class="chat-input">
                <input class="input" v-model="inputText" placeholder="请输入收支情况..." @confirm="send" />
                <button class="send-btn" @click="send"><text class="send-icon">✈</text></button>
            </view>
        </view>
	</custom-layout>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref, onMounted } from 'vue';
import { getDomHeight, formatRelativeTime } from '@/utils/common';

type Side = 'left' | 'right';
type MsgType = 'robot' | 'user';
interface RecordItem {
    kind: string;
    amount: number;
    category: string;
    time: string;
}
interface Message {
    side: Side;
    type: MsgType;
    text?: string;
    record?: RecordItem;
    time?: string;
}

const chatListHeight = ref(300);

const messages = ref<Message[]>([
    {
        side: 'right',
        type: 'user',
        text: '下午坐地铁花了10元',
    },
    {
        side: 'left',
        type: 'robot',
        record: {
            kind: '支出',
            amount: 10,
            category: '交通',
            time: (() => {
                const y = new Date(Date.now() - 86400000);
                y.setHours(18, 15, 0, 0);
                return formatRelativeTime(y.getTime());
            })()
        }
    },    {
        side: 'right',
        type: 'user',
        text: '晚上吃饭50元',
    },
    {
        side: 'left',
        type: 'robot',
        record: {
            kind: '支出',
            amount: 50,
            category: '餐饮',
            time: formatRelativeTime(Date.now())
        }
    }
]);

const inputText = ref('');
const send = () => {
    const text = inputText.value.trim();
    if (!text) return;
    const nowTs = Date.now();
    messages.value.push({ side: 'right', type: 'user', text, time: formatRelativeTime(nowTs) });
    inputText.value = '';
    const lower = text.toLowerCase();
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    const category = /(打车|地铁|公交)/.test(text) ? '交通' : /(饭|餐|早餐|午餐|晚餐)/.test(text) ? '餐饮' : '其它收支';
    messages.value.push({
        side: 'left',
        type: 'robot',
        record: {
            kind: '支出',
            amount,
            category,
            time: formatRelativeTime(nowTs)
        }
    });
};

const formatAmount = (n?: number) => (n ?? 0).toFixed(2);

onMounted(async () => {
    setListHeight();
});

const setListHeight = async () => {
    const inputHeight = await getDomHeight('.chat-input');
    const sys = uni.getSystemInfoSync();
    const windowHeight = sys.windowHeight;
    const tabbarPx = uni.upx2px(100) + (sys.safeAreaInsets?.bottom || 0);
    const pagePaddingPx = uni.upx2px(20 * 2);
    chatListHeight.value = windowHeight - tabbarPx - inputHeight - pagePaddingPx;
};

onShow(() => {
    console.log('记账页面');
});
</script>

<style lang="scss">
.content-record {
	padding: 20rpx;

	.chat-header {
		padding: 20rpx 0 10rpx;
		display: flex;
		justify-content: flex-start;
		.chat-title {
			background-color: #3b82f6;
			color: #fff;
			padding: 12rpx 22rpx;
			border-radius: 26rpx;
			font-weight: 600;
		}
	}

	.chat-list {
		overflow-y: auto;
		padding: 10rpx 6rpx 90rpx;
	}

	.chat-item {
		display: flex;
		margin: 26rpx 16rpx;
		align-items: flex-start;
		.avatar {
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			background-color: #d1d5db;
			margin-right: 16rpx;
		}
		.msg-wrap {
			display: flex;
			flex-direction: column;
			max-width: 70%;
		}
		.msg-wrap.right {
			margin-left: auto;
			align-items: flex-end;
		}
		.msg-wrap.left {
			align-items: flex-start;
		}
		.bubble {
			max-width: 100%;
			.record-card {
				background: #f5f7fb;
				border-radius: 20rpx;
				padding: 22rpx;
				color: #26303d;
				.card-title {
					font-weight: 600;
					margin-bottom: 12rpx;
				}
				.card-row text {
					display: block;
					line-height: 1.6;
					font-size: 26rpx;
				}
			}
		}
	}

	.chat-item.right {
		justify-content: flex-end;
		.bubble.user {
			background-color: #3b82f6;
			color: #fff;
			padding: 16rpx 22rpx;
			border-radius: 20rpx 20rpx 6rpx 20rpx;
			max-width: 100%;
		}
	}

.bubble-time {
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #9ca3af;
	display: block;
}
.chat-item.right .bubble-time { text-align: right; }

	.chat-input {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(100rpx + env(safe-area-inset-bottom));
		z-index: 10;
		display: flex;
		align-items: center;
		padding: 12rpx 20rpx;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(6px);
		.input {
			flex: 1;
			height: 72rpx;
			border: 2rpx solid #eee;
			border-radius: 999rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			background-color: #fff;
		}
		.send-btn {
			margin-left: 16rpx;
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			background-color: #3b82f6;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.send-icon {
			font-size: 32rpx;
		}
	}
}
</style>
