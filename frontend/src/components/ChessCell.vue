<script lang="ts" setup>
import { Ref } from "vue"

const props = defineProps<{
    state: Ref<boolean> // true: black, false: white
}>()
</script>

<template>
    <div v-if="state" class="piece"></div>
</template>

<style>
.piece {
    width: 100%;
    height: 100%;
    background-color: black;
    border-radius: 50%;
}
</style>
