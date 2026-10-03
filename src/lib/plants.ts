import rawPlants from '../../data/plants.json';
import { Plant, FilterOptions, QuizAnswers, QuizResultMatch } from '../types/plant';

export const plants: Plant[] = rawPlants as Plant[];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function getAllPlants(): Plant[] {
  return plants;
}

export function getPlantById(id: string): Plant | undefined {
  return plants.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function getFeaturedPlants(limit = 6): Plant[] {
  // Select a diverse mix of popular, iconic plants
  const featuredIds = ['aloe-vera', 'snake-plant', 'tomato', 'marigold', 'monstera-deliciosa', 'lemon'];
  const featured = plants.filter((p) => featuredIds.includes(p.id));
  if (featured.length < limit) {
    const remaining = plants.filter((p) => !featuredIds.includes(p.id));
    return [...featured, ...remaining.slice(0, limit - featured.length)];
  }
  return featured.slice(0, limit);
}

export function getPlantsForMonth(month: number): Plant[] {
  // month is 1-12
  return plants.filter((p) => p.season.bestMonths.includes(month));
}

export function getRelatedPlants(currentPlant: Plant, limit = 4): Plant[] {
  return plants
    .filter((p) => p.id !== currentPlant.id)
    .sort((a, b) => {
      // Prioritize same category, then difficulty, then light type
      let scoreA = 0;
      let scoreB = 0;
      if (a.category === currentPlant.category) scoreA += 3;
      if (b.category === currentPlant.category) scoreB += 3;
      if (a.difficulty === currentPlant.difficulty) scoreA += 1;
      if (b.difficulty === currentPlant.difficulty) scoreB += 1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function getLightScore(plant: Plant): number {
  const type = plant.light.type.toLowerCase();
  if (type.includes('full') || type.includes('blazing') || type.includes('direct sun')) {
    return 4;
  }
  if (type.includes('bright indirect') || type.includes('6+') || type.includes('5-7')) {
    return 3;
  }
  if (type.includes('medium') || type.includes('partial') || type.includes('morning sun')) {
    return 2;
  }
  return 1; // Low light
}

export function getLightLabel(score: number): string {
  switch (score) {
    case 4: return 'Full Direct Sun (6-8+ hrs)';
    case 3: return 'Bright Indirect Light (5-7 hrs)';
    case 2: return 'Medium / Partial Shade (3-5 hrs)';
    case 1: return 'Low / Filtered Light (2-4 hrs)';
    default: return 'Moderate Light';
  }
}

export function getWaterNeedCategory(plant: Plant): 'Low' | 'Moderate' | 'High' {
  const summer = plant.watering.summer.toLowerCase();
  if (summer.includes('daily') || summer.includes('every 1-2 days')) {
    return 'High';
  }
  if (summer.includes('every 2-3 weeks') || summer.includes('every 7-10 days') || summer.includes('soak and dry')) {
    return 'Low';
  }
  return 'Moderate';
}

export function filterPlants(allPlants: Plant[], filters: Partial<FilterOptions>): Plant[] {
  let result = [...allPlants];

  // Search query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.commonName.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.family && p.family.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Category
  if (filters.category && filters.category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  // Difficulty
  if (filters.difficulty && filters.difficulty !== 'All') {
    result = result.filter((p) => p.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
  }

  // Light Level
  if (filters.lightLevel && filters.lightLevel !== 'All') {
    const targetScore = parseInt(filters.lightLevel, 10);
    if (!isNaN(targetScore)) {
      result = result.filter((p) => getLightScore(p) === targetScore);
    }
  }

  // Water need
  if (filters.waterNeed && filters.waterNeed !== 'All') {
    result = result.filter((p) => getWaterNeedCategory(p) === filters.waterNeed);
  }

  // Location (Indoor / Outdoor)
  if (filters.location && filters.location !== 'All') {
    const loc = filters.location.toLowerCase();
    result = result.filter((p) => p.environment.location.toLowerCase().includes(loc));
  }

  // Pet Safe only
  if (filters.petSafeOnly) {
    result = result.filter((p) => p.petSafe === true);
  }

  // Best Month
  if (filters.bestMonth && filters.bestMonth > 0) {
    result = result.filter((p) => p.season.bestMonths.includes(filters.bestMonth!));
  }

  // Climate Zone
  if (filters.climateZone && filters.climateZone !== 'All') {
    const cz = filters.climateZone.toLowerCase();
    result = result.filter((p) => 
      p.environment.climateZones.some((z) => z.toLowerCase().includes(cz))
    );
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.commonName.localeCompare(b.commonName));
        break;
      case 'name-desc':
        result.sort((a, b) => b.commonName.localeCompare(a.commonName));
        break;
      case 'difficulty-asc':
        const order: Record<string, number> = { Easy: 1, Moderate: 2, Challenging: 3 };
        result.sort((a, b) => (order[a.difficulty] || 2) - (order[b.difficulty] || 2));
        break;
      case 'growth-asc':
        const growthOrder: Record<string, number> = { Fast: 1, Moderate: 2, Slow: 3 };
        result.sort((a, b) => (growthOrder[a.growthSpeed] || 2) - (growthOrder[b.growthSpeed] || 2));
        break;
      default:
        break;
    }
  }

  return result;
}

export function calculateQuizMatches(answers: QuizAnswers): QuizResultMatch[] {
  const matches: QuizResultMatch[] = [];

  for (const plant of plants) {
    let score = 0;
    const reasons: string[] = [];

    // Location
    if (answers.location) {
      const loc = plant.environment.location.toLowerCase();
      if (answers.location === 'indoor' && loc.includes('indoor')) {
        score += 25;
        reasons.push('Thrives comfortably in indoor room conditions');
      } else if (answers.location === 'outdoor-balcony' && (loc.includes('outdoor') || loc.includes('balcony') || loc.includes('container'))) {
        score += 25;
        reasons.push('Ideal for patio planters and balcony pots');
      } else if (answers.location === 'outdoor-garden' && loc.includes('outdoor')) {
        score += 25;
        reasons.push('Excellent choice for outdoor garden beds & borders');
      }
    }

    // Light
    if (answers.light) {
      const plantScore = getLightScore(plant);
      if (answers.light === 'full-sun' && plantScore >= 3) {
        score += 25;
        reasons.push('Loves the bright, sunny rays in your space');
      } else if (answers.light === 'medium' && (plantScore === 2 || plantScore === 3)) {
        score += 25;
        reasons.push('Well-suited for moderate, indirect window light');
      } else if (answers.light === 'low' && plantScore <= 2) {
        score += 25;
        reasons.push('Tolerates low and dim lighting gracefully');
      }
    }

    // Watering routine / care time
    if (answers.wateringTime) {
      const waterNeed = getWaterNeedCategory(plant);
      if (answers.wateringTime === 'busy' && (waterNeed === 'Low' || plant.difficulty === 'Easy')) {
        score += 25;
        reasons.push('Forgiving of busy schedules and infrequent watering');
      } else if (answers.wateringTime === 'regular' && (waterNeed === 'Moderate' || waterNeed === 'Low')) {
        score += 25;
        reasons.push('Fits a predictable weekly plant care routine');
      } else if (answers.wateringTime === 'daily' && (waterNeed === 'High' || plant.category === 'Vegetables' || plant.category === 'Herbs')) {
        score += 25;
        reasons.push('Thrives under attentive daily garden attention');
      }
    }

    // Pet safety
    if (answers.petSafe === 'must-be-safe') {
      if (plant.petSafe) {
        score += 25;
        reasons.push('100% non-toxic & safe for cats and dogs');
      } else {
        // Disqualify or heavily penalize if pet safe was required!
        score -= 50;
      }
    } else {
      score += 15;
    }

    // Purpose / Goal
    if (answers.purpose) {
      if (answers.purpose === 'edible' && (plant.category === 'Herbs' || plant.category === 'Vegetables' || plant.category === 'Fruit Trees')) {
        score += 20;
        reasons.push('Provides fresh culinary harvests for home cooking');
      } else if (answers.purpose === 'flowers' && plant.category === 'Flowers') {
        score += 20;
        reasons.push('Produces magnificent, colorful seasonal blooms');
      } else if (answers.purpose === 'air-purifying' && (plant.id === 'snake-plant' || plant.id === 'money-plant' || plant.id === 'peace-lily' || plant.id === 'aloe-vera')) {
        score += 20;
        reasons.push('Natural NASA-grade indoor air purifier');
      } else if (answers.purpose === 'easy' && plant.difficulty === 'Easy') {
        score += 20;
        reasons.push('Beginner-friendly with minimal maintenance required');
      }
    }

    if (score >= 40) {
      matches.push({
        plant,
        score: Math.min(100, Math.max(0, score)),
        matchReasons: reasons.slice(0, 3),
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, 6);
}
