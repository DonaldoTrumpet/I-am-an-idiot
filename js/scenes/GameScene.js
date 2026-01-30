class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        this.setupWorld();
        this.createMap();
        this.createZone();
        this.createPlayer();
        this.createBots();
        this.createLoot();
        this.setupControls();
        this.setupCollisions();
        this.setupCamera();
        this.setupTimers();
        
        this.bullets = [];
        this.gameTime = 0;
        this.gameState = 'playing';
        
        this.events.on('playerDied', this.onPlayerDied, this);
    }
    
    setupWorld() {
        this.physics.world.setBounds(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    }
    
    createMap() {
        this.mapGraphics = this.add.graphics();
        
        this.mapGraphics.fillStyle(GAME_CONFIG.COLORS.GRASS, 1);
        this.mapGraphics.fillRect(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
        
        for (let i = 0; i < 200; i++) {
            const x = Utils.randomInRange(0, GAME_CONFIG.MAP_WIDTH);
            const y = Utils.randomInRange(0, GAME_CONFIG.MAP_HEIGHT);
            const shade = Utils.randomInRange(0.8, 1.2);
            const r = Math.floor(0x2d * shade);
            const g = Math.floor(0x5a * shade);
            const b = Math.floor(0x27 * shade);
            this.mapGraphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 0.5);
            this.mapGraphics.fillCircle(x, y, Utils.randomInRange(20, 60));
        }
        
        this.obstacles = this.physics.add.staticGroup();
        
        for (let i = 0; i < 50; i++) {
            const pos = Utils.getRandomMapPosition(150);
            this.createTree(pos.x, pos.y);
        }
        
        for (let i = 0; i < 30; i++) {
            const pos = Utils.getRandomMapPosition(150);
            this.createRock(pos.x, pos.y);
        }
        
        this.createMapBorder();
    }
    
    createTree(x, y) {
        const trunk = this.add.rectangle(x, y + 15, 10, 30, 0x8B4513);
        const foliage = this.add.circle(x, y - 10, 25, GAME_CONFIG.COLORS.TREE);
        foliage.setStrokeStyle(2, 0x1a6b1a);
        
        const hitbox = this.add.circle(x, y, 20, 0x000000, 0);
        this.physics.world.enable(hitbox);
        hitbox.body.setCircle(20);
        hitbox.body.setOffset(-20, -20);
        hitbox.body.setImmovable(true);
        this.obstacles.add(hitbox);
    }
    
    createRock(x, y) {
        const size = Utils.randomInRange(20, 40);
        const rock = this.add.circle(x, y, size, GAME_CONFIG.COLORS.ROCK);
        rock.setStrokeStyle(3, 0x606060);
        
        this.physics.world.enable(rock);
        rock.body.setCircle(size);
        rock.body.setOffset(-size, -size);
        rock.body.setImmovable(true);
        this.obstacles.add(rock);
    }
    
    createMapBorder() {
        const thickness = 50;
        const color = 0x333333;
        
        this.add.rectangle(GAME_CONFIG.MAP_WIDTH / 2, thickness / 2, GAME_CONFIG.MAP_WIDTH, thickness, color);
        this.add.rectangle(GAME_CONFIG.MAP_WIDTH / 2, GAME_CONFIG.MAP_HEIGHT - thickness / 2, GAME_CONFIG.MAP_WIDTH, thickness, color);
        this.add.rectangle(thickness / 2, GAME_CONFIG.MAP_HEIGHT / 2, thickness, GAME_CONFIG.MAP_HEIGHT, color);
        this.add.rectangle(GAME_CONFIG.MAP_WIDTH - thickness / 2, GAME_CONFIG.MAP_HEIGHT / 2, thickness, GAME_CONFIG.MAP_HEIGHT, color);
    }
    
    createZone() {
        this.zone = {
            centerX: GAME_CONFIG.MAP_WIDTH / 2,
            centerY: GAME_CONFIG.MAP_HEIGHT / 2,
            radius: GAME_CONFIG.INITIAL_ZONE_RADIUS,
            targetRadius: GAME_CONFIG.INITIAL_ZONE_RADIUS,
            shrinking: false
        };
        
        this.zoneGraphics = this.add.graphics();
        this.zoneGraphics.setDepth(100);
        this.updateZoneGraphics();
    }
    
    updateZoneGraphics() {
        this.zoneGraphics.clear();
        
        this.zoneGraphics.fillStyle(GAME_CONFIG.COLORS.DANGER_ZONE, 0.3);
        this.zoneGraphics.fillRect(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
        
        this.zoneGraphics.fillStyle(GAME_CONFIG.COLORS.GRASS, 1);
        this.zoneGraphics.fillCircle(this.zone.centerX, this.zone.centerY, this.zone.radius);
        
        this.zoneGraphics.lineStyle(4, GAME_CONFIG.COLORS.SAFE_ZONE, 1);
        this.zoneGraphics.strokeCircle(this.zone.centerX, this.zone.centerY, this.zone.radius);
        
        if (this.zone.targetRadius < this.zone.radius) {
            this.zoneGraphics.lineStyle(2, 0xffffff, 0.5);
            this.zoneGraphics.strokeCircle(this.zone.centerX, this.zone.centerY, this.zone.targetRadius);
        }
    }
    
    createPlayer() {
        const spawnPos = this.getValidSpawnPosition();
        this.player = new Player(this, spawnPos.x, spawnPos.y, true);
    }
    
    createBots() {
        this.bots = [];
        const botNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'];
        
        for (let i = 0; i < GAME_CONFIG.BOT_COUNT; i++) {
            const spawnPos = this.getValidSpawnPosition();
            const bot = new Bot(this, spawnPos.x, spawnPos.y, botNames[i] || `Bot${i + 1}`);
            
            if (Math.random() < 0.3) {
                bot.switchWeapon(Utils.getRandomWeapon());
            }
            
            this.bots.push(bot);
        }
    }
    
    createLoot() {
        this.lootItems = [];
        this.weaponLootItems = [];
        
        for (let i = 0; i < GAME_CONFIG.LOOT_COUNT; i++) {
            const pos = this.getValidSpawnPosition();
            const type = Utils.getRandomLootType();
            const loot = new Loot(this, pos.x, pos.y, type);
            this.lootItems.push(loot);
        }
        
        const weapons = Object.keys(GAME_CONFIG.WEAPONS);
        for (let i = 0; i < 15; i++) {
            const pos = this.getValidSpawnPosition();
            const weaponType = weapons[Utils.randomInt(0, weapons.length - 1)];
            const weaponLoot = new WeaponLoot(this, pos.x, pos.y, weaponType);
            this.weaponLootItems.push(weaponLoot);
        }
    }
    
    getValidSpawnPosition() {
        let attempts = 0;
        while (attempts < 100) {
            const pos = Utils.getRandomPositionInCircle(
                this.zone ? this.zone.centerX : GAME_CONFIG.MAP_WIDTH / 2,
                this.zone ? this.zone.centerY : GAME_CONFIG.MAP_HEIGHT / 2,
                this.zone ? this.zone.radius - 100 : GAME_CONFIG.INITIAL_ZONE_RADIUS - 100
            );
            
            pos.x = Utils.clamp(pos.x, 100, GAME_CONFIG.MAP_WIDTH - 100);
            pos.y = Utils.clamp(pos.y, 100, GAME_CONFIG.MAP_HEIGHT - 100);
            
            return pos;
        }
        return { x: GAME_CONFIG.MAP_WIDTH / 2, y: GAME_CONFIG.MAP_HEIGHT / 2 };
    }
    
    setupControls() {
        this.moveJoystick = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            pointerId: null
        };
        
        this.aimJoystick = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            pointerId: null,
            shooting: false
        };
        
        this.input.addPointer(2);
        
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        
        this.input.on('pointerdown', (pointer) => {
            if (!this.sys.game.device.input.touch) {
                this.handleMouseShoot(pointer);
            }
        });
    }
    
    onPointerDown(pointer) {
        const screenWidth = this.cameras.main.width;
        
        if (pointer.x < screenWidth / 2) {
            if (!this.moveJoystick.active) {
                this.moveJoystick.active = true;
                this.moveJoystick.startX = pointer.x;
                this.moveJoystick.startY = pointer.y;
                this.moveJoystick.currentX = pointer.x;
                this.moveJoystick.currentY = pointer.y;
                this.moveJoystick.pointerId = pointer.id;
            }
        } else {
            if (!this.aimJoystick.active) {
                this.aimJoystick.active = true;
                this.aimJoystick.startX = pointer.x;
                this.aimJoystick.startY = pointer.y;
                this.aimJoystick.currentX = pointer.x;
                this.aimJoystick.currentY = pointer.y;
                this.aimJoystick.pointerId = pointer.id;
                this.aimJoystick.shooting = true;
            }
        }
        
        this.events.emit('joystickUpdate', this.moveJoystick, this.aimJoystick);
    }
    
    onPointerMove(pointer) {
        if (this.moveJoystick.active && pointer.id === this.moveJoystick.pointerId) {
            this.moveJoystick.currentX = pointer.x;
            this.moveJoystick.currentY = pointer.y;
        }
        
        if (this.aimJoystick.active && pointer.id === this.aimJoystick.pointerId) {
            this.aimJoystick.currentX = pointer.x;
            this.aimJoystick.currentY = pointer.y;
        }
        
        this.events.emit('joystickUpdate', this.moveJoystick, this.aimJoystick);
    }
    
    onPointerUp(pointer) {
        if (this.moveJoystick.pointerId === pointer.id) {
            this.moveJoystick.active = false;
            this.moveJoystick.pointerId = null;
        }
        
        if (this.aimJoystick.pointerId === pointer.id) {
            this.aimJoystick.active = false;
            this.aimJoystick.pointerId = null;
            this.aimJoystick.shooting = false;
        }
        
        this.events.emit('joystickUpdate', this.moveJoystick, this.aimJoystick);
    }
    
    handleMouseShoot(pointer) {
        if (!this.player || !this.player.isAlive) return;
        
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const bullets = this.player.shoot(worldPoint.x, worldPoint.y);
        if (bullets) {
            this.addBullets(bullets);
        }
    }
    
    setupCollisions() {
        this.physics.add.collider(this.player.container, this.obstacles);
        
        for (const bot of this.bots) {
            this.physics.add.collider(bot.container, this.obstacles);
            this.physics.add.collider(this.player.container, bot.container);
            
            for (const otherBot of this.bots) {
                if (bot !== otherBot) {
                    this.physics.add.collider(bot.container, otherBot.container);
                }
            }
        }
    }
    
    setupCamera() {
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
        this.cameras.main.startFollow(this.player.container, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
    }
    
    setupTimers() {
        this.zoneShrinkTimer = this.time.addEvent({
            delay: GAME_CONFIG.ZONE_SHRINK_INTERVAL,
            callback: this.shrinkZone,
            callbackScope: this,
            loop: true
        });
        
        this.zoneDamageTimer = this.time.addEvent({
            delay: GAME_CONFIG.ZONE_DAMAGE_INTERVAL,
            callback: this.applyZoneDamage,
            callbackScope: this,
            loop: true
        });
        
        this.lootRespawnTimer = this.time.addEvent({
            delay: 15000,
            callback: this.respawnLoot,
            callbackScope: this,
            loop: true
        });
    }
    
    shrinkZone() {
        if (this.zone.radius <= GAME_CONFIG.ZONE_MIN_RADIUS) return;
        
        this.zone.targetRadius = Math.max(
            this.zone.radius - GAME_CONFIG.ZONE_SHRINK_AMOUNT,
            GAME_CONFIG.ZONE_MIN_RADIUS
        );
        
        const newCenterOffset = (this.zone.radius - this.zone.targetRadius) * 0.3;
        const angle = Math.random() * Math.PI * 2;
        
        this.zone.centerX = Utils.clamp(
            this.zone.centerX + Math.cos(angle) * newCenterOffset,
            this.zone.targetRadius + 50,
            GAME_CONFIG.MAP_WIDTH - this.zone.targetRadius - 50
        );
        this.zone.centerY = Utils.clamp(
            this.zone.centerY + Math.sin(angle) * newCenterOffset,
            this.zone.targetRadius + 50,
            GAME_CONFIG.MAP_HEIGHT - this.zone.targetRadius - 50
        );
        
        this.zone.shrinking = true;
        
        this.tweens.add({
            targets: this.zone,
            radius: this.zone.targetRadius,
            duration: 10000,
            ease: 'Linear',
            onUpdate: () => {
                this.updateZoneGraphics();
            },
            onComplete: () => {
                this.zone.shrinking = false;
            }
        });
        
        this.sound.play('zone', { volume: 0.3 });
        this.events.emit('zoneShrinking');
    }
    
    applyZoneDamage() {
        if (this.player && this.player.isAlive) {
            const playerPos = this.player.getPosition();
            if (!Utils.isPointInCircle(playerPos.x, playerPos.y, this.zone.centerX, this.zone.centerY, this.zone.radius)) {
                this.player.takeDamage(GAME_CONFIG.ZONE_DAMAGE);
            }
        }
        
        for (const bot of this.bots) {
            if (bot.isAlive) {
                const botPos = bot.getPosition();
                if (!Utils.isPointInCircle(botPos.x, botPos.y, this.zone.centerX, this.zone.centerY, this.zone.radius)) {
                    bot.takeDamage(GAME_CONFIG.ZONE_DAMAGE);
                }
            }
        }
    }
    
    respawnLoot() {
        const activeLoot = this.lootItems.filter(l => l.active).length;
        const neededLoot = Math.floor(GAME_CONFIG.LOOT_COUNT * 0.3) - activeLoot;
        
        for (let i = 0; i < Math.max(0, neededLoot); i++) {
            const pos = this.getValidSpawnPosition();
            const type = Utils.getRandomLootType();
            const loot = new Loot(this, pos.x, pos.y, type);
            this.lootItems.push(loot);
        }
    }
    
    addBullets(bullets) {
        this.bullets.push(...bullets);
    }
    
    onPlayerDied(killer) {
        this.gameState = 'dead';
        this.events.emit('showRespawn', killer);
        
        this.time.delayedCall(GAME_CONFIG.RESPAWN_TIME, () => {
            if (this.player) {
                const spawnPos = this.getValidSpawnPosition();
                this.player.respawn(spawnPos.x, spawnPos.y);
                this.gameState = 'playing';
                this.events.emit('playerRespawned');
            }
        });
    }
    
    update(time, delta) {
        this.gameTime += delta;
        
        if (this.player && this.player.isAlive) {
            this.updatePlayerMovement();
            this.updatePlayerShooting();
            this.player.update(time, delta);
        }
        
        for (const bot of this.bots) {
            if (bot.isAlive) {
                bot.update(time, delta);
            } else {
                this.handleBotRespawn(bot);
            }
        }
        
        this.updateBullets();
        this.checkBulletCollisions();
        this.checkLootCollisions();
        
        this.events.emit('gameUpdate', {
            player: this.player,
            zone: this.zone,
            gameTime: this.gameTime,
            aliveCount: this.getAliveCount()
        });
    }
    
    updatePlayerMovement() {
        let moveX = 0;
        let moveY = 0;
        
        if (this.moveJoystick.active) {
            const dx = this.moveJoystick.currentX - this.moveJoystick.startX;
            const dy = this.moveJoystick.currentY - this.moveJoystick.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 10) {
                const maxDistance = JOYSTICK_CONFIG.BASE_RADIUS;
                const normalizedDist = Math.min(distance, maxDistance) / maxDistance;
                moveX = (dx / distance) * normalizedDist;
                moveY = (dy / distance) * normalizedDist;
            }
        }
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) moveX = -1;
        if (this.cursors.right.isDown || this.wasd.right.isDown) moveX = 1;
        if (this.cursors.up.isDown || this.wasd.up.isDown) moveY = -1;
        if (this.cursors.down.isDown || this.wasd.down.isDown) moveY = 1;
        
        if (moveX !== 0 && moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= length;
            moveY /= length;
        }
        
        this.player.move(moveX, moveY);
    }
    
    updatePlayerShooting() {
        if (this.aimJoystick.active && this.aimJoystick.shooting) {
            const dx = this.aimJoystick.currentX - this.aimJoystick.startX;
            const dy = this.aimJoystick.currentY - this.aimJoystick.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 20) {
                const angle = Math.atan2(dy, dx);
                const targetX = this.player.container.x + Math.cos(angle) * 100;
                const targetY = this.player.container.y + Math.sin(angle) * 100;
                
                this.player.setRotation(angle);
                
                const bullets = this.player.shoot(targetX, targetY);
                if (bullets) {
                    this.addBullets(bullets);
                }
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            if (!bullet.active) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    checkBulletCollisions() {
        for (const bullet of this.bullets) {
            if (!bullet.active || !bullet.sprite) continue;
            
            if (this.player && this.player.isAlive && bullet.owner !== this.player) {
                const dist = Utils.distance(
                    bullet.sprite.x, bullet.sprite.y,
                    this.player.container.x, this.player.container.y
                );
                
                if (dist < GAME_CONFIG.PLAYER_RADIUS + 4) {
                    this.player.takeDamage(bullet.damage, bullet.owner);
                    this.sound.play('hit', { volume: 0.3 });
                    bullet.destroy();
                    continue;
                }
            }
            
            for (const bot of this.bots) {
                if (bot.isAlive && bullet.owner !== bot) {
                    const dist = Utils.distance(
                        bullet.sprite.x, bullet.sprite.y,
                        bot.container.x, bot.container.y
                    );
                    
                    if (dist < GAME_CONFIG.PLAYER_RADIUS + 4) {
                        bot.takeDamage(bullet.damage, bullet.owner);
                        this.sound.play('hit', { volume: 0.3 });
                        bullet.destroy();
                        break;
                    }
                }
            }
        }
    }
    
    checkLootCollisions() {
        const playerPos = this.player ? this.player.getPosition() : null;
        
        for (const loot of this.lootItems) {
            if (!loot.active) continue;
            
            if (playerPos && this.player.isAlive) {
                const dist = Utils.distance(playerPos.x, playerPos.y, loot.x, loot.y);
                if (dist < GAME_CONFIG.PLAYER_RADIUS + 15) {
                    loot.collect(this.player);
                    continue;
                }
            }
            
            for (const bot of this.bots) {
                if (bot.isAlive) {
                    const botPos = bot.getPosition();
                    const dist = Utils.distance(botPos.x, botPos.y, loot.x, loot.y);
                    if (dist < GAME_CONFIG.PLAYER_RADIUS + 15) {
                        loot.collect(bot);
                        break;
                    }
                }
            }
        }
        
        for (const weaponLoot of this.weaponLootItems) {
            if (!weaponLoot.active) continue;
            
            if (playerPos && this.player.isAlive) {
                const dist = Utils.distance(playerPos.x, playerPos.y, weaponLoot.x, weaponLoot.y);
                if (dist < GAME_CONFIG.PLAYER_RADIUS + 20) {
                    weaponLoot.collect(this.player);
                    continue;
                }
            }
        }
        
        this.lootItems = this.lootItems.filter(l => l.active);
        this.weaponLootItems = this.weaponLootItems.filter(l => l.active);
    }
    
    handleBotRespawn(bot) {
        if (!bot.respawnScheduled) {
            bot.respawnScheduled = true;
            this.time.delayedCall(GAME_CONFIG.RESPAWN_TIME, () => {
                const spawnPos = this.getValidSpawnPosition();
                bot.respawn(spawnPos.x, spawnPos.y);
                bot.respawnScheduled = false;
            });
        }
    }
    
    getAliveCount() {
        let count = this.player && this.player.isAlive ? 1 : 0;
        for (const bot of this.bots) {
            if (bot.isAlive) count++;
        }
        return count;
    }
}
