import { GRID_SIZE } from '@/constants'
import type { Cell, Tile, TileNoId } from '@/interfaces/Tile'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

interface GameState {
  tiles: Tile[]
  cells: (Tile | null)[][]
}
type Direction = 'up' | 'down' | 'right' | 'left'

export const useGameStore = defineStore('game', () => {
  let id = ref(0)
  let state = reactive<GameState>({
    tiles: [],
    cells: Array.from({ length: GRID_SIZE }, () => {
      return Array.from({ length: GRID_SIZE }, () => null)
    })
  })

  const eachCell = (callback: (row: number, col: number, tile: Tile) => void) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        callback(i, j, state.cells[i][j])
      }
    }
  }

  const availableCells = computed<Cell[]>(() => {
    const result = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (state.cells[i][j] === null) {
          result.push({ col: '', row: '' })
        }
      }
    }

    return Array.from(
      { length: GRID_SIZE * GRID_SIZE },
      (_, index): Cell => ({
        col: (index % GRID_SIZE) + 1,
        row: Math.ceil((index + 1) / GRID_SIZE)
      })
    ).filter(({ col, row }) => {
      const match = state.tiles.findIndex((tile) => tile.col === col && tile.row === row)
      return match === -1
    })
  })

  const initializeGrid = () => {
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
      const newTile = createTile({
        ...getRandomAvailableCell(),
        value: Math.random() < 0.9 ? 2 : 4,
        isNew: true,
        mergedFrom: null
      })
      state.tiles.push(newTile)
    }
  }

  const prepareGrid = (): void => {
    state.tiles.forEach((tile) => (tile.isNew = false))
  }

  const removeMergedTiles = (): void => {
    state.tiles.forEach((tile) => {
      tile.mergedFrom = null
    })
    state.tiles = state.tiles.filter((tile) => !tile.markedForDeletion)
  }

  initializeGrid() // START

  const moveUp = (): void => {
    let hasMoved = false
    for (let i = 1; i <= GRID_SIZE; i++) {
      const tiles = state.tiles.filter((tile) => tile.col === i).sort((a, b) => a.row - b.row)
      for (let j = 0; j < tiles.length; j++) {
        const current = tiles[j]
        const currentPos = current.row
        const prev = j > 0 ? tiles[j - 1] : null
        if (!prev) {
          current.row = 1
        } else {
          if (prev.value === current.value && !prev.mergedFrom && !prev.markedForDeletion) {
            current.row = prev.row
            current.markedForDeletion = true
            prev.markedForDeletion = true
            const newTile = createTile({
              value: current.value * 2,
              row: current.row,
              col: current.col,
              isNew: false,
              mergedFrom: [current.id, prev.id]
            })
            state.tiles.push(newTile)
          } else {
            current.row = prev.row + 1
          }
        }
        if (current.row !== currentPos) {
          hasMoved = true
        }
      }
    }
    if (hasMoved) {
      addRandomTile()
    }
  }
  const moveDown = (): void => {
    let hasMoved = false
    for (let i = 1; i <= GRID_SIZE; i++) {
      const tiles = state.tiles.filter((tile) => tile.col === i).sort((a, b) => a.row - b.row)
      for (let j = tiles.length - 1; j >= 0; j--) {
        const current = tiles[j]
        const currentPos = current.row
        const next = j < tiles.length - 1 ? tiles[j + 1] : null
        if (!next) {
          current.row = GRID_SIZE
        } else {
          if (next.value === current.value && !next.mergedFrom && !next.markedForDeletion) {
            current.row = next.row
            current.markedForDeletion = true
            next.markedForDeletion = true
            const newTile = createTile({
              value: current.value * 2,
              row: current.row,
              col: current.col,
              isNew: false,
              mergedFrom: [current.id, next.id]
            })
            state.tiles.push(newTile)
          } else {
            current.row = next.row - 1
          }
        }
        if (current.row !== currentPos) {
          hasMoved = true
        }
      }
    }
    if (hasMoved) {
      addRandomTile()
    }
  }
  const moveRight = (): void => {
    let hasMoved = false
    for (let i = 1; i <= GRID_SIZE; i++) {
      const tiles = state.tiles.filter((tile) => tile.row === i).sort((a, b) => a.col - b.col)
      for (let j = tiles.length - 1; j >= 0; j--) {
        const current = tiles[j]
        const currentPos = current.col
        const next = j < tiles.length - 1 ? tiles[j + 1] : null
        if (!next) {
          current.col = GRID_SIZE
        } else {
          if (next.value === current.value && !next.mergedFrom && !next.markedForDeletion) {
            current.col = next.col
            current.markedForDeletion = true
            next.markedForDeletion = true
            const newTile = createTile({
              value: current.value * 2,
              col: current.col,
              row: current.row,
              isNew: false,
              mergedFrom: [current.id, next.id]
            })
            state.tiles.push(newTile)
          } else {
            current.col = next.col - 1
          }
        }
        if (current.col !== currentPos) {
          hasMoved = true
        }
      }
    }
    if (hasMoved) {
      addRandomTile()
    }
  }
  const moveLeft = (): void => {
    let hasMoved = false
    for (let i = 1; i <= GRID_SIZE; i++) {
      const tiles = state.tiles.filter((tile) => tile.row === i).sort((a, b) => a.col - b.col)
      for (let j = 0; j < tiles.length; j++) {
        const current = tiles[j]
        const currentPos = current.col
        const prev = j > 0 ? tiles[j - 1] : null
        if (!prev) {
          current.col = 1
        } else {
          if (prev.value === current.value && !prev.mergedFrom && !prev.markedForDeletion) {
            current.col = prev.col
            current.markedForDeletion = true
            prev.markedForDeletion = true
            const newTile = createTile({
              value: current.value * 2,
              col: current.col,
              row: current.row,
              isNew: false,
              mergedFrom: [current.id, prev.id]
            })
            state.tiles.push(newTile)
          } else {
            current.col = prev.col + 1
          }
        }
        if (current.col !== currentPos) {
          hasMoved = true
        }
      }
    }
    if (hasMoved) {
      addRandomTile()
    }
  }

  const move = (direction: Direction): void => {
    prepareGrid()
    removeMergedTiles()
    switch (direction) {
      case 'up':
        moveUp()
        break
      case 'down':
        moveDown()
        break
      case 'right':
        moveRight()
        break
      case 'left':
        moveLeft()
        break
      default:
        return
    }
  }

  return {
    state,
    move
  }
})
