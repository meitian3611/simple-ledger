export const getContentHeight = (container: string): Promise<number> => {
	return new Promise((resolve, reject) => {
		const query = uni.createSelectorQuery(); // 创建一个选择器查询
		query
			.select(container)
			.boundingClientRect((data: any) => {
				if (data?.height) {
					resolve(data.height); // 返回获取到的容器高度
				} else {
					reject('获取容器高度失败'); // 如果没有高度数据则返回错误
				}
			})
			.exec();
	});
};

/*
 获取指定容器的页面高度
*/
export const getDomHeight = async (dom: string) => {
	const height = await getContentHeight(dom);
	return height;
};
