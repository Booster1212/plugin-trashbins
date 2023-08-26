<template>
    <div class="trashbin-container">
        <div class="trashbin">
            <div class="item-list">
                <div v-if="items.length > 0">
                    <div v-for="(item, index) in items" :key="index" class="item">
                        <div class="item-icon">
                            <img
                                :src="resolvePath(`../../assets/icons/${item.dbName}.png`)"
                                alt="Item Icon"
                                style="width: 32px; height: 32px"
                            />
                        </div>
                        <div class="item-name" @click="removeItem(item, index)">{{ item.name }} x{{ item.amount }}</div>
                    </div>
                </div>
                <div v-else>
                    <p>Trashbin doesn't contain any items.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import WebViewEvents from '@utility/webViewEvents';
import { TrashbinEvents } from '../shared/enums';
import resolvePath from '@utility/pathResolver';
import { Trash } from '../shared/trashInterface';

const items = ref<Array<Trash>>([]);

function setTrashData(data: Array<Trash>) {
    items.value = data;

    console.log(JSON.stringify(data));
}

function removeItem(item: Trash, index: number) {
    if (items.value[index].amount > 1) {
        items.value[index].amount--;
    } else {
        items.value.splice(index, 1);
    }

    WebViewEvents.emitServer(TrashbinEvents.GRAB_TRASH, item, 1);
}

onMounted(() => {
    WebViewEvents.on(TrashbinEvents.REQUEST_TRASH, setTrashData);

    WebViewEvents.emitReady(`Trashbin`);
});
</script>

<style scoped>
.trashbin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.trashbin {
    width: 250px;
    height: 350px;
    border-radius: 15px;
    overflow: hidden;
    background-color: black;
}

.item-list {
    margin-top: 20px;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
}

.item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    background-color: #888181;
    border-radius: 5px;
    transition: transform 0.5s ease, background-color 0.5s ease;
    will-change: transform;
}

.item:hover {
    cursor: pointer;
    transform: translateY(-5px);
    background-color: #6b6b6b;
}
.item-icon {
    font-size: 20px;
    margin-right: 10px;
}

.item-name {
    font-size: 16px;
    color: rgb(248, 248, 248);
}
</style>
