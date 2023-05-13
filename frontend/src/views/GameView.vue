<script lang="ts" setup>
import { ref } from "vue"
import { Board } from "../scripts/game"
import { reshape } from "../scripts/utils"
import { ElMessage, MessageHandler } from "element-plus"

const DEFAULT_BOARD = [
    [
        1,
        0,
        1,
        0,
    ],
    [
        0,
        1,
        0,
        1,
    ],
    [
        1,
        0,
        1,
        0,
    ],
]
const DEFAULT_BOARD_HEIGHT = DEFAULT_BOARD.length
const DEFAULT_BOARD_WIDTH = DEFAULT_BOARD[0].length

const board = ref(new Board())
board.value.setBoard(DEFAULT_BOARD)
const input = ref(DEFAULT_BOARD.map((row) => row.join(" ")).join("\n"))
const boardHeight = ref(DEFAULT_BOARD_HEIGHT)
const boardWidth = ref(DEFAULT_BOARD_WIDTH)
const dialogSetupVisible = ref(false)
const messageHandle = ref<MessageHandler>()

const parseBitboard = (input: string) => {
    return input.trim().split(/\s+/).map(Number)
}

const genRandBitboard = (h: number, w: number) => {
    return Array.from({ length: h * w }, () => Math.floor(Math.random() * 2))
}

const setBoard = (input: string, h: number, w: number) => {
    const bitboard = parseBitboard(input)

    const isValidInput = () => bitboard.length >= h * w
    if (!isValidInput()) {
        warn("Warning, invalid input!")
        return
    }

    boardHeight.value = h
    boardWidth.value = w

    board.value.setBoard(reshape<number[][]>(bitboard, h, w))
    hideSetupDialog()
}

const setRandBoard = (h: number, w: number) => {
    const bitboard = genRandBitboard(h, w)
    input.value = reshape<number[][]>(bitboard, h, w)
        .map((row) => row.map(String).join(" "))
        .join("\n")
}

const eliminateRow = (row: number) => {
    const ok = board.value.eliminateRow(row)
    if (!ok) {
        warn("Warning, the row is already eliminated!")
    }
}

const eliminateCol = (col: number) => {
    const ok = board.value.eliminateCol(col)
    if (!ok) {
        warn("Warning, the column is already eliminated!")
    }
}

const showSetupDialog = () => {
    dialogSetupVisible.value = true
}

const hideSetupDialog = () => {
    dialogSetupVisible.value = false
}

const warn = (msg: string) => {
    if (messageHandle.value) messageHandle.value.close()
    messageHandle.value = ElMessage({
        message: msg,
        type: "warning",
    })
}
</script>

<template>
    <div class="w-full h-full m-0">
        <div class="flex flex-col h-full justify-center items-center">
            <el-space direction="vertical">
                <chess-board :board="board" @eliminateRow="eliminateRow" @eliminateCol="eliminateCol" />
                <el-button type="primary" @click="showSetupDialog">New Board</el-button>
            </el-space>

            <el-dialog
                v-model="dialogSetupVisible"
                title="New Board"
                :before-close="hideSetupDialog"
                align-center
                width="35%"
            >
                <template #default>
                    <div class="flex flex-col space-y-2 justify-between">
                        <div class="flex space-x-5 items-center">
                            <span class="w-10 text-left">height:</span>
                            <el-slider v-model="boardHeight" :min="1" :max="8" show-input />
                        </div>
                        <div class="flex space-x-5 items-center">
                            <span class="w-10 text-left">width:</span>
                            <el-slider v-model="boardWidth" :min="1" :max="8" show-input />
                        </div>
                        <div>
                            <el-input
                                type="textarea"
                                :rows="9"
                                v-model="input"
                                placeholder="Enter the custom board..."
                            />
                        </div>
                        <div>
                            <el-button type="primary" @click="setBoard(input, boardHeight, boardWidth)" class="w-full"
                                >Apply</el-button
                            >
                        </div>
                        <div>
                            <el-button type="info" @click="setRandBoard(boardHeight, boardWidth)" class="w-full"
                                >Random</el-button
                            >
                        </div>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
