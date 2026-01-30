class Bot extends Player {
    constructor(scene, x, y, name = 'Bot') {
        super(scene, x, y, false);
        this.name = name;
        this.target = null;
        this.lastDecisionTime = 0;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.state = 'wander';
        this.fleeTarget = null;
        this.stuckCounter = 0;
        this.lastPosition = { x, y };
        
        this.body.setFillStyle(GAME_CONFIG.COLORS.BOT);
        
        this.nameText = this.scene.add.text(0, -50, this.name, {
            fontSize: '12px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.container.add(this.nameText);
    }
    
    update(time, delta) {
        if (!this.isAlive) return;
        
        super.update(time, delta);
        
        if (time - this.lastDecisionTime > GAME_CONFIG.BOT_DECISION_INTERVAL) {
            this.makeDecision();
            this.lastDecisionTime = time;
        }
        
        this.executeState();
        this.checkStuck();
    }
    
    makeDecision() {
        const zone = this.scene.zone;
        const pos = this.getPosition();
        const distToZoneCenter = Utils.distance(pos.x, pos.y, zone.centerX, zone.centerY);
        
        if (distToZoneCenter > zone.radius - 100) {
            this.state = 'moveToZone';
            return;
        }
        
        const nearestEnemy = this.findNearestEnemy();
        
        if (nearestEnemy) {
            const dist = Utils.distance(pos.x, pos.y, nearestEnemy.x, nearestEnemy.y);
            
            if (this.health < 30 && dist < GAME_CONFIG.BOT_DETECTION_RANGE) {
                this.state = 'flee';
                this.fleeTarget = nearestEnemy;
            } else if (dist < GAME_CONFIG.BOT_SHOOT_RANGE) {
                this.state = 'attack';
                this.target = nearestEnemy;
            } else if (dist < GAME_CONFIG.BOT_DETECTION_RANGE) {
                this.state = 'chase';
                this.target = nearestEnemy;
            } else {
                this.state = 'wander';
            }
        } else {
            const nearestLoot = this.findNearestLoot();
            if (nearestLoot && Utils.distance(pos.x, pos.y, nearestLoot.x, nearestLoot.y) < 300) {
                this.state = 'collectLoot';
                this.target = nearestLoot;
            } else {
                this.state = 'wander';
            }
        }
    }
    
    executeState() {
        const pos = this.getPosition();
        
        switch (this.state) {
            case 'wander':
                this.wander();
                break;
                
            case 'chase':
                if (this.target && this.target.entity && this.target.entity.isAlive) {
                    const angle = Utils.angle(pos.x, pos.y, this.target.x, this.target.y);
                    this.move(Math.cos(angle), Math.sin(angle));
                } else {
                    this.state = 'wander';
                }
                break;
                
            case 'attack':
                if (this.target && this.target.entity && this.target.entity.isAlive) {
                    const dist = Utils.distance(pos.x, pos.y, this.target.x, this.target.y);
                    
                    if (dist > GAME_CONFIG.BOT_SHOOT_RANGE) {
                        const angle = Utils.angle(pos.x, pos.y, this.target.x, this.target.y);
                        this.move(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5);
                    } else if (dist < 100) {
                        const angle = Utils.angle(pos.x, pos.y, this.target.x, this.target.y);
                        this.move(-Math.cos(angle) * 0.3, -Math.sin(angle) * 0.3);
                    } else {
                        this.move(0, 0);
                    }
                    
                    const bullets = this.shoot(this.target.x, this.target.y);
                    if (bullets) {
                        this.scene.addBullets(bullets);
                    }
                } else {
                    this.state = 'wander';
                }
                break;
                
            case 'flee':
                if (this.fleeTarget) {
                    const angle = Utils.angle(this.fleeTarget.x, this.fleeTarget.y, pos.x, pos.y);
                    this.move(Math.cos(angle), Math.sin(angle));
                } else {
                    this.state = 'wander';
                }
                break;
                
            case 'moveToZone':
                const zone = this.scene.zone;
                const angle = Utils.angle(pos.x, pos.y, zone.centerX, zone.centerY);
                this.move(Math.cos(angle), Math.sin(angle));
                break;
                
            case 'collectLoot':
                if (this.target && this.target.active) {
                    const angle = Utils.angle(pos.x, pos.y, this.target.x, this.target.y);
                    this.move(Math.cos(angle), Math.sin(angle));
                } else {
                    this.state = 'wander';
                }
                break;
        }
    }
    
    wander() {
        if (Math.random() < 0.02) {
            this.wanderAngle += (Math.random() - 0.5) * Math.PI;
        }
        
        const pos = this.getPosition();
        const zone = this.scene.zone;
        
        const nextX = pos.x + Math.cos(this.wanderAngle) * 50;
        const nextY = pos.y + Math.sin(this.wanderAngle) * 50;
        
        if (Utils.distance(nextX, nextY, zone.centerX, zone.centerY) > zone.radius - 150) {
            this.wanderAngle = Utils.angle(pos.x, pos.y, zone.centerX, zone.centerY);
        }
        
        if (nextX < 50 || nextX > GAME_CONFIG.MAP_WIDTH - 50 ||
            nextY < 50 || nextY > GAME_CONFIG.MAP_HEIGHT - 50) {
            this.wanderAngle += Math.PI;
        }
        
        this.move(Math.cos(this.wanderAngle) * 0.6, Math.sin(this.wanderAngle) * 0.6);
    }
    
    findNearestEnemy() {
        const pos = this.getPosition();
        let nearest = null;
        let nearestDist = Infinity;
        
        if (this.scene.player && this.scene.player.isAlive) {
            const playerPos = this.scene.player.getPosition();
            const dist = Utils.distance(pos.x, pos.y, playerPos.x, playerPos.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = { x: playerPos.x, y: playerPos.y, entity: this.scene.player };
            }
        }
        
        for (const bot of this.scene.bots) {
            if (bot !== this && bot.isAlive) {
                const botPos = bot.getPosition();
                const dist = Utils.distance(pos.x, pos.y, botPos.x, botPos.y);
                if (dist < nearestDist && dist < GAME_CONFIG.BOT_DETECTION_RANGE) {
                    nearestDist = dist;
                    nearest = { x: botPos.x, y: botPos.y, entity: bot };
                }
            }
        }
        
        return nearestDist < GAME_CONFIG.BOT_DETECTION_RANGE ? nearest : null;
    }
    
    findNearestLoot() {
        const pos = this.getPosition();
        let nearest = null;
        let nearestDist = Infinity;
        
        for (const loot of this.scene.lootItems) {
            if (loot.active) {
                const dist = Utils.distance(pos.x, pos.y, loot.x, loot.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = loot;
                }
            }
        }
        
        return nearest;
    }
    
    checkStuck() {
        const pos = this.getPosition();
        const dist = Utils.distance(pos.x, pos.y, this.lastPosition.x, this.lastPosition.y);
        
        if (dist < 2) {
            this.stuckCounter++;
            if (this.stuckCounter > 30) {
                this.wanderAngle += Math.PI / 2 + Math.random() * Math.PI;
                this.stuckCounter = 0;
            }
        } else {
            this.stuckCounter = 0;
        }
        
        this.lastPosition = pos;
    }
    
    respawn(x, y) {
        super.respawn(x, y);
        this.state = 'wander';
        this.target = null;
        this.wanderAngle = Math.random() * Math.PI * 2;
    }
}
