<template>
  <div>
    <div class="container">
      <h1>Loredraft - Lorcana Draft Simulator</h1>
      <PackDisplay @cardSelected="selectCard" />
      <div v-if="cardStore.playerPacks.length > 0 && cardStore.playerPacks[0][0] && cardStore.playerPacks[0][0].length > 0">
        <h3>AI Tracker</h3>
        <!-- a simple counter to show how many cards are in each AI's current pack -->
        <h4>You: {{ cardStore.playerPacks[0][0].length }} cards in this pack, {{ cardStore.playerPacks[0].length }} packs left
          <small v-for="p in cardStore.playerPacks[0]" v-if="cardStore.playerPacks[0].length > 0">
            ({{ p.length }})
          </small>
        </h4>
      </div>
      <div v-if="cardStore.playerPacks.length > 0 && cardStore.playerPacks[0][0] && cardStore.playerPacks[0][0].length > 0">
        <h4 v-for="ai in (cardStore.podSize-1)" :key="ai">
          <span>AI {{ ai }}: {{ cardStore.playerPacks[ai][0].length }} cards in this pack, {{ cardStore.playerPacks[ai].length }} packs left </span>
          <small v-for="p in cardStore.playerPacks[ai]" v-if="cardStore.playerPacks[ai].length > 0">
            ({{ p.length }})
          </small>
        </h4>
      </div> 
    </div>
    <div class="container">
      <DraftPool />
    </div>
    <footer class="footer mt-auto py-3 bg-light">
      <div class="container">
        <span class="text-muted">Created by Hayk Saakian </span>
        <span class="text-muted">
          <a href="https://twitter.com/hayksaakian">@hayksaakian</a>
        </span>
        <span class="text-muted"> DM Me or @ me for suggestions</span>
        <span class="text-muted float-end"><a href="https://lorcania.com/">Card Database Sourced from Lorcania</a></span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import PackDisplay from '~/components/PackDisplay.vue';
import DraftPool from '~/components/DraftPool.vue';

import type { Card } from '~/types/card'; // Import the interface
import { useCardStore } from '~/stores/cardStore';

const cardStore = useCardStore();

// This will be run once when the component is mounted
onMounted(async () => {
  await cardStore.fetchCards();
  console.log('Fetched Cards', cardStore.cards.length);
  cardStore.buildAllPacks();
  // Build all packs after fetching cards
});

const selectCard = (card:any) => {
  console.log('Selected Card, Adding to Draft Pool', card.name);
  cardStore.addToDraftPool(card);
  cardStore.passPack();
}

</script>
