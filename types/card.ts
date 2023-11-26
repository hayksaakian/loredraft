// Define an interface for the card prices from different markets
export interface CardPrices {
  tcgplayer: {
    type: string;
    normal_low: string;
    normal_market: string;
    foil_low: string;
    foil_market: string;
    normal_url: string;
    foil_url: string;
  };
  cardmarket: {
    type: string;
    normal_low: string;
    normal_market: string;
    foil_low: string;
    foil_market: string;
    normal_url: string;
    foil_url: string;
  };
}

// Define the main card interface
export interface Card {
  foil?: boolean;
  // pre-defined in JSON
  id: number;
  name: string;
  title: string | null;
  cost: number;
  inkwell: number;
  attack: number | null;
  defence: number | null;
  color: number;
  type: string;
  action: string;
  flavour: string;
  separator: string;
  stars: number;
  illustrator: string;
  card_set_id: number;
  language: string;
  number: number;
  pack: string;
  rarity: string;
  image: string;
  blurhash: string;
  franchise_id: number;
  final: number;
  spoiler: number;
  created_at: string;
  updated_at: string;
  traits: string[];
  prices: CardPrices;
}

// Define the interface for the store state
export interface CardStoreState {
  cards: Card[];
  pack: Card[];
  playerPacks: Card[][][];
  draftPool: Card[];
  cuts: Card[];
  podSize: number;
  packsPerPlayer: number;
}
