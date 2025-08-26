import { defineStore } from 'pinia';

export const useTabbarStore = defineStore('tabbarStore', {
	state: () => ({
		tabbarValue: 'home'
	}),

	actions: {
		changeTabbar(value: string) {
			this.tabbarValue = value;
		}
	}
});
