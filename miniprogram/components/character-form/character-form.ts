import { Character, CharacterClass } from '../../models/character'

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    editMode: {
      type: Boolean,
      value: false
    },
    character: {
      type: Object,
      value: null,
      observer: function(newVal: Character) {
        if (newVal && this.data.editMode) {
          const classIndex = this.data.classOptions.findIndex(option => option.value === newVal.class)
          this.setData({
            formData: {
              name: newVal.name || '',
              class: newVal.class || CharacterClass.Sorceress,
              level: (newVal.level && newVal.level.toString()) || '',
              magicFind: (newVal.magicFind && newVal.magicFind.toString()) || ''
            },
            selectedClassIndex: classIndex >= 0 ? classIndex : 0
          })
        }
      }
    }
  },

  data: {
    formData: {
      name: '',
      class: CharacterClass.Sorceress,
      level: '',
      magicFind: ''
    },
    classOptions: [
      { value: CharacterClass.Sorceress, label: '法师' },
      { value: CharacterClass.Paladin, label: '圣骑士' },
      { value: CharacterClass.Necromancer, label: '死灵法师' },
      { value: CharacterClass.Amazon, label: '亚马逊' },
      { value: CharacterClass.Barbarian, label: '野蛮人' },
      { value: CharacterClass.Druid, label: '德鲁伊' },
      { value: CharacterClass.Assassin, label: '刺客' }
    ],
    selectedClassIndex: 0
  },

  methods: {
    onNameInput(e: any) {
      this.setData({
        'formData.name': e.detail.value
      })
    },

    onClassSelect(e: any) {
      const selectedIndex = e.detail.value
      const selectedClass = this.data.classOptions[selectedIndex].value
      this.setData({
        'formData.class': selectedClass,
        selectedClassIndex: selectedIndex
      })
    },

    onLevelInput(e: any) {
      this.setData({
        'formData.level': e.detail.value
      })
    },

    onMagicFindInput(e: any) {
      this.setData({
        'formData.magicFind': e.detail.value
      })
    },

    validateForm(): { isValid: boolean; message?: string } {
      const { name, level, magicFind } = this.data.formData

      if (!name.trim()) {
        return { isValid: false, message: '请输入人物名称' }
      }

      if (name.trim().length > 20) {
        return { isValid: false, message: '人物名称不能超过20个字符' }
      }

      if (level && (isNaN(Number(level)) || Number(level) < 1 || Number(level) > 99)) {
        return { isValid: false, message: '等级必须是1-99之间的数字' }
      }

      if (magicFind && (isNaN(Number(magicFind)) || Number(magicFind) < 0)) {
        return { isValid: false, message: 'MF值必须是非负数' }
      }

      return { isValid: true }
    },

    onSubmit() {
      const validation = this.validateForm()
      if (!validation.isValid) {
        wx.showToast({
          title: validation.message,
          icon: 'none'
        })
        return
      }

      const formData = this.data.formData
      const characterData: any = {
        name: formData.name.trim(),
        class: formData.class
      }

      if (formData.level) {
        characterData.level = Number(formData.level)
      }

      if (formData.magicFind) {
        characterData.magicFind = Number(formData.magicFind)
      }

      if (this.data.editMode && this.data.character) {
        const updatedCharacter = this.extendObject(this.data.character, characterData)
        updatedCharacter.updateTime = Date.now()
        this.triggerEvent('submit', {
          type: 'edit',
          character: updatedCharacter
        })
      } else {
        const newCharacter = this.extendObject({}, characterData)
        newCharacter.id = Date.now().toString()
        newCharacter.createTime = Date.now()
        newCharacter.updateTime = Date.now()
        this.triggerEvent('submit', {
          type: 'create',
          character: newCharacter
        })
      }
    },

    onOverlayTap() {
      this.triggerEvent('cancel')
    },

    onContentTap() {
      // 阻止事件冒泡，防止modal被意外关闭
    },

    onCancel() {
      this.triggerEvent('cancel')
    },

    extendObject(target: any, source: any): any {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key]
        }
      }
      return target
    },

    resetForm() {
      this.setData({
        formData: {
          name: '',
          class: CharacterClass.Sorceress,
          level: '',
          magicFind: ''
        },
        selectedClassIndex: 0
      })
    }
  },

  lifetimes: {
    attached() {
      if (!this.data.editMode) {
        this.resetForm()
      }
    }
  }
})