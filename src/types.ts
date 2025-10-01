export type Attrs = {
  didatica: number;
  carisma: number;
  rigor: number;
  prazos: number;
  humor: number;
};

export type Card = {
  id: string;
  teacher: string;
  nickname?: string;
  image: string;
  attributes: Attrs;
  notes?: string;
};

export type ArenaState = {
  round: string;
  attribute: keyof Attrs;
  deckA: string;
  deckB: string;
  playerAName?: string;
  playerBName?: string;
};

export type Winner = {
  round: string;
  winner: string;
  loser: string;
  attribute: keyof Attrs;
  diff: number;
  playerAName?: string;
  playerBName?: string;
  winnerName?: string;
};
