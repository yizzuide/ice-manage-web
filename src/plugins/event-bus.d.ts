export declare type CallBack = (...args) => void

export declare interface EventBus {
  on: (key: string, callback: CallBack) => void

  emit(key: string, ...args: any[]): void
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $eventBus: EventBus
  }
}
