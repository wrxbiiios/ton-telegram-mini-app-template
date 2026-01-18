import Phaser from 'phaser';
import { GameState, Player, Enemy, Bullet, NFTUpgrade } from './types';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private spaceBar!: Phaser.Input.Keyboard.Key;
  
  private score: number = 0;
  private health: number = 100;
  private wave: number = 1;
  private enemySpawnTimer: number = 0;
  private lastShootTime: number = 0;
  
  // Multiplayer
  private otherPlayers: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private socket: any;
  
  // NFT bonuses
  private nftBonuses: {
    damageMultiplier: number;
    fireRateMultiplier: number;
    healthBonus: number;
    speedMultiplier: number;
  } = {
    damageMultiplier: 1,
    fireRateMultiplier: 1,
    healthBonus: 0,
    speedMultiplier: 1,
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { socket?: any; nftUpgrades?: NFTUpgrade[] }) {
    this.socket = data.socket;
    if (data.nftUpgrades) {
      this.applyNFTBonuses(data.nftUpgrades);
    }
  }

  preload() {
    // Create placeholder graphics for now
    this.createPlaceholderAssets();
  }

  create() {
    // Set up world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    // Create player
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);

    // Create groups
    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group({
      runChildUpdate: true,
    });

    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceBar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Set up click to shoot
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.shootTowards(pointer.x, pointer.y);
    });

    // Set up collisions
    this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy as any, undefined, this);

    // Apply health bonus from NFTs
    this.health = 100 + this.nftBonuses.healthBonus;

    // Set up multiplayer listeners
    if (this.socket) {
      this.setupMultiplayerListeners();
    }

    // Emit player joined
    this.emitPlayerUpdate();
  }

  update(time: number, delta: number) {
    // Player movement
    this.handlePlayerMovement();

    // Auto-shoot with space bar
    if (this.spaceBar.isDown) {
      this.shootInDirection();
    }

    // Enemy spawning
    this.enemySpawnTimer += delta;
    if (this.enemySpawnTimer > 2000 / this.wave) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;
    }

    // Move enemies towards player
    this.enemies.children.entries.forEach((enemy: any) => {
      this.physics.moveToObject(enemy, this.player, 100);
    });

    // Emit player position to other players
    if (this.socket && time % 100 < delta) {
      this.emitPlayerUpdate();
    }
  }

  private createPlaceholderAssets() {
    // Create cyberpunk skull player sprite
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x00ffff, 1);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.fillStyle(0xff00ff, 1);
    playerGraphics.fillRect(8, 8, 4, 4);
    playerGraphics.fillRect(20, 8, 4, 4);
    playerGraphics.fillTriangle(16, 24, 10, 20, 22, 20);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Create enemy sprite
    const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    enemyGraphics.fillStyle(0xff0000, 1);
    enemyGraphics.fillCircle(12, 12, 12);
    enemyGraphics.fillStyle(0x000000, 1);
    enemyGraphics.fillCircle(8, 10, 3);
    enemyGraphics.fillCircle(16, 10, 3);
    enemyGraphics.generateTexture('enemy', 24, 24);
    enemyGraphics.destroy();

    // Create bullet sprite
    const bulletGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    bulletGraphics.fillStyle(0xffff00, 1);
    bulletGraphics.fillCircle(4, 4, 4);
    bulletGraphics.generateTexture('bullet', 8, 8);
    bulletGraphics.destroy();

    // Create other player sprite
    const otherPlayerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    otherPlayerGraphics.fillStyle(0x00ff00, 1);
    otherPlayerGraphics.fillCircle(16, 16, 16);
    otherPlayerGraphics.fillStyle(0x0000ff, 1);
    otherPlayerGraphics.fillRect(8, 8, 4, 4);
    otherPlayerGraphics.fillRect(20, 8, 4, 4);
    otherPlayerGraphics.generateTexture('otherPlayer', 32, 32);
    otherPlayerGraphics.destroy();
  }

  private handlePlayerMovement() {
    const speed = 200 * this.nftBonuses.speedMultiplier;
    const velocity = { x: 0, y: 0 };

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocity.x = -speed;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocity.x = speed;
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocity.y = -speed;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocity.y = speed;
    }

    this.player.setVelocity(velocity.x, velocity.y);
  }

  private shootInDirection() {
    const now = this.time.now;
    const fireRate = 200 / this.nftBonuses.fireRateMultiplier;
    
    if (now - this.lastShootTime < fireRate) return;
    this.lastShootTime = now;

    const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet') as Phaser.Physics.Arcade.Sprite;
    
    // Get direction based on player rotation or last movement
    const angle = this.player.rotation || 0;
    bullet.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
    
    this.time.delayedCall(2000, () => {
      bullet.destroy();
    });
  }

  private shootTowards(x: number, y: number) {
    const now = this.time.now;
    const fireRate = 200 / this.nftBonuses.fireRateMultiplier;
    
    if (now - this.lastShootTime < fireRate) return;
    this.lastShootTime = now;

    const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet') as Phaser.Physics.Arcade.Sprite;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, x, y);
    
    bullet.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
    this.player.rotation = angle;
    
    this.time.delayedCall(2000, () => {
      bullet.destroy();
    });
  }

  private spawnEnemy() {
    const side = Phaser.Math.Between(0, 3);
    let x, y;

    switch (side) {
      case 0: // Top
        x = Phaser.Math.Between(0, 800);
        y = -20;
        break;
      case 1: // Right
        x = 820;
        y = Phaser.Math.Between(0, 600);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(0, 800);
        y = 620;
        break;
      default: // Left
        x = -20;
        y = Phaser.Math.Between(0, 600);
    }

    const enemy = this.enemies.create(x, y, 'enemy') as Phaser.Physics.Arcade.Sprite;
    enemy.setData('health', 1 * this.wave);
  }

  private bulletHitEnemy(bullet: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
    const damage = 1 * this.nftBonuses.damageMultiplier;
    const enemyHealth = enemy.getData('health') - damage;
    
    if (enemyHealth <= 0) {
      enemy.destroy();
      this.score += 10 * this.wave;
      
      // Check for wave progression
      if (this.enemies.countActive() === 0 && this.score > this.wave * 100) {
        this.wave++;
      }
    } else {
      enemy.setData('health', enemyHealth);
    }
    
    bullet.destroy();
  }

  private playerHitEnemy(player: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
    this.health -= 10;
    enemy.destroy();
    
    if (this.health <= 0) {
      this.gameOver();
    }
  }

  private gameOver() {
    this.scene.pause();
    this.scene.launch('GameOverScene', { score: this.score, wave: this.wave });
  }

  private applyNFTBonuses(nftUpgrades: NFTUpgrade[]) {
    nftUpgrades.forEach((nft) => {
      switch (nft.type) {
        case 'weapon':
          this.nftBonuses.damageMultiplier += nft.bonus.damage || 0;
          this.nftBonuses.fireRateMultiplier += nft.bonus.fireRate || 0;
          break;
        case 'armor':
          this.nftBonuses.healthBonus += nft.bonus.health || 0;
          break;
        case 'ability':
          // Special abilities can be added here
          break;
        case 'cosmetic':
          // Cosmetic changes don't affect gameplay
          break;
      }
    });
  }

  private setupMultiplayerListeners() {
    this.socket.on('playerMoved', (data: { id: string; x: number; y: number; rotation: number }) => {
      this.updateOtherPlayer(data);
    });

    this.socket.on('playerJoined', (data: { id: string; x: number; y: number }) => {
      this.addOtherPlayer(data);
    });

    this.socket.on('playerLeft', (data: { id: string }) => {
      this.removeOtherPlayer(data.id);
    });

    this.socket.on('enemySpawned', (data: { id: string; x: number; y: number }) => {
      // Sync enemy spawns in multiplayer
    });
  }

  private emitPlayerUpdate() {
    if (!this.socket) return;
    
    this.socket.emit('playerMove', {
      x: this.player.x,
      y: this.player.y,
      rotation: this.player.rotation,
      health: this.health,
      score: this.score,
    });
  }

  private addOtherPlayer(data: { id: string; x: number; y: number }) {
    const otherPlayer = this.physics.add.sprite(data.x, data.y, 'otherPlayer');
    otherPlayer.setScale(1.5);
    this.otherPlayers.set(data.id, otherPlayer);
  }

  private updateOtherPlayer(data: { id: string; x: number; y: number; rotation: number }) {
    const otherPlayer = this.otherPlayers.get(data.id);
    if (otherPlayer) {
      otherPlayer.setPosition(data.x, data.y);
      otherPlayer.setRotation(data.rotation);
    }
  }

  private removeOtherPlayer(id: string) {
    const otherPlayer = this.otherPlayers.get(id);
    if (otherPlayer) {
      otherPlayer.destroy();
      this.otherPlayers.delete(id);
    }
  }

  public getGameState(): GameState {
    return {
      score: this.score,
      health: this.health,
      wave: this.wave,
      playerPosition: { x: this.player.x, y: this.player.y },
    };
  }
}
