interface Menu {
  id: number;
  parentId: number | null;
  // 0为目录，1为菜单，2为按钮
  type: 0 | 1 | 2;
  // 排序
  order: number;
  // 后台记录没有这个字段的情况
  children?: Menu[];
}

// 处理乱序的后台一维菜单列表
export default function buildTree(
  menuList: Menu[],
  parentId: number | null
): Menu[] {
  const orderMenuList: Menu[] = [];
  for (const menu of menuList) {
    if (
      menu.parentId == null
        ? parentId == null
        : menu.parentId === parentId && menu.type != 2
    ) {
      const menuItem = { ...menu };
      menuItem.children = buildTree(menuList, menu.id);
      orderMenuList.push(menuItem);
    }
  }
  // 根据order字段排序
  return orderMenuList.sort((item1, item2) => item1.order - item2.order);
}
