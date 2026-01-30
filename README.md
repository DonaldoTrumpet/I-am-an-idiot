# Interactive Clicker Game 🎮

A fun, interactive web-based clicker game with satisfying visual and audio feedback.

## Features

- **Unlimited Clicking**: Click the image as many times as you want!
- **Score Tracking**: Real-time score counter that increments with each click
- **Boing Sound Effect**: Procedurally generated "boing" sound plays on each click
- **Squish Animation**: Image squishes and bounces back with a satisfying spring effect
- **Visual Effects**:
  - Particle burst effects with emojis (✨⭐💫🌟💥🎉)
  - Ripple wave effect on click
  - Glow pulse animation
  - Combo milestone celebrations every 10 clicks
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Touch Support**: Full touch support for mobile devices

## How to Play

1. Open `index.html` in any modern web browser
2. Click (or tap) on the image
3. Watch your score increase and enjoy the effects!
4. Keep clicking to see combo celebrations at milestones

## Technical Details

- **Pure Vanilla JavaScript**: No external dependencies required
- **Web Audio API**: Procedurally generated sound effects
- **CSS Animations**: Smooth, performant animations
- **Responsive**: Adapts to different screen sizes
- **Self-Contained**: Single HTML file with embedded CSS and JavaScript

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- Web Audio API
- CSS3 Animations

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

Simply open the `index.html` file in your web browser:

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or just open the file directly
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

Then navigate to `http://localhost:8000` in your browser.

## Game Mechanics

- Each click increments the score by 1
- Boing sound plays with each interaction
- Image squishes down to ~70-80% size then bounces back
- Particles burst outward in a circular pattern
- Ripple effect emanates from click point
- Every 10 clicks triggers a special combo celebration
- Hover effect provides visual feedback

## Customization

You can easily customize the game by modifying:
- **Image**: Change the `src` attribute of the `<img>` tag
- **Colors**: Modify the CSS gradient and color values
- **Sound**: Adjust frequency values in `playBoingSound()` method
- **Animation Speed**: Change animation duration in CSS keyframes
- **Particle Effects**: Modify emojis array in `createParticles()` method

## License

See LICENSE file for details.

Enjoy clicking! 🎉
