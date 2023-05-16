<script setup lang="ts">
import { ref, watch } from "vue"
import { Game } from "../scripts/game"

const props = defineProps<{
    game: Game
    visible: boolean
}>()

const emit = defineEmits<{
    (e: "newGame"): void
    (e: "close"): void
}>()

const dialogVisible = ref(false)

const close = () => {
    emit("close")
}

const newGame = () => {
    emit("close")
    emit("newGame")
}

watch(
    () => props.visible,
    (val) => {
        dialogVisible.value = val
    },
)
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Game Over" :before-close="close" align-center width="20%">
        <template #default>
            <div v-if="game" class="flex flex-col space-y-2 justify-between">
                <div class="flex flex-col space-y-2 justify-between items-center">
                    <el-text size="large">{{ game.scores[0] }} : {{ game.scores[1] }}</el-text>
                    <el-text>{{ game.winnerMessage }}</el-text>
                </div>
                <div>
                    <el-button type="primary" @click="newGame" class="w-full">New Game</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
