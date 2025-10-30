"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    properties: {
        character: {
            type: Object,
            value: null,
            observer: function (newVal) {
                if (newVal) {
                    this.setData({
                        displayInfo: this.formatDisplayInfo(newVal)
                    });
                }
            }
        }
    },
    data: {
        displayInfo: ''
    },
    methods: {
        formatDisplayInfo: function (character) {
            var info = character.name;
            if (character.level) {
                info += ' (Lvl ' + character.level;
            }
            else {
                info += ' (Lvl ??';
            }
            if (character.class) {
                info += ' ' + character.class;
            }
            if (character.magicFind && character.magicFind > 0) {
                info += ' MF=' + character.magicFind;
            }
            info += ')';
            return info;
        },
        onEditTap: function () {
            this.triggerEvent('edit', { character: this.data.character });
        },
        onConfigTap: function () {
            this.triggerEvent('config', { character: this.data.character });
        },
        onDeleteTap: function () {
            this.triggerEvent('delete', { character: this.data.character });
        },
        onStartSessionTap: function () {
            this.triggerEvent('startsession', { character: this.data.character });
        }
    }
});
