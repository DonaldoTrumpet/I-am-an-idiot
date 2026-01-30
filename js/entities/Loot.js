class Loot {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.config = GAME_CONFIG.LOOT_TYPES[type];
        this.active = true;
        
        this.container = scene.add.container(x, y);
        
        const bg = scene.add.circle(0, 0, 15, 0x000000, 0.5);
        const item = scene.add.circle(0, 0, 12, this.config.color);
        item.setStrokeStyle(2, 0xffffff);
        
        let icon;
        switch (type) {
            case 'HEALTH':
                icon = scene.add.text(0, 0, '+', {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    fill: '#ffffff'
                }).setOrigin(0.5);
                break;
            case 'AMMO':
                icon = scene.add.text(0, 0, '•', {
                    fontSize: '20px',
                    fill: '#000000'
                }).setOrigin(0.5);
                break;
            case 'SPEED_BOOST':
                icon = scene.add.text(0, 0, '»', {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    fill: '#000000'
                }).setOrigin(0.5);
                break;
            case 'DAMAGE_BOOST':
                icon = scene.add.text(0, 0, '!', {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    fill: '#000000'
                }).setOrigin(0.5);
                break;
        }
        
        this.container.add([bg, item, icon]);
        this.container.setDepth(3);
        
        scene.physics.world.enable(this.container);
        this.container.body.setCircle(15);
        this.container.body.setOffset(-15, -15);
        this.container.body.setImmovable(true);
        
        this.container.setData('loot', this);
        
        scene.tweens.add({
            targets: this.container,
            y: y - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        scene.tweens.add({
            targets: item,
            alpha: 0.7,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    get x() {
        return this.container.x;
    }
    
    get y() {
        return this.container.y;
    }
    
    collect(player) {
        if (!this.active) return;
        
        switch (this.type) {
            case 'HEALTH':
                player.heal(this.config.value);
                break;
            case 'AMMO':
                player.addAmmo(this.config.value);
                break;
            case 'SPEED_BOOST':
            case 'DAMAGE_BOOST':
                player.applyBoost(this.type, this.config.value, this.config.duration);
                break;
        }
        
        this.scene.sound.play('pickup', { volume: 0.4 });
        
        this.scene.tweens.add({
            targets: this.container,
            scale: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.destroy();
            }
        });
        
        this.active = false;
    }
    
    destroy() {
        this.active = false;
        if (this.container) {
            this.container.destroy();
        }
    }
}

class WeaponLoot {
    constructor(scene, x, y, weaponType) {
        this.scene = scene;
        this.weaponType = weaponType;
        this.config = GAME_CONFIG.WEAPONS[weaponType];
        this.active = true;
        
        this.container = scene.add.container(x, y);
        
        const bg = scene.add.rectangle(0, 0, 40, 20, 0x000000, 0.5);
        bg.setStrokeStyle(2, this.config.color);
        
        const weapon = scene.add.rectangle(0, 0, 30, 10, this.config.color);
        
        const nameText = scene.add.text(0, 18, this.config.name, {
            fontSize: '10px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.container.add([bg, weapon, nameText]);
        this.container.setDepth(3);
        
        scene.physics.world.enable(this.container);
        this.container.body.setSize(40, 20);
        this.container.body.setOffset(-20, -10);
        this.container.body.setImmovable(true);
        
        this.container.setData('weaponLoot', this);
        
        scene.tweens.add({
            targets: this.container,
            y: y - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    get x() {
        return this.container.x;
    }
    
    get y() {
        return this.container.y;
    }
    
    collect(player) {
        if (!this.active) return;
        
        player.switchWeapon(this.weaponType);
        
        this.scene.sound.play('pickup', { volume: 0.5 });
        
        this.scene.tweens.add({
            targets: this.container,
            scale: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.destroy();
            }
        });
        
        this.active = false;
    }
    
    destroy() {
        this.active = false;
        if (this.container) {
            this.container.destroy();
        }
    }
}
