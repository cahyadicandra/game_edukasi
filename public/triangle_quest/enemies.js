/**
 * enemies.js - Musuh, Perilaku AI, dan Pertarungan Boss Slime King
 */

import { IMG } from './assets.js';
import { Sound } from './audio.js';
import { SAVE } from './save.js';

export class Enemy {
  constructor(type, x, y, options = {}) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 44;
    this.height = 44;
    this.facing = -1;
    this.isDead = false;
    this.isBoss = options.isBoss || false;

    // Status effects: burn, freeze, shock
    this.status = {
      burnTime: 0,
      burnTick: 0,
      freezeTime: 0,
      shockTime: 0
    };

    this.animTimer = 0;
    this.squashX = 1;
    this.squashY = 1;
    this.setupType();
  }

  setupType() {
    switch (this.type) {
      case 'slime_green':
        this.maxHp = 2;
        this.hp = this.maxHp;
        this.speed = 70;
        this.hopTimer = 1.2;
        this.canStomp = true;
        this.immuneToBullets = false;
        break;

      case 'slime_blue':
        this.maxHp = 3;
        this.hp = this.maxHp;
        this.speed = 100;
        this.jumpCooldown = 2.0;
        this.canStomp = true;
        this.immuneToBullets = false;
        break;

      case 'slime_purple':
        this.maxHp = 3;
        this.hp = this.maxHp;
        this.speed = 80;
        this.canStomp = false; // Berduri: tidak boleh diinjak!
        this.immuneToBullets = false;
        break;

      case 'bat':
        this.maxHp = 1;
        this.hp = this.maxHp;
        this.speed = 130;
        this.width = 38;
        this.height = 34;
        this.baseY = this.y;
        this.canStomp = true;
        this.immuneToBullets = false;
        break;

      case 'spike_ball':
        this.maxHp = 999;
        this.hp = this.maxHp;
        this.speed = 110;
        this.width = 40;
        this.height = 40;
        this.canStomp = false;
        this.immuneToBullets = true; // Hanya hancur oleh laser
        break;

      case 'ghost':
        this.maxHp = 2;
        this.hp = this.maxHp;
        this.speed = 110;
        this.alpha = 0.75;
        this.canStomp = false;
        this.immuneToBullets = false;
        break;

      case 'mushroom_walker':
        this.maxHp = 2;
        this.hp = this.maxHp;
        this.speed = 50;
        this.canStomp = true;
        this.springBounce = true;
        this.immuneToBullets = false;
        break;

      case 'slime_king_boss':
        this.maxHp = 30;
        this.hp = this.maxHp;
        this.width = 110;
        this.height = 96;
        this.speed = 90;
        this.phase = 1;
        this.attackTimer = 2.5;
        this.canStomp = true;
        this.immuneToBullets = false;
        break;
    }
  }

  takeHit(damage, effect = null, isLaser = false) {
    if (this.immuneToBullets && !isLaser) {
      Sound.playHit();
      return false;
    }

    this.hp -= damage;
    Sound.playHit();

    // Aplikasikan status effect
    if (effect === 'burn') {
      this.status.burnTime = 2.5;
    } else if (effect === 'freeze') {
      this.status.freezeTime = 2.0;
    } else if (effect === 'shock') {
      this.status.shockTime = 0.5;
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      Sound.playExplosion(this.isBoss);
    }
    return true;
  }

  update(dt, player, level, spawnedEnemies, enemyBullets, particles, triggerCameraShake) {
    if (this.isDead) return;

    this.animTimer += dt;

    // Status effect logic
    let speedMult = 1.0;
    if (this.status.freezeTime > 0) {
      this.status.freezeTime -= dt;
      speedMult = 0.4; // Melambat saat beku
    }

    if (this.status.burnTime > 0) {
      this.status.burnTime -= dt;
      this.status.burnTick += dt;
      if (this.status.burnTick >= 0.5) {
        this.status.burnTick = 0;
        this.hp -= 0.5;
        if (particles) {
          particles.spawnBurnSparks(this.x + this.width / 2, this.y + this.height / 2);
        }
        if (this.hp <= 0) {
          this.hp = 0;
          this.isDead = true;
          Sound.playExplosion(this.isBoss);
          return;
        }
      }
    }

    const distToPlayer = Math.hypot(player.x - this.x, player.y - this.y);

    switch (this.type) {
      case 'slime_green':
        this.hopTimer -= dt;
        if (this.hopTimer <= 0) {
          this.hopTimer = 1.4;
          this.squashX = 1.3;
          this.squashY = 0.7;
          this.vy = -260;
          this.vx = (Math.random() > 0.5 ? 1 : -1) * this.speed * speedMult;
        }
        this.vy += 900 * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.resolvePlatformCollision(level);
        break;

      case 'slime_blue':
        // Melompat mengejar pemain bila jarak < 320 px
        this.jumpCooldown -= dt;
        if (distToPlayer < 320 && this.jumpCooldown <= 0 && this.grounded) {
          this.jumpCooldown = 1.8;
          const dir = player.x > this.x ? 1 : -1;
          this.facing = dir;
          this.vx = dir * 180 * speedMult;
          this.vy = -380;
          this.grounded = false;
          this.squashX = 0.7;
          this.squashY = 1.4;
        }
        this.vy += 900 * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.resolvePlatformCollision(level);
        break;

      case 'slime_purple':
        // Patroli konstan
        if (!this.patrolDir) this.patrolDir = 1;
        this.vx = this.patrolDir * this.speed * speedMult;
        this.vy += 900 * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.resolvePlatformCollision(level);
        // Balik arah jika menabrak tepi platform
        if (this.hitEdge) this.patrolDir *= -1;
        break;

      case 'bat':
        // Terbang bergelombang & menukik ke pemain
        this.facing = player.x > this.x ? 1 : -1;
        this.x += this.facing * this.speed * speedMult * dt;
        this.y = this.baseY + Math.sin(this.animTimer * 4) * 50;
        if (distToPlayer < 240) {
          this.y += (player.y - this.y) * dt * 1.5;
        }
        break;

      case 'spike_ball':
        // Menggelinding di tanah
        if (!this.rollDir) this.rollDir = 1;
        this.x += this.rollDir * this.speed * dt;
        this.vy += 900 * dt;
        this.y += this.vy * dt;
        this.resolvePlatformCollision(level);
        // Pantul jika di batas tertentu
        if (this.x < 1700 || this.x > 3200) this.rollDir *= -1;
        break;

      case 'ghost':
        // Bergerak HANYA saat pemain membelakanginya (tidak menatap hantu)
        // Pemain menatap hantu jika (player.facing == 1 && player.x < ghost.x) atau (player.facing == -1 && player.x > ghost.x)
        const playerLookingAtGhost = (player.facing === 1 && player.x < this.x) ||
                                     (player.facing === -1 && player.x > this.x);

        if (!playerLookingAtGhost && distToPlayer < 550) {
          // Mendekati pemain secara melayang
          const angle = Math.atan2(player.y - this.y, player.x - this.x);
          this.x += Math.cos(angle) * this.speed * speedMult * dt;
          this.y += Math.sin(angle) * this.speed * speedMult * dt;
          this.alpha = 0.85;
        } else {
          // Membeku saat ditatap!
          this.alpha = 0.35;
        }
        break;

      case 'mushroom_walker':
        if (!this.walkDir) this.walkDir = -1;
        this.vx = this.walkDir * this.speed * speedMult;
        this.vy += 900 * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.resolvePlatformCollision(level);
        break;

      case 'slime_king_boss':
        this.updateBoss(dt, player, level, spawnedEnemies, enemyBullets, particles, triggerCameraShake);
        break;
    }

    // Pemulihan squash & stretch
    this.squashX += (1 - this.squashX) * 10 * dt;
    this.squashY += (1 - this.squashY) * 10 * dt;
  }

  updateBoss(dt, player, level, spawnedEnemies, enemyBullets, particles, triggerCameraShake) {
    // 3 Fase berdasarkan HP (Max: 30)
    if (this.hp > 20) {
      this.phase = 1;
    } else if (this.hp > 10) {
      this.phase = 2;
    } else {
      this.phase = 3;
    }

    this.attackTimer -= dt;

    if (this.attackTimer <= 0) {
      if (this.phase === 1) {
        // Fase 1: Melompat tinggi dan membuat gelombang kejut tanah
        this.vy = -680;
        this.grounded = false;
        this.attackTimer = 3.2;
        Sound.playBossRoar();
      } else if (this.phase === 2) {
        // Fase 2: Memanggil anak buah slime hijau
        if (spawnedEnemies) {
          spawnedEnemies.push(new Enemy('slime_green', this.x - 60, this.y));
          spawnedEnemies.push(new Enemy('slime_green', this.x + this.width + 20, this.y));
        }
        this.attackTimer = 4.0;
        Sound.playBossRoar();
      } else if (this.phase === 3) {
        // Fase 3: Menembakkan bullet_enemy berpola melingkar
        if (enemyBullets) {
          const numBullets = 8;
          for (let i = 0; i < numBullets; i++) {
            const angle = (i / numBullets) * Math.PI * 2;
            enemyBullets.push({
              x: this.x + this.width / 2,
              y: this.y + this.height / 2,
              vx: Math.cos(angle) * 220,
              vy: Math.sin(angle) * 220,
              asset: 'bullet_enemy',
              damage: 1,
              isPlayer: false
            });
          }
        }
        this.attackTimer = 2.8;
        Sound.playBossRoar();
      }
    }

    // Gravitasi Boss
    this.vy += 1100 * dt;
    const prevY = this.y;
    this.y += this.vy * dt;

    // Deteksi mendarat & shockwave
    if (!this.grounded && this.y + this.height >= level.groundY) {
      this.y = level.groundY - this.height;
      this.vy = 0;
      this.grounded = true;
      this.squashX = 1.45;
      this.squashY = 0.65;
      if (triggerCameraShake) triggerCameraShake(0.3, 14);
      if (particles) {
        particles.spawnDust(this.x + this.width / 2, this.y + this.height);
      }
    }

    // Bergerak mendekati pemain perlahan
    const dir = player.x > this.x ? 1 : -1;
    this.facing = dir;
    this.x += dir * this.speed * 0.7 * dt;
  }

  resolvePlatformCollision(level) {
    this.hitEdge = false;
    this.grounded = false;

    // Platform tanah dasar
    if (this.y + this.height >= level.groundY) {
      this.y = level.groundY - this.height;
      this.vy = 0;
      this.grounded = true;
      return;
    }

    // Platform melayang
    for (let i = 0; i < level.platforms.length; i++) {
      const p = level.platforms[i];
      if (this.x + this.width > p.x && this.x < p.x + p.width) {
        if (this.y + this.height >= p.y && this.y + this.height <= p.y + 20 && this.vy >= 0) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.grounded = true;
          return;
        }
      }
    }
  }

  getDrops() {
    const drops = [];
    if (this.isBoss) {
      drops.push({ type: 'coin', count: 50 });
      drops.push({ type: 'shard', count: 20 });
      drops.push({ type: 'ticket', count: 3 });
      return drops;
    }

    // Koin
    if (Math.random() < 0.75) {
      drops.push({ type: 'coin', count: Math.floor(Math.random() * 3) + 1 });
    }
    // Shard
    if (Math.random() < 0.20) {
      drops.push({ type: 'shard', count: 1 });
    }
    // Tiket Gacha (peluang kecil dari musuh elit / slime purple)
    if (this.type === 'slime_purple' && Math.random() < 0.12) {
      drops.push({ type: 'ticket', count: 1 });
    }
    return drops;
  }

  draw(ctx) {
    if (this.isDead) return;

    ctx.save();
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    // Alpha (untuk hantu)
    if (this.type === 'ghost') {
      ctx.globalAlpha = this.alpha || 0.7;
    }

    // Efek beku
    if (this.status.freezeTime > 0) {
      ctx.filter = 'hue-rotate(180deg) brightness(1.2)';
    }

    ctx.scale(this.facing * this.squashX, this.squashY);

    let img = null;
    switch (this.type) {
      case 'slime_green':
        img = IMG.slime_green_idle;
        break;
      case 'slime_blue':
        img = IMG.slime_blue_idle;
        break;
      case 'slime_purple':
        img = IMG.slime_purple_idle;
        break;
      case 'bat':
        // Animasi 2 frame bergantian
        img = (Math.floor(this.animTimer * 8) % 2 === 0) ? IMG.bat_wings_up : IMG.bat_wings_down;
        break;
      case 'spike_ball':
        img = IMG.spike_ball;
        break;
      case 'ghost':
        img = IMG.ghost;
        break;
      case 'mushroom_walker':
        img = IMG.mushroom_walker;
        break;
      case 'slime_king_boss':
        img = IMG.slime_king_boss;
        break;
    }

    if (img) {
      ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    }

    ctx.restore();

    // Health bar mini untuk musuh non-boss jika HP berkurang
    if (!this.isBoss && this.hp < this.maxHp && this.hp > 0) {
      ctx.save();
      const barW = 36;
      const barH = 5;
      const bx = this.x + (this.width - barW) / 2;
      const by = this.y - 10;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx, by, barW * (this.hp / this.maxHp), barH);
      ctx.restore();
    }
  }
}
