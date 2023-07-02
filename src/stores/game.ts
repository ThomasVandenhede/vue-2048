import { GRID_SIZE } from '@/constants'
import type { Cell, Tile, TileInCell, TileNoId, Vector, VectorMap } from '@/interfaces/Tile'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

interface GameState {
  score: number
  bestScore: number
  over: boolean
  won: boolean
  grid: (Tile | null)[][]
}
type Direction = 'up' | 'down' | 'right' | 'left'

const vectorMap: VectorMap = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 }
}

export const useGameStore = defineStore('game', () => {
  let id = ref(0)
  let state = reactive<GameState>({
    score: 0,
    bestScore: 0,
    over: false,
    won: false,
    grid: Array.from({ length: GRID_SIZE }, () => {
      return Array.from({ length: GRID_SIZE }, () => null)
    })
  })

  const availableCells = computed<Cell[]>(() => {
    const result = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!state.grid[y][x]) {
          result.push({ x, y })
        }
      }
    }
    return result
  })

  const eachCell = (callback: (cell: Cell, tile: Tile | null) => void) => {
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = { y, x }
        callback(cell, state.grid[y][x])
      }
    }
  }

  const cellAvailable = (cell: Cell): boolean => !cellOccupied(cell)

  const cellOccupied = (cell: Cell): boolean => !!cellContent(cell)

  const findFarthestPosition = (cell: Cell, vector: Vector) => {
    let previous
    do {
      previous = cell
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (isCellWithinBounds(cell) && cellAvailable(cell))
    return {
      farthest: previous,
      next: cell
    }
  }

  const movesAvailable = () => !!availableCells.value.length || tileMatchesAvailable()

  const tileMatchesAvailable = () => {
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = { y, x }
        const tile: Tile | null = cellContent(cell)
        if (tile) {
          for (let direction of ['up', 'down', 'left', 'right']) {
            const vector = vectorMap[direction]
            const nextCell: Cell = {
              x: x + vector.x,
              y: y + vector.y
            }
            const nextTile = cellContent(nextCell)
            if (nextTile && nextTile.value === tile.value) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  const isCellWithinBounds = (cell: Cell) => {
    return cell.y >= 0 && cell.y < GRID_SIZE && cell.x >= 0 && cell.x < GRID_SIZE
  }

  const positionsEqual = (first: Cell, second: Cell) => {
    return first.x === second.x && first.y === second.y
  }

  const initializeGrid = () => {
    eachCell((cell) => {
      state.grid[cell.y][cell.x] = null
    })
    addRandomTile()
    addRandomTile()
  }

  const getRandomAvailableCell = (): Cell => {
    return availableCells.value[Math.floor(Math.random() * availableCells.value.length)]
  }

  const createTile = (tileNoId: TileNoId): Tile => {
    return { id: id.value++, ...tileNoId }
  }

  const addRandomTile = (): void => {
    if (availableCells.value.length) {
      const cell = getRandomAvailableCell()
      const newTile = createTile({
        value: Math.random() < 0.9 ? 2 : 4,
        isNew: true,
        mergedFrom: null
      })
      state.grid[cell.y][cell.x] = newTile
    }
  }

  initializeGrid() // START

  const cellContent = (cell: Cell): Tile | null => {
    if (isCellWithinBounds(cell)) {
      return state.grid[cell.y][cell.x]
    } else {
      return null
    }
  }

  const insertTile = (cell: Cell, tile: Tile): void => {
    state.grid[cell.y][cell.x] = tile
  }

  const removeTile = (cell: Cell): void => {
    state.grid[cell.y][cell.x] = null
  }

  const moveTile = (tile: Tile, start: Cell, end: Cell): void => {
    removeTile(start)
    insertTile(end, tile)
  }

  const prepareTiles = (): void => {
    eachCell((cell, tile) => {
      if (tile) {
        tile.mergedFrom = null
      }
    })
  }

  const buildTraversals = (vector: Vector) => {
    const traversals: { x: number[]; y: number[] } = {
      x: [],
      y: []
    }
    for (let pos = 0; pos < GRID_SIZE; pos++) {
      traversals.x.push(pos)
      traversals.y.push(pos)
    }
    if (vector.x === 1) traversals.x = traversals.x.reverse()
    if (vector.y === 1) traversals.y = traversals.y.reverse()
    return traversals
  }

  const move = (direction: Direction): void => {
    const vector = vectorMap[direction]
    const traversals = buildTraversals(vector)
    // TODO
    // if (isGameTerminated()) return;
    let moved = false
    prepareTiles()

    traversals.x.forEach(function (x) {
      traversals.y.forEach(function (y) {
        const cell: Cell = { x, y }
        const tile: Tile | null = cellContent(cell)
        if (tile !== null) {
          let tileInCell: TileInCell = { ...tile, ...cell } // temporarily track tile position
          const positions = findFarthestPosition(cell, vector)
          const next: Tile | null = cellContent(positions.next)
          if (next && next.value === tile.value && !next.mergedFrom) {
            const merged = createTile({
              value: tile.value * 2,
              isNew: false
            })
            merged.mergedFrom = [tile, next]
            insertTile(positions.next, merged)
            removeTile(cell)
            tileInCell = Object.assign(tileInCell, positions.next)
            state.score += merged.value
            if (merged.value === 2048) state.won = true
          } else {
            moveTile(tile, cell, positions.farthest)
            tileInCell = Object.assign(tileInCell, positions.farthest)
          }
          if (!positionsEqual(cell, tileInCell)) {
            moved = true
          }
        }
      })
    })
    if (moved) {
      addRandomTile()
      if (!movesAvailable()) {
        state.over = true
      }
    }
  }

  function $reset() {
    state.won = false
    state.over = false
    state.score = 0
    state.bestScore = 0
    initializeGrid()
  }

  const tiles = computed<TileInCell[]>(() => {
    const result: TileInCell[] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell: Cell = { x, y }
        const tile: Tile | null = cellContent(cell)
        if (tile) {
          if (tile.mergedFrom) {
            const [tile1, tile2] = tile.mergedFrom
            result.push({ ...tile1, ...cell })
            result.push({ ...tile2, ...cell })
          }
          result.push({ ...tile, ...cell })
        }
      }
    }
    return result.sort((a, b) => a.id - b.id)
  })

  return {
    state,
    tiles,
    move,
    newGame: $reset
  }
})
