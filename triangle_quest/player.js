/**
 * player.js - Karakter Utama Segitiga Kuning, Gerakan Prosedural, dan Menembak Modular
 */

import { IMG, getTintedImage } from './assets.js';
import { SAVE, saveGame } from './save.js';
import { computeStats, getActiveWeapon, getBulletAssetForCore } from './weapons.js';
import { Sound } from './audio.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 48;
    this.height = 48;

    // Kecepatan & Fisika
    this.speed = 340;
    this.jumpForce = -620;
    this.gravity = 1400;
    this.grounded = false;
    this.facing = 1; // 1 = kanan, -1 = kiri

    // Status Nyawa & Invincibility
    this.maxHp = 5;
    this.hp = this.maxHp;
    this.invincibleTimer = 0;
    this.isDead = false;
    this.respawnX = x;
    this.respawnY = y;

    // Animasi Prosedural
    this.squashX = 1;
    this.squashY = 1;
    this.tilt = 0;
    this.walkCycle = 0;
    this.state = 'idle'; // 'idle', 'walk', 'jump', 'hurt', 'shoot'

    // Penembakan & Senjata
    this.shootTimer = 0;
    this.cooldownTimer = 0;
    this.muzzleTimer = 0;
    this.muzzlePos = { x: 0, y: 0 };
    this.activeWeaponStats = computeStats(getActiveWeapon(SAVE.activeLoadoutIndex, SAVE.loadouts), SAVE.parts);

    // Buffer Lompat & Coyote Time
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
  }

  updateStats() {
    this.activeWeaponStats = computeStats(getActiveWeapon(SAVE.activeLoadoutIndex, SAVE.loadouts), SAVE.parts);
  }

  setRespawn(x, y) {
    this.respawnX = x;
    this.respawnY = y;
  }

  takeDamage(amount = 1, knockbackDir = 0) {
    if (this.invincibleTimer > 0 || this.isDead) return false;

    this.hp -= amount;
    this.invincibleTimer = 1.5; // 1.5 detik kebal
    this.state = 'hurt';
    Sound.playHit();

    // Efek dorongan mundur
    this.vx = (knockbackDir || -this.facing) * 260;
    this.vy = -280;
    this.squashX = 0.8;
    this.squashY = 1.3;

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
    return true;
  }

  die() {
    this.isDead = true;
    Sound.playExplosion(true);
  }

  respawn() {
    this.x = this.respawnX;
    this.y = this.respawnY;
    this.vx = 0;
    this.vy = 0;
    this.hp = this.maxHp;
    this.isDead = false;
    this.invincibleTimer = 1.5;
  }

  update(dt, input, level, bullets, particles) {
    if (this.isDead) return;

    this.updateStats();

    // Cooldown & timer
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    if (this.cooldownTimer > 0) this.cooldownTimer -= dt;
    if (this.muzzleTimer > 0) this.muzzleTimer -= dt;
    if (this.shootTimer > 0) {
      this.shootTimer -= dt;
      if (this.shootTimer <= 0 && this.grounded) {
        this.state = 'idle';
      }
    }

    // Input Gerak Horizontal
    let moveDir = 0;
    if (input.left) moveDir -= 1;
    if (input.right) moveDir += 1;

    if (moveDir !== 0) {
      this.facing = moveDir;
      this.vx = moveDir * this.speed;
      this.walkCycle += dt * 12;
      this.tilt = moveDir * 0.12; // Miringkan sedikit saat bergerak
      if (this.grounded && this.shootTimer <= 0) this.state = 'walk';
    } else {
      this.vx *= 0.65; // Gesekan / rem lembut
      this.tilt *= 0.8;
      if (this.grounded && this.shootTimer <= 0) this.state = 'idle';
    }

    // Coyote time & Jump buffer
    if (this.grounded) {
      this.coyoteTimer = 0.12;
    } else {
      this.coyoteTimer -= dt;
    }

    if (input.jumpJustPressed) {
      this.jumpBuffer = 0.15;
    } else if (this.jumpBuffer > 0) {
      this.jumpBuffer -= dt;
    }

    // Eksekusi Lompat
    if (this.jumpBuffer > 0 && this.coyoteTimer > 0) {
      this.vy = this.jumpForce;
      this.grounded = false;
      this.coyoteTimer = 0;
      this.jumpBuffer = 0;
      this.squashX = 0.7; // Regang vertikal saat melompat
      this.squashY = 1.4;
      Sound.playJump();
      if (this.shootTimer <= 0) this.state = 'jump';

      // Partikel debu lompat
      if (particles) {
        particles.spawnDust(this.x + this.width / 2, this.y + this.height);
      }
    }

    // Gravitasi
    this.vy += this.gravity * dt;
    if (this.vy > 900) this.vy = 900; // Terminal velocity

    // Gerakan Fisika & Tabrakan dengan Platform
    this.x += this.vx * dt;
    this.resolveHorizontalCollisions(level);

    const prevY = this.y;
    this.y += this.vy * dt;
    this.resolveVerticalCollisions(level, prevY, particles);

    // Jatuh ke jurang
    if (this.y > level.height + 100) {
      this.takeDamage(999);
    }

    // Menembak
    if (input.shoot && this.cooldownTimer <= 0) {
      this.shoot(bullets, input.aimUp);
    }

    // Pemulihan Squash & Stretch kembali ke 1.0 secara bertahap
    this.squashX += (1 - this.squashX) * 12 * dt;
    this.squashY += (1 - this.squashY) * 12 * dt;
  }

  shoot(bullets, aimUp = false) {
    const stats = this.activeWeaponStats;
    this.cooldownTimer = 1 / stats.fireRate;
    this.shootTimer = 0.18;
    this.muzzleTimer = 0.1;
    this.state = 'shoot';

    // Sudut tembakan
    let angle = this.facing === 1 ? 0 : Math.PI;
    if (aimUp) {
      angle = this.facing === 1 ? -Math.PI / 4 : -Math.PI * 3 / 4;
    }

    // Sebaran peluru (spread)
    if (stats.spread > 0) {
      const spreadRad = (stats.spread * Math.PI) / 180;
      angle += (Math.random() - 0.5) * spreadRad;
    }

    // Recoil mundur
    this.vx -= Math.cos(angle) * (stats.recoil * 35);

    // Titik spawn peluru di ujung blaster
    const spawnX = this.x + this.width / 2 + Math.cos(angle) * 32;
    const spawnY = this.y + this.height / 2 + Math.sin(angle) * 32;
    this.muzzlePos = { x: spawnX, y: spawnY };

    // Tentukan aset peluru berdasarkan core
    const activeLoadout = SAVE.loadouts[SAVE.activeLoadoutIndex];
    const bulletAsset = getBulletAssetForCore(activeLoadout.core);

    // Periksa critical hit
    const isCrit = Math.random() < stats.critChance;
    const finalDamage = isCrit ? stats.damage * stats.critMult : stats.damage;

    bullets.push({
      x: spawnX,
      y: spawnY,
      vx: Math.cos(angle) * stats.projectileSpeed,
      vy: Math.sin(angle) * stats.projectileSpeed,
      damage: finalDamage,
      isCrit: isCrit,
      rangeLeft: stats.range,
      effect: stats.effect,
      pierceLeft: stats.pierce,
      bounceLeft: stats.bounce,
      asset: bulletAsset,
      angle: angle,
      isPlayer: true
    });

    Sound.playShoot(activeLoadout.core);
  }

  resolveHorizontalCollisions(level) {
    // Batas kiri & kanan dunia
    if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    }
    if (this.x + this.width > level.width) {
      this.x = level.width - this.width;
      this.vx = 0;
    }
  }

  resolveVerticalCollisions(level, prevY, particles) {
    this.grounded = false;

    // Periksa semua platform
    for (let i = 0; i < level.platforms.length; i++) {
      const plat = level.platforms[i];

      // Periksa overlap horizontal
      if (this.x + this.width > plat.x && this.x < plat.x + plat.width) {
        if (plat.isOneWay) {
          // One-way: Hanya mendarat jika sebelumnya berada di atas platform dan sedang bergerak jatuh
          const playerBottom = this.y + this.height;
          const prevBottom = prevY + this.height;
          if (prevBottom <= plat.y + 8 && playerBottom >= plat.y && this.vy >= 0) {
            this.landOn(plat.y, particles);
            break;
          }
        } else {
          // Solid ground
          if (this.vy >= 0 && this.y + this.height >= plat.y && prevY + this.height <= plat.y + 24) {
            this.landOn(plat.y, particles);
            break;
          }
        }
      }
    }
  }

  landOn(surfaceY, particles) {
    this.y = surfaceY - this.height;
    this.vy = 0;
    if (!this.grounded) {
      this.grounded = true;
      // Efek squish saat mendarat
      this.squashX = 1.35;
      this.squashY = 0.7;
      if (particles) {
        particles.spawnDust(this.x + this.width / 2, this.y + this.height);
      }
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    // Efek kelap-kelip saat invincible
    if (this.invincibleTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      return;
    }

    ctx.save();
    // Translasi ke titik tengah karakter
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    // Squash & Stretch + Tilt
    ctx.scale(this.facing * this.squashX, this.squashY);
    ctx.rotate(this.tilt);

    // Bobbing saat jalan
    let bobY = 0;
    if (this.state === 'walk') {
      bobY = Math.sin(this.walkCycle) * 3;
    }

    // Pilih gambar pose pemain
    let img = IMG.player_idle;
    if (this.state === 'hurt') img = IMG.player_hurt || IMG.player_idle;
    else if (this.state === 'shoot') img = IMG.player_shoot || IMG.player_idle;
    else if (this.state === 'jump') img = IMG.player_idle;

    if (img) {
      // Gambar karakter segitiga kuning berwajah
      ctx.drawImage(img, -this.width / 2, -this.height / 2 + bobY, this.width, this.height);
    }

    // Gambar Blaster di tangan
    const blasterImg = IMG.blaster;
    if (blasterImg) {
      const tintedBlaster = getTintedImage(blasterImg, SAVE.blasterColor || '#f59e0b');
      ctx.drawImage(tintedBlaster, 6, -6 + bobY, 32, 24);
    }

    ctx.restore();

    // Gambar Muzzle Flash jika baru saja menembak
    if (this.muzzleTimer > 0 && IMG.muzzle_flash) {
      ctx.save();
      ctx.translate(this.muzzlePos.x, this.muzzlePos.y);
      ctx.drawImage(IMG.muzzle_flash, -16, -16, 32, 32);
      ctx.restore();
    }
  }
}
