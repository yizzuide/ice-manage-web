
// 定义可取消的行类型
type CancelableRow<T> = T & { canceled: boolean, id?: number };

// 接口模型类型
type Model = Record<string, any>;
type TypeModel<T> = T & Model;
