<script lang="ts" setup>
import { ref } from "vue"
import { Game, useGameMessage } from "../scripts/game"

const game = ref<Game>()
const dialogSetupVisible = ref(false)
const dialogGameOverVisible = ref(false)
const gameMessage = useGameMessage()

const botTurn = (game: Game) => {
    if (game.isBotTurn) {
        console.log("Bot's turn!")
        for (let i = 0; i < game.board.height; ++i) {
            if(game.board.canEliminateRow(i)) {
                setTimeout(() => {
                    eliminateRow(i)
                }, 1000)
                return
            }
        }
        for (let i = 0; i < game.board.width; ++i) {
            if(game.board.canEliminateCol(i)) {
                setTimeout(() => {
                    eliminateCol(i)
                }, 1000)
                return
            }
        }
    }
}

const checkGameOver = () => {
    if (game.value == undefined) return false
    if (game.value.isOver) {
        showGameOverDialog()
    }
    return game.value.isOver
}

const toPossessive = (name: string) => {
    switch (name) {
        case "You":
            return "Your"
        default:
            return name + "'s"
    }
}

const startGame = (board: number[][], botPlayer: number) => {
    game.value = new Game(board, botPlayer, botTurn)
    console.log("Game started!")
    gameMessage.value.clearLogs()
    hideGameOverDialog()
}

const eliminateRow = (row: number) => {
    if (game.value == undefined) return
    game.value.eliminateRow(row)
    if(checkGameOver()) return
}

const eliminateCol = (col: number) => {
    if (game.value == undefined) return
    game.value.eliminateCol(col)
    if(checkGameOver()) return
}

const showSetupDialog = () => {
    dialogSetupVisible.value = true
}

const hideSetupDialog = () => {
    dialogSetupVisible.value = false
}

const showGameOverDialog = () => {
    dialogGameOverVisible.value = true
}

const hideGameOverDialog = () => {
    dialogGameOverVisible.value = false
}
</script>

<template>
    <div class="w-full h-full m-0">
        <div class="flex flex-col h-full justify-center items-center">
            <div class="flex flex-col space-y-2">
                <el-card v-if="game">
                    <div class="space-y-3">
                        <div class="flex justify-center">
                            <chess-board :game="game" @eliminateRow="eliminateRow" @eliminateCol="eliminateCol" />
                        </div>

                        <div class="grid grid-cols-10 space-x-5 space-y-1">
                            <div class="flex justify-end col-span-2">
                                <el-text>Score:</el-text>
                            </div>
                            <div class="flex flex-col col-span-8">
                                <el-text>{{ game.playerNames[0].toLowerCase() }}: {{ game.scores[0] }}</el-text>
                                <el-text>{{ game.playerNames[1].toLowerCase() }}: {{ game.scores[1] }}</el-text>
                            </div>
                            <div class="flex justify-end col-span-2">
                                <el-text>State:</el-text>
                            </div>
                            <div class="col-span-8">
                                <el-text>{{ toPossessive(game.currentPlayerName.toLowerCase()) }} turn</el-text>
                            </div>
                            <div class="flex justify-end col-span-2 w-20">
                                <el-text>Message:</el-text>
                            </div>
                            <div class="col-span-8">
                                <el-text>{{ gameMessage.logs.at(-1) }}</el-text>
                            </div>
                        </div>
                    </div>
                </el-card>
                <div>
                    <el-button type="primary" @click="showSetupDialog">New Game</el-button>
                </div>
            </div>

            <game-setup-dialog
                :visible="dialogSetupVisible"
                @start="startGame"
                @close="hideSetupDialog"
                ></game-setup-dialog>

            <game-over-dialog
                :visible="dialogGameOverVisible"
                :game="game"
                @newGame="showSetupDialog"
                @close="hideGameOverDialog"
                ></game-over-dialog>
        </div>
    </div>
</template>
