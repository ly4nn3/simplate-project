# Simplate Project

A recipe hub website built with vanilla JavaScript, featuring an interactive kitchen interface where users can explore recipes based on different cooking appliances. The project uses modern web technologies and a sprite-based approach for smooth interactions.

![Simplate Logo Black](src/assets/images/logo-black.svg)
![Simplate Logo White](src/assets/images/logo-white.svg)

## Features

### Interactive Kitchen Layout
- Clickable kitchen appliances with hover effects
- Sparkle animations (✨) for interactive elements
- Isometric design with active state indicators
- Smooth transitions and visual feedback

### Interactive Elements
- Oven
- Stove
- Microwave
- Rice Cooker
- Cutting Board
- Recipe Book

### Navigation
- Client-side routing system
- Smooth transitions between views
- Maintains browser history
- Query parameter support

## Technology Stack
- Vanilla JavaScript (ES6+)
- CSS3 with animations
- HTML5
- Sprite sheets for optimized graphics
- Custom router implementation

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/ly4nn3/simplate-project.git
```
2. Install dependencies:
```bash
npm install
```
3. Run development server
```bash
npm run dev
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run format` - Format code

## Routes
- `/` - Kitchen view (home)
- `/recipes?type=oven` - Oven recipes
- `/recipes?type=stove` - Stovetop recipes
- `/recipes?type=microwave` - Microwave recipes
- `/recipes?type=ricecooker` - Rice cooker recipes
- `/recipes?type=board` - Cutting board recipes
- `/book` - Cookbook recommendation
- `/about` - About page

## Interactive Elements Implementation

### Hover Effects
Each interactive element features:
- Custom clip-path for precise interaction areas
- Sparkle animations on hover
- Smooth opacity transitions
- Active state indicators

### Sparkle Animation
- Dynamic positioning for each appliance
- Gentle floating animation
- Non-intrusive visual feedback
- Pointer-events handling for smooth interaction

### Styling
The project uses a combination of:
- Sprite sheets for efficient image loading
- CSS animations for smooth transitions
- Clip-path for precise interaction areas
- Z-index management for proper layering