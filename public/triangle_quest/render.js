/**
 * render.js - Renderer Canvas Tajam High-DPI, Parallax 3-Lapis, Partikel & HUD
 */

import { IMG } from './assets.js';
import { getSkyColors } from './level.js';
import { SAVE } from './save.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  spawnDust(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        type: 'dust',
        x: x + (Math.random() - 0.5) * 20,
        y: y - 2,
        vx: (Math.random() - 0.5) * 60,
        vy: -Math.random() * 40 - 10,
        size: Math.random() * 5 + 3,
        alpha: 0.8,
        color: '#E2E8F0',
        decay: 2.5
      });
    }
  }

  spawnHitSpark(x, y) {
    // Gunakan aset hit_spark_1..3 berurutan
    this.particles.push({
      type: 'spark_anim',
      x: x,
      y: y,
      frame: 1,
      maxFrame: 3,
      frameTimer: 0,
      frameRate: 18,
      size: 32
    });
  }

  spawnExplosion(x, y, isLarge = false) {
    // Gunakan aset explosion_1..4
    this.particles.push({
      type: 'explosion_anim',
      x: x,
      y: y,
      frame: 1,
      maxFrame: 4,
      frameTimer: 0,
      frameRate: 14,
      size: isLarge ? 80 : 48
    });
  }

  spawnBurnSparks(x, y) {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        type: 'burn',
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 30,
        vy: -Math.random() * 50 - 20,
        size: Math.random() * 4 + 2,
        alpha: 0.9,
        color: '#F97316',
        decay: 2.2
      });
    }
  }

  spawnFloatingText(text, x, y, color = '#FBBF24') {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -55,
      alpha: 1.0,
      color
    });
  }

  update(dt) {
    // Update partikel biasa
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.type === 'spark_anim' || p.type === 'explosion_anim') {
        p.frameTimer += dt * p.frameRate;
        if (p.frameTimer >= 1) {
          p.frameTimer = 0;
          p.frame++;
          if (p.frame > p.maxFrame) {
            this.particles.splice(i, 1);
            continue;
          }
        }
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    // Update floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= 0.9 * dt;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Gambar partikel
    this.particles.forEach(p => {
      ctx.save();
      if (p.type === 'spark_anim') {
        const sparkImg = IMG[`hit_spark_${p.frame}`];
        if (sparkImg) {
          ctx.drawImage(sparkImg, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
      } else if (p.type === 'explosion_anim') {
        const expImg = IMG[`explosion_${p.frame}`];
        if (expImg) {
          ctx.drawImage(expImg, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
      } else {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Gambar floating text
    this.floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 960;
    this.height = 540;
    this.camera = { x: 0, y: 0, shakeTime: 0, shakeIntensity: 0 };
    this.cloudOffset = 0;
    this.particles = new ParticleSystem();

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);

    this.width = w;
    this.height = h;
  }

  triggerShake(duration = 0.25, intensity = 8) {
    this.camera.shakeTime = duration;
    this.camera.shakeIntensity = intensity;
  }

  updateCamera(targetX, targetY, levelWidth, levelHeight, dt) {
    // Geser kamera halus mengikuti pemain
    const targetCamX = targetX - this.width / 2;
    const targetCamY = targetY - this.height * 0.65;

    this.camera.x += (targetCamX - this.camera.x) * 6.5 * dt;
    this.camera.y += (targetCamY - this.camera.y) * 6.5 * dt;

    // Batas kamera
    if (this.camera.x < 0) this.camera.x = 0;
    if (this.camera.x > levelWidth - this.width) this.camera.x = Math.max(0, levelWidth - this.width);

    // Ketinggian vertikal dijepit
    const maxCamY = levelHeight - this.height;
    if (this.camera.y > maxCamY) this.camera.y = maxCamY;
    if (this.camera.y < -50) this.camera.y = -50;

    // Screen Shake
    if (this.camera.shakeTime > 0) {
      this.camera.shakeTime -= dt;
      const shakeAmt = this.camera.shakeIntensity * (this.camera.shakeTime / 0.25);
      this.camera.shakeOffsetX = (Math.random() - 0.5) * shakeAmt;
      this.camera.shakeOffsetY = (Math.random() - 0.5) * shakeAmt;
    } else {
      this.camera.shakeOffsetX = 0;
      this.camera.shakeOffsetY = 0;
    }

    // Pergerakan awan pelan
    this.cloudOffset += dt * 18;
  }

  render(level, player, enemies, bullets, enemyBullets) {
    const ctx = this.ctx;
    const camX = this.camera.x + this.camera.shakeOffsetX;
    const camY = this.camera.y + this.camera.shakeOffsetY;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. LANGIT BERGRADASI SESUAI ZONA
    const sky = getSkyColors(camX);
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, sky.top);
    grad.addColorStop(1, sky.bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. PARALLAX AWAN
    this.drawParallaxClouds(ctx, camX);

    // 3. PARALLAX PEGUNUNGAN & BUKIT
    this.drawParallaxLayer(ctx, IMG.mountains, camX, 0.1, this.height - 290, 420);
    this.drawParallaxLayer(ctx, IMG.hills_far, camX, 0.22, this.height - 240, 360);
    this.drawParallaxLayer(ctx, IMG.hills_near, camX, 0.45, this.height - 180, 280);

    // 4. DUNIA GAME (TERKENA TRANSLASI KAMERA)
    ctx.save();
    ctx.translate(-camX, -camY);

    // A. Dekorasi latar belakang (pohon, semak, batu di belakang pemain)
    this.drawDecorations(ctx, level.decorations, camX, false);

    // B. Checkpoints & Goal Flag
    this.drawCheckpoints(ctx, level.checkpoints, level.finishX);

    // C. Platform & Ground Tiles (dengan culling)
    this.drawPlatforms(ctx, level.platforms, camX);

    // D. Kolektibel (Koin, Hati, Star, dll)
    this.drawCollectibles(ctx, level.collectibles, camX);

    // E. Musuh
    enemies.forEach(enemy => {
      if (this.isInView(enemy.x, enemy.width, camX)) {
        enemy.draw(ctx);
      }
    });

    // F. Pemain
    player.draw(ctx);

    // G. Peluru Pemain & Peluru Musuh
    this.drawBullets(ctx, bullets);
    this.drawBullets(ctx, enemyBullets);

    // H. Partikel (Debu, Spark, Ledakan)
    this.particles.draw(ctx);

    // I. Dekorasi latar depan (beberapa semak/bunga di foreground)
    this.drawDecorations(ctx, level.decorations, camX, true);

    ctx.restore();

    // 5. HUD PEMAIN & BOSS HEALTH BAR
    this.drawHUD(ctx, player, enemies);
  }

  drawParallaxClouds(ctx, camX) {
    const clouds = [IMG.cloud_a, IMG.cloud_b, IMG.cloud_c];
    for (let i = 0; i < 4; i++) {
      const cImg = clouds[i % clouds.length];
      if (!cImg) continue;
      const x = ((i * 320 + this.cloudOffset - camX * 0.05) % (this.width + 400)) - 100;
      const y = 30 + (i * 25) % 80;
      ctx.drawImage(cImg, x, y, 140, 70);
    }
  }

  drawParallaxLayer(ctx, img, camX, factor, y, imgWidth) {
    if (!img) return;
    const startX = -(camX * factor) % imgWidth;
    for (let x = startX - imgWidth; x < this.width + imgWidth; x += imgWidth) {
      ctx.drawImage(img, x, y, imgWidth, 200);
    }
  }

  drawPlatforms(ctx, platforms, camX) {
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      if (this.isInView(p.x, p.width, camX)) {
        const img = IMG[p.asset];
        if (img) {
          ctx.drawImage(img, p.x, p.y, p.width, p.height);
        } else {
          // Fallback bila aset belum siap
          ctx.fillStyle = '#65A30D';
          ctx.fillRect(p.x, p.y, p.width, p.height);
        }
      }
    }
  }

  drawDecorations(ctx, decorations, camX, foregroundOnly) {
    decorations.forEach(dec => {
      if (dec.isForeground !== foregroundOnly) return;
      if (this.isInView(dec.x, 80, camX)) {
        const img = IMG[dec.asset];
        if (img) {
          ctx.save();
          ctx.translate(dec.x, dec.y);
          if (dec.flipX) ctx.scale(-1, 1);
          const w = 64 * dec.scale;
          const h = 64 * dec.scale;
          if (dec.isForeground) ctx.globalAlpha = 0.85;
          ctx.drawImage(img, -w / 2, -h, w, h);
          ctx.restore();
        }
      }
    });
  }

  drawCheckpoints(ctx, checkpoints, finishX) {
    checkpoints.forEach(cp => {
      const img = cp.reached ? IMG.flag_checkpoint_on : IMG.flag_checkpoint_off;
      if (img) {
        ctx.drawImage(img, cp.x - 24, cp.y - 48, 48, 48);
      }
    });

    // Goal Flag
    if (IMG.flag_goal) {
      ctx.drawImage(IMG.flag_goal, finishX - 24, 672 - 64, 52, 64);
    }
  }

  drawCollectibles(ctx, collectibles, camX) {
    const time = Date.now() / 250;
    collectibles.forEach(c => {
      if (c.collected) return;
      if (this.isInView(c.x, 32, camX)) {
        const img = IMG[c.type];
        const bob = Math.sin(time + c.x) * 4;
        if (img) {
          ctx.drawImage(img, c.x - 16, c.y - 16 + bob, 32, 32);
        }
      }
    });
  }

  drawBullets(ctx, bullets) {
    bullets.forEach(b => {
      const img = IMG[b.asset] || IMG.bullet_orb;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle || 0);
      if (img) {
        ctx.drawImage(img, -14, -14, 28, 28);
      } else {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  drawHUD(ctx, player, enemies) {
    // 1. Nyawa Pemain (Hati)
    const heartImg = IMG.heart;
    for (let i = 0; i < player.maxHp; i++) {
      const x = 20 + i * 36;
      const y = 20;
      if (i < player.hp) {
        if (heartImg) ctx.drawImage(heartImg, x, y, 30, 30);
        else {
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(x, y, 26, 26);
        }
      } else {
        // Hati kosong
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.arc(x + 15, y + 15, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Koin, Tiket & Shard
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;

    // Koin
    if (IMG.coin) ctx.drawImage(IMG.coin, 20, 62, 22, 22);
    ctx.fillText(`${SAVE.coins}`, 48, 73);

    // Tiket
    if (IMG.flag_checkpoint_on) ctx.drawImage(IMG.flag_checkpoint_on, 120, 62, 22, 22);
    ctx.fillText(`${SAVE.tickets}`, 148, 73);

    // Shard
    if (IMG.power_cell) ctx.drawImage(IMG.power_cell, 210, 62, 22, 22);
    ctx.fillText(`${SAVE.shards}`, 238, 73);

    // 3. Info Loadout Aktif
    const loadout = SAVE.loadouts[SAVE.activeLoadoutIndex];
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#FDE047';
    ctx.fillText(`[${SAVE.activeLoadoutIndex + 1}] ${loadout.name} (${loadout.core})`, 20, 105);

    // 4. Boss Health Bar (Jika di dekat Boss atau Boss sedang aktif)
    const boss = enemies.find(e => e.isBoss && !e.isDead);
    if (boss && Math.abs(player.x - boss.x) < 850) {
      const barW = Math.min(480, this.width - 60);
      const barH = 18;
      const bx = (this.width - barW) / 2;
      const by = 24;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(bx - 3, by - 3, barW + 6, barH + 6);

      const hpPercent = Math.max(0, boss.hp / boss.maxHp);
      const bossGrad = ctx.createLinearGradient(bx, 0, bx + barW, 0);
      bossGrad.addColorStop(0, '#EF4444');
      bossGrad.addColorStop(1, '#9333EA');
      ctx.fillStyle = bossGrad;
      ctx.fillRect(bx, by, barW * hpPercent, barH);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`RAJA SLIME GEOMETRI - FASE ${boss.phase} (${Math.ceil(boss.hp)} / ${boss.maxHp})`, this.width / 2, by - 8);
    }
  }

  isInView(x, width, camX) {
    return x + width >= camX - 80 && x <= camX + this.width + 80;
  }
}
