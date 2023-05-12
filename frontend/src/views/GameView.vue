<script lang="ts" setup>
import { ref } from "vue"
import { Board } from "../scripts/game"

const keyUpdate = ref(0)

const input = ref(``)
const board = new Board()
board.resize(8, 8)

const parseNumbers = (input: string) => {
    return input.trim().split(/\s+/).map(Number)
}

const setBoard = () => {
    const numbers = parseNumbers(input.value)
    if (numbers.length < 3) {
        return
    }
    const height = numbers[0]
    const width = numbers[1]
    const bitboard = numbers.slice(2)

    const tmpBoard = []
    for (let i = 0; i < height; i++) {
        const begin = i * width
        const end = (i + 1) * width
        tmpBoard.push(bitboard.slice(begin, end))
    }
    board.setBoard(tmpBoard)
    ++keyUpdate.value
}
</script>

<template>
    <div class="w-full h-full m-0" :key="keyUpdate">
        <div class="flex flex-col h-full justify-center items-center">
            <chess-board :board="board" />
            <div>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 9 }"
                    v-model="input"
                    placeholder="Enter the custom board..."
                />
                <el-button @click="setBoard">Set Board</el-button>
            </div>
        </div>
    </div>
</template>
