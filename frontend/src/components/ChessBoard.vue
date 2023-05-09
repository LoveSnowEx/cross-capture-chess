<script lang="ts" setup>
import ChessCell from "@/components/ChessCell.vue"

const props = defineProps<{
    board: number[][]
}>()
</script>

<template>
    <table class="chessboard">
        <tr v-for="(row, i) in board" :key="i">
            <td v-for="(cell, j) in row" :key="j">
                <ChessCell :state="cell == 1" />
            </td>
        </tr>
    </table>
</template>

<style>
.chessboard {
    table-layout: auto;
    border-collapse: collapse;
}

.chessboard tr,
td {
    width: 50px;
    height: 50px;
    aspect-ratio: 1;
    border-width: 2px;
    --tw-border-opacity: 1;
    border-color: rgb(0 0 0 / var(--tw-border-opacity));
}

.chessboard tr:nth-child(odd) td:nth-child(even),
.chessboard tr:nth-child(even) td:nth-child(odd) {
    background-color: gray;
}

.chessboard tr:nth-child(even) td:nth-child(even),
.chessboard tr:nth-child(odd) td:nth-child(odd) {
    background-color: white;
}
</style>
