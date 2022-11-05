/**
 * 对象代理类型
 */
export interface ObjectProxy<T> {
  target: T;
}

/**
 * 方法代理
 * @param target 目标对象
 * @param methods 代理方法
 * @returns 代理对象
 */
export function createProxy<T extends M, M>(target: T, methods: M) {
  return {
    target,
    ...methods,
  };
}

/**
 * 创建代理对象列表
 * @param list 目标对象list
 * @param methods 代理方法
 * @returns 代理对象list
 */
export function createProxyList<T extends M, M>(
  list: T[],
  methods: (target: T) => M
) {
  return list.map((item) => createProxy<T, M>(item, methods(item)));
}

/**
 * 获代理对象代理的目标对象
 * @param objectProxy 代理对象
 * @returns 目标对象
 */
export function getProxyTarget<T>(objectProxy: ObjectProxy<T>) {
  return objectProxy.target;
}
