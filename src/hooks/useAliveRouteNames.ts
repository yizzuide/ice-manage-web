import { ref, watch, Ref } from "vue";
import { useRouter } from "vue-router";

/**
 * 根据当前Route配置的meta.keepAlive来返回Route name
 * @returns 需要keepAlive的Route name
 */
export default function () {
  const router = useRouter();
  // 添加有路由名，且keepAlive配置为true的缓存组件名
  const keepAliveList: Ref<string[]> = ref([]);
  const keepAliveSet = new Set<string>();
  watch(
    router.currentRoute,
    (route) => {
      const routeName = route.name as string;
      if (route.meta.keepAlive && routeName) {
        keepAliveSet.add(routeName);
      }
      keepAliveList.value = [...keepAliveSet];
    },
    {
      immediate: true,
      deep: true,
    }
  );
  return keepAliveList;
}
