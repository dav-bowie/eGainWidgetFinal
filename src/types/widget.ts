export interface Question {
  id: string;
  type: 'text-choices' | 'image-choices' | 'free-text' | 'numeric';
  title: string;
  description?: string;
  options?: QuestionOption[];
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface QuestionOption {
  id: string;
  label: string;
  image?: string;
}

export interface Answer {
  questionId: string;
  value: string | number;
  label?: string;
  timestamp: Date;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface WidgetConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  logoUrl?: string;
  maxQuestionsBeforeSolution: number;
}

export interface WidgetState {
  currentStep: 'problem' | 'questions' | 'review' | 'solution' | 'feedback';
  problemDescription: string;
  currentQuestions: Question[];
  answers: Answer[];
  currentSolution: Solution | null;
  feedback: {
    helpful: boolean | null;
    rating?: number;
    comment?: string;
  };
  displayMode: 'sequential' | 'batch';
}

export interface MockApiResponse {
  questions: Question[];
  solutionReady: boolean;
  solution?: Solution;
} 