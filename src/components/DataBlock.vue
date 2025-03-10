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
                :key="item.innerId"
            >
                <div class="data-block__item-header" @click="expandItem(item.innerId)">
                    <b>{{ item.innerId }}</b>: {{ item.GL_Text || 'Без тексту' }}
                </div>

                <div class="data-block__item-preview" v-if="expandedItems[item.innerId]">
                    <div class="preview-content">
                        <div class="pytannia-block">
                            <div class="pytannia-block__header">
                                <div class="pytannia-block__meta">
                                    <p><strong>Дата документу:</strong> {{ formatDate(item.DocTime) }}</p>
                                    <p><strong>Час голосування:</strong> {{ formatDate(item.GLTime) }}</p>
                                    <p><strong>Тип голосування:</strong> {{ item.GLType }}</p>
                                    <p><strong>Сесія:</strong> {{ item.SName }}</p>
                                    <p v-if="item.PD_Fullname"><strong>Повна назва:</strong> {{ item.PD_Fullname }}</p>
                                    <p v-if="item.GL_ResultType"><strong>Тип результату:</strong> {{ item.GL_ResultType }}</p>
                                    <p v-if="item.RESULT"><strong>Результат:</strong> {{ item.RESULT }}</p>
                                </div>
                                <div class="pytannia-block__stats">
                                    <h4>Статистика голосування:</h4>
                                    <div class="pytannia-block__stats-grid">
                                        <div class="stats-item stats-item--za">
                                            <span class="count">{{ getVoteStats(item.DPList).za }}</span>
                                            <span class="label">За</span>
                                        </div>
                                        <div class="stats-item stats-item--proty">
                                            <span class="count">{{ getVoteStats(item.DPList).proty }}</span>
                                            <span class="label">Проти</span>
                                        </div>
                                        <div class="stats-item stats-item--utr">
                                            <span class="count">{{ getVoteStats(item.DPList).utr }}</span>
                                            <span class="label">Утримались</span>
                                        </div>
                                        <div class="stats-item stats-item--ng">
                                            <span class="count">{{ getVoteStats(item.DPList).ng }}</span>
                                            <span class="label">Не голосували</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pytannia-block__votes">
                                <h4>Результати поіменного голосування:</h4>
                                <div class="votes-grid">
                                    <div v-for="(deputy, index) in filterValidVotes(item.DPList)" 
                                         :key="index"
                                         :class="['vote-item', `vote-item--${getVoteClass(deputy.DPGolos)}`]">
                                        <span class="deputy-name">{{ deputy.DPName }}</span>
                                        <span class="vote-result">{{ deputy.DPGolos.trim() }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="preview-actions">
                        <RouterLink 
                            :to="{ name: 'pytannia-detail', params: { id: item.innerId }}"
                            class="detail-link"
                        >
                            Детальніше →
                        </RouterLink>
                    </div>
                </div>
            </li>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { usePytanniaStore } from "@/stores/pytannia";
import type {DeputyVoiceModel, PytanniaModel} from "@/models/Pytannia.model.ts";

const counterInSetup = ref<number>(33);
const message = ref("Питання?!");
const counterInDataBlock = reactive({ count: 0 });

const pytanniaStore = usePytanniaStore();
const pytanniaList = computed(() => pytanniaStore.items);
const expandedItems = computed(() => pytanniaStore.expandedItems);

const incrementButtonInSetupAction = () => {
    counterInSetup.value++;
}

const incrementButtonAction = () => {
    counterInDataBlock.count++;
}

const expandItem = (innerId: string) => {
    pytanniaStore.toggleExpanded(innerId);
}

const getDPList = (item: PytanniaModel) => {
    let result: string[] = [];
    if (!item.DPList?.length) {
        return "Немає даних про голосування";
    }

    item.DPList.map((deputy: DeputyVoiceModel, orderNumber: number) => {
        result.push(`${orderNumber + 1}] ${deputy.DPName}: ${deputy.DPGolos}`);
    });

    return result.join(";\n");
};

const formatDate = (dateStr: string) => {
    if (!dateStr?.trim()) return 'Дата не вказана';
    try {
        const date = new Date(dateStr.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
        return new Intl.DateTimeFormat('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (e) {
        return 'Некоректний формат дати';
    }
};

const getVoteClass = (vote: string) => {
    if (!vote?.trim()) return 'invalid';
    const voteStr = vote.trim().toLowerCase();
    if (voteStr === 'за') return 'za';
    if (voteStr === 'проти') return 'proty';
    if (voteStr === 'утримався') return 'utr';
    if (voteStr === 'не голосував') return 'ng';
    return 'invalid';
};

const filterValidVotes = (deputies: DeputyVoiceModel[]) => {
    if (!deputies?.length) return [];
    return deputies.filter(d => 
        d.DPName && 
        d.DPName !== '. .. ..' && 
        d.DPGolos && 
        d.DPGolos !== '.........'
    );
};

const getVoteStats = (deputies: DeputyVoiceModel[]) => {
    const stats = {
        za: 0,
        proty: 0,
        utr: 0,
        ng: 0
    };
    
    if (!deputies?.length) return stats;
    
    deputies.forEach(deputy => {
        if (!deputy.DPGolos) return;
        const vote = deputy.DPGolos.trim().toLowerCase();
        if (vote === 'за') stats.za++;
        else if (vote === 'проти') stats.proty++;
        else if (vote === 'утримався') stats.utr++;
        else if (vote === 'не голосував') stats.ng++;
    });
    
    return stats;
};

onMounted(() => {
    pytanniaStore.fetchPytannia();
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

        &-header {
            cursor: pointer;
            padding: 0.5rem 0;

            &:hover {
                opacity: 0.8;
            }
        }

        &-preview {
            margin-top: 1rem;
        }
    }
}

.pytannia-block {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &__header {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 1.5rem;

        @media (min-width: 768px) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
    }

    &__meta {
        p {
            margin: 0.5rem 0;
            color: #666;
            font-size: 0.9rem;
        }
    }

    &__stats {
        h4 {
            margin: 0 0 1rem;
            color: #333;
            font-size: 1.1rem;

            @media (max-width: 374px) {
                font-size: 1rem;
                margin-bottom: 0.75rem;
            }
        }
    }

    &__stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;

        @media (min-width: 480px) {
            grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 374px) {
            gap: 0.5rem;
        }
    }

    .stats-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem 0.5rem;
        border-radius: 6px;
        color: #fff;
        min-width: 80px;

        @media (min-width: 480px) {
            padding: 1rem;
        }

        @media (max-width: 374px) {
            padding: 0.5rem;
            min-width: 70px;
        }

        .count {
            font-size: 1.25rem;
            font-weight: bold;

            @media (min-width: 480px) {
                font-size: 1.5rem;
            }

            @media (max-width: 374px) {
                font-size: 1.1rem;
            }
        }

        .label {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            text-align: center;

            @media (min-width: 480px) {
                font-size: 0.8rem;
                margin-top: 0.5rem;
            }

            @media (max-width: 374px) {
                font-size: 0.7rem;
            }
        }

        &--za { background-color: #4CAF50; }
        &--proty { background-color: #f44336; }
        &--utr { background-color: #ff9800; }
        &--ng { background-color: #9e9e9e; }
    }

    &__votes {
        h4 {
            margin: 1rem 0;
            color: #333;
            font-size: 1.1rem;

            @media (max-width: 374px) {
                font-size: 1rem;
            }
        }
    }

    .votes-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;

        @media (min-width: 480px) {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
        }

        @media (max-width: 374px) {
            gap: 0.5rem;
        }
    }

    .vote-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;

        @media (min-width: 480px) {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }

        @media (max-width: 374px) {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
        }

        .deputy-name {
            font-weight: 500;
            margin-right: 0.5rem;
        }

        .vote-result {
            font-weight: bold;
            white-space: nowrap;
        }

        &--za { 
            background-color: rgba(76, 175, 80, 0.1);
            color: #2e7d32;
        }
        &--proty { 
            background-color: rgba(244, 67, 54, 0.1);
            color: #c62828;
        }
        &--utr { 
            background-color: rgba(255, 152, 0, 0.1);
            color: #ef6c00;
        }
        &--ng { 
            background-color: rgba(158, 158, 158, 0.1);
            color: #616161;
        }
    }
}

.preview-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-link {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #333;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: background-color 0.2s;

    &:hover {
        background-color: #555;
    }
}
</style>
