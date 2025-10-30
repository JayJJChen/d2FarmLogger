export interface ItemLibrary {
  id: string
  name: string
  category: ItemCategory
  isBuiltIn: boolean
  usageCount: number
  createTime: number
  updateTime: number
}

export interface ItemCategory {
  key: string
  name: string
  color: string
}

export interface ItemLibraryItem {
  id: string
  name: string
  category: ItemCategory
  usageCount: number
  isBuiltIn: boolean
  createTimeText: string
}

// 物品分类
export const ITEM_CATEGORIES: ItemCategory[] = [
  { key: 'unique', name: '暗金', color: '#d4af37' },
  { key: 'set', name: '套装', color: '#4CAF50' },
  { key: 'rare', name: '稀有', color: '#3498db' },
  { key: 'magic', name: '魔法', color: '#9b59b6' },
  { key: 'rune', name: '符文', color: '#e74c3c' },
  { key: 'base', name: '底材', color: '#95a5a6' },
  { key: 'key', name: '钥匙', color: '#ff9800' }
]