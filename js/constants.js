const GAME_CONFIG = {
    MAP_WIDTH: 3000,
    MAP_HEIGHT: 3000,
    TILE_SIZE: 64,
    
    PLAYER_SPEED: 200,
    PLAYER_MAX_HEALTH: 100,
    PLAYER_RADIUS: 20,
    
    BOT_COUNT: 10,
    BOT_SPEED: 150,
    BOT_DETECTION_RANGE: 400,
    BOT_SHOOT_RANGE: 300,
    BOT_SHOOT_COOLDOWN: 1000,
    BOT_DECISION_INTERVAL: 500,
    
    BULLET_SPEED: 600,
    BULLET_DAMAGE: 15,
    BULLET_LIFETIME: 2000,
    
    ZONE_SHRINK_INTERVAL: 30000,
    ZONE_SHRINK_AMOUNT: 100,
    ZONE_MIN_RADIUS: 150,
    ZONE_DAMAGE: 5,
    ZONE_DAMAGE_INTERVAL: 1000,
    INITIAL_ZONE_RADIUS: 1400,
    
    RESPAWN_TIME: 20000,
    
    LOOT_COUNT: 50,
    LOOT_TYPES: {
        HEALTH: { color: 0x00ff00, value: 25, name: 'Health Pack' },
        AMMO: { color: 0xffff00, value: 30, name: 'Ammo' },
        SPEED_BOOST: { color: 0x00ffff, value: 1.5, name: 'Speed Boost', duration: 5000 },
        DAMAGE_BOOST: { color: 0xff00ff, value: 1.5, name: 'Damage Boost', duration: 5000 }
    },
    
    WEAPONS: {
        PISTOL: {
            name: 'Pistol',
            damage: 15,
            fireRate: 400,
            bulletSpeed: 600,
            spread: 0.05,
            ammoMax: 30,
            color: 0xaaaaaa
        },
        SMG: {
            name: 'SMG',
            damage: 10,
            fireRate: 100,
            bulletSpeed: 550,
            spread: 0.15,
            ammoMax: 50,
            color: 0xffaa00
        },
        SHOTGUN: {
            name: 'Shotgun',
            damage: 8,
            fireRate: 800,
            bulletSpeed: 500,
            spread: 0.3,
            pellets: 5,
            ammoMax: 20,
            color: 0x8B4513
        },
        RIFLE: {
            name: 'Rifle',
            damage: 35,
            fireRate: 1000,
            bulletSpeed: 800,
            spread: 0.02,
            ammoMax: 15,
            color: 0x4a4a4a
        }
    },
    
    COLORS: {
        PLAYER: 0x4a90d9,
        BOT: 0xe74c3c,
        GRASS: 0x2d5a27,
        GRASS_DARK: 0x1e4a1e,
        TREE: 0x228b22,
        ROCK: 0x808080,
        WATER: 0x3498db,
        SAFE_ZONE: 0x3498db,
        DANGER_ZONE: 0xe74c3c,
        UI_BG: 0x1a1a2e,
        UI_TEXT: 0xffffff,
        HEALTH_BAR: 0x2ecc71,
        HEALTH_BAR_BG: 0x333333
    }
};

const JOYSTICK_CONFIG = {
    BASE_RADIUS: 60,
    THUMB_RADIUS: 30,
    BASE_COLOR: 0x333333,
    THUMB_COLOR: 0x666666,
    ALPHA: 0.7
};
