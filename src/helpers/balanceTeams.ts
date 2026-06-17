import { TeamV2, Player } from "../types/teamsAndPlayers";

/**
 * Функція для балансування команд
 * @param {Array} keepers - Масив воротарів { name: string, rating: number }
 * @param {Array} players - Масив польових { name: string, rating: number }
 * @param {number} numTeams - Кількість команд
 */

/**
 * Балансування команд за СЕРЕДНІМ рейтингом
 */
export function balanceTeamsByAverage(
    keepers: Player[],
    players: Player[],
    numTeams: number,
    iterations = 5000,
): { teams: TeamV2[]; imbalance: string } {
  const totalPlayers = keepers.length + players.length;

  // Рахуємо цільову кількість гравців для кожної команди
  const baseSize = Math.floor(totalPlayers / numTeams);
  const extras = totalPlayers % numTeams;
  // Наприклад: 23 гравці, 3 команди → [8, 8, 7]
  const targetSizes = Array.from({ length: numTeams }, (_, i) =>
      i < extras ? baseSize + 1 : baseSize,
  );

  let bestDist = Infinity;
  let bestTeams = null;

  for (let i = 0; i < iterations; i++) {
    let currentTeams = Array.from({ length: numTeams }, (_, i) => ({
      players: [] as Player[],
      totalRating: 0,
      avgRating: 0,
      targetSize: targetSizes[i],
    }));

    // 1. Розподіл воротарів — перемішуємо і по одному на команду
    let shuffledKeepers = [...keepers].sort(() => Math.random() - 0.5);
    shuffledKeepers.forEach((keeper, index) => {
      let teamIdx = index % numTeams;
      currentTeams[teamIdx].players.push({ ...keeper, role: "GK" });
      currentTeams[teamIdx].totalRating += keeper.rating;
    });

    // 2. Розподіл польових з врахуванням targetSize
    let shuffledField = [...players].sort(() => Math.random() - 0.5);

    for (const player of shuffledField) {
      // Знаходимо команду, якій ще потрібні гравці і яка найменш заповнена
      const eligibleTeams = currentTeams.filter(
          (t) => t.players.length < t.targetSize,
      );
      eligibleTeams.sort((a, b) => a.players.length - b.players.length);
      eligibleTeams[0].players.push({ ...player, role: "Field" });
      eligibleTeams[0].totalRating += player.rating;
    }

    // 3. Середній рейтинг
    currentTeams.forEach((team) => {
      team.avgRating = team.totalRating / team.players.length;
    });

    // 4. Дисбаланс
    const averages = currentTeams.map((t) => t.avgRating);
    const diff = Math.max(...averages) - Math.min(...averages);

    if (diff < bestDist) {
      bestDist = diff;
      bestTeams = JSON.parse(JSON.stringify(currentTeams));
    }

    if (diff === 0) break;
  }

  return { teams: bestTeams, imbalance: bestDist.toFixed(3) };
}
