class Bullet {
    constructor(scene, x, y, angle, speed, damage, owner) {
        this.scene = scene;
        this.owner = owner;
        this.damage = damage;
        this.speed = speed;
        this.active = true;
        this.createdAt = Date.now();
        
        this.sprite = scene.add.circle(x, y, 4, 0xffff00);
        this.sprite.setStrokeStyle(1, 0xff8800);
        this.sprite.setDepth(5);
        
        scene.physics.world.enable(this.sprite);
        this.sprite.body.setCircle(4);
        this.sprite.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        this.sprite.setData('bullet', this);
        
        this.trail = scene.add.circle(x, y, 3, 0xffff00, 0.5);
        this.trail.setDepth(4);
        
        scene.tweens.add({
            targets: this.trail,
            alpha: 0,
            scale: 0,
            duration: 100,
            onComplete: () => {
                if (this.trail) this.trail.destroy();
            }
        });
    }
    
    update() {
        if (!this.active) return;
        
        if (Date.now() - this.createdAt > GAME_CONFIG.BULLET_LIFETIME) {
            this.destroy();
            return;
        }
        
        const x = this.sprite.x;
        const y = this.sprite.y;
        
        if (x < 0 || x > GAME_CONFIG.MAP_WIDTH || y < 0 || y > GAME_CONFIG.MAP_HEIGHT) {
            this.destroy();
        }
    }
    
    destroy() {
        this.active = false;
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        if (this.trail) {
            this.trail.destroy();
            this.trail = null;
        }
    }
}
