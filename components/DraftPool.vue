<template>
  <div>
    <h2>Draft Pool: {{ store.draftPool.length+store.cuts.length }} Cards ({{ store.draftPool.filter(c => c.inkwell).length+ store.cuts.filter(c => c.inkwell).length }} inkable)</h2>
    <h3>Deck: {{ store.draftPool.length }} Cards ({{ store.draftPool.filter(c => c.inkwell).length }} inkable)</h3>
    <div class="draft-pool">
      <div v-for="cost in 6" :key="cost" class="draft-column">
        <h3>{{ getCardsByCost(cost).length }} at Cost {{ cost }}{{ cost == 6 ? '+' : '' }}</h3>
        <div v-for="card in getCardsByCost(cost)" :key="card.id">
          <CardDisplay :card="card" @click="cut(card)"  />
        </div>
      </div>
    </div>
    <h3>Cuts: {{ store.cuts.length }} Cuts ({{ store.cuts.filter(c => c.inkwell).length }} inkable)</h3>
    <div class="draft-pool">
      <div v-for="cost in 6" :key="cost" class="draft-column">
        <h3>{{ getCutsByCost(cost).length }} at Cost {{ cost }}{{ cost == 6 ? '+':'' }}</h3>
        <div v-for="card in getCutsByCost(cost)" :key="card.id">
          <CardDisplay :card="card" @click="reAdd(card)" />
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

const getCutsByCost = (cost: number): Card[] => {
  // Ensure that the return value is typed as an array of Cards
  return store.cuts.filter((card) => card.cost === cost || (cost === 6 && card.cost >= cost));
};

const cut = (card: Card) => {
  console.log('Cutting Card', card.name);
  store.cutCard(card);
};

const reAdd = (card: Card) => {
  console.log('Re-Adding Card', card.name);
  store.reAddCard(card);
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
