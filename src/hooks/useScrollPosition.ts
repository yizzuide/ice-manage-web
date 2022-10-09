import {ref} from "vue";

/**
 * 内容滚动hook
 * @returns {scrollX, scrollY}
 */
export default function () {
  const scrollX = ref(0);
  const scrollY = ref(0);
  document.addEventListener("scroll", () => {
    scrollX.value = window.scrollX;
    scrollY.value = window.scrollY;
  });
  return {
    scrollX,
    scrollY,
  };
}
