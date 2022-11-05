import { createProxy, createProxyList, ObjectProxy } from "./interfaceProxy";

/**
 * 树节点结构
 */
export interface Node {
  getId(): number;
  getParentId(): number;
  getOrder(): number;
  setChildren(parentNode: Node, nodes: Node[]): void;
}

// 定义代理类型
type NodeProxy<T> = ObjectProxy<T> & Node;

/**
 * 通用自动代理Node接口的树节点构建
 * @param nodeList  节点列表
 * @param methods Node接口方法实现
 * @param parentId 父节点ID
 * @returns
 */
export function buildProxyNodeTree<T extends Node>(
  nodeList: T[],
  methods: (target: T) => Node,
  parentId?: number
) {
  return buildTree(createProxyList(nodeList, methods), parentId);
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
  if (parentId === null) {
    throw new Error("parent id must be not null");
  }
  // 如果没有这个参数
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
    const nodeProxyList: NodeProxy<T>[] = [];
    for (const node of nodeList) {
      if (node.getParentId() === null || node.getParentId() == parentId) {
        node.setChildren(node.target, buildTree(nodeList, node.getId()));
        nodeProxyList.push(node);
      }
    }
    return nodeProxyList
      .sort((n1, n2) => n1.getOrder() - n2.getOrder())
      .map((n) => n.target);
  }
}
