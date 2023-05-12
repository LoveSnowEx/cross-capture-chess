<script lang="ts" setup>
import { ref } from "vue"
import { Board } from "../scripts/game"
import { reshape } from "../scripts/utils"

const input = ref(``)
const board = ref(new Board())
board.value.resize(8, 8)

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

    board.value.setBoard(reshape<number[][]>(bitboard, height, width))
}

const eliminateRow = (row: number) => {
    board.value.eliminateRow(row)
}

const eliminateCol = (col: number) => {
    board.value.eliminateCol(col)
}
</script>

<template>
    <div class="w-full h-full m-0">
        <div class="flex flex-col h-full justify-center items-center">
            <chess-board :board="board" @eliminateRow="eliminateRow" @eliminateCol="eliminateCol" />
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
