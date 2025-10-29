import { Character } from '../../models/character'

Component({
  properties: {
    character: {
      type: Object,
      value: null,
      observer: function(newVal: Character) {
        if (newVal) {
          this.setData({
            displayInfo: this.formatDisplayInfo(newVal)
          })
        }
      }
    }
  },

  data: {
    displayInfo: ''
  },

  methods: {
    formatDisplayInfo(character: Character): string {
      let info = character.name
      if (character.level) {
        info += ' (Lvl ' + character.level
      } else {
        info += ' (Lvl ??'
      }

      if (character.class) {
        info += ' ' + character.class
      }

      if (character.magicFind && character.magicFind > 0) {
        info += ' MF=' + character.magicFind
      }

      info += ')'
      return info
    },

    onEditTap() {
      this.triggerEvent('edit', { character: this.data.character })
    },

    onConfigTap() {
      this.triggerEvent('config', { character: this.data.character })
    },

    onDeleteTap() {
      this.triggerEvent('delete', { character: this.data.character })
    },

    onStartSessionTap() {
      this.triggerEvent('startsession', { character: this.data.character })
    }
  }
})