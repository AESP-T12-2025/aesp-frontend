import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface VocabularyItem {
    id: number;
    word: string;
    definition: string;
    example?: string;
    created_at?: string;
}

export interface PersonalVocabCreate {
    word: string;
    definition: string;
    example?: string;
}

export interface QuizQuestion {
    question_id: number;
    type: string;
    question: string;
    word: string;
    options: string[];
    correct_answer: string;
}

export interface QuizAnswer {
    question_id: number;
    selected_answer: string;
}

export interface QuizSubmission {
    answers: QuizAnswer[];
}

export interface QuizResult {
    score: number;
    correct_count: number;
    total_questions: number;
    percentage: number;
}

// ============================================================================
// VOCABULARY SERVICE (Issue #36)
// ============================================================================

export const vocabularyService = {
    // ========================================================================
    // SCENARIO VOCABULARY
    // ========================================================================

    /**
     * Get vocabulary for a specific scenario
     * Returns scenario-specific vocabulary list
     */
    getScenarioVocabulary: async (scenarioId: number): Promise<VocabularyItem[]> => {
        const res = await api.get(`/vocabulary/scenario/${scenarioId}`);
        return res.data;
    },

    /**
     * Get all vocabulary items
     * Optional difficulty filter
     */
    getAllVocabulary: async (difficulty?: string, skip: number = 0, limit: number = 50): Promise<VocabularyItem[]> => {
        const res = await api.get('/vocabulary', {
            params: { difficulty, skip, limit }
        });
        return res.data;
    },

    // ========================================================================
    // PERSONAL COLLECTION
    // ========================================================================

    /**
     * Get learner's personal vocabulary collection
     * User's saved vocabulary words
     */
    getPersonalCollection: async (): Promise<VocabularyItem[]> => {
        const res = await api.get('/vocabulary/personal');
        return res.data;
    },

    /**
     * Add vocabulary to personal collection
     * Save a word with definition and example
     */
    addToPersonalCollection: async (data: PersonalVocabCreate): Promise<VocabularyItem & { message: string }> => {
        const res = await api.post('/vocabulary/personal', data);
        return res.data;
    },

    /**
     * Remove vocabulary from personal collection
     * Delete specific saved word
     */
    removeFromPersonalCollection: async (vocabId: number): Promise<{ message: string }> => {
        const res = await api.delete(`/vocabulary/personal/${vocabId}`);
        return res.data;
    },

    // ========================================================================
    // VOCABULARY QUIZ
    // ========================================================================

    /**
     * Get vocabulary quiz questions
     * Generates quiz from user's personal collection
     * @param count - Number of questions (default: 10)
     */
    getQuizQuestions: async (count: number = 10): Promise<QuizQuestion[]> => {
        const res = await api.get('/vocabulary/quiz', {
            params: { count }
        });
        return res.data;
    },

    /**
     * Submit quiz answers and get results
     * Returns score and statistics
     */
    submitQuiz: async (submission: QuizSubmission): Promise<QuizResult> => {
        const res = await api.post('/vocabulary/quiz/submit', submission);
        return res.data;
    },

    // ========================================================================
    // SEARCH
    // ========================================================================

    /**
     * Search vocabulary by keyword
     * Searches in word and definition
     */
    searchVocabulary: async (query: string): Promise<VocabularyItem[]> => {
        const res = await api.get('/vocabulary/search', {
            params: { q: query }
        });
        return res.data;
    }
};
