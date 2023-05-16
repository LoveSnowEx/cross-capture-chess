<script setup lang="ts">
import { ref, watch } from "vue"
import { useGameMessage } from "../scripts/game"

const DEFAULT_BOARD = [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
]
const DEFAULT_BOARD_HEIGHT = DEFAULT_BOARD.length
const DEFAULT_BOARD_WIDTH = DEFAULT_BOARD[0].length

const randZeroOne = () => Math.floor(Math.random() * 2)

const randBoard = (h: number, w: number) => Array.from({ length: h }, () => Array.from({ length: w }, randZeroOne))

const board2Str = (board: number[][]) => board.map((row) => row.map(String).join(" ")).join("\n")

const str2Board = (str: string) => str.split("\n").map((row) => row.trim().split(/\s+/).map(Number))

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    (e: "start", board: number[][], botPlayer: number): void
    (e: "close"): void
}>()

const dialogVisible = ref(false)
const boardHeight = ref(DEFAULT_BOARD_HEIGHT)
const boardWidth = ref(DEFAULT_BOARD_WIDTH)
const input = ref(board2Str(DEFAULT_BOARD))
const enableBot = ref(false)
const goFirst = ref(-1)
const goFirstOptions = [
    {
        value: 0,
        label: "You",
    },
    {
        value: 1,
        label: "Bot",
    },
    {
        value: -1,
        label: "Random",
    },
]
const gameMessage = useGameMessage()

const startGame = () => {
    const [h, w] = [boardHeight.value, boardWidth.value]
    const board = str2Board(input.value)
    if (board.length != h || board.some((row) => row.length != w)) {
        gameMessage.value.error("Invalid board size!")
        return
    }
    const botPlayer = getBotPlayer()
    emit("close")
    emit("start", board, botPlayer)
}

const close = () => {
    emit("close")
}

const genRandBoard = () => {
    const [h, w] = [boardHeight.value, boardWidth.value]
    const board = randBoard(h, w)
    input.value = board2Str(board)
}

const getBotPlayer = () => {
    if (!enableBot.value) return -1
    return goFirst.value == -1 ? randZeroOne() : goFirst.value
}

watch(
    () => props.visible,
    (val) => {
        dialogVisible.value = val
    },
)
</script>

<template>
    <el-dialog v-model="dialogVisible" title="New Game" :before-close="close" align-center width="35%">
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
                    <el-input type="textarea" :rows="9" v-model="input" placeholder="Enter the custom board..." />
                </div>
                <div class="flex flex-col space-y-2 justify-between items-center">
                    <el-checkbox v-model="enableBot">Play with Bot</el-checkbox>
                    <el-select v-model="goFirst" placeholder="Who goes first?" :disabled="!enableBot">
                        <el-option
                            v-for="item in goFirstOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
                <div>
                    <el-button type="primary" @click="startGame" class="w-full">Start</el-button>
                </div>
                <div>
                    <el-button type="info" @click="genRandBoard" class="w-full">Random</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
