// app.ts
interface IAppOption {
  globalData: Record<string, any>
}

App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 小程序启动时执行
  },
})