import {DivideOptions, UpdatedPlayer, Team, tierScoreMap} from "../types/teamsAndPlayers";

export const divideIntoTeams = (
    players: UpdatedPlayer[],
    options: DivideOptions
): Team[] => {
    const {numTeams, maxPlayersPerTeam} = options;

    // Shuffle to randomize distribution
    const shuffled = [...players].sort(() => Math.random() - 0.5);

    // Assign score to each player
    const scoredPlayers = shuffled.map((p) => ({
        ...p,
        score: tierScoreMap[p.tier],
    }));

    // Sort from strongest to weakest
    scoredPlayers.sort((a, b) => b.score - a.score);

    // Init teams
    const teams: Team[] = Array.from({length: numTeams}, () => ({
        players: [],
        totalScore: 0,
    }));

    // Distribute like in UEFA pots (snake draft)
    scoredPlayers.forEach((player, index) => {
        const round = Math.floor(index / numTeams);
        const pos = index % numTeams;
        const teamIndex = round % 2 === 0 ? pos : numTeams - 1 - pos;

        teams[teamIndex].players.push(player);
        teams[teamIndex].totalScore += player.score;
    });

    // If any team exceeds maxPlayersPerTeam, move extra to teams with space
    let changed = true;
    while (changed) {
        changed = false;
        for (const team of teams) {
            if (team.players.length > maxPlayersPerTeam) {
                const extraPlayer = team.players.pop()!;
                team.totalScore -= tierScoreMap[extraPlayer.tier];

                // Find team with least players
                const targetTeam = teams
                    .filter((t) => t.players.length < maxPlayersPerTeam)
                    .sort((a, b) => a.players.length - b.players.length || a.totalScore - b.totalScore)[0];

                if (targetTeam) {
                    targetTeam.players.push(extraPlayer);
                    targetTeam.totalScore += tierScoreMap[extraPlayer.tier];
                    changed = true;
                } else {
                    // No place to move — reinsert player
                    team.players.push(extraPlayer);
                    team.totalScore += tierScoreMap[extraPlayer.tier];
                }
            }
        }
    }

    return teams;
};
