import { Ref } from "vue";
import { DialogConfig, Model, OperationType, LogData } from "./data-dialog";
import { OperationNamed, SearchParams } from "./list-page";
import useEventBus from "@/hooks/useEventBus";
import router from "@/router";

/**
 * Page处理器参数（D: Dialog模型类型，R: 表记录行的类型）
 */
export interface PageHandlerParams<D extends Model, R> {
  /**
   * 初始化
   */
  init?: () => void;
  /**
   * 页搜索
   * @param searchParams 搜索参数
   * @param tableData 表数据引用
   */
  onSearch(searchParams: SearchParams & R, tableData: Ref<Model[]>): void;
  /**
   * 执行操作
   * @param name 当前操作名
   * @param dialogConfig dialog配置对象
   * @param selectedRow 记录行数据
   */
  onOperation?(
    name: OperationNamed,
    dialogConfig: Ref<DialogConfig<D>>,
    selectedRow?: R & {canceled: boolean}
  ): Promise<void | boolean>;
}

export const usePageProxyHandler = function <D extends Model, R>(
  params: PageHandlerParams<D, R>
) {
  let tableDataRef: Ref<Model[]>;
  let reqParams: SearchParams;
  let currentSelectedRow: R;
  const eventBus = useEventBus();

  params.init && params.init();
  return {
    getCurrentSelectedRow() {
      return currentSelectedRow;
    },
    refresh() {
      this.onSearch(reqParams, tableDataRef);
    },
    onSelectRow(selectedRow: Model) {
      currentSelectedRow = selectedRow as R;
    },
    onSearch(searchParams: SearchParams, tableData: Ref<Model[]>) {
      reqParams = searchParams;
      tableDataRef = tableData;
      params.onSearch(searchParams as SearchParams & R, tableData);
    },
    onOperation(
      name: OperationNamed,
      dialogConfig: Ref<DialogConfig<D>>,
      selectedRow?: R & {canceled: boolean, id:number}
    ) {
      if (params.onOperation) {
        params.onOperation(name, dialogConfig, selectedRow).then(res => {
          if(res && name == "remove") {
            // 记录del操作日志
            const logData = <LogData>{
              recordId: selectedRow?.id,
              pageName: router.currentRoute.value.meta.title,
              type: OperationType.DELETE,
              beforeValue: JSON.stringify(selectedRow),
              afterValue: "",
            };
            eventBus.emit("operationLog", logData);
          }
        });
      }
    },
  };
};
