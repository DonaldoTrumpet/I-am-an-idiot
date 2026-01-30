class Player {
    constructor(scene, x, y, isHuman = true) {
        this.scene = scene;
        this.isHuman = isHuman;
        this.isAlive = true;
        this.id = Date.now() + Math.random();
        
        this.health = GAME_CONFIG.PLAYER_MAX_HEALTH;
        this.maxHealth = GAME_CONFIG.PLAYER_MAX_HEALTH;
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.kills = 0;
        
        this.currentWeapon = 'PISTOL';
        this.ammo = GAME_CONFIG.WEAPONS.PISTOL.ammoMax;
        this.lastFireTime = 0;
        
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;
        this.boostEndTime = 0;
        
        this.createSprite(x, y);
        this.createHealthBar();
    }
    
    createSprite(x, y) {
        this.container = this.scene.add.container(x, y);
        
        this.body = this.scene.add.circle(0, 0, GAME_CONFIG.PLAYER_RADIUS, 
            this.isHuman ? GAME_CONFIG.COLORS.PLAYER : GAME_CONFIG.COLORS.BOT);
        this.body.setStrokeStyle(3, 0xffffff);
        
        this.weaponIndicator = this.scene.add.rectangle(
            GAME_CONFIG.PLAYER_RADIUS + 5, 0, 
            20, 8, 
            GAME_CONFIG.WEAPONS[this.currentWeapon].color
        );
        
        if (this.isHuman) {
            this.directionIndicator = this.scene.add.triangle(
                GAME_CONFIG.PLAYER_RADIUS + 10, 0,
                0, -5, 0, 5, 10, 0,
                0xffffff
            );
            this.container.add(this.directionIndicator);
        }
        
        this.container.add([this.body, this.weaponIndicator]);
        
        this.scene.physics.world.enable(this.container);
        this.container.body.setCircle(GAME_CONFIG.PLAYER_RADIUS);
        this.container.body.setOffset(-GAME_CONFIG.PLAYER_RADIUS, -GAME_CONFIG.PLAYER_RADIUS);
        this.container.body.setCollideWorldBounds(true);
        this.container.body.setBounce(0.1);
        
        this.container.setDepth(10);
        this.container.setData('entity', this);
    }
    
    createHealthBar() {
        this.healthBarBg = this.scene.add.rectangle(0, -35, 50, 6, GAME_CONFIG.COLORS.HEALTH_BAR_BG);
        this.healthBar = this.scene.add.rectangle(0, -35, 50, 6, GAME_CONFIG.COLORS.HEALTH_BAR);
        this.container.add([this.healthBarBg, this.healthBar]);
    }
    
    update(time, delta) {
        if (!this.isAlive) return;
        
        if (time > this.boostEndTime) {
            this.damageMultiplier = 1;
            this.speedMultiplier = 1;
        }
        
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.setScale(healthPercent, 1);
        this.healthBar.x = -25 * (1 - healthPercent);
        
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(GAME_CONFIG.COLORS.HEALTH_BAR);
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xf1c40f);
        } else {
            this.healthBar.setFillStyle(0xe74c3c);
        }
    }
    
    move(velocityX, velocityY) {
        if (!this.isAlive) return;
        
        const actualSpeed = this.speed * this.speedMultiplier;
        this.container.body.setVelocity(velocityX * actualSpeed, velocityY * actualSpeed);
        
        if (velocityX !== 0 || velocityY !== 0) {
            const angle = Math.atan2(velocityY, velocityX);
            this.setRotation(angle);
        }
    }
    
    setRotation(angle) {
        if (this.weaponIndicator) {
            this.weaponIndicator.setPosition(
                Math.cos(angle) * (GAME_CONFIG.PLAYER_RADIUS + 5),
                Math.sin(angle) * (GAME_CONFIG.PLAYER_RADIUS + 5)
            );
            this.weaponIndicator.setRotation(angle);
        }
        if (this.directionIndicator) {
            this.directionIndicator.setPosition(
                Math.cos(angle) * (GAME_CONFIG.PLAYER_RADIUS + 10),
                Math.sin(angle) * (GAME_CONFIG.PLAYER_RADIUS + 10)
            );
            this.directionIndicator.setRotation(angle);
        }
        this.facingAngle = angle;
    }
    
    shoot(targetX, targetY) {
        if (!this.isAlive) return null;
        
        const now = Date.now();
        const weapon = GAME_CONFIG.WEAPONS[this.currentWeapon];
        
        if (now - this.lastFireTime < weapon.fireRate) return null;
        if (this.ammo <= 0) return null;
        
        this.lastFireTime = now;
        this.ammo--;
        
        const angle = Utils.angle(this.container.x, this.container.y, targetX, targetY);
        this.setRotation(angle);
        
        const bullets = [];
        const pellets = weapon.pellets || 1;
        
        for (let i = 0; i < pellets; i++) {
            const spread = (Math.random() - 0.5) * weapon.spread * 2;
            const bulletAngle = angle + spread;
            
            const bullet = new Bullet(
                this.scene,
                this.container.x + Math.cos(angle) * (GAME_CONFIG.PLAYER_RADIUS + 10),
                this.container.y + Math.sin(angle) * (GAME_CONFIG.PLAYER_RADIUS + 10),
                bulletAngle,
                weapon.bulletSpeed,
                weapon.damage * this.damageMultiplier,
                this
            );
            bullets.push(bullet);
        }
        
        this.scene.sound.play('shoot', { volume: 0.3 });
        
        return bullets;
    }
    
    takeDamage(amount, attacker = null) {
        if (!this.isAlive) return;
        
        this.health -= amount;
        
        this.scene.tweens.add({
            targets: this.body,
            alpha: 0.5,
            duration: 50,
            yoyo: true,
            repeat: 2
        });
        
        if (this.health <= 0) {
            this.health = 0;
            this.die(attacker);
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    addAmmo(amount) {
        const weapon = GAME_CONFIG.WEAPONS[this.currentWeapon];
        this.ammo = Math.min(this.ammo + amount, weapon.ammoMax);
    }
    
    applyBoost(type, value, duration) {
        if (type === 'SPEED_BOOST') {
            this.speedMultiplier = value;
        } else if (type === 'DAMAGE_BOOST') {
            this.damageMultiplier = value;
        }
        this.boostEndTime = Date.now() + duration;
    }
    
    switchWeapon(weaponType) {
        if (GAME_CONFIG.WEAPONS[weaponType]) {
            this.currentWeapon = weaponType;
            this.ammo = GAME_CONFIG.WEAPONS[weaponType].ammoMax;
            this.weaponIndicator.setFillStyle(GAME_CONFIG.WEAPONS[weaponType].color);
        }
    }
    
    die(killer = null) {
        this.isAlive = false;
        this.container.body.setVelocity(0, 0);
        
        if (killer && killer !== this) {
            killer.kills++;
        }
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.5,
            duration: 300,
            onComplete: () => {
                this.container.setVisible(false);
            }
        });
        
        this.scene.sound.play('death', { volume: 0.4 });
        
        if (this.isHuman) {
            this.scene.events.emit('playerDied', killer);
        }
    }
    
    respawn(x, y) {
        this.isAlive = true;
        this.health = this.maxHealth;
        this.ammo = GAME_CONFIG.WEAPONS[this.currentWeapon].ammoMax;
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;
        
        this.container.setPosition(x, y);
        this.container.setAlpha(1);
        this.container.setScale(1);
        this.container.setVisible(true);
        this.container.body.setVelocity(0, 0);
    }
    
    getPosition() {
        return { x: this.container.x, y: this.container.y };
    }
    
    destroy() {
        this.container.destroy();
    }
}
