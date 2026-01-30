const Utils = {
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    },
    
    isPointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) <= radius;
    },
    
    getRandomPositionInCircle(cx, cy, radius) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        return {
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r
        };
    },
    
    getRandomMapPosition(padding = 100) {
        return {
            x: Utils.randomInRange(padding, GAME_CONFIG.MAP_WIDTH - padding),
            y: Utils.randomInRange(padding, GAME_CONFIG.MAP_HEIGHT - padding)
        };
    },
    
    formatTime(ms) {
        const seconds = Math.ceil(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    getRandomWeapon() {
        const weapons = Object.keys(GAME_CONFIG.WEAPONS);
        return weapons[Utils.randomInt(0, weapons.length - 1)];
    },
    
    getRandomLootType() {
        const types = Object.keys(GAME_CONFIG.LOOT_TYPES);
        return types[Utils.randomInt(0, types.length - 1)];
    }
};
