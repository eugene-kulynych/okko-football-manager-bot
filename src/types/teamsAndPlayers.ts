export type PollStorage = {
  [pollId: string]: {
    question: string;
    answers: PollAnswers;
  };
};

export type PollAnswers = {
  userId: number;
  username: string;
  fullName: string;
  optionIds: number[];
}[];

type PlayerRole = "GK" | "Field";

export type Player = {
  userId: string;
  username: string;
  nickname: string;
  firstName: string;
  lastName: string;
  rating: number;
  role?: PlayerRole;
};

type FinalPlayer = Player & {
  role: PlayerRole;
};

export type TeamV2 = {
  players: FinalPlayer[];
  totalRating: number;
  avgRating: number;
};
