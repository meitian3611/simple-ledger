import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
export function createApp() {
	const app = createSSRApp(App);
	// 创建 pinia 实例
	const pinia = createPinia();
	app.use(pinia);
	return {
		app,
		pinia
	};
}
