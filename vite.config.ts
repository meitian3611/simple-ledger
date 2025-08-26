import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [uni()],
	css: {
		preprocessorOptions: {
			scss: {
				// 可以在这里配置全局的 SCSS 变量、混入等，例如：
				// additionalData: `@import "@/styles/variables.scss";`
			}
		}
	}
});
