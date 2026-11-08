/**
 * main.js - Entry Point, Game Loop 60Hz, Penanganan Tabrakan & Siklus Permainan
 */

import { loadAllAssets, IMG } from './assets.js';
import { loadSave, SAVE, saveGame } from './save.js';
import { buildLevelData } from './level.js';
import { Player } from './player.js';
import { Enemy } from './enemies.js';
import { Renderer } from './render.js';
import { UIManager } from './ui.js';
import { Sound } from './audio.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);
    this.isPaused = false;
    this.isVictory = false;

    this.input = {
      left: false,
      right: false,
      jumpJustPressed: false,
      shoot: false,
      aimUp: false
    };

    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.lastTime = performance.now();

    this.init();
  }

  async init() {
    // 1. Muat simpanan permainan
    loadSave();

    // 2. Muat semua 101 aset dengan progress bar
    const progressBar = document.getElementById('loading-progress-bar');
    const loadingText = document.getElementById('loading-text');

    await loadAllAssets((loaded, total) => {
      const pct = Math.round((loaded / total) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (loadingText) loadingText.textContent = `Memuat Aset Geometri: ${loaded}/${total} (${pct}%)`;
    });

    // Sembunyikan layar loading
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => loadingScreen.remove(), 400);
    }

    // 3. Bangun data level & entitas
    this.level = buildLevelData();
    this.player = new Player(80, 500);

    // Spawn musuh dari data level
    this.enemies = this.level.enemySpawns.map(sp => new Enemy(sp.type, sp.x, sp.y, { isBoss: sp.isBoss }));

    // 4. Inisialisasi UI Manager & Kontrol
    this.ui = new UIManager(this);
    this.setupKeyboardInput();

    // Mulai Audio saat klik pertama
    const startAudioOnce = () => {
      Sound.init();
      Sound.startBGM();
      window.removeEventListener('pointerdown', startAudioOnce);
      window.removeEventListener('keydown', startAudioOnce);
    };
    window.addEventListener('pointerdown', startAudioOnce);
    window.addEventListener('keydown', startAudioOnce);

    // 5. Mulai Loop Game
    requestAnimationFrame((t) => this.loop(t));
  }

  setupKeyboardInput() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();

      if (k === 'arrowleft' || k === 'a') this.input.left = true;
      if (k === 'arrowright' || k === 'd') this.input.right = true;
      if (k === 'arrowup' || k === 'w') this.input.aimUp = true;
      if (k === ' ' || k === 'w' || k === 'arrowup') this.input.jumpJustPressed = true;
      if (k === 'j' || k === 'x') this.input.shoot = true;

      // Ganti loadout cepat: 1, 2, 3 atau Q/E
      if (k === '1' || k === '2' || k === '3') {
        SAVE.activeLoadoutIndex = parseInt(k) - 1;
        saveGame();
        Sound.playPowerup();
        this.renderer.particles.spawnFloatingText(`Loadout ${k} Aktif`, this.player.x + 24, this.player.y - 20, '#FBBF24');
      }
      if (k === 'q') {
        SAVE.activeLoadoutIndex = (SAVE.activeLoadoutIndex + 2) % 3;
        saveGame();
        Sound.playPowerup();
      }
      if (k === 'e') {
        SAVE.activeLoadoutIndex = (SAVE.activeLoadoutIndex + 1) % 3;
        saveGame();
        Sound.playPowerup();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') this.input.left = false;
      if (k === 'arrowright' || k === 'd') this.input.right = false;
      if (k === 'arrowup' || k === 'w') this.input.aimUp = false;
      if (k === ' ' || k === 'w' || k === 'arrowup') this.input.jumpJustPressed = false;
      if (k === 'j' || k === 'x') this.input.shoot = false;
    });
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05); // Cap dt max 50ms
    this.lastTime = currentTime;

    if (!this.isPaused) {
      this.update(dt);
    }

    this.renderer.render(this.level, this.player, this.enemies, this.bullets, this.enemyBullets);
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    const player = this.player;
    const particles = this.renderer.particles;

    // 1. Update Pemain
    player.update(dt, this.input, this.level, this.bullets, particles);

    // Reset jumpJustPressed setelah satu frame update
    this.input.jumpJustPressed = false;

    // 2. Pemain Respawn jika mati
    if (player.isDead) {
      setTimeout(() => {
        player.respawn();
        particles.spawnFloatingText('Respawn di Checkpoint!', player.x + 24, player.y - 20, '#EF4444');
      }, 700);
    }

    // 3. Update Kamera Mengikuti Pemain
    this.renderer.updateCamera(player.x, player.y, this.level.width, this.level.height, dt);
    particles.update(dt);

    // 4. Update Musuh
    const newlySpawned = [];
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(
        dt,
        player,
        this.level,
        newlySpawned,
        this.enemyBullets,
        particles,
        (dur, str) => this.renderer.triggerShake(dur, str)
      );

      // Cek apakah musuh mati
      if (enemy.isDead) {
        particles.spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.isBoss);
        // Hasilkan Drop Barang
        const drops = enemy.getDrops();
        drops.forEach(drop => {
          if (drop.type === 'coin') {
            SAVE.coins += drop.count;
            particles.spawnFloatingText(`+${drop.count} 🪙`, enemy.x + 20, enemy.y - 10, '#FBBF24');
          } else if (drop.type === 'shard') {
            SAVE.shards += drop.count;
            particles.spawnFloatingText(`+${drop.count} ⚡ Shard`, enemy.x + 20, enemy.y - 25, '#A855F7');
          } else if (drop.type === 'ticket') {
            SAVE.tickets += drop.count;
            particles.spawnFloatingText(`+${drop.count} 🎟️ TIKET GACHA!`, enemy.x + 20, enemy.y - 40, '#EC4899');
          }
        });
        saveGame();
        this.ui.updateCurrencies();
        this.enemies.splice(i, 1);
        continue;
      }

      // Deteksi Tabrakan Pemain vs Musuh
      this.checkPlayerEnemyCollision(enemy, player, particles);
    }

    if (newlySpawned.length > 0) {
      this.enemies.push(...newlySpawned);
    }

    // 5. Update Peluru Pemain & Deteksi Tabrakan
    this.updatePlayerBullets(dt, particles);

    // 6. Update Peluru Musuh
    this.updateEnemyBullets(dt, particles, player);

    // 7. Deteksi Kolektibel (Koin, Hati, Star)
    this.checkCollectibles(player, particles);

    // 8. Deteksi Checkpoint
    this.checkCheckpoints(player, particles);

    // 9. Deteksi Kemenangan (Goal Flag)
    if (player.x >= this.level.finishX - 40 && !this.isVictory) {
      this.triggerVictory();
    }
  }

  checkPlayerEnemyCollision(enemy, player, particles) {
    if (player.isDead || enemy.isDead) return;

    // AABB Check
    const overlapX = player.x + player.width > enemy.x && player.x < enemy.x + enemy.width;
    const overlapY = player.y + player.height > enemy.y && player.y < enemy.y + enemy.height;

    if (overlapX && overlapY) {
      // Periksa apakah Pemain menginjak musuh dari atas (Stomp)
      const playerBottom = player.y + player.height;
      const isFalling = player.vy > 0;
      const hitTop = playerBottom <= enemy.y + 26;

      if (isFalling && hitTop && enemy.canStomp) {
        // Berhasil Menginjak!
        enemy.takeHit(1);
        player.vy = enemy.springBounce ? -760 : -520; // Pantul tinggi pada jamur
        player.squashX = 1.3;
        player.squashY = 0.7;
        Sound.playStomp();
        particles.spawnHitSpark(enemy.x + enemy.width / 2, enemy.y);
      } else {
        // Pemain Tertabrak Musuh
        const dir = player.x < enemy.x ? -1 : 1;
        player.takeDamage(1, dir);
        this.renderer.triggerShake(0.2, 6);
      }
    }
  }

  updatePlayerBullets(dt, particles) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rangeLeft -= Math.hypot(b.vx, b.vy) * dt;

      // Habis jangkauan atau keluar batas dunia
      if (b.rangeLeft <= 0 || b.x < 0 || b.x > this.level.width || b.y > this.level.height) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Tabrakan dengan Musuh
      let bulletRemoved = false;
      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];
        if (enemy.isDead) continue;

        if (b.x >= enemy.x && b.x <= enemy.x + enemy.width &&
            b.y >= enemy.y && b.y <= enemy.y + enemy.height) {
          
          const isLaser = b.asset === 'bullet_laser';
          const hitSuccess = enemy.takeHit(b.damage, b.effect, isLaser);

          if (hitSuccess) {
            particles.spawnHitSpark(b.x, b.y);
            particles.spawnFloatingText(`${Math.round(b.damage)}`, b.x, b.y - 12, b.isCrit ? '#EF4444' : '#FBBF24');
            
            // Efek Shock rantai ke musuh terdekat
            if (b.effect === 'shock') {
              this.applyShockChain(enemy, particles);
            }
          }

          if (b.pierceLeft > 0) {
            b.pierceLeft -= 1;
          } else {
            this.bullets.splice(i, 1);
            bulletRemoved = true;
            break;
          }
        }
      }

      if (bulletRemoved) continue;

      // Pantulan peluru (bounce) jika mengenai tanah
      if (b.bounceLeft > 0 && b.y >= this.level.groundY) {
        b.vy = -b.vy * 0.85;
        b.bounceLeft -= 1;
        particles.spawnHitSpark(b.x, b.y);
      }
    }
  }

  applyShockChain(hitEnemy, particles) {
    this.enemies.forEach(other => {
      if (other !== hitEnemy && !other.isDead) {
        const dist = Math.hypot(other.x - hitEnemy.x, other.y - hitEnemy.y);
        if (dist < 160) {
          other.takeHit(1, 'shock');
          particles.spawnHitSpark(other.x + other.width / 2, other.y + other.height / 2);
          particles.spawnFloatingText('⚡SHOCK!', other.x + 20, other.y - 10, '#38BDF8');
        }
      }
    });
  }

  updateEnemyBullets(dt, particles, player) {
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Tabrakan dengan Pemain
      if (!player.isDead &&
          b.x >= player.x && b.x <= player.x + player.width &&
          b.y >= player.y && b.y <= player.y + player.height) {
        player.takeDamage(b.damage || 1);
        particles.spawnHitSpark(b.x, b.y);
        this.enemyBullets.splice(i, 1);
        continue;
      }

      // Keluar batas
      if (b.x < 0 || b.x > this.level.width || b.y > this.level.height || b.y < 0) {
        this.enemyBullets.splice(i, 1);
      }
    }
  }

  checkCollectibles(player, particles) {
    this.level.collectibles.forEach(c => {
      if (c.collected) return;
      const dist = Math.hypot(player.x + player.width / 2 - c.x, player.y + player.height / 2 - c.y);
      if (dist < 36) {
        c.collected = true;
        if (c.type === 'coin') {
          SAVE.coins += 1;
          Sound.playCoin();
          particles.spawnFloatingText('+1 🪙', c.x, c.y, '#FBBF24');
        } else if (c.type === 'heart') {
          player.hp = Math.min(player.maxHp, player.hp + 1);
          Sound.playPowerup();
          particles.spawnFloatingText('+1 ❤️ HP', c.x, c.y, '#EF4444');
        } else if (c.type === 'power_cell') {
          SAVE.shards += 2;
          Sound.playPowerup();
          particles.spawnFloatingText('+2 ⚡ Shard', c.x, c.y, '#A855F7');
        } else if (c.type === 'ammo_pack') {
          Sound.playPowerup();
          particles.spawnFloatingText('Amunisi Maksimal!', c.x, c.y, '#38BDF8');
        } else if (c.type === 'star') {
          SAVE.coins += 25;
          SAVE.shards += 5;
          SAVE.tickets += 1;
          Sound.playPowerup();
          particles.spawnFloatingText('BINTANG GEOMETRI! (+1 🎟️)', c.x, c.y, '#F59E0B');
        }
        saveGame();
        this.ui.updateCurrencies();
      }
    });
  }

  checkCheckpoints(player, particles) {
    this.level.checkpoints.forEach(cp => {
      if (!cp.reached && Math.abs(player.x - cp.x) < 40) {
        cp.reached = true;
        player.setRespawn(cp.x, cp.y);
        Sound.playPowerup();
        particles.spawnFloatingText('🚩 Checkpoint Aktif!', cp.x, cp.y - 30, '#10B981');
      }
    });
  }

  triggerVictory() {
    this.isVictory = true;
    Sound.playPowerup();
    SAVE.tickets += 2;
    SAVE.coins += 100;
    saveGame();
    this.ui.updateCurrencies();

    const victoryHtml = `
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #FBBF24; font-size: 28px;">🏆 MISI SELESAI! 🏆</h1>
        <p>Selamat! Kamu telah berhasil menaklukkan 4 Zona Geometri dan mengalahkan Raja Slime!</p>
        <div style="margin: 20px 0; font-size: 18px;">
          <span>Hadiah Kemenangan:</span><br>
          <b>🪙 +100 Koin</b> &nbsp;|&nbsp; <b>🎟️ +2 Tiket Gacha</b>
        </div>
        <button id="btn-replay" class="btn btn-primary" style="padding: 12px 24px; font-size: 16px;">
          🔄 Mainkan Lagi dari Awal
        </button>
      </div>
    `;

    const modal = this.ui.createModal('Kemenangan Petualang Segitiga!', victoryHtml);
    modal.querySelector('#btn-replay').addEventListener('click', () => {
      window.location.reload();
    });
  }
}

// Inisialisasi saat DOM siap
window.addEventListener('DOMContentLoaded', () => {
  window.TriangleQuestGame = new Game();
});
