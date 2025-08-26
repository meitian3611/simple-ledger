<template>
	<custom-layout>
		<view class="content">记账页面</view>
	</custom-layout>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';

onShow(() => {
	console.log('记账页面');
});
</script>

<style lang="scss"></style>
