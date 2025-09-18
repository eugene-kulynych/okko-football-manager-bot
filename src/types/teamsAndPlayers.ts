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

export type PlayerLevel = "GC" | "CORE" | "OK" | "R";

export type Player = {
    userId: number;
    username: string;
    fullName?: string;
    optionIds?: number[];
};

export type UpdatedPlayer = {
    userId: string;
    username: string;
    nickname: string;
    firstName: string;
    lastName: string;
    tier: PlayerLevel;
};

export const tierScoreMap: Record<PlayerLevel, number> = {
    GC: 5,
    CORE: 3,
    OK: 2,
    R: 0.5,
};

export type DivideOptions = {
    maxPlayersPerTeam: number;
    numTeams: number;
};

export type Team = {
    players: UpdatedPlayer[];
    totalScore: number;
};
