# 🤖 eGain AI Guidance Widget

A modern, responsive AI-powered guidance widget that can be embedded on any website to provide intelligent customer support and problem-solving assistance.

## ✨ Features

### Core Functionality

- **Problem Description**: Users can describe their issues with free text or quick option buttons
- **Smart Question System**: Multiple question types to gather detailed information
- **Answered Questions Section**: Users can review and edit their previous answers
- **AI-Powered Solutions**: Intelligent solutions based on user responses
- **Feedback Collection**: Comprehensive feedback system with ratings and comments
- **Responsive Design**: Works perfectly on all screen sizes

### Question Types Supported

1. **Text Choices**: Multiple choice questions with text options
2. **Image Choices**: Multiple choice questions with image options
3. **Free Text**: Open-ended text input for detailed responses
4. **Numeric**: Number input with optional min/max validation

### Customization Options

- **Colors**: Customizable primary and secondary colors
- **Fonts**: Configurable font family and size
- **Logo**: Easy logo integration in the top-right corner
- **Branding**: Full white-label support

### Technical Features

- **Embeddable**: Can be embedded on any website
- **Responsive**: Adapts to different screen dimensions
- **Accessible**: WCAG compliant with keyboard navigation
- **Lightweight**: Minimal performance impact
- **Secure**: No external dependencies or tracking

## 🚀 Quick Start

### 1. Basic Implementation

Add this script to your website:

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

### 2. Auto-Initialization

You can also auto-initialize using data attributes:

```html
<script
  src="http://localhost:5173/widget.js"
  data-auto-init="true"
  data-primary-color="#9333ea"
  data-secondary-color="#f1f5f9"
  data-font-family="Inter, sans-serif"
  data-font-size="16px"
  data-logo-url="/your-logo.png"
></script>
```

## ⚙️ Configuration Options

| Option                       | Type   | Default             | Description                                 |
| ---------------------------- | ------ | ------------------- | ------------------------------------------- |
| `primaryColor`               | string | `#9333ea`           | Main brand color for buttons and highlights |
| `secondaryColor`             | string | `#f1f5f9`           | Background color for secondary elements     |
| `fontFamily`                 | string | `Inter, sans-serif` | Font family for all text                    |
| `fontSize`                   | string | `16px`              | Base font size                              |
| `logoUrl`                    | string | `undefined`         | URL to your company logo                    |
| `maxQuestionsBeforeSolution` | number | `3`                 | Questions before showing solution           |

## 📋 Requirements Met

### ✅ Core Requirements

1. **Problem Description**: ✅ Widget asks user for description of the problem
2. **Question System**: ✅ Widget presents questions and records answers
3. **Multiple Question Types**: ✅ Supports text choices, image choices, free text, and numeric
4. **Answered Section**: ✅ All answered questions displayed with edit capability
5. **Solution Delivery**: ✅ System provides solutions after answering questions
6. **Feedback System**: ✅ Users can provide feedback on solution helpfulness
7. **Embeddable**: ✅ Can be embedded on any web page
8. **Customizable**: ✅ Admin can change colors, fonts, and font sizes
9. **Logo Support**: ✅ Features logo in top-right corner, easily changeable
10. **Responsive**: ✅ Fits different screen dimensions

### ✅ Question Types Implemented

- **Text Enumerated Form**: ✅ Show text options, user picks one
- **Image Enumerated Form**: ✅ Show images, user picks one
- **Text Box**: ✅ Freeform text box for typing
- **Numerical Answer**: ✅ Freeform text box that accepts only numbers

### ✅ User Experience Features

- **Minimal Design**: ✅ Clean, step-free interface
- **Easy Interaction**: ✅ Simple, intuitive user flow
- **Answer Editing**: ✅ Click on answered questions to change answers
- **Visual Feedback**: ✅ Clear progress indicators and status
- **Mobile Optimized**: ✅ Touch-friendly interface

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dav-bowie/eGainWidgetFinal.git
cd eGainWidgetFinal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
eGainWidgetFinal/
├── src/
│   ├── components/
│   │   ├── GuidanceWidget.vue          # Main widget component
│   │   └── steps/
│   │       ├── ProblemDescriptionStep.vue
│   │       ├── QuestionsStep.vue
│   │       ├── QuestionComponent.vue
│   │       ├── SolutionStep.vue
│   │       └── FeedbackStep.vue
│   ├── stores/
│   │   └── widget.ts                   # State management
│   ├── types/
│   │   └── widget.ts                   # TypeScript definitions
│   └── views/
│       └── WidgetView.vue              # Widget demo page
├── public/
│   └── widget.js                       # Embed script
├── demo.html                           # Demo page
└── README.md
```

## 🎨 Customization Examples

### Different Color Schemes

```javascript
// Purple theme (default)
{
  primaryColor: '#9333ea',
  secondaryColor: '#f1f5f9'
}

// Blue theme
{
  primaryColor: '#3b82f6',
  secondaryColor: '#eff6ff'
}

// Green theme
{
  primaryColor: '#10b981',
  secondaryColor: '#f0fdf4'
}
```

### Custom Fonts

```javascript
// Google Fonts
{
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px'
}

// System fonts
{
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '16px'
}
```

## 🔧 API Integration

The widget is designed to work with any backend API. The current implementation includes mock data, but you can easily integrate with your own API by modifying the store methods:

- `fetchNextQuestions()`: Fetch questions from your API
- `saveAnswer()`: Save answers to your backend
- `saveFeedback()`: Submit feedback to your system

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
