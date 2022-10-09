import {ref} from "vue";

/**
 * 鼠标移动位置
 * @returns {moveX, moveY}
 */
export default function () {
  const moveX = ref(0);
  const moveY = ref(0);
  window.addEventListener("mousemove", (event) => {
    moveX.value = event.pageX;
    moveY.value = event.pageY;
  });
  return {
    moveX,
    moveY,
  };
}
