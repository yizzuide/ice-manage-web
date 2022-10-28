import { isRef, reactive, watchEffect } from "vue";
import gsap from "gsap";

/**
 * 显示数字动画（bindObject的key必须与target的key要一致）
 * @param bindObject 模板里使用的绑定对象
 * @param target 目标值对象，可以是Ref
 */
export default function <T extends object>(bindObject: T, target: any) {
  return {
    start: function () {
      const proxyBindObject = reactive<T>(bindObject);
      watchEffect(
        () => {
          Object.keys(bindObject).forEach((key) => {
            if (isRef(target)) {
              target = target.value;
            }
            showDanceNumber(proxyBindObject, key, target[key]);
          });
        },
        {
          flush: "post",
        }
      );
    },
  };
}

function showDanceNumber(bindObject: any, field: string, targetValue: number) {
  gsap.to(bindObject, {
    duration: 1,
    [field]: targetValue ?? 0,
    onUpdate: () => {
      bindObject[field as keyof typeof bindObject] = parseInt(
        bindObject[field as keyof typeof bindObject].toFixed(0)
      );
    },
  });
}
