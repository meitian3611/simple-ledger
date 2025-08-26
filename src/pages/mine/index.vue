<template>
	<custom-layout>
		<view class="content">个人中心</view>
	</custom-layout>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';

onShow(() => {
	console.log('这是个人中心');
});
</script>

<style lang="scss"></style>
