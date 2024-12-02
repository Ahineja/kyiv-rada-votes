<template>
    <div class="data-block">
        <h2>{{ message }}</h2>
        <p>Count is: {{ counterInDataBlock.count }}</p>
        <h6>counterInSetup is: {{ counterInSetup }}</h6>
        <button @click="incrementButtonAction">Count is: {{ counterInDataBlock.count }}</button>
        <button @click="incrementButtonInSetupAction">Count is: {{ counterInSetup }}</button>

        <h2>If pytannia.length = {{ pytanniaList.length }}</h2>
        <transition-group
          name="dancing-quin"
          class="data-block__list"
          tag="ul"
          v-if="pytanniaList.length"
        >
            <li
                :class="{
                    'data-block__item': true,
                    'data-block__item_expanded': expandedItems[item.innerId],
                }"
                v-for="(item, index) in pytanniaList"
                :key="item.innerId || index + 10000"
                @click="expandItem(item.innerId)"
            >
                  <b v-if="item.innerId">{{ item.innerId }}</b>:  {{ item.GL_Text }}

                  <br />

                  <div
                      v-if="expandedItems[item.innerId]"
                      class="pytannia-block"
                  >
                      {{ getDPList(item) }}
                  </div>
            </li>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import type {DeputyVoiceModel, PytanniaModel} from "@/models/Pytannia.model.ts";

const counterInSetup = ref<number>(33);
const pytanniaList = ref<PytanniaModel[]>([]);
const message = ref("Питання?!");
const counterInDataBlock = reactive({ count: 0 });
const expandedItems = ref<Record<string, boolean>>({});

const incrementButtonInSetupAction = () => {
    counterInSetup.value++;
}

const incrementButtonAction = () => {
    counterInDataBlock.count++;
}

const expandItem = (innerId: string) => {
    expandedItems.value[innerId] = !expandedItems.value[innerId];
};

const getDPList = (item: PytanniaModel) => {
    let result: string[] = [];
    if (!item.DPList) {
        return "Nothing";
    }

    item.DPList.map((deputy: DeputyVoiceModel, orderNumber: number) => {
        result.push(`${orderNumber + 1}] ${deputy.DPName}: ${deputy.DPGolos}`);
    });

    return result.join(";\n");
};

onMounted(() => {
    fetch('http://localhost:2222/pytannia')
        .then(res => res.json())
        .then(data => {
            pytanniaList.value = data || {};
            console.log("fetch got data = ", pytanniaList.value); // tmp
        })
        .catch(err => message.value = err.message);
});
</script>

<style scoped lang="scss">
.data-block {
    position: relative;
    padding: 2rem 1.5rem;
    color: brown;
    font-size: larger;
    background-color: orange;

    &__list {
        position: relative;
        list-style: none;
        padding: 0;
    }

    &__item {
        position: relative;
        cursor: pointer;
        margin: 1rem 0.5rem;
        padding: 0.5rem 1rem;
        border: 3px dotted darkred;
        background-color: gold;
        border-radius: 2px;
        transition: all 400ms ease-out;

        &:hover {
            cursor: pointer;
            border-style: dashed;
        }

        &_expanded {
            border-style: solid;
            background-color: PaleGoldenrod;
            z-index: 2;
        }
    }
}
</style>
