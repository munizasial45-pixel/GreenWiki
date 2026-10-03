export type PlantCategory = 
  | 'Indoor' 
  | 'Outdoor' 
  | 'Flowers' 
  | 'Vegetables' 
  | 'Herbs' 
  | 'Succulents' 
  | 'Fruit Trees';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging';
export type GrowthSpeed = 'Slow' | 'Moderate' | 'Fast';

export interface PlantSeason {
  bestMonths: number[]; // 1 = Jan, 12 = Dec
  bloomOrHarvest: string;
  notes: string;
}

export interface PlantWatering {
  summer: string;
  winter: string;
  method: string;
  overwaterSigns: string;
  underwaterSigns: string;
}

export interface PlantLight {
  type: string;
  hoursPerDay: string;
  notes: string;
}

export interface PlantSoil {
  type: string;
  phRange: string;
  drainage: string;
  mix: string;
}

export interface PlantEnvironment {
  tempRange: string;
  humidity: string;
  location: string;
  climateZones: string[];
  frostTolerance: string;
}

export interface PlantCare {
  fertilizer: string;
  pruning: string;
  repotting: string;
}

export interface PlantProblem {
  issue: string;
  cause: string;
  fix: string;
}

export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  family?: string;
  category: PlantCategory;
  description: string;
  imageUrl: string;
  gallery?: string[];
  difficulty: DifficultyLevel;
  growthSpeed: GrowthSpeed;
  petSafe: boolean;
  lifespan?: string;
  season: PlantSeason;
  watering: PlantWatering;
  light: PlantLight;
  soil: PlantSoil;
  environment: PlantEnvironment;
  care: PlantCare;
  problems: PlantProblem[];
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  difficulty: string;
  lightLevel: string;
  waterNeed: string;
  soilType: string;
  location: string;
  petSafeOnly: boolean;
  bestMonth?: number;
  climateZone?: string;
  sortBy: 'name-asc' | 'name-desc' | 'difficulty-asc' | 'growth-asc';
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    iconName?: string;
    value: string;
  }[];
}

export interface QuizAnswers {
  location?: string;
  light?: string;
  wateringTime?: string;
  petSafe?: string;
  purpose?: string;
}

export interface QuizResultMatch {
  plant: Plant;
  score: number;
  matchReasons: string[];
}
