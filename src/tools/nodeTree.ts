/**
 * 树节点结构
 */
export interface Node {
  getId(): number;
  getParentId(): number;
  getOrder(): number;
  setChildren(parentNode: Node, nodes: Node[]): void;
}

/**
 * Node接口代理
 */
interface NodeProxy<T> extends Node {
  target: T;
}

/**
 * 通用自动代理Node接口的树节点构建
 * @param nodeList  节点列表
 * @param proxyMethods Node接口方法实现
 * @param parentId 父节点ID
 * @returns
 */
export function buildProxyNodeTree<T extends Node>(
  nodeList: T[],
  proxyMethods: (target: T) => Node,
  parentId?: number
) {
  const nodeProxyList = nodeList.map((n) => proxyImplNode(n, proxyMethods(n)));
  return buildTree(nodeProxyList, parentId);
}

/**
 * Node接口代理实现（TS的类型编译为JS后会移除，这里需要添加真实方法实现）
 * @param target    目标
 * @param methods   代理方法
 * @returns Node接口代理对象
 */
function proxyImplNode<T extends Node>(target: T, methods: Node): NodeProxy<T> {
  return {
    target,
    ...methods,
  };
}

/**
 * 树节点构建
 * @param nodeList 代理节点列表
 * @param parentId 父节点ID
 * @returns 树节点列表
 */
function buildTree<T extends Node>(
  nodeList: NodeProxy<T>[],
  parentId?: number
): T[] {
  if (parentId === undefined) {
    const treeList: T[] = [];
    // find root nodes
    const rootNodes = nodeList.filter((rn) => {
      for (const n of nodeList) {
        if (rn.getParentId() == n.getId()) {
          return false;
        }
      }
      return true;
    });
    // add parentId to set list
    const parentIds = rootNodes.map((n) => n.getParentId());
    // parent id list -> node tree
    [...new Set(parentIds)]
      .map((pid) => buildTree(nodeList, pid))
      .forEach((nodes) => treeList.push(...nodes));
    return treeList;
  } else {
    const orderNodeList: NodeProxy<T>[] = [];
    for (const node of nodeList) {
      if (node.getParentId() === null || node.getParentId() == parentId) {
        node.setChildren(node.target, buildTree(nodeList, node.getId()));
        orderNodeList.push(node);
      }
    }
    return orderNodeList
      .sort((n1, n2) => n1.getOrder() - n2.getOrder())
      .map((n) => n.target);
  }
}
