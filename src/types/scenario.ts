export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó';

export interface Vocabulary {
  word: string;
  meaning: string;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: DifficultyLevel;
  tags: string[];
  vocabulary: Vocabulary[]; 
  suggestions: string[];   
}