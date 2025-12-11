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

const hm = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
export const formatRelativeTime = (ts: number) => {
  const now = new Date();
  const d = new Date(ts);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.floor((todayStart - dayStart) / 86400000);
  if (diffDays === 0) return `今天 ${hm(d)}`;
  if (diffDays === 1) return `昨天 ${hm(d)}`;
  if (diffDays === 2) return `前天 ${hm(d)}`;
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  return `${mm}-${dd} ${hm(d)}`;
};
