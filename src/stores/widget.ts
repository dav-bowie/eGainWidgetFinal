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
  const isOpen = ref(false) // Widget starts closed, showing FAB

  // Configuration
  const config = ref<WidgetConfig>({
    primaryColor: '#9333ea',
    secondaryColor: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    companyName: 'eGain',
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

    // Log config updates for debugging
    console.log('Widget config updated:', config.value)
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

    // Focused company policy/service scenario
    const mockQuestions: Question[] = [
      {
        id: 'service-type',
        type: 'text-choices',
        title: 'What type of service are you inquiring about?',
        required: true,
        options: [
          { id: 'technical-support', label: 'Technical Support' },
          { id: 'billing-inquiry', label: 'Billing Inquiry' },
          { id: 'account-management', label: 'Account Management' },
          { id: 'product-information', label: 'Product Information' }
        ]
      },
      {
        id: 'issue-category',
        type: 'image-choices',
        title: 'Which category best describes your issue?',
        required: true,
        options: [
          { id: 'hardware', label: 'Hardware', image: '/hardware-icon.svg' },
          { id: 'software', label: 'Software', image: '/software-icon.svg' },
          { id: 'network', label: 'Network', image: '/network-icon.svg' },
          { id: 'performance', label: 'Performance', image: '/performance-icon.svg' }
        ]
      },
      {
        id: 'urgency',
        type: 'text-choices',
        title: 'How urgent is this issue?',
        required: true,
        options: [
          { id: 'low', label: 'Low - Can wait a few days' },
          { id: 'medium', label: 'Medium - Need resolution this week' },
          { id: 'high', label: 'High - Need resolution today' },
          { id: 'critical', label: 'Critical - Immediate attention required' }
        ]
      },
      {
        id: 'policy-inquiry',
        type: 'text-choices',
        title: 'Are you asking about a specific company policy?',
        required: true,
        options: [
          { id: 'refund-policy', label: 'Refund Policy' },
          { id: 'warranty-policy', label: 'Warranty Policy' },
          { id: 'support-policy', label: 'Support Policy' },
          { id: 'service-level', label: 'Service Level Agreement' }
        ]
      },
      {
        id: 'additional-info',
        type: 'free-text',
        title: 'Please provide any additional details about your inquiry:',
        required: false
      }
    ]

    const solutionReady = answers.value.length >= 2
    let solution: Solution | undefined

    if (solutionReady) {
      // Generate solution based on answers
      // const serviceType = answers.value.find(a => a.questionId === 'service-type')?.value
      // const issueCategory = answers.value.find(a => a.questionId === 'issue-category')?.value
      const urgency = answers.value.find(a => a.questionId === 'urgency')?.value
      const policyInquiry = answers.value.find(a => a.questionId === 'policy-inquiry')?.value

      let solutionTitle = 'Company Policy Information'
      const solutionDescription = 'Based on your inquiry, here is the relevant information:'
      let solutionSteps: string[] = []
      let priority = 'medium'

      // Customize solution based on service type and policy inquiry
      if (policyInquiry === 'refund-policy') {
        solutionTitle = 'Refund Policy Information'
        solutionSteps = [
          '**30-Day Return Window** - Products can be returned within 30 days of purchase',
          '**Original Packaging** - Item must be in original condition with all packaging',
          '**Proof of Purchase** - Receipt or order confirmation required',
          '**Processing Time** - Refunds processed within 5-7 business days'
        ]
      } else if (policyInquiry === 'warranty-policy') {
        solutionTitle = 'Warranty Policy Information'
        solutionSteps = [
          '**Standard Warranty** - 1-year limited warranty on all products',
          '**Extended Coverage** - Available for purchase up to 3 years',
          '**Coverage Details** - Covers manufacturing defects and hardware failures',
          '**Service Process** - Contact support for warranty claims and repairs'
        ]
      } else if (policyInquiry === 'support-policy') {
        solutionTitle = 'Support Policy Information'
        solutionSteps = [
          '**24/7 Support** - Round-the-clock technical assistance available',
          '**Response Times** - Critical issues: 2 hours, High: 4 hours, Medium: 24 hours',
          '**Support Channels** - Phone, email, chat, and ticket system',
          '**Escalation Process** - Complex issues escalated to senior technicians'
        ]
      } else if (policyInquiry === 'service-level') {
        solutionTitle = 'Service Level Agreement (SLA)'
        solutionSteps = [
          '**Uptime Guarantee** - 99.9% service availability',
          '**Response Commitments** - Based on issue severity and urgency',
          '**Compensation** - Service credits for SLA violations',
          '**Monitoring** - Real-time system monitoring and alerts'
        ]
      }

      // Adjust priority based on urgency
      if (urgency === 'critical') priority = 'critical'
      else if (urgency === 'high') priority = 'high'

      solution = {
        id: 'solution-1',
        title: solutionTitle,
        description: solutionDescription,
        steps: solutionSteps,
        priority: priority as 'low' | 'medium' | 'high'
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
