import { Scene } from '../../models/scene'
import * as SceneFlowUtils from '../../models/scene-flow'
import { SceneStorageService } from '../../services/sceneStorageService'

interface SelectedScene {
  id: string
  name: string
  index: number // 显示的顺序编号
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    preselectedSceneIds: {
      type: Array,
      value: [],
      observer: function(newVal: string[]) {
        if (newVal && Array.isArray(newVal)) {
          this.updateSelectedScenes(newVal)
        }
      }
    }
  },

  data: {
    availableScenes: [] as Scene[],
    selectedScenes: [] as SelectedScene[],
    searchKeyword: ''
  },

  methods: {
    // 初始化场景数据
    initializeScenes() {
      try {
        var allScenes = SceneStorageService.getAllScenes()
        this.setData({
          availableScenes: allScenes
        })
      } catch (error) {
        console.error('初始化场景数据失败:', error)
        wx.showToast({
          title: '加载场景失败',
          icon: 'none'
        })
      }
    },

    // 更新已选择的场景
    updateSelectedScenes(sceneIds: string[]) {
      try {
        var allScenes = this.data.availableScenes
        var selectedScenes: SelectedScene[] = []

        for (var i = 0; i < sceneIds.length; i++) {
          var sceneId = sceneIds[i]
          for (var j = 0; j < allScenes.length; j++) {
            if (allScenes[j].id === sceneId) {
              selectedScenes.push({
                id: allScenes[j].id,
                name: allScenes[j].name,
                index: i + 1
              })
              break
            }
          }
        }

        this.setData({
          selectedScenes: selectedScenes
        })
      } catch (error) {
        console.error('更新已选择场景失败:', error)
      }
    },

    // 搜索输入
    onSearchInput(e: any) {
      this.setData({
        searchKeyword: e.detail.value
      })
    },

    // 获取过滤后的可用场景列表
    getFilteredScenes(): Scene[] {
      var keyword = this.data.searchKeyword.toLowerCase().trim()
      var availableScenes = this.data.availableScenes
      var selectedSceneIds = this.data.selectedScenes.map(function(scene) { return scene.id })

      if (!keyword) {
        return availableScenes.filter(function(scene) {
          return selectedSceneIds.indexOf(scene.id) === -1
        })
      }

      return availableScenes.filter(function(scene) {
        return selectedSceneIds.indexOf(scene.id) === -1 &&
               scene.name.toLowerCase().indexOf(keyword) !== -1
      })
    },

    // 点击场景进行选择/取消选择
    onSceneTap(e: any) {
      var sceneId = e.currentTarget.dataset.sceneId
      var sceneName = e.currentTarget.dataset.sceneName

      // 检查是否已经选择了这个场景
      var selectedScenes = this.data.selectedScenes
      var existingIndex = -1

      for (var i = 0; i < selectedScenes.length; i++) {
        if (selectedScenes[i].id === sceneId) {
          existingIndex = i
          break
        }
      }

      if (existingIndex !== -1) {
        // 已选择，则取消选择
        selectedScenes.splice(existingIndex, 1)
        // 重新编号
        for (var i = 0; i < selectedScenes.length; i++) {
          selectedScenes[i].index = i + 1
        }
      } else {
        // 未选择，则添加到末尾
        if (selectedScenes.length >= 20) {
          wx.showToast({
            title: '最多选择20个场景',
            icon: 'none'
          })
          return
        }
        selectedScenes.push({
          id: sceneId,
          name: sceneName,
          index: selectedScenes.length + 1
        })
      }

      this.setData({
        selectedScenes: selectedScenes
      })
    },

    // 上移场景
    onMoveUp(e: any) {
      var index = e.currentTarget.dataset.index
      var selectedScenes = this.data.selectedScenes

      if (index > 0) {
        var temp = selectedScenes[index]
        selectedScenes[index] = selectedScenes[index - 1]
        selectedScenes[index - 1] = temp

        // 重新编号
        for (var i = 0; i < selectedScenes.length; i++) {
          selectedScenes[i].index = i + 1
        }

        this.setData({
          selectedScenes: selectedScenes
        })
      }
    },

    // 下移场景
    onMoveDown(e: any) {
      var index = e.currentTarget.dataset.index
      var selectedScenes = this.data.selectedScenes

      if (index < selectedScenes.length - 1) {
        var temp = selectedScenes[index]
        selectedScenes[index] = selectedScenes[index + 1]
        selectedScenes[index + 1] = temp

        // 重新编号
        for (var i = 0; i < selectedScenes.length; i++) {
          selectedScenes[i].index = i + 1
        }

        this.setData({
          selectedScenes: selectedScenes
        })
      }
    },

    // 检查场景是否已被选择
    isSceneSelected(sceneId: string): boolean {
      var selectedScenes = this.data.selectedScenes
      for (var i = 0; i < selectedScenes.length; i++) {
        if (selectedScenes[i].id === sceneId) {
          return true
        }
      }
      return false
    },

    // 生成预览文本
    generatePreviewText(): string {
      var selectedScenes = this.data.selectedScenes
      if (selectedScenes.length === 0) {
        return '暂未选择场景'
      }

      var sceneNames = selectedScenes.map(function(scene) { return scene.name })
      return SceneFlowUtils.generateScenePreview(sceneNames)
    },

    // 确认选择
    onConfirm() {
      var selectedScenes = this.data.selectedScenes
      if (selectedScenes.length === 0) {
        wx.showToast({
          title: '请至少选择一个场景',
          icon: 'none'
        })
        return
      }

      var selectedSceneIds = selectedScenes.map(function(scene) { return scene.id })
      this.triggerEvent('confirm', {
        sceneIds: selectedSceneIds,
        sceneNames: selectedScenes.map(function(scene) { return scene.name })
      })
    },

    // 取消选择
    onCancel() {
      this.triggerEvent('cancel')
    },

    // 清空选择
    onClear() {
      this.setData({
        selectedScenes: []
      })
    },

    // 重置组件状态
    reset() {
      this.setData({
        selectedScenes: [],
        searchKeyword: ''
      })
    }
  },

  lifetimes: {
    attached() {
      this.initializeScenes()
    }
  }
})