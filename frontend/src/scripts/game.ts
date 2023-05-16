import { ElMessage, MessageHandler } from "element-plus"
import { ref } from "vue"

class GameMessage {
    private _handler: MessageHandler | null = null
    private _logs: string[] = []

    warn(msg: string) {
        if (this._handler != null) {
            this._handler.close()
        }
        this._handler = ElMessage({
            message: msg,
            type: "warning",
        })
    }

    info(msg: string) {
        if (this._handler != null) {
            this._handler.close()
        }
        this._handler = ElMessage({
            message: msg,
            type: "info",
        })
    }

    error(msg: string) {
        if (this._handler != null) {
            this._handler.close()
        }
        this._handler = ElMessage({
            message: msg,
            type: "error",
        })
    }

    log(msg: string) {
        this._logs.push(msg)
    }

    get logs(): string[] {
        return this._logs
    }

    clearLogs() {
        this._logs = []
    }
}

const gameMessageInstance = ref(new GameMessage())

export const useGameMessage = () => {
    return gameMessageInstance
}

export interface Position {
    row: number
    col: number
}

export class Board {
    board: number[][]
    snapshots: Position[][]
    current: number

    constructor(board: number[][]) {
        this.board = board
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

    get isOver() {
        return this.board.every((row) => row.every((value) => value == 0))
    }

    canEliminateRow(row: number) {
        return this.getRowPositions(row).some((pos) => this.getPosition(pos) == 1)
    }

    canEliminateCol(col: number) {
        return this.getColPositions(col).some((pos) => this.getPosition(pos) == 1)
    }

    getRowPositions(row: number): Position[] {
        return Array.from({ length: this.width }, (_, col) => ({ row, col } as Position))
    }

    getColPositions(col: number): Position[] {
        return Array.from({ length: this.height }, (_, row) => ({ row, col } as Position))
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
        ++this.current
    }

    clearHitory() {
        this.snapshots.length = 0
        this.current = -1
    }

    undo() {
        if (!this.canUndo) return
        const positions = this.snapshots[this.current]
        positions.forEach((pos) => this.add(pos))
        --this.current
    }

    redo() {
        if (!this.canRedo) return
        ++this.current
        const positions = this.snapshots[this.current]
        positions.forEach((pos) => this.remove(pos))
    }

    eliminatePositions(positions: Position[]) {
        positions.forEach((pos) => this.remove(pos))
    }

    eliminateRow(row: number): number {
        const positions = Array.from({ length: this.width }, (_, col) => ({ row, col } as Position)).filter(
            (pos) => this.getPosition(pos) == 1,
        )
        const score = positions.length
        if (score == 0) return 0
        this.eliminatePositions(positions)
        this.pushHitory(positions)
        return score
    }

    eliminateCol(col: number): number {
        const positions = Array.from({ length: this.height }, (_, row) => ({ row, col } as Position)).filter(
            (pos) => this.getPosition(pos) == 1,
        )
        const score = positions.length
        if (score == 0) return 0
        this.eliminatePositions(positions)
        this.pushHitory(positions)
        return score
    }
}

export class Game {
    private _board: Board
    private _currentPlayer: number
    private _botPlayer: number
    private _scores: number[]
    private _onBotMove: (game: Game) => void

    constructor(board: number[][], botPlayer: number, onBotMove: (game: Game) => void = () => {return}) {
        this._board = new Board(board)
        this._currentPlayer = 0
        this._botPlayer = botPlayer
        this._scores = [0, 0]
        this._onBotMove = onBotMove
        if (this.isBotTurn) {
            this.botMove()
        }
    }

    get board() {
        return this._board
    }

    get isOver() {
        return this._board.isOver
    }

    get winner() {
        if(this._scores[0] == this._scores[1]) return -1
        return this._scores[0] > this._scores[1] ? 0 : 1
    }

    get isBotTurn() {
        return this._currentPlayer == this._botPlayer
    }

    get currentPlayer() {
        return this._currentPlayer
    }

    get playerNames() {
        if (this._botPlayer == -1) {
            return ["Player 1", "Player 2"]
        }
        return this._botPlayer == 0 ? ["Bot", "You"] : ["You", "Bot"]
    }

    get currentPlayerName() {
        return this.playerNames[this.currentPlayer]
    }

    get winnerName() {
        return this.playerNames[this.winner]
    }

    get winnerMessage() {
        if (this.winner == -1) return "It's a tie!"
        return `${this.winnerName} win!`
    }

    get scores() {
        return this._scores
    }

    eliminateRow(row: number) {
        const score = this._board.eliminateRow(row)
        this._scores[this._currentPlayer] += score
        gameMessageInstance.value.log(`${this.currentPlayerName} eliminated row ${row} and got ${score} points!`)
        this.nextTurn()
    }

    eliminateCol(col: number) {
        const score = this._board.eliminateCol(col)
        this._scores[this._currentPlayer] += score
        gameMessageInstance.value.log(`${this.currentPlayerName} eliminated column ${col} and got ${score} points!`)
        this.nextTurn()
    }

    botMove() {
        this._onBotMove(this)
    }

    nextTurn() {
        if(this.isOver) {
            gameMessageInstance.value.log(this.winnerMessage)
            return
        }
        this._currentPlayer = 1 - this._currentPlayer
        if (this.isBotTurn) {
            this.botMove()
        }
    }
}
