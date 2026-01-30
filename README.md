# Battle Royale 2D 🎮

A web-based 2D battle royale game inspired by surviv.io, built with Phaser 3. Optimized for iPad and touch devices with responsive controls.

## 🎯 Features

- **Battle Royale Gameplay**: Shrinking safe zone that forces players together
- **Touch Controls**: Dual virtual joysticks for movement and aiming/shooting
- **Multiple Weapons**: Pistol, SMG, Shotgun, and Rifle with different stats
- **Loot System**: Health packs, ammo, speed boosts, and damage boosts
- **Bot AI**: 10 AI-controlled bots with different behaviors (wander, chase, attack, flee)
- **Respawn System**: 20-second respawn timer after elimination
- **Real-time HUD**: Health bar, ammo counter, kills tracker, minimap
- **Zone Mechanics**: Shrinking play area with damage outside the safe zone

## 🕹️ Controls

### Touch/iPad Controls
- **Left side of screen**: Movement joystick - drag to move your character
- **Right side of screen**: Aim & shoot joystick - drag to aim, release to stop shooting

### Desktop/Keyboard Controls
- **WASD / Arrow Keys**: Movement
- **Mouse Click**: Shoot in the direction of the cursor

## 🎮 Gameplay

1. You spawn in a large map with 10 bot enemies
2. Move around to find weapons and loot
3. The safe zone (blue circle) shrinks every 30 seconds
4. Stay inside the safe zone or take damage
5. Eliminate enemies to earn kills
6. If eliminated, you respawn after 20 seconds
7. The game continues indefinitely with respawning players

## 🔫 Weapons

| Weapon | Damage | Fire Rate | Special |
|--------|--------|-----------|---------|
| Pistol | 15 | Medium | Balanced starter |
| SMG | 10 | Fast | High fire rate |
| Shotgun | 8x5 | Slow | Multiple pellets |
| Rifle | 35 | Slow | High damage, accuracy |

## 💊 Loot Types

- **Health Pack** (Green): Restores 25 health
- **Ammo** (Yellow): Adds 30 ammo
- **Speed Boost** (Cyan): 1.5x movement speed for 5 seconds
- **Damage Boost** (Magenta): 1.5x damage for 5 seconds

## 🚀 How to Play

### Option 1: Open Directly
Simply open `index.html` in any modern web browser.

### Option 2: Local Server
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📱 Device Support

- **iPad**: Fully optimized with touch controls
- **iPhone**: Works in landscape mode
- **Android Tablets/Phones**: Supported with touch controls
- **Desktop**: Full keyboard + mouse support

## 🛠️ Technical Details

- **Engine**: Phaser 3.60
- **Physics**: Arcade Physics
- **Target FPS**: 60
- **Map Size**: 3000x3000 pixels
- **Rendering**: WebGL with Canvas fallback

## 🎨 Game Architecture

```
js/
├── constants.js      # Game configuration and constants
├── utils.js          # Utility functions
├── main.js           # Phaser game initialization
├── entities/
│   ├── Player.js     # Player class (human & base for bots)
│   ├── Bot.js        # AI-controlled enemies
│   ├── Bullet.js     # Projectile physics
│   └── Loot.js       # Pickups and weapons
└── scenes/
    ├── BootScene.js  # Asset loading and setup
    ├── GameScene.js  # Main game logic
    └── UIScene.js    # HUD and interface
```

## 📋 Browser Compatibility

Works in all modern browsers supporting:
- ES6 JavaScript
- WebGL / Canvas
- Web Audio API
- Touch Events

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile

## 🎯 Tips

1. Stay near the edge of the safe zone for tactical advantage
2. Collect weapon upgrades for better firepower
3. Use speed boosts to escape dangerous situations
4. Watch the minimap to track enemy positions
5. The shotgun is devastating at close range

## License

See LICENSE file for details.

Enjoy the game! 🎮
