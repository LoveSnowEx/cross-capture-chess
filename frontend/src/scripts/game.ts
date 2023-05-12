export interface Position {
    row: number
    col: number
}

export class Board {
    board: number[][]
    snapshots: Position[][]
    current: number

    constructor() {
        this.board = []
        this.snapshots = []
        this.current = -1
    }

    setBoard(board: number[][]) {
        this.board = board
        this.snapshots = []
        this.current = -1
    }

    get height() {
        return this.board.length
    }

    get width() {
        return this.board.length == 0 ? 0 : this.board[0].length
    }

    get key() {
        return this.current
    }

    get canUndo() {
        return this.current >= 0
    }

    get canRedo() {
        return this.current + 1 < this.snapshots.length
    }

    getPosition(pos: Position) {
        return this.board[pos.row][pos.col]
    }

    setPosition(pos: Position, value: number) {
        this.board[pos.row][pos.col] = value
    }

    add(pos: Position) {
        this.setPosition(pos, 1)
    }

    remove(pos: Position) {
        this.setPosition(pos, 0)
    }

    reset() {
        this.board.length = 0
        this.clearHitory()
    }

    resize(height: number, width: number) {
        this.board = Array.from({ length: height }, () => Array.from({ length: width }, () => 1))
    }

    pushHitory(positions: Position[]) {
        this.snapshots.length = this.current + 1
        this.snapshots.push(positions)
        this.current++
    }

    clearHitory() {
        this.snapshots = []
        this.current = -1
    }

    undo() {
        if (!this.canUndo) return
        const positions = this.snapshots[this.current]
        for (const pos of positions) {
            this.add(pos)
        }
        this.current--
    }

    redo() {
        if (!this.canRedo) return
        this.current++
        const positions = this.snapshots[this.current]
        for (const pos of positions) {
            return this.remove(pos)
        }
    }

    eliminatePositions(positions: Position[]) {
        positions.forEach((pos) => this.remove(pos))
    }

    eliminateRow = (row: number) => {
        const positions = Array.from({ length: this.width }, (_, col) => ({ row, col } as Position)).filter(
            (pos) => this.getPosition(pos) == 1,
        )
        this.eliminatePositions(positions)
        this.pushHitory(positions)
    }

    eliminateCol(col: number) {
        const positions = Array.from({ length: this.height }, (_, row) => ({ row, col } as Position)).filter(
            (pos) => this.getPosition(pos) == 1,
        )
        this.eliminatePositions(positions)
        this.pushHitory(positions)
    }
}
