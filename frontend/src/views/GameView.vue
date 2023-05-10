<script lang="ts" setup>
import { ref } from "vue"

const input = ref(``)
const board = ref<number[][]>(Array(8).fill(Array(8).fill(1)))

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

    board.value.length = 0
    for (let i = 0; i < height; i++) {
        const begin = i * width
        const end = (i + 1) * width
        board.value.push(bitboard.slice(begin, end))
    }
}
</script>

<template>
    <div class="w-full h-full m-0">
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
