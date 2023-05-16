<script lang="ts" setup>
import { Game, useGameMessage } from "../scripts/game"
import { ref } from "vue"

const props = defineProps<{
    game: Game
}>()

const emit = defineEmits<{
    (e: "eliminateRow", row: number): void
    (e: "eliminateCol", col: number): void
}>()

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
const gameMessage = useGameMessage()

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

const eliminateRow = (row: number) => {
    if (props.game.isBotTurn) {
        gameMessage.value.error("It's bot's turn!")
        return
    }
    if( !props.game.board.canEliminateRow(row) ) {
        gameMessage.value.error("You can't eliminate this row!")
        return
    }
    emit("eliminateRow", row)
}

const eliminateCol = (col: number) => {
    if (props.game.isBotTurn) {
        gameMessage.value.error("It's bot's turn!")
        return
    }
    if( !props.game.board.canEliminateCol(col) ) {
        gameMessage.value.error("You can't eliminate this column!")
        return
    }
    emit("eliminateCol", col)
}
</script>

<template>
    <table class="chessboard">
        <tr>
            <td />
            <td v-for="(_, i) in game.board.width" :key="i">
                <div class="flex m-auto rounded justify-center items-center">
                    <button
                        class="eliminate-btn"
                        @mousemove="hoverColButton(i)"
                        @mouseleave="hoverColButton(-1)"
                        @click="eliminateCol(i)"
                    >
                        <img src="@/assets/images/arrow-down.png" alt="arrow-down" />
                    </button>
                </div>
            </td>
        </tr>
        <tr v-for="(row, i) in game.board.board" :key="i">
            <td />
            <td v-for="(val, j) in row" :key="j" class="cell" :class="getCellBgColor(i, j)">
                <div @mousemove="hoverCell(i, j)" @mouseleave="hoverCell(-1, -1)">
                    <chess-piece v-if="val === 1" />
                </div>
            </td>
            <td>
                <div class="flex m-auto justify-center items-center">
                    <button
                        class="eliminate-btn"
                        @mousemove.prevent="hoverRowButton(i)"
                        @mouseleave.prevent="hoverRowButton(-1)"
                        @click="eliminateRow(i)"
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
}

.eliminate-btn {
    width: 40px;
    height: 40px;
    border-color: transparent;
    border-radius: 100%;
}

.eliminate-btn:hover {
    border-width: 1px;
}
</style>
