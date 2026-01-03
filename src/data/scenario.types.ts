// src/data/scenario.types.ts

export interface Topic {
  id: number;
  name: string;
  image: string;
}

export interface Category {
  id: number;
  title: string;
  topics: Topic[];
}

export type ScenarioStatus = 'active' | 'draft' | 'archived';

export interface Scenario {
  id: string;
  name: string;
  topicId: number; 
  status: ScenarioStatus;
  updatedAt: string;
}

