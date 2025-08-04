import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Question, 
  Answer, 
  Solution, 
  WidgetConfig, 
  WidgetState,
  MockApiResponse 
} from '@/types/widget'

export const useWidgetStore = defineStore('widget', () => {
  // State
  const currentStep = ref<WidgetState['currentStep']>('problem')
  const problemDescription = ref('')
  const currentQuestions = ref<Question[]>([])
  const answers = ref<Answer[]>([])
  const currentSolution = ref<Solution | null>(null)
  const feedback = ref<WidgetState['feedback']>({ helpful: null })
  const displayMode = ref<'sequential' | 'batch'>('sequential')
  const isOpen = ref(false)

  // Configuration
  const config = ref<WidgetConfig>({
    primaryColor: '#9333ea',
    secondaryColor: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    logoUrl: '/placeholder.svg',
    maxQuestionsBeforeSolution: 3
  })

  // Computed
  const answeredQuestions = computed(() => {
    return currentQuestions.value.filter(q => 
      answers.value.some(a => a.questionId === q.id)
    )
  })

  const unansweredQuestions = computed(() => {
    return currentQuestions.value.filter(q => 
      !answers.value.some(a => a.questionId === q.id)
    )
  })

  const canShowSolution = computed(() => {
    return answers.value.length >= config.value.maxQuestionsBeforeSolution
  })

  const currentQuestionIndex = computed(() => {
    if (displayMode.value === 'sequential') {
      return unansweredQuestions.value.length > 0 ? 0 : -1
    }
    return -1
  })

  // Actions
  const setProblemDescription = (description: string) => {
    problemDescription.value = description
  }

  const setCurrentQuestions = (questions: Question[]) => {
    currentQuestions.value = questions
  }

  const addAnswer = (answer: Answer) => {
    const existingIndex = answers.value.findIndex(a => a.questionId === answer.questionId)
    if (existingIndex >= 0) {
      answers.value[existingIndex] = answer
    } else {
      answers.value.push(answer)
    }
  }

  const updateAnswer = (questionId: string, value: string | number, label?: string) => {
    addAnswer({
      questionId,
      value,
      label,
      timestamp: new Date()
    })
  }

  const removeAnswer = (questionId: string) => {
    answers.value = answers.value.filter(a => a.questionId !== questionId)
  }

  const setCurrentSolution = (solution: Solution | null) => {
    currentSolution.value = solution
  }

  const setFeedback = (newFeedback: Partial<WidgetState['feedback']>) => {
    feedback.value = { ...feedback.value, ...newFeedback }
  }

  const setCurrentStep = (step: WidgetState['currentStep']) => {
    currentStep.value = step
  }

  const setDisplayMode = (mode: 'sequential' | 'batch') => {
    displayMode.value = mode
  }

  const updateConfig = (newConfig: Partial<WidgetConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  const reset = () => {
    currentStep.value = 'problem'
    problemDescription.value = ''
    currentQuestions.value = []
    answers.value = []
    currentSolution.value = null
    feedback.value = { helpful: null }
  }

  const toggleOpen = () => {
    isOpen.value = !isOpen.value
  }

  // Mock API functions
  const fetchNextQuestions = async (): Promise<MockApiResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock questions based on problem description
    const mockQuestions: Question[] = [
      {
        id: 'device-type',
        type: 'text-choices',
        title: 'What type of device are you having issues with?',
        required: true,
        options: [
          { id: 'computer', label: 'Computer' },
          { id: 'mobile', label: 'Mobile Device' },
          { id: 'tablet', label: 'Tablet' },
          { id: 'other', label: 'Other Device' }
        ]
      },
      {
        id: 'issue-type',
        type: 'text-choices',
        title: 'What type of issue are you experiencing?',
        required: true,
        options: [
          { id: 'hardware', label: 'Hardware Issues' },
          { id: 'software', label: 'Software Issues' },
          { id: 'network', label: 'Network Issues' },
          { id: 'performance', label: 'Performance Issues' }
        ]
      },
      {
        id: 'urgency',
        type: 'text-choices',
        title: 'How urgent is this issue?',
        required: true,
        options: [
          { id: 'low', label: 'Low - Minor inconvenience' },
          { id: 'medium', label: 'Medium - Affects daily work' },
          { id: 'high', label: 'High - Significantly impacted' },
          { id: 'critical', label: 'Critical - Cannot work' }
        ]
      },
      {
        id: 'additional-info',
        type: 'free-text',
        title: 'Any additional information that might help?',
        required: false
      },
      {
        id: 'budget',
        type: 'numeric',
        title: 'What is your budget for a solution (if applicable)?',
        required: false,
        validation: {
          min: 0,
          max: 10000
        }
      }
    ]

    const solutionReady = answers.value.length >= 2
    let solution: Solution | undefined

    if (solutionReady) {
      solution = {
        id: 'solution-1',
        title: 'Recommended Solution',
        description: 'Based on your description and the information provided, we recommend:',
        steps: [
          '**Document the issue** - Note when it occurs and any error messages',
          '**Check for updates** - Ensure all software is current',
          '**Restart your device** - This resolves many common issues',
          '**Contact support** - Given the high priority, consider professional help'
        ],
        priority: 'high'
      }
    }

    return {
      questions: mockQuestions,
      solutionReady,
      solution
    }
  }

  const saveAnswer = async (answer: Answer): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    addAnswer(answer)
  }

  const saveFeedback = async (feedbackData: WidgetState['feedback']): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    setFeedback(feedbackData)
    console.log('Feedback saved:', feedbackData)
  }

  return {
    // State
    currentStep,
    problemDescription,
    currentQuestions,
    answers,
    currentSolution,
    feedback,
    displayMode,
    isOpen,
    config,

    // Computed
    answeredQuestions,
    unansweredQuestions,
    canShowSolution,
    currentQuestionIndex,

    // Actions
    setProblemDescription,
    setCurrentQuestions,
    addAnswer,
    updateAnswer,
    removeAnswer,
    setCurrentSolution,
    setFeedback,
    setCurrentStep,
    setDisplayMode,
    updateConfig,
    reset,
    toggleOpen,

    // API
    fetchNextQuestions,
    saveAnswer,
    saveFeedback
  }
}) 