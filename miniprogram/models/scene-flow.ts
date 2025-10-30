export interface SceneFlow {
  id: string
  name: string
  description?: string
  sceneIds: string[]
  createTime: number
  updateTime: number
}

export interface SceneFlowItem {
  id: string
  name: string
  sceneCount: number
  isBuiltIn: boolean
  createTime: number
  updateTime: number
}