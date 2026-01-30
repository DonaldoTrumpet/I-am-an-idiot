class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        this.createLoadingBar();
    }
    
    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xff6b6b, 1);
            progressBar.fillRect(width / 2 - 155, height / 2 + 5, 310 * value, 20);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
    
    create() {
        this.createSounds();
        
        document.getElementById('loading').style.display = 'none';
        
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
    
    createSounds() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.game.sound.add('shoot', this.createShootSound());
        this.game.sound.add('hit', this.createHitSound());
        this.game.sound.add('death', this.createDeathSound());
        this.game.sound.add('pickup', this.createPickupSound());
        this.game.sound.add('zone', this.createZoneSound());
    }
    
    createShootSound() {
        return {
            play: (config = {}) => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
                
                gain.gain.setValueAtTime(config.volume || 0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            }
        };
    }
    
    createHitSound() {
        return {
            play: (config = {}) => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
                
                gain.gain.setValueAtTime(config.volume || 0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
            }
        };
    }
    
    createDeathSound() {
        return {
            play: (config = {}) => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
                
                gain.gain.setValueAtTime(config.volume || 0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            }
        };
    }
    
    createPickupSound() {
        return {
            play: (config = {}) => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
                
                gain.gain.setValueAtTime(config.volume || 0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
            }
        };
    }
    
    createZoneSound() {
        return {
            play: (config = {}) => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                
                gain.gain.setValueAtTime(config.volume || 0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            }
        };
    }
}
