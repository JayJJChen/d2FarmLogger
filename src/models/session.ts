import { ItemCategory } from './item-library'

// Session Goal Type
export enum SessionTargetType {
  RunCount = 'count', // Fixed number of runs
  Time = 'time',      // Fixed time in minutes
  None = 'none'       // Just start
}

// Session Status
export enum SessionStatus {
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed'
}

// Session Goal Configuration
export interface SessionTarget {
  type: SessionTargetType
  value?: number // e.g. 100 runs or 60 minutes
}

// Drop Record
export interface SessionDrop {
  id: string
  itemId: string // Reference to ItemLibrary.id
  itemName: string // Snapshot
  itemCategory: ItemCategory // Snapshot
  sceneId: string // Reference to Scene.id
  sceneName: string // Snapshot
  note?: string
  timestamp: number
}

// Session
export interface Session {
  id: string
  characterId: string
  characterSnapshot: {
    name: string
    class: string
    level?: number
    magicFind?: number
  }
  sceneIds: string[]
  sceneSnapshots: {
    id: string
    name: string
  }[]
  target: SessionTarget
  status: SessionStatus
  startTime: number
  endTime?: number
  duration: number // seconds
  runCount: number
  drops: SessionDrop[]
  lastUpdate: number
}

/**
 * Create a new session object
 */
export function createSession(data: any): Session {
  var session: Session = {
    id: data.id || '',
    characterId: data.characterId || '',
    characterSnapshot: data.characterSnapshot || { name: '', class: '' },
    sceneIds: data.sceneIds || [],
    sceneSnapshots: data.sceneSnapshots || [],
    target: data.target || { type: SessionTargetType.None },
    status: data.status || SessionStatus.Active,
    startTime: data.startTime || Date.now(),
    duration: data.duration || 0,
    runCount: data.runCount || 0,
    drops: data.drops || [],
    lastUpdate: data.lastUpdate || Date.now()
  }

  if (data.endTime) {
    session.endTime = data.endTime
  }

  return session
}
