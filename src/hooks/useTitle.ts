import {ref, watch} from "vue";

/**
 * 设置标题的hook
 * @param title 导航栏标题
 * @returns titleRef
 */
export default function (title = "") {
  const updatedTitle = ref(title);
  watch(
    updatedTitle,
    (preset, _) => {
      document.title = updatedTitle.value;
    },
    {
      immediate: true,
    }
  );
  return updatedTitle;
}
