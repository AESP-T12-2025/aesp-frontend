import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AIFeedback {
    feedback_id: number;
    session_id: number;
    grammar_score: number;
    fluency_score: number;
    pronunciation_score: number;
    vocabulary_score: number;
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    detailed_feedback: string;
}

export interface AIAnalysisRequest {
    session_id: number;
    transcript: string;
    audio_url?: string;
    scenario_context?: string;
}

export interface AIAnalysisResponse {
    feedback_id: number;
    scores: {
        grammar: number;
        fluency: number;
        pronunciation: number;
        vocabulary: number;
        overall: number;
    };
    feedback: {
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
        detailed: string;
    };
}

export interface AISuggestion {
    type: 'vocabulary' | 'grammar' | 'pronunciation' | 'topic';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    resources?: string[];
}

export interface TopicSuggestion {
    topic_id: number;
    title: string;
    description: string;
    difficulty_level: string;
    relevance_score: number;
    reason: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatRequest {
    messages: ChatMessage[];
    context?: string;
}

export interface ChatResponse {
    response: string;
    suggestions?: string[];
}

export interface TTSRequest {
    text: string;
    voice?: string;
    speed?: number;
}

export interface TTSResponse {
    audio_url: string;
    duration?: number;
}

export interface STTRequest {
    audio_data: string | Blob;
    language?: string;
}

export interface STTResponse {
    transcript: string;
    confidence?: number;
}

// ============================================================================
// AI SERVICE
// ============================================================================

export const aiService = {
    // ========================================================================
    // AI CHAT ASSISTANT (NEW)
    // ========================================================================

    /**
     * Chat with AI assistant
     * Get help with grammar, vocabulary, or general questions
     */
    chat: async (data: ChatRequest): Promise<ChatResponse> => {
        const res = await api.post('/ai/chat', data);
        return res.data;
    },

    // ========================================================================
    // TEXT-TO-SPEECH (NEW)
    // ========================================================================

    /**
     * Convert text to speech
     * Generate audio from text for pronunciation practice
     */
    textToSpeech: async (data: TTSRequest): Promise<TTSResponse> => {
        const res = await api.post('/ai/tts', data);
        return res.data;
    },

    // ========================================================================
    // SPEECH-TO-TEXT (NEW)
    // ========================================================================

    /**
     * Convert speech to text
     * Transcribe audio for analysis
     */
    speechToText: async (data: STTRequest): Promise<STTResponse> => {
        const res = await api.post('/ai/stt', data);
        return res.data;
    },

    // ========================================================================
    // SPEECH ANALYSIS
    // ========================================================================

    /**
     * Analyze speech session using AI
     * Returns comprehensive feedback on grammar, fluency, pronunciation
     */
    analyzeSpeech: async (data: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
        const res = await api.post('/ai/analyze', data);
        return res.data;
    },

    /**
     * Get AI feedback for a specific session
     */
    getSessionFeedback: async (sessionId: number): Promise<AIFeedback> => {
        const res = await api.get(`/ai/feedback/${sessionId}`);
        return res.data;
    },

    /**
     * Get detailed AI feedback with breakdown
     */
    getDetailedFeedback: async (feedbackId: number) => {
        const res = await api.get(`/ai/feedback/detailed/${feedbackId}`);
        return res.data;
    },

    // ========================================================================
    // AI SUGGESTIONS & RECOMMENDATIONS
    // ========================================================================

    /**
     * Get personalized learning suggestions based on progress
     */
    getPersonalizedSuggestions: async (): Promise<AISuggestion[]> => {
        const res = await api.get('/ai/suggestions');
        return res.data;
    },

    /**
     * Get AI-powered topic recommendations
     */
    getTopicRecommendations: async (): Promise<TopicSuggestion[]> => {
        const res = await api.post('/ai/recommend-topics');
        return res.data;
    },

    /**
     * Get vocabulary suggestions based on weak areas
     */
    getVocabularySuggestions: async () => {
        const res = await api.get('/ai/vocabulary-suggestions');
        return res.data;
    },

    /**
     * Get pronunciation tips for specific words
     */
    getPronunciationTips: async (word: string) => {
        const res = await api.post('/ai/pronunciation-tips', { word });
        return res.data;
    },

    /**
     * Get grammar correction suggestions
     */
    getGrammarCorrections: async (text: string) => {
        const res = await api.post('/ai/grammar-check', { text });
        return res.data;
    },

    // ========================================================================
    // AI LEARNING PATH
    // ========================================================================

    /**
     * Generate AI-powered learning path
     */
    generateLearningPath: async (preferences?: {
        focus_areas?: string[];
        difficulty_level?: string;
        time_commitment?: number;
    }) => {
        const res = await api.post('/ai/learning-path', preferences || {});
        return res.data;
    },

    /**
     * Get next recommended lesson
     */
    getNextLesson: async () => {
        const res = await api.get('/ai/next-lesson');
        return res.data;
    },

    // ========================================================================
    // AI-POWERED PRACTICE
    // ========================================================================

    /**
     * Generate practice questions based on weak areas
     */
    generatePracticeQuestions: async (topic?: string, difficulty?: string) => {
        const params: any = {};
        if (topic) params.topic = topic;
        if (difficulty) params.difficulty = difficulty;

        const res = await api.post('/ai/generate-practice', null, { params });
        return res.data;
    },

    /**
     * Evaluate practice response
     */
    evaluatePracticeResponse: async (questionId: number, response: string) => {
        const res = await api.post('/ai/evaluate-response', {
            question_id: questionId,
            response
        });
        return res.data;
    }
};
