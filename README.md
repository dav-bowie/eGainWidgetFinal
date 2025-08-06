# eGain AI Guidance Widget

A responsive AI-powered guidance widget designed to provide intelligent customer support and problem-solving assistance. This widget can be embedded on any website and features an admin panel for customization.

## Overview

This project implements a comprehensive guidance system that walks users through problem description, question answering, and solution delivery. The widget is built with Vue 3, TypeScript, and Pinia for state management.

## Core Features

### User Experience Flow
1. **Problem Description**: Users describe their issue using free text or quick option buttons
2. **Question System**: Multiple question types gather detailed information
3. **Answer Management**: Users can review and edit previous answers
4. **Solution Delivery**: AI-powered solutions based on user responses
5. **Feedback Collection**: Rating system for solution effectiveness

### Question Types Supported
- **Text Choices**: Multiple choice questions with text options
- **Image Choices**: Multiple choice questions with image options  
- **Free Text**: Open-ended text input for detailed responses
- **Numeric**: Number input with validation

### Admin Panel
- **Password Protection**: Access with `admin123`
- **Color Customization**: Primary and secondary color pickers
- **Typography Control**: Font family selection and size adjustment
- **Logo Management**: Upload, preview, and remove logos
- **Real-time Preview**: Changes apply immediately

## Technical Implementation

### Architecture
- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia store for widget state
- **Styling**: CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds
- **TypeScript**: Full type safety throughout the application

### Component Structure
```
src/
├── components/
│   ├── GuidanceWidget.vue          # Main widget container
│   └── steps/
│       ├── ProblemDescriptionStep.vue
│       ├── QuestionsStep.vue
│       ├── QuestionComponent.vue
│       ├── SolutionStep.vue
│       └── FeedbackStep.vue
├── stores/
│   └── widget.ts                   # State management
├── types/
│   └── widget.ts                   # TypeScript definitions
└── views/
    └── HomeView.vue                # Demo page
```

### Key Design Decisions

#### Responsive Design
- **Mobile First**: Widget adapts to screen size with breakpoints at 768px and 1024px
- **Touch Friendly**: Proper touch targets and gesture support
- **Flexible Layout**: CSS Grid and Flexbox for adaptive layouts

#### Positioning System
- **FAB (Floating Action Button)**: Fixed positioning in top-right corner
- **Widget Container**: Draggable when open, returns to top-right when closed
- **Boundary Constraints**: Widget stays within viewport bounds

#### State Management
- **Centralized Store**: All widget state managed in Pinia store
- **Reactive Updates**: Real-time UI updates based on state changes
- **Persistence**: State maintained during widget interactions

## Installation and Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Development Setup
```bash
# Clone the repository
git clone https://github.com/dav-bowie/eGainWidgetFinal.git
cd eGainWidgetFinal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## Configuration

### Basic Implementation
```html
<script src="http://localhost:5173/widget.js"></script>
<script>
  window.initGuidanceWidget({
    primaryColor: '#9333ea',
    secondaryColor: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    logoUrl: '/your-logo.png',
  })
</script>
```

### Configuration Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `primaryColor` | string | `#9333ea` | Main brand color |
| `secondaryColor` | string | `#f1f5f9` | Background color |
| `fontFamily` | string | `Inter, sans-serif` | Font family |
| `fontSize` | string | `16px` | Base font size |
| `logoUrl` | string | `undefined` | Logo URL |
| `maxQuestionsBeforeSolution` | number | `3` | Questions before solution |

## UX Development Process

### Research Phase
- **User Journey Mapping**: Identified key touchpoints in customer support
- **Competitive Analysis**: Studied existing chat widgets and support systems
- **Accessibility Review**: Ensured WCAG compliance for inclusive design

### Design Phase
- **Wireframing**: Created low-fidelity prototypes for user flow
- **Component Design**: Designed reusable UI components
- **Interaction Design**: Defined drag-and-drop behavior and animations

### Development Phase
- **Component Architecture**: Built modular Vue components
- **State Management**: Implemented Pinia store for data flow
- **Responsive Implementation**: Created adaptive layouts for all devices

### Testing Phase
- **Cross-browser Testing**: Verified functionality across Chrome, Firefox, Safari, Edge
- **Device Testing**: Tested on mobile, tablet, and desktop devices
- **Accessibility Testing**: Ensured keyboard navigation and screen reader support

## Technical Considerations

### Performance
- **Lazy Loading**: Components load only when needed
- **Optimized Assets**: Images and fonts optimized for web
- **Minimal Dependencies**: Reduced bundle size for faster loading

### Security
- **Input Validation**: All user inputs validated and sanitized
- **Admin Protection**: Password-protected admin panel
- **No External Tracking**: No third-party analytics or tracking

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## API Integration

The widget includes mock data for demonstration. To integrate with your backend:

1. **Questions API**: Replace `fetchNextQuestions()` in the store
2. **Answer Storage**: Implement `saveAnswer()` for your database
3. **Feedback System**: Connect `saveFeedback()` to your analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For technical support or questions, please create an issue in the repository.
