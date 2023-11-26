<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div class="container-lg"> <!-- Use 'container-lg' to align with the body's content -->
        <a class="navbar-brand" href="#">Loredraft - Lorcana Draft Simulator</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <!-- Other navbar items if needed -->
          </ul>
          <form class="d-flex">
            <!-- Align set-selector to the right -->
            <select class="form-select me-2" v-model="set">
              <option :value=CardSet.RiseOfTheFloodBorn>Rise of the Floodborn</option>
              <option :value=CardSet.TheFirstChapter>The First Chapter</option>
            </select>
            <button class="btn btn-success btn-sm" type="submit" @click.prevent="restartDraft">Restart&nbsp;Draft</button>
          </form>
        </div>
      </div>
    </nav>
    <div class="container mt-5 pt-3">
      <PackDisplay @cardSelected="selectCard" />
      <div v-if="cardStore.playerPacks.length > 0 && cardStore.playerPacks[0][0] && cardStore.playerPacks[0][0].length > 0">
        <div>
          <h3>AI Tracker</h3>
          <!-- a simple counter to show how many cards are in each AI's current pack -->
          <h4>You: {{ cardStore.playerPacks[0][0].length }} cards in this pack, {{ cardStore.playerPacks[0].length }} packs left
            <small v-for="p in cardStore.playerPacks[0]" v-if="cardStore.playerPacks[0].length > 0">
              ({{ p.length }})
            </small>
          </h4>
        </div>
        <div v-if="cardStore.playerPacks.length > 0 && cardStore.playerPacks[0][0] && cardStore.playerPacks[0][0].length > 0">
          <h4 v-for="ai in (cardStore.draft_options.pod_size-1)" :key="ai">
            <span>AI {{ ai }}: {{ cardStore.playerPacks[ai][0].length }} cards in this pack, {{ cardStore.playerPacks[ai].length }} packs left </span>
            <small v-for="p in cardStore.playerPacks[ai]" v-if="cardStore.playerPacks[ai].length > 0">
              ({{ p.length }})
            </small>
          </h4>
        </div>
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
import { CardSet, defaultDraftOptions } from '~/types/draftoptions'; // Import the interface
import { useCardStore } from '~/stores/cardStore';

const cardStore = useCardStore();

const set = ref(CardSet.TheFirstChapter)
const podSize = ref(defaultDraftOptions.pod_size)
const packsPerPlayer = ref(defaultDraftOptions.packs_per_player)

// This will be run once when the component is mounted
onMounted(async () => {
  await cardStore.fetchCards();
  console.log('Fetched Cards', cardStore.cards.length);
  // build a 'default' draft to have something to do right away
  restartDraft();
  // Build all packs after fetching cards
});

const selectCard = (card:any) => {
  console.log('Selected Card, Adding to Draft Pool', card.name);
  cardStore.addToDraftPool(card);
  cardStore.passPack();
}

const restartDraft = () => {
  console.log('Restarting New Draft');
  const options = {
    card_set: set.value, 
    pod_size: podSize.value, 
    packs_per_player: packsPerPlayer.value 
  };
  cardStore.restartDraft(options);
}

</script>
