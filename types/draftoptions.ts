// Define the interface for the draft options
export enum CardSet {
  Promos = 1,
  TheFirstChapter = 2,
  RiseOfTheFloodBorn = 3,
}

export interface DraftOptions {
    card_set: CardSet;
    pod_size: number;
    packs_per_player: number;
}

export const defaultDraftOptions: DraftOptions = {
  card_set: CardSet.RiseOfTheFloodBorn,
  packs_per_player: 4,
  pod_size: 8,
};

