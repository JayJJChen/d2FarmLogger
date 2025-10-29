export enum CharacterClass {
  Sorceress = '法师',
  Paladin = '圣骑士',
  Necromancer = '死灵法师',
  Amazon = '亚马逊',
  Barbarian = '野蛮人',
  Druid = '德鲁伊',
  Assassin = '刺客'
}

export interface Character {
  id: string
  name: string
  class: CharacterClass
  level?: number
  magicFind?: number
  defaultSceneIds?: string[]
  createTime: number
  updateTime: number
}