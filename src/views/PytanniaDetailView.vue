<template>
    <div class="pytannia-detail">
        <nav class="breadcrumbs" aria-label="breadcrumb">
            <RouterLink to="/" class="breadcrumbs__item">Головна</RouterLink>
            <span class="breadcrumbs__separator">/</span>
            <span class="breadcrumbs__item breadcrumbs__item--active">Питання {{ pytanniaId }}</span>
        </nav>

        <div v-if="pytannia" class="detail-content">
            <header class="detail-header">
                <h1 class="detail-title">{{ pytannia.GL_Text || 'Без тексту' }}</h1>
                <div class="detail-meta">
                    <div class="meta-item">
                        <span class="meta-label">Дата документу:</span>
                        <span class="meta-value">{{ formatDate(pytannia.DocTime) }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Час голосування:</span>
                        <span class="meta-value">{{ formatDate(pytannia.GLTime) }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Тип голосування:</span>
                        <span class="meta-value">{{ pytannia.GLType }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Сесія:</span>
                        <span class="meta-value">{{ pytannia.SName }}</span>
                    </div>
                </div>
            </header>

            <section class="voting-stats">
                <h2>Результати голосування</h2>
                <div class="stats-container">
                    <div class="stats-chart">
                        <!-- Тут буде діаграма -->
                    </div>
                    <div class="stats-summary">
                        <div class="stats-card stats-card--za">
                            <div class="stats-number">{{ voteStats.za }}</div>
                            <div class="stats-label">За</div>
                            <div class="stats-percentage">{{ calculatePercentage(voteStats.za) }}%</div>
                        </div>
                        <div class="stats-card stats-card--proty">
                            <div class="stats-number">{{ voteStats.proty }}</div>
                            <div class="stats-label">Проти</div>
                            <div class="stats-percentage">{{ calculatePercentage(voteStats.proty) }}%</div>
                        </div>
                        <div class="stats-card stats-card--utr">
                            <div class="stats-number">{{ voteStats.utr }}</div>
                            <div class="stats-label">Утримались</div>
                            <div class="stats-percentage">{{ calculatePercentage(voteStats.utr) }}%</div>
                        </div>
                        <div class="stats-card stats-card--ng">
                            <div class="stats-number">{{ voteStats.ng }}</div>
                            <div class="stats-label">Не голосували</div>
                            <div class="stats-percentage">{{ calculatePercentage(voteStats.ng) }}%</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="voting-details">
                <h2>Поіменне голосування</h2>
                <div class="voting-tabs">
                    <button 
                        v-for="tab in votingTabs" 
                        :key="tab.id"
                        :class="['tab-button', { active: activeTab === tab.id }]"
                        @click="activeTab = tab.id"
                    >
                        {{ tab.label }} ({{ getVotesByType(tab.id).length }})
                    </button>
                </div>
                <div class="voting-table">
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Депутат</th>
                                <th>Голос</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(deputy, index) in getVotesByType(activeTab)" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ deputy.DPName }}</td>
                                <td :class="'vote-' + getVoteClass(deputy.DPGolos)">
                                    {{ deputy.DPGolos }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
        <div v-else class="loading-state">
            Завантаження...
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePytanniaStore } from '@/stores/pytannia';
import type { PytanniaModel, DeputyVoiceModel } from '@/models/Pytannia.model';

const route = useRoute();
const pytanniaId = route.params.id as string;
const pytanniaStore = usePytanniaStore();

const pytannia = computed(() => pytanniaStore.getPytanniaById(pytanniaId));
const activeTab = ref('all');

const votingTabs = [
    { id: 'all', label: 'Всі' },
    { id: 'za', label: 'За' },
    { id: 'proty', label: 'Проти' },
    { id: 'utr', label: 'Утримались' },
    { id: 'ng', label: 'Не голосували' }
];

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

const voteStats = computed(() => {
    const stats = {
        za: 0,
        proty: 0,
        utr: 0,
        ng: 0
    };
    
    if (!pytannia.value?.DPList?.length) return stats;
    
    pytannia.value.DPList.forEach(deputy => {
        if (!deputy.DPGolos) return;
        const vote = deputy.DPGolos.trim().toLowerCase();
        if (vote === 'за') stats.za++;
        else if (vote === 'проти') stats.proty++;
        else if (vote === 'утримався') stats.utr++;
        else if (vote === 'не голосував') stats.ng++;
    });
    
    return stats;
});

const calculatePercentage = (count: number) => {
    const total = voteStats.value.za + voteStats.value.proty + 
                 voteStats.value.utr + voteStats.value.ng;
    return total ? Math.round((count / total) * 100) : 0;
};

const getVotesByType = (type: string) => {
    if (!pytannia.value?.DPList) return [];
    
    return pytannia.value.DPList.filter(deputy => {
        if (type === 'all') return true;
        const voteClass = getVoteClass(deputy.DPGolos);
        return voteClass === type;
    });
};

onMounted(async () => {
    await pytanniaStore.fetchPytanniaById(pytanniaId);
});
</script>

<style scoped lang="scss">
.pytannia-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;

    @media (min-width: 768px) {
        padding: 2rem;
    }
}

.breadcrumbs {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    font-size: 0.9rem;

    &__item {
        color: #666;
        text-decoration: none;

        &:hover {
            color: #333;
        }

        &--active {
            color: #333;
            font-weight: 500;
        }
    }

    &__separator {
        margin: 0 0.5rem;
        color: #999;
    }
}

.detail-header {
    margin-bottom: 3rem;
}

.detail-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;

    @media (min-width: 768px) {
        font-size: 2rem;
    }
}

.detail-meta {
    display: grid;
    gap: 1rem;
    
    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
    }
}

.meta-item {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;

    .meta-label {
        display: block;
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 0.25rem;
    }

    .meta-value {
        font-size: 1rem;
        color: #333;
        font-weight: 500;
    }
}

.voting-stats {
    margin-bottom: 3rem;

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: #333;
    }
}

.stats-summary {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
    
    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
    }
}

.stats-card {
    padding: 1.5rem;
    border-radius: 8px;
    color: white;
    text-align: center;

    .stats-number {
        font-size: 2rem;
        font-weight: bold;
        line-height: 1;
    }

    .stats-label {
        margin: 0.5rem 0;
        font-size: 1rem;
    }

    .stats-percentage {
        font-size: 1.25rem;
        font-weight: 500;
    }

    &--za { background-color: #4CAF50; }
    &--proty { background-color: #f44336; }
    &--utr { background-color: #ff9800; }
    &--ng { background-color: #9e9e9e; }
}

.voting-details {
    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: #333;
    }
}

.voting-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    .tab-button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background: #f5f5f5;
        }

        &.active {
            background: #333;
            color: white;
            border-color: #333;
        }
    }
}

.voting-table {
    overflow-x: auto;

    table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        th {
            background: #f5f5f5;
            font-weight: 500;
        }

        .vote-za { color: #2e7d32; }
        .vote-proty { color: #c62828; }
        .vote-utr { color: #ef6c00; }
        .vote-ng { color: #616161; }
    }
}

.loading-state {
    text-align: center;
    padding: 3rem;
    color: #666;
}
</style> 