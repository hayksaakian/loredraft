<template>
  <div>
    <h2>Draft Pool</h2>
    <h3>{{ store.draftPool.length }} Cards ({{ store.draftPool.filter(c => c.inkwell).length }} inkable)</h3>
    <div class="draft-pool">
      <div v-for="cost in 6" :key="cost" class="draft-column">
        <h3>{{ getCardsByCost(cost).length }} at Cost {{ cost }}</h3>
        <div v-for="card in getCardsByCost(cost)" :key="card.id">
          <CardDisplay :card="card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardDisplay from './CardDisplay.vue';
import { useCardStore } from '~/stores/cardStore';
import type { Card } from '~/types/card';

const store = useCardStore();

const getCardsByCost = (cost: number): Card[] => {
  // Ensure that the return value is typed as an array of Cards
  return store.draftPool.filter((card) => card.cost === cost || (cost === 6 && card.cost >= cost));
};
</script>

<style scoped>
.draft-pool {
  display: flex;
  justify-content: space-between;
}

.draft-column {
  flex: 1;
  /* Add padding, margins, and other styles as needed */
}
</style>
