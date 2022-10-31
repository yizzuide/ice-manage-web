/**
 * 树节点结构
 */
export interface Node {
  getId(): number;
  getParentId(): number;
  getOrder(): number;
  setChildren(parentNode: Node, nodes: Node[]): void;
}

// Node接口代理
interface NodeProxy<T> extends Node {
  target: T;
}

// 代理实现Node接口，TS的类型编译为JS后会移除，这里需要添加真实方法实现
export function proxyImplNode<T extends Node>(
  target: T,
  nodeConfig: Node
): NodeProxy<T> {
  return {
    target,
    ...nodeConfig,
  };
}

/**
 * 通用树节点构建
 * @param nodeList 节点列表
 * @param parentId 父节点ID
 * @returns 树节点列表
 */
export default function buildTree<T extends Node>(
  nodeList: T[],
  parentId?: number
): T[] {
  const orderNodeList: T[] = [];
  for (const node of nodeList) {
    if (node.getParentId() == null || node.getParentId() == parentId) {
      node.setChildren(
        (node as Node as NodeProxy<T>).target,
        buildTree(nodeList, node.getId())
      );
      orderNodeList.push(node);
    }
  }
  return orderNodeList.sort((n1, n2) => n1.getOrder() - n2.getOrder());
}
