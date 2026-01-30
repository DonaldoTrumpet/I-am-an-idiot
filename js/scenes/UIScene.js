class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }
    
    create() {
        this.gameScene = this.scene.get('GameScene');
        
        this.createHUD();
        this.createJoysticks();
        this.createMinimap();
        this.createRespawnOverlay();
        
        this.setupEvents();
    }
    
    createHUD() {
        const padding = 20;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        const topBarBg = this.add.rectangle(width / 2, 30, width - 40, 50, 0x000000, 0.6);
        topBarBg.setStrokeStyle(2, 0x444444);
        this.hudContainer.add(topBarBg);
        
        this.healthBarBg = this.add.rectangle(padding + 100, 30, 180, 20, 0x333333);
        this.healthBar = this.add.rectangle(padding + 100, 30, 180, 20, GAME_CONFIG.COLORS.HEALTH_BAR);
        this.healthText = this.add.text(padding + 100, 30, '100', {
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const healthIcon = this.add.text(padding, 30, '❤️', { fontSize: '20px' }).setOrigin(0.5);
        
        this.hudContainer.add([healthIcon, this.healthBarBg, this.healthBar, this.healthText]);
        
        const ammoIcon = this.add.text(padding + 220, 30, '🔫', { fontSize: '18px' }).setOrigin(0.5);
        this.ammoText = this.add.text(padding + 250, 30, '30', {
            fontSize: '16px',
            fontStyle: 'bold',
            fill: '#ffff00'
        }).setOrigin(0, 0.5);
        this.weaponText = this.add.text(padding + 300, 30, 'Pistol', {
            fontSize: '12px',
            fill: '#aaaaaa'
        }).setOrigin(0, 0.5);
        
        this.hudContainer.add([ammoIcon, this.ammoText, this.weaponText]);
        
        this.killsText = this.add.text(width - padding, 20, '🎯 Kills: 0', {
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#ff6b6b'
        }).setOrigin(1, 0.5);
        
        this.aliveText = this.add.text(width - padding, 42, '👥 Alive: 11', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(1, 0.5);
        
        this.hudContainer.add([this.killsText, this.aliveText]);
        
        this.timerText = this.add.text(width / 2, 30, '⏱️ 00:00', {
            fontSize: '16px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.hudContainer.add(this.timerText);
        
        this.zoneWarning = this.add.text(width / 2, 70, '⚠️ ZONE SHRINKING!', {
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#ff4444',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.zoneWarning.setVisible(false);
        this.hudContainer.add(this.zoneWarning);
    }
    
    createJoysticks() {
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;
        
        this.moveJoystickContainer = this.add.container(120, height - 120);
        this.moveJoystickContainer.setDepth(1001);
        
        this.moveJoystickBase = this.add.circle(0, 0, JOYSTICK_CONFIG.BASE_RADIUS, JOYSTICK_CONFIG.BASE_COLOR, JOYSTICK_CONFIG.ALPHA);
        this.moveJoystickBase.setStrokeStyle(3, 0x888888);
        this.moveJoystickThumb = this.add.circle(0, 0, JOYSTICK_CONFIG.THUMB_RADIUS, JOYSTICK_CONFIG.THUMB_COLOR, JOYSTICK_CONFIG.ALPHA + 0.2);
        this.moveJoystickThumb.setStrokeStyle(2, 0xaaaaaa);
        
        const moveLabel = this.add.text(0, JOYSTICK_CONFIG.BASE_RADIUS + 20, 'MOVE', {
            fontSize: '12px',
            fill: '#888888'
        }).setOrigin(0.5);
        
        this.moveJoystickContainer.add([this.moveJoystickBase, this.moveJoystickThumb, moveLabel]);
        
        this.aimJoystickContainer = this.add.container(width - 120, height - 120);
        this.aimJoystickContainer.setDepth(1001);
        
        this.aimJoystickBase = this.add.circle(0, 0, JOYSTICK_CONFIG.BASE_RADIUS, 0x663333, JOYSTICK_CONFIG.ALPHA);
        this.aimJoystickBase.setStrokeStyle(3, 0xaa6666);
        this.aimJoystickThumb = this.add.circle(0, 0, JOYSTICK_CONFIG.THUMB_RADIUS, 0x994444, JOYSTICK_CONFIG.ALPHA + 0.2);
        this.aimJoystickThumb.setStrokeStyle(2, 0xcc6666);
        
        const aimLabel = this.add.text(0, JOYSTICK_CONFIG.BASE_RADIUS + 20, 'AIM & SHOOT', {
            fontSize: '12px',
            fill: '#aa6666'
        }).setOrigin(0.5);
        
        this.aimJoystickContainer.add([this.aimJoystickBase, this.aimJoystickThumb, aimLabel]);
    }
    
    createMinimap() {
        const minimapSize = 150;
        const padding = 10;
        const width = this.cameras.main.width;
        
        this.minimapContainer = this.add.container(width - minimapSize / 2 - padding, minimapSize / 2 + 60);
        this.minimapContainer.setDepth(999);
        
        this.minimapBg = this.add.rectangle(0, 0, minimapSize, minimapSize, 0x000000, 0.7);
        this.minimapBg.setStrokeStyle(2, 0x444444);
        
        this.minimapContent = this.add.graphics();
        
        this.minimapContainer.add([this.minimapBg, this.minimapContent]);
    }
    
    createRespawnOverlay() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.respawnContainer = this.add.container(width / 2, height / 2);
        this.respawnContainer.setDepth(2000);
        this.respawnContainer.setVisible(false);
        
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        
        const deathText = this.add.text(0, -60, '💀 YOU DIED', {
            fontSize: '48px',
            fontStyle: 'bold',
            fill: '#ff4444',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.killerText = this.add.text(0, 0, 'Killed by: Bot', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.respawnTimerText = this.add.text(0, 50, 'Respawning in: 20', {
            fontSize: '28px',
            fontStyle: 'bold',
            fill: '#ffff00'
        }).setOrigin(0.5);
        
        this.respawnContainer.add([overlay, deathText, this.killerText, this.respawnTimerText]);
    }
    
    setupEvents() {
        this.gameScene.events.on('gameUpdate', this.updateHUD, this);
        this.gameScene.events.on('joystickUpdate', this.updateJoysticks, this);
        this.gameScene.events.on('zoneShrinking', this.showZoneWarning, this);
        this.gameScene.events.on('showRespawn', this.showRespawnOverlay, this);
        this.gameScene.events.on('playerRespawned', this.hideRespawnOverlay, this);
    }
    
    updateHUD(data) {
        const { player, zone, gameTime, aliveCount } = data;
        
        if (player) {
            const healthPercent = player.health / player.maxHealth;
            this.healthBar.setScale(healthPercent, 1);
            this.healthBar.x = this.healthBarBg.x - (1 - healthPercent) * 90;
            this.healthText.setText(Math.ceil(player.health));
            
            if (healthPercent > 0.6) {
                this.healthBar.setFillStyle(GAME_CONFIG.COLORS.HEALTH_BAR);
            } else if (healthPercent > 0.3) {
                this.healthBar.setFillStyle(0xf1c40f);
            } else {
                this.healthBar.setFillStyle(0xe74c3c);
            }
            
            this.ammoText.setText(player.ammo);
            this.weaponText.setText(GAME_CONFIG.WEAPONS[player.currentWeapon].name);
            this.killsText.setText(`🎯 Kills: ${player.kills}`);
        }
        
        this.aliveText.setText(`👥 Alive: ${aliveCount}`);
        this.timerText.setText(`⏱️ ${Utils.formatTime(gameTime)}`);
        
        this.updateMinimap(data);
    }
    
    updateMinimap(data) {
        const { player, zone } = data;
        const minimapSize = 150;
        const scale = minimapSize / GAME_CONFIG.MAP_WIDTH;
        
        this.minimapContent.clear();
        
        this.minimapContent.fillStyle(GAME_CONFIG.COLORS.GRASS, 0.5);
        this.minimapContent.fillRect(-minimapSize / 2, -minimapSize / 2, minimapSize, minimapSize);
        
        this.minimapContent.fillStyle(GAME_CONFIG.COLORS.DANGER_ZONE, 0.3);
        this.minimapContent.fillRect(-minimapSize / 2, -minimapSize / 2, minimapSize, minimapSize);
        
        this.minimapContent.fillStyle(GAME_CONFIG.COLORS.GRASS, 1);
        const zoneX = (zone.centerX * scale) - minimapSize / 2;
        const zoneY = (zone.centerY * scale) - minimapSize / 2;
        const zoneR = zone.radius * scale;
        this.minimapContent.fillCircle(zoneX, zoneY, zoneR);
        
        this.minimapContent.lineStyle(1, GAME_CONFIG.COLORS.SAFE_ZONE, 1);
        this.minimapContent.strokeCircle(zoneX, zoneY, zoneR);
        
        for (const bot of this.gameScene.bots) {
            if (bot.isAlive) {
                const botPos = bot.getPosition();
                const bx = (botPos.x * scale) - minimapSize / 2;
                const by = (botPos.y * scale) - minimapSize / 2;
                this.minimapContent.fillStyle(GAME_CONFIG.COLORS.BOT, 1);
                this.minimapContent.fillCircle(bx, by, 3);
            }
        }
        
        if (player && player.isAlive) {
            const playerPos = player.getPosition();
            const px = (playerPos.x * scale) - minimapSize / 2;
            const py = (playerPos.y * scale) - minimapSize / 2;
            this.minimapContent.fillStyle(GAME_CONFIG.COLORS.PLAYER, 1);
            this.minimapContent.fillCircle(px, py, 4);
            this.minimapContent.lineStyle(1, 0xffffff, 1);
            this.minimapContent.strokeCircle(px, py, 4);
        }
    }
    
    updateJoysticks(moveJoystick, aimJoystick) {
        if (moveJoystick.active) {
            const dx = moveJoystick.currentX - moveJoystick.startX;
            const dy = moveJoystick.currentY - moveJoystick.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = JOYSTICK_CONFIG.BASE_RADIUS;
            
            if (distance > maxDist) {
                const ratio = maxDist / distance;
                this.moveJoystickThumb.x = dx * ratio;
                this.moveJoystickThumb.y = dy * ratio;
            } else {
                this.moveJoystickThumb.x = dx;
                this.moveJoystickThumb.y = dy;
            }
            
            this.moveJoystickContainer.x = moveJoystick.startX;
            this.moveJoystickContainer.y = moveJoystick.startY;
            this.moveJoystickContainer.setAlpha(1);
        } else {
            this.moveJoystickThumb.x = 0;
            this.moveJoystickThumb.y = 0;
            this.moveJoystickContainer.x = 120;
            this.moveJoystickContainer.y = this.cameras.main.height - 120;
            this.moveJoystickContainer.setAlpha(0.7);
        }
        
        if (aimJoystick.active) {
            const dx = aimJoystick.currentX - aimJoystick.startX;
            const dy = aimJoystick.currentY - aimJoystick.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = JOYSTICK_CONFIG.BASE_RADIUS;
            
            if (distance > maxDist) {
                const ratio = maxDist / distance;
                this.aimJoystickThumb.x = dx * ratio;
                this.aimJoystickThumb.y = dy * ratio;
            } else {
                this.aimJoystickThumb.x = dx;
                this.aimJoystickThumb.y = dy;
            }
            
            this.aimJoystickContainer.x = aimJoystick.startX;
            this.aimJoystickContainer.y = aimJoystick.startY;
            this.aimJoystickContainer.setAlpha(1);
            
            this.aimJoystickBase.setFillStyle(0x884444, JOYSTICK_CONFIG.ALPHA);
        } else {
            this.aimJoystickThumb.x = 0;
            this.aimJoystickThumb.y = 0;
            this.aimJoystickContainer.x = this.cameras.main.width - 120;
            this.aimJoystickContainer.y = this.cameras.main.height - 120;
            this.aimJoystickContainer.setAlpha(0.7);
            this.aimJoystickBase.setFillStyle(0x663333, JOYSTICK_CONFIG.ALPHA);
        }
    }
    
    showZoneWarning() {
        this.zoneWarning.setVisible(true);
        
        this.tweens.add({
            targets: this.zoneWarning,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.zoneWarning.setVisible(false);
                this.zoneWarning.setAlpha(1);
            }
        });
    }
    
    showRespawnOverlay(killer) {
        this.respawnContainer.setVisible(true);
        
        if (killer && killer.name) {
            this.killerText.setText(`Killed by: ${killer.name}`);
        } else if (killer) {
            this.killerText.setText('Killed by: Enemy');
        } else {
            this.killerText.setText('Killed by: Zone');
        }
        
        let timeLeft = GAME_CONFIG.RESPAWN_TIME / 1000;
        this.respawnTimerText.setText(`Respawning in: ${timeLeft}`);
        
        this.respawnTimerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                timeLeft--;
                this.respawnTimerText.setText(`Respawning in: ${timeLeft}`);
            },
            repeat: timeLeft - 1
        });
    }
    
    hideRespawnOverlay() {
        this.respawnContainer.setVisible(false);
        
        if (this.respawnTimerEvent) {
            this.respawnTimerEvent.destroy();
        }
    }
}
