import { Character, CharacterClass } from '../../models/character'

interface CharacterPageData {
  characters: Character[]
  showForm: boolean
  editMode: boolean
  editingCharacter: Character | null
}

Page({
  data: {
    characters: [],
    showForm: false,
    editMode: false,
    editingCharacter: null
  } as CharacterPageData,

  onLoad() {
    this.loadMockData()
  },

  onShow() {
    this.loadMockData()
  },

  loadMockData() {
    const mockCharacters: Character[] = [
      {
        id: '1',
        name: '冰法',
        class: CharacterClass.Sorceress,
        level: 90,
        magicFind: 302,
        defaultSceneIds: ['1', '2'],
        createTime: Date.now() - 86400000,
        updateTime: Date.now() - 86400000
      },
      {
        id: '2',
        name: '盾骑',
        class: CharacterClass.Paladin,
        level: 85,
        magicFind: 150,
        createTime: Date.now() - 172800000,
        updateTime: Date.now() - 172800000
      }
    ]

    this.setData({
      characters: mockCharacters
    })
  },

  onAddCharacter() {
    this.setData({
      showForm: true,
      editMode: false,
      editingCharacter: null
    })
  },

  onCharacterEdit(e: any) {
    const { character } = e.detail
    this.setData({
      showForm: true,
      editMode: true,
      editingCharacter: character
    })
  },

  onCharacterConfig(e: any) {
    const { character } = e.detail
    wx.showModal({
      title: '配置场景',
      content: character.name + ' 还没有配置默认场景列表，请先去配置页面设置场景流程。',
      showCancel: true,
      cancelText: '取消',
      confirmText: '去配置',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/configuration/configuration'
          })
        }
      }
    })
  },

  onCharacterStartSession(e: any) {
    const { character } = e.detail

    if (!character.defaultSceneIds || character.defaultSceneIds.length === 0) {
      wx.showModal({
        title: '提示',
        content: character.name + ' 还没有配置默认场景列表，请先配置后再开始Session。',
        showCancel: true,
        cancelText: '取消',
        confirmText: '去配置',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/configuration/configuration'
            })
          }
        }
      })
      return
    }

    wx.navigateTo({
      url: '/pages/sessions/session?characterId=' + character.id
    })
  },

  onCharacterDelete(e: any) {
    const { character } = e.detail

    wx.showModal({
      title: '确认删除',
      content: '确定要删除人物"' + character.name + '"吗？此操作不可恢复。',
      showCancel: true,
      cancelText: '取消',
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.deleteCharacter(character.id)
        }
      }
    })
  },

  deleteCharacter(characterId: string) {
    const characters = this.data.characters.filter(c => c.id !== characterId)
    this.setData({ characters })

    wx.showToast({
      title: '删除成功',
      icon: 'success'
    })
  },

  onFormSubmit(e: any) {
    const { type, character } = e.detail

    if (type === 'create') {
      this.createCharacter(character)
    } else if (type === 'edit') {
      this.updateCharacter(character)
    }

    this.setData({
      showForm: false,
      editMode: false,
      editingCharacter: null
    })
  },

  onFormCancel() {
    this.setData({
      showForm: false,
      editMode: false,
      editingCharacter: null
    })
  },

  createCharacter(character: Character) {
    const characters = this.data.characters.concat([character])
    this.setData({ characters })

    wx.showToast({
      title: '创建成功',
      icon: 'success'
    })
  },

  updateCharacter(character: Character) {
    const characters = this.data.characters.map(c =>
      c.id === character.id ? character : c
    )
    this.setData({ characters })

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  }
})