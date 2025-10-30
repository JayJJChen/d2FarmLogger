"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var character_1 = require("../../models/character");
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
            observer: function (newVal) {
                if (newVal && this.data.editMode) {
                    var classIndex = this.data.classOptions.findIndex(function (option) { return option.value === newVal.class; });
                    this.setData({
                        formData: {
                            name: newVal.name || '',
                            class: newVal.class || character_1.CharacterClass.Sorceress,
                            level: (newVal.level && newVal.level.toString()) || '',
                            magicFind: (newVal.magicFind && newVal.magicFind.toString()) || ''
                        },
                        selectedClassIndex: classIndex >= 0 ? classIndex : 0
                    });
                }
            }
        }
    },
    data: {
        formData: {
            name: '',
            class: character_1.CharacterClass.Sorceress,
            level: '',
            magicFind: ''
        },
        classOptions: [
            { value: character_1.CharacterClass.Sorceress, label: '法师' },
            { value: character_1.CharacterClass.Paladin, label: '圣骑士' },
            { value: character_1.CharacterClass.Necromancer, label: '死灵法师' },
            { value: character_1.CharacterClass.Amazon, label: '亚马逊' },
            { value: character_1.CharacterClass.Barbarian, label: '野蛮人' },
            { value: character_1.CharacterClass.Druid, label: '德鲁伊' },
            { value: character_1.CharacterClass.Assassin, label: '刺客' }
        ],
        selectedClassIndex: 0
    },
    methods: {
        onNameInput: function (e) {
            this.setData({
                'formData.name': e.detail.value
            });
        },
        onClassSelect: function (e) {
            var selectedIndex = e.detail.value;
            var selectedClass = this.data.classOptions[selectedIndex].value;
            this.setData({
                'formData.class': selectedClass,
                selectedClassIndex: selectedIndex
            });
        },
        onLevelInput: function (e) {
            this.setData({
                'formData.level': e.detail.value
            });
        },
        onMagicFindInput: function (e) {
            this.setData({
                'formData.magicFind': e.detail.value
            });
        },
        validateForm: function () {
            var formData = this.data.formData;
            // 验证名称
            if (!formData.name || !formData.name.trim()) {
                return { isValid: false, message: '请输入人物名称' };
            }
            if (!(0, character_1.validateCharacterName)(formData.name.trim())) {
                return { isValid: false, message: '人物名称只能是1-20个中英文字符' };
            }
            // 验证等级
            var levelValue = formData.level ? Number(formData.level) : undefined;
            if (!(0, character_1.validateLevel)(levelValue)) {
                return { isValid: false, message: '等级必须是1-99之间的整数' };
            }
            // 验证MF值
            var magicFindValue = formData.magicFind ? Number(formData.magicFind) : undefined;
            if (!(0, character_1.validateMagicFind)(magicFindValue)) {
                return { isValid: false, message: 'MF值必须是0-9999之间的整数' };
            }
            return { isValid: true };
        },
        onSubmit: function () {
            var validation = this.validateForm();
            if (!validation.isValid) {
                wx.showToast({
                    title: validation.message,
                    icon: 'none'
                });
                return;
            }
            var formData = this.data.formData;
            var characterData = {
                name: formData.name.trim(),
                class: formData.class
            };
            // 添加可选字段
            if (formData.level) {
                characterData.level = Number(formData.level);
            }
            if (formData.magicFind) {
                characterData.magicFind = Number(formData.magicFind);
            }
            if (this.data.editMode && this.data.character) {
                // 编辑模式：保留原有ID和时间信息
                var updatedCharacter = (0, character_1.extendObject)({}, this.data.character);
                updatedCharacter = (0, character_1.extendObject)(updatedCharacter, characterData);
                updatedCharacter.updateTime = Date.now();
                this.triggerEvent('submit', {
                    type: 'edit',
                    character: updatedCharacter
                });
            }
            else {
                // 创建模式：生成新角色
                var newCharacter = (0, character_1.extendObject)({}, characterData);
                // ID会在页面中生成，这里不设置
                newCharacter.createTime = Date.now();
                newCharacter.updateTime = Date.now();
                this.triggerEvent('submit', {
                    type: 'create',
                    character: newCharacter
                });
            }
        },
        onOverlayTap: function () {
            this.triggerEvent('cancel');
        },
        onContentTap: function () {
            // 阻止事件冒泡，防止modal被意外关闭
        },
        onCancel: function () {
            this.triggerEvent('cancel');
        },
        resetForm: function () {
            this.setData({
                formData: {
                    name: '',
                    class: character_1.CharacterClass.Sorceress,
                    level: '',
                    magicFind: ''
                },
                selectedClassIndex: 0
            });
        }
    },
    lifetimes: {
        attached: function () {
            if (!this.data.editMode) {
                this.resetForm();
            }
        }
    }
});
