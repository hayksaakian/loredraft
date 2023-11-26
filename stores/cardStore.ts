// ~/stores/cardStore.ts
import { defineStore } from 'pinia';

import type { CardStoreState, Card } from '~/types/card'; // Import the interface
import { CardSet, type DraftOptions, defaultDraftOptions } from '~/types/draftoptions';

const RARITIES = {
  Rare: 1, // 1 in every pack
  SuperRare: 0.5, // 1 in 2 packs
  Legendary: 0.2, // 1 in 5 packs
  Enchanted: 1 / 72, // 1 in 72 packs
};


export const useCardStore = defineStore('cardStore', {
  state: (): CardStoreState => ({
    playerPacks: [] as Card[][][],
    cards: [],
    pack: [],
    draftPool: [],
    cuts: [],
    draft_options: defaultDraftOptions,
  }),
  actions: {
    async fetchCards() {
      const response = await fetch('/cards/all.json');
      if (response.ok) {
        const data: Card[] = await response.json();
        // Cast the response data to the Card[] type
        // Future: only fetch the set you need
        // for now there's only 2 sets so this is fine.
        this.cards = data;
      } else {
        console.error(`Failed to fetch cards: ${response.status}`);
        // Handle any errors here
      }
    },

    restartDraft(options: DraftOptions = defaultDraftOptions) {
      // we assume cards are already loaded at this point
      this.playerPacks = [] as Card[][][];
      this.draftPool = [];
      this.cuts = [];
      this.pack = [];
      this.draft_options = options;
      this.buildAllPacks(options);
    },

    buildAllPacks(options: DraftOptions = defaultDraftOptions) {
      console.log(`Building packs for ${options.pod_size} players, ${options.packs_per_player} packs per player`)
      // iterate on the podSize
      for (let i = 0; i < options.pod_size; i++) {
        // create an array of packs for each player
        const _playerPacks: Card[][] = [];
        // iterate on the packsPerPlayer
        for (let j = 0; j < options.packs_per_player; j++) {
          // add a pack to the playerPacks array
          _playerPacks.push(this.buildPack(options.card_set));
        }
        // add the playerPacks array to the all_packs array
        console.log(`Before: Player ${i} has ${this.playerPacks.length} packs`)
        this.playerPacks.push(_playerPacks);
        console.log(`After: Player ${i} has ${this.playerPacks.length} packs`)
      }
      // set the current pack to the first pack of the first player
      this.pack = this.playerPacks[0][0];
    },

    buildPack(selectedSet: CardSet = CardSet.RiseOfTheFloodBorn): Card[] {
      // array of Card objects
      const newPack: Card[] = [];

      const setCards = this.cards.filter(card => card.card_set_id === selectedSet);
      console.log(`Building Pack from Set Named ${CardSet[selectedSet]}#${selectedSet} with ${setCards.length} cards`)

      const commonCards = setCards.filter(card => card.rarity === 'common');
      const uncommonCards = setCards.filter(card => card.rarity === 'uncommon');
      const rareCards = setCards.filter(card => card.rarity === 'rare');
      const superRareCards = setCards.filter(card => card.rarity === 'super_rare');
      const legendaryCards = setCards.filter(card => card.rarity === 'legendary');
      const enchantedCards = setCards.filter(card => card.rarity === 'enchanted');
      // log how many cards are in each rarity
      console.log(`${commonCards.length} commons`);
      console.log(`${uncommonCards.length} uncommons`);
      console.log(`${rareCards.length} rares`);
      console.log(`${superRareCards.length} super rares`);
      console.log(`${legendaryCards.length} legendaries`);
      console.log(`${enchantedCards.length} enchanted`);

      // Add 6 guaranteed commons, one from each color
      for (let color = 1; color <= 6; color++) {
        const colorCards = commonCards.filter(card => card.color === color);
        newPack.push(colorCards[Math.floor(Math.random() * colorCards.length)]);
      }

      // Add 3 random uncommons
      for (let i = 0; i < 3; i++) {
        newPack.push(uncommonCards[Math.floor(Math.random() * uncommonCards.length)]);
      }

      // Add 1 guaranteed rare
      newPack.push(rareCards[Math.floor(Math.random() * rareCards.length)]);

      // Add 1 card that can be rare, super rare, or legendary
      const randomRareType = Math.random();
      if (randomRareType < RARITIES.Legendary) {
        newPack.push(legendaryCards[Math.floor(Math.random() * legendaryCards.length)]);
      } else if (randomRareType < RARITIES.SuperRare) {
        newPack.push(superRareCards[Math.floor(Math.random() * superRareCards.length)]);
      } else {
        newPack.push(rareCards[Math.floor(Math.random() * rareCards.length)]);
      }

      // explicitly mark all the cards added so far as .foil = false
      for (const card of newPack) {
        card.foil = false;
      }

      // Add 1 foil slot, which can include any rarity, including enchanted
      const foilCardType = Math.random();
      let foilCardPool = [];
      if (foilCardType < RARITIES.Enchanted) {
        console.log(`Enchanted foil card pool ${enchantedCards.length} cards`);
        foilCardPool = enchantedCards;
      } else if (foilCardType < RARITIES.Legendary) {
        console.log(`Legendary foil card pool ${legendaryCards.length} cards`);
        foilCardPool = legendaryCards;
      } else if (foilCardType < RARITIES.SuperRare) {
        console.log(`Super rare foil card pool ${superRareCards.length} cards`);
        foilCardPool = superRareCards;
      } else {
        // This only considers commons, uncommons, and rares
        // because the if/else if statements above will catch the other rarities
        console.log("Normal foil card pool");
        foilCardPool = [...commonCards, ...uncommonCards, ...rareCards];
        console.log(`Normal foil card pool ${foilCardPool.length} cards`);
      }
      if (foilCardPool.length === 0) {
        throw new Error('Foil card pool is empty. This should not happen.');
      }

      // Select a random card from the foilCardPool array
      const randomIndex = Math.floor(Math.random() * foilCardPool.length);
      const selectedCard = foilCardPool[randomIndex];

      // Create a copy of the selected card
      const foilCard = { ...selectedCard };

      // Set the foil property of the copied card to true
      foilCard.foil = true;

      // Add the copied card to the newPack array
      newPack.push(foilCard);
      newPack.reverse();
      // console.log('Foil card selected:', foilCard);
      // Log the current list of cards by name
      console.log(`${newPack.length} Cards in pack`);
      console.log(newPack.map(card => card.name));

      return newPack;
    },

    // generatePack() {
    //   if (setCards.length == 0) {
    //     return
    //   }
    //   // refers to the currently "displayed" pack
    //   // this.pack = [];
    //   this.pack = this.buildPack();
    // },

    addToDraftPool(card: Card) {
      this.draftPool.push(card);
      console.log(`Before filtering: ${this.pack.map(c => c.name)}`);
      const cardIndex = this.pack.indexOf(card);
      if (cardIndex !== -1) {
        this.pack.splice(cardIndex, 1);
      }
      console.log(`After filtering: ${this.pack.map(c => c.name)}`);
    },

    cutCard(card: Card) {
      // add to cuts
      this.cuts.push(card);
      // remove from pool
      console.log(`Before cutting ${card.name} from draftPool: ${this.draftPool.map(c => c.name)}`);
      const cardIndex = this.draftPool.indexOf(card);
      if (cardIndex !== -1) {
        this.draftPool.splice(cardIndex, 1);
      }
      console.log(`After cutting ${card.name} from draftPool: ${this.draftPool.map(c => c.name)}`);
    },

    reAddCard(card: Card) {
      // add to draft pool
      this.draftPool.push(card);
      // remove from cuts
      console.log(`Before re-adding ${card.name} to draftPool: ${this.draftPool.map(c => c.name)}`);
      const cardIndex = this.cuts.indexOf(card);
      if (cardIndex !== -1) {
        this.cuts.splice(cardIndex, 1);
      }
      console.log(`After re-adding ${card.name} to draftPool: ${this.draftPool.map(c => c.name)}`);
    },

    passPack() {
      const podSize = this.draft_options.pod_size || defaultDraftOptions.pod_size; // Number of players
      // assuming this is run after the player (0) has picked their pack
      // pick the first card from each pack for each AI and remove it from the pack
      // do not add it to the Player's draft pool
      for (let i = 1; i < this.playerPacks.length; i++) {
        const aiPack = this.playerPacks[i][0];
        const aiCard = aiPack[0];
        // .shift Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.
        aiPack.shift();
        console.log(`AI # ${i} picked card ${aiCard.name} ${aiCard.title}, a ${aiCard.rarity}
        ${aiPack.length} cards: ${aiPack.map(card => card.name).join(', ')} remaining in pack
        `);
      }
      
      // Open the next pack if there are no cards left in the current pack
      // Rotate the packs, if there are still cards left in the current pack
      if(this.playerPacks[0][0].length == 0){
        console.log("No more cards in the current pack");
        for (let currentPlayerID = 0; currentPlayerID < this.playerPacks.length; currentPlayerID++) {
          // remove the first, now empty, pack from each player's packs
          this.playerPacks[currentPlayerID].shift();
          console.log(`Player ${currentPlayerID} has ${this.playerPacks[currentPlayerID].length} packs left`)
        }
      } else {
        // assuming the current pack isn't empty, rotate the packs
        // Define the type for nextPlayerPacks
        const nextPlayerPacks: Card[][][] = new Array(podSize).fill(null).map(() => []);

        console.log(`Rotating packs for ${podSize} players in the pod`);
        for (let currentPlayerID = 0; currentPlayerID < podSize; currentPlayerID++) {
          if (currentPlayerID >= this.playerPacks.length) {
            console.error(`Current player ID ${currentPlayerID} is out of bounds. Player packs length: ${this.playerPacks.length}, pod size: ${podSize}`);
            continue;
          }
          const nextPlayerIndex = (currentPlayerID + 1) % podSize;
          console.log(`Moving pack from player ${currentPlayerID} to player ${nextPlayerIndex}`);
          // Ensure currentPack is properly typed
          const currentPack: Card[] | undefined = this.playerPacks[currentPlayerID].shift();
  
          if (currentPack) {
            console.log(`Moving currentPack of ${currentPack.length} cards from player ${currentPlayerID} to player ${nextPlayerIndex}`);
            // test: trying unshift here instead of push
            nextPlayerPacks[nextPlayerIndex].unshift(currentPack);
          } else {
            console.log(`No more packs for player ${currentPlayerID}`);
          }
  
          if (this.playerPacks[currentPlayerID]) {
              nextPlayerPacks[currentPlayerID].push(...this.playerPacks[currentPlayerID]);
          } else {
            console.error(`No pack array found for player ${currentPlayerID}`);
          }
        }
  
        // assign the new arrangement to the 'live' playerPacks array
        console.log(`${nextPlayerPacks.length} player packs after rotation`)
        this.playerPacks = nextPlayerPacks;
      }

      // set the current pack to the first pack of the first player
      // if the first player has no packs left, set the current pack to an empty array
      if (this.playerPacks[0] && this.playerPacks[0].length > 0) {
        this.pack = this.playerPacks[0][0];
      } else {
        console.log("End of the draft round");
        this.pack = [];
      }
    }
  },
});
