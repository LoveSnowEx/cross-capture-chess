<script lang="ts" setup>
import { computed, ref } from "vue"

const props = defineProps<{
    board: number[][]
}>()

const height = computed(() => props.board.length)
const width = computed(() => (props.board.length == 0 ? 0 : props.board[0].length))

const getCellBgColor = (row: number, col: number): string => {
    if (row == hoverRow.value && col == hoverCol.value) {
        return "bg-cyan-200"
    }
    if (row == hoverRow.value) {
        return "bg-blue-200"
    }
    if (col == hoverCol.value) {
        return "bg-green-200"
    }
    return (row + col) % 2 == 0 ? "bg-white" : "bg-gray-200"
}

const hoverRow = ref(-1)
const hoverCol = ref(-1)

const hoverCell = (row: number, col: number) => {
    hoverRow.value = row
    hoverCol.value = col
}

const hoverRowButton = (row: number) => {
    hoverRow.value = row
}

const hoverColButton = (col: number) => {
    hoverCol.value = col
}
</script>

<template>
    <table class="chessboard">
        <tr>
            <td v-for="(cell, i) in width" :key="i">
                <div class="flex m-auto rounded justify-center items-center">
                    <button
                        class="eliminate-btn"
                        @mousemove.prevent="hoverColButton(i)"
                        @mouseleave.prevent="hoverColButton(-1)"
                    >
                        <img src="@/assets/images/arrow-down.png" alt="arrow-down" />
                    </button>
                </div>
            </td>
        </tr>
        <tr v-for="(row, i) in board" :key="i">
            <td v-for="(cell, j) in row" :key="j" class="cell" :class="getCellBgColor(i, j)">
                <div @mousemove.prevent="hoverCell(i, j)" @mouseleave.prevent="hoverCell(-1, -1)">
                    <chess-piece v-if="cell === 1" />
                </div>
            </td>
            <td>
                <div class="flex m-auto justify-center items-center">
                    <button
                        class="eliminate-btn"
                        @mousemove.prevent="hoverRowButton(i)"
                        @mouseleave.prevent="hoverRowButton(-1)"
                    >
                        <img src="@/assets/images/arrow-right.png" alt="arrow-right" class="rotate-180" />
                    </button>
                </div>
            </td>
        </tr>
    </table>
</template>

<style scoped>
.chessboard {
    table-layout: auto;
    border-collapse: separate;
}

.chessboard tr td {
    width: 50px;
    height: 50px;
    aspect-ratio: 1;
}

.cell {
    border-width: 1px;
    border-radius: 10%;
    --tw-border-opacity: 1;
    border-color: rgb(0 0 0 / var(--tw-border-opacity));
}

.cell:hover {
    border-width: 2px;
    border-radius: 10%;
    --tw-border-opacity: 1;
    border-color: rgb(0 0 0 / var(--tw-border-opacity));
}

.eliminate-btn {
    width: 40px;
    height: 40px;
}

.eliminate-btn:hover {
    border-width: 1px;
    border-color: transparent;
    border-radius: 100%;
}
</style>
