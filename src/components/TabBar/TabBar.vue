<template>
	<!-- 底部导航栏 -->
	<view class="tabbar-Btn">
		<wd-tabbar fixed placeholder safeAreaInsetBottom active-color="#3B82F6" inactive-color="#6B7280" custom-class="ledger-tabbar" v-model="tabbarValue" @change="tabbarChange">
			<wd-tabbar-item name="home" title="首页">
				<template #icon>
					<icon class="iconfont" :class="tabbarValue == 'home' ? 'icon-shouye-ht' : 'icon-shouye'"></icon>
				</template>
			</wd-tabbar-item>
			<wd-tabbar-item name="record" title="记账">
				<template #icon>
					<icon class="iconfont" :class="tabbarValue == 'record' ? 'icon-liaotian-ht' : 'icon-liaotian'"></icon>
				</template>
			</wd-tabbar-item>
			<wd-tabbar-item name="statistics" title="总览">
				<template #icon>
					<icon class="iconfont" :class="tabbarValue == 'statistics' ? 'icon-tongji-ht' : 'icon-tongji'"></icon>
				</template>
			</wd-tabbar-item>
		</wd-tabbar>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useTabbarStore } from '@/stores';

const store = useTabbarStore(); // 引入Pinia管理公共数据
const tabbarValue = computed(() => store.tabbarValue); // 缓存tabbar状态

const tabbarChange = ({ value }: any) => {
	uni.switchTab({
		url: `/pages/${value}/index`,
		complete: () => {
			store.changeTabbar(value);
		}
	});
};

onMounted(() => {});
</script>

<style lang="scss">
.tabbar-Btn {
	.iconfont {
		font-size: 36rpx;
		line-height: 1.5;
	}
}
</style>