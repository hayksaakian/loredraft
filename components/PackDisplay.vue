<template>
  <div v-if="pack.length > 0">
    <h2>Pack of {{ pack.length }} Cards</h2>
  </div>
  <div class="pack">
    <div v-for="card in pack" :key="card.id" class="pack-card" @click="selectCard(card)">
      <CardDisplay :card="card" />
    </div>
  </div>
</template>

<script setup>
import CardDisplay from './CardDisplay.vue';
import { useCardStore } from '~/stores/cardStore';

const store = useCardStore();
const pack = computed(() => store.pack);
const emit = defineEmits(['cardSelected']);

const selectCard = (card) => {
  console.log('Selected Card, Emmitting Event', card.name);
  emit('cardSelected', card);
};
</script>


<style scoped>
.pack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.pack-card {
  flex: 0 1 calc(50% - 1rem);
  /* 2 cards per row on small screens */
}

@media (min-width: 768px) {

  /* Medium devices (tablets, 768px and up) */
  .pack-card {
    flex: 0 1 calc(33.333% - 1rem);
    /* 3 cards per row */
  }
}

@media (min-width: 992px) {

  /* Large devices (desktops, 992px and up) */
  .pack-card {
    flex: 0 1 calc(16.666% - 1rem);
    /* 6 cards per row */
  }
}

</style>

