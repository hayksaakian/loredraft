// Define the interface for the draft options
export enum CardSet {
  Promos = 1,
  TheFirstChapter = 2,
  RiseOfTheFloodBorn = 3,
}

export interface DraftOptions {
    card_set?: CardSet;
  }
