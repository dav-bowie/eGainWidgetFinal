# eGainWidget - Interactive Guidance Widget

A Vue.js-based interactive guidance widget that collects user input, walks users through questions, and offers solutions with feedback capture. Built for eGain's AI Knowledge Platform.

## Features

- **Multi-step Guidance Flow**: Problem description → Dynamic questioning → Answer review → Solution delivery → Feedback
- **Multiple Input Types**: Text choices, image choices, free-text, and numeric inputs
- **Responsive Design**: Desktop floating panel (360-400px) and mobile bottom sheet
- **Admin Configurable**: Customizable theming, branding, and logo
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and ARIA roles
- **Embeddable**: Can be embedded on any webpage

## Tech Stack

- **Framework**: Vue 3 + Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Styling**: CSS with CSS variables for theming
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

## Project Setup

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

### Lint and Format

```sh
npm run lint
npm run format
```

## Widget Usage

The widget can be embedded on any webpage by including the widget script and mounting to a target element:

```html
<div id="egain-widget"></div>
<script src="path/to/widget.js"></script>
```

## Mock Services

- `GET /next-questions` - Returns question array
- `POST /save-answer` - Simulated answer storage  
- `GET /solution` - Returns solution when ready

## Development Guidelines

- Maximum 6 answer options per question
- Images delivered as HTTPS URLs sized 96×96px
- Numeric answers fit within 64-bit signed integer
- Solution appears after ≥ 3 answered questions
