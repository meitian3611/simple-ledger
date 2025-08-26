<template>
	<style scoped lang="scss"></style>
	<view class="layout-container">
		<view class="page-content">
			<slot />
		</view>
	</view>
	<TabBar v-if="tabbarShow"></TabBar>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';
interface Props {
	tabbarShow: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	tabbarShow: true
});
</script>

<style lang="scss">
.layout-container {
	/* 确保布局容器占满整个屏幕 */
	background-color: #fff;
	width: 100%;
	max-height: calc(100vh - 100rpx);
	overflow-y: auto;
	position: relative;
}

.page-content {
	box-sizing: border-box;
	width: 100%;
	/* 底部留出空间，避免内容被 Tabbar 遮挡 */
	// padding-bottom: 100rpx; /* 等于 Tabbar 高度 */
	// padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
	// padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
</style>
