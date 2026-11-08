/**
 * ui.js - Tampilan Antarmuka Pengguna, Workshop Senjata, Gacha, Koleksi & Kontrol Sentuh
 */

import { SAVE, saveGame, resetSave, exportSaveJSON, importSaveJSON, BLASTER_PALETTES } from './save.js';
import { WEAPON_PARTS_DB, computeStats, getUpgradeCost, equipPartToLoadout, unequipSlotFromLoadout } from './weapons.js';
import { GachaSystem, BANNERS, RARITY_COLORS, SET_BONUSES } from './gacha.js';
import { Sound } from './audio.js';
import { IMG } from './assets.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.activeTab = 'game'; // 'game', 'workshop', 'gacha', 'collection', 'settings'
    this.activeBanner = 'weapons';
    this.selectedWorkshopSlot = 'core';
    this.previewPart = null;
    this.isGachaAnimating = false;

    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('ui-overlay');
    if (!this.container) return;

    this.renderNavigationBar();
    this.renderTouchControls();
  }

  renderNavigationBar() {
    const nav = document.createElement('div');
    nav.id = 'top-nav-bar';
    nav.innerHTML = `
      <div class="nav-brand">🔺 Triangle Quest</div>
      <div class="nav-buttons">
        <button class="nav-btn active" data-tab="game">🎮 Main</button>
        <button class="nav-btn" data-tab="workshop">🔧 Workshop</button>
        <button class="nav-btn" data-tab="gacha">✨ Gacha</button>
        <button class="nav-btn" data-tab="collection">📖 Koleksi</button>
        <button class="nav-btn" data-tab="settings">⚙️ Opsi</button>
      </div>
      <div class="nav-currencies">
        <span class="curr-pill">🪙 <b id="ui-coins">${SAVE.coins}</b></span>
        <span class="curr-pill">🎟️ <b id="ui-tickets">${SAVE.tickets}</b></span>
        <span class="curr-pill">⚡ <b id="ui-shards">${SAVE.shards}</b></span>
      </div>
    `;

    this.container.appendChild(nav);

    nav.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
  }

  updateCurrencies() {
    const c = document.getElementById('ui-coins');
    const t = document.getElementById('ui-tickets');
    const s = document.getElementById('ui-shards');
    if (c) c.textContent = SAVE.coins;
    if (t) t.textContent = SAVE.tickets;
    if (s) s.textContent = SAVE.shards;
  }

  switchTab(tab) {
    this.activeTab = tab;

    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });

    // Pause/Resume game loop state
    if (tab === 'game') {
      this.game.isPaused = false;
      this.hideModal();
    } else {
      this.game.isPaused = true;
      if (tab === 'workshop') this.showWorkshop();
      else if (tab === 'gacha') this.showGacha();
      else if (tab === 'collection') this.showCollection();
      else if (tab === 'settings') this.showSettings();
    }
    this.updateCurrencies();
  }

  hideModal() {
    const modal = document.getElementById('modal-panel');
    if (modal) modal.remove();
  }

  createModal(title, contentHtml) {
    this.hideModal();
    const modal = document.createElement('div');
    modal.id = 'modal-panel';
    modal.className = 'modal-container';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">${contentHtml}</div>
      </div>
    `;

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      this.switchTab('game');
    });

    this.container.appendChild(modal);
    return modal;
  }

  // ================= 1. WORKSHOP SENJATA =================
  showWorkshop() {
    const activeLoadout = SAVE.loadouts[SAVE.activeLoadoutIndex];
    const currentStats = computeStats(activeLoadout, SAVE.parts);
    const slots = ['body', 'core', 'barrel', 'grip', 'charm'];

    let slotButtonsHtml = slots.map(slot => {
      const partId = activeLoadout[slot];
      const partInfo = partId ? WEAPON_PARTS_DB[partId] : null;
      const partName = partInfo ? partInfo.name : '(Kosong)';
      const isSelected = slot === this.selectedWorkshopSlot;
      return `
        <div class="slot-item ${isSelected ? 'selected' : ''}" data-slot="${slot}">
          <div class="slot-label">${slot.toUpperCase()}</div>
          <div class="slot-val">${partName}</div>
        </div>
      `;
    }).join('');

    // Daftar part yang dimiliki pemain untuk slot yang dipilih
    const ownedParts = Object.keys(SAVE.parts)
      .map(id => WEAPON_PARTS_DB[id])
      .filter(p => p && p.slot === this.selectedWorkshopSlot);

    let partsListHtml = ownedParts.map(p => {
      const pInv = SAVE.parts[p.id];
      const level = pInv ? pInv.level : 1;
      const isEquipped = activeLoadout[p.slot] === p.id;
      const cost = getUpgradeCost(level + 1, p.rarity);
      const canUp = level < 5 && SAVE.shards >= cost.shards && SAVE.coins >= cost.coins;

      return `
        <div class="part-card" style="border-left: 4px solid ${RARITY_COLORS[p.rarity] || '#aaa'};">
          <div class="part-card-header">
            <b>${p.name}</b> <span class="badge">Lv.${level}</span>
          </div>
          <div class="part-desc">${p.desc}</div>
          <div class="part-actions">
            ${isEquipped ? 
              `<button class="btn btn-unequip" data-part="${p.id}">Lepas</button>` :
              `<button class="btn btn-equip" data-part="${p.id}">Pasang</button>`
            }
            ${level < 5 ?
              `<button class="btn btn-upgrade ${canUp ? '' : 'disabled'}" data-part="${p.id}">
                Upgrade (⚡${cost.shards} 🪙${cost.coins})
               </button>` :
              `<span class="badge max-badge">MAX</span>`
            }
          </div>
        </div>
      `;
    }).join('');

    if (ownedParts.length === 0 && this.selectedWorkshopSlot !== 'body') {
      partsListHtml = `<div class="empty-msg">Belum ada part untuk slot ini. Dapatkan dari Banner Gacha!</div>`;
    }

    // Pilihan Warna Blaster
    const colorSwatches = BLASTER_PALETTES.map(pal => `
      <div class="color-swatch ${SAVE.blasterColor === pal.hex ? 'active' : ''}"
           style="background-color: ${pal.hex};"
           data-hex="${pal.hex}"
           title="${pal.name}"></div>
    `).join('');

    const html = `
      <div class="workshop-layout">
        <!-- Kolom Kiri: Loadout & Slot -->
        <div class="ws-left">
          <div class="loadout-bar">
            <span>Pilih Loadout:</span>
            <button class="loadout-btn ${SAVE.activeLoadoutIndex === 0 ? 'active' : ''}" data-l="0">1</button>
            <button class="loadout-btn ${SAVE.activeLoadoutIndex === 1 ? 'active' : ''}" data-l="1">2</button>
            <button class="loadout-btn ${SAVE.activeLoadoutIndex === 2 ? 'active' : ''}" data-l="2">3</button>
          </div>
          <div class="slot-list">${slotButtonsHtml}</div>
          
          <div class="blaster-colors">
            <label>Warna Blaster:</label>
            <div class="swatches-grid">${colorSwatches}</div>
          </div>
        </div>

        <!-- Kolom Tengah: Preview Senjata & Stat -->
        <div class="ws-center">
          <div class="weapon-preview-box">
            <div class="preview-title">Senjata: ${activeLoadout.name}</div>
            <canvas id="workshop-canvas" width="280" height="150"></canvas>
            <button id="ws-test-shoot-btn" class="btn btn-primary">💥 Coba Tembak Dummy</button>
          </div>
          
          <div class="stats-box">
            ${this.renderStatRow('Damage', currentStats.damage, 1, 5)}
            ${this.renderStatRow('Kecepatan Tembak', currentStats.fireRate.toFixed(1) + '/s', currentStats.fireRate, 8)}
            ${this.renderStatRow('Jangkauan Peluru', currentStats.range + 'px', currentStats.range, 800)}
            ${this.renderStatRow('Kecepatan Peluru', currentStats.projectileSpeed + 'px/s', currentStats.projectileSpeed, 900)}
            ${this.renderStatRow('Peluang Kritis', Math.round(currentStats.critChance * 100) + '%', currentStats.critChance * 100, 50)}
          </div>
        </div>

        <!-- Kolom Kanan: Part Milik Pemain -->
        <div class="ws-right">
          <h3>Part Tersedia (${this.selectedWorkshopSlot.toUpperCase()})</h3>
          <div class="parts-scroll-list">${partsListHtml}</div>
        </div>
      </div>
    `;

    const modal = this.createModal('Workshop & Perakitan Senjata Modular', html);
    this.bindWorkshopEvents(modal);
    this.drawWorkshopCanvas();
  }

  renderStatRow(label, textVal, currentVal, maxVal) {
    const percent = Math.min(100, Math.round((currentVal / maxVal) * 100));
    return `
      <div class="stat-row">
        <span class="stat-name">${label}</span>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width: ${percent}%;"></div>
        </div>
        <span class="stat-val">${textVal}</span>
      </div>
    `;
  }

  bindWorkshopEvents(modal) {
    // Ganti slot terpilih
    modal.querySelectorAll('.slot-item').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedWorkshopSlot = el.getAttribute('data-slot');
        this.showWorkshop();
      });
    });

    // Ganti Loadout 1..3
    modal.querySelectorAll('.loadout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SAVE.activeLoadoutIndex = parseInt(btn.getAttribute('data-l'));
        saveGame();
        this.showWorkshop();
      });
    });

    // Ganti Warna Blaster
    modal.querySelectorAll('.color-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        SAVE.blasterColor = sw.getAttribute('data-hex');
        saveGame();
        this.showWorkshop();
      });
    });

    // Pasang Part
    modal.querySelectorAll('.btn-equip').forEach(btn => {
      btn.addEventListener('click', () => {
        const partId = btn.getAttribute('data-part');
        const part = WEAPON_PARTS_DB[partId];
        equipPartToLoadout(SAVE.activeLoadoutIndex, part.slot, partId, SAVE.loadouts);
        saveGame();
        Sound.playPowerup();
        this.showWorkshop();
      });
    });

    // Lepas Part
    modal.querySelectorAll('.btn-unequip').forEach(btn => {
      btn.addEventListener('click', () => {
        const partId = btn.getAttribute('data-part');
        const part = WEAPON_PARTS_DB[partId];
        unequipSlotFromLoadout(SAVE.activeLoadoutIndex, part.slot, SAVE.loadouts);
        saveGame();
        this.showWorkshop();
      });
    });

    // Upgrade Part
    modal.querySelectorAll('.btn-upgrade').forEach(btn => {
      btn.addEventListener('click', () => {
        const partId = btn.getAttribute('data-part');
        const pInv = SAVE.parts[partId];
        const part = WEAPON_PARTS_DB[partId];
        if (!pInv || pInv.level >= 5) return;

        const cost = getUpgradeCost(pInv.level + 1, part.rarity);
        if (SAVE.shards >= cost.shards && SAVE.coins >= cost.coins) {
          SAVE.shards -= cost.shards;
          SAVE.coins -= cost.coins;
          pInv.level += 1;
          saveGame();
          Sound.playPowerup();
          this.updateCurrencies();
          this.showWorkshop();
        }
      });
    });

    // Coba Tembak Dummy
    const testBtn = modal.querySelector('#ws-test-shoot-btn');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        const loadout = SAVE.loadouts[SAVE.activeLoadoutIndex];
        Sound.playShoot(loadout.core);
        Sound.playHit();
      });
    }
  }

  drawWorkshopCanvas() {
    const canvas = document.getElementById('workshop-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Latar workshop
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Garis grid teknik
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Gambar Karakter & Blaster di tengah
    if (IMG.player_idle && IMG.blaster) {
      ctx.drawImage(IMG.player_idle, 70, 45, 60, 60);
      ctx.drawImage(IMG.blaster, 115, 65, 45, 34);
    }

    // Gambar Dummy Target di sisi kanan
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(220, 75, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(220, 75, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(220, 75, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // ================= 2. SISTEM GACHA & BANNER =================
  showGacha() {
    const banner = BANNERS[this.activeBanner];
    const pity = GachaSystem.getPity(this.activeBanner);

    const bannerTabsHtml = Object.keys(BANNERS).map(bKey => `
      <button class="gacha-tab ${this.activeBanner === bKey ? 'active' : ''}" data-banner="${bKey}">
        ${BANNERS[bKey].name}
      </button>
    `).join('');

    const canSingle = GachaSystem.canAfford(this.activeBanner, 1);
    const canTen = GachaSystem.canAfford(this.activeBanner, 10);

    const costSingleStr = banner.currency === 'tickets' ? `${banner.costSingle} Tiket` : `${banner.costSingle} Koin / 1 Tiket`;
    const costTenStr = banner.currency === 'tickets' ? `${banner.costTen} Tiket` : `${banner.costTen} Koin / 10 Tiket`;

    const html = `
      <div class="gacha-container">
        <div class="gacha-banner-tabs">${bannerTabsHtml}</div>
        
        <div class="gacha-banner-hero">
          <h2>${banner.name}</h2>
          <p>${banner.desc}</p>
          <div class="pity-counter-box">
            <span>🛡️ Garansi Epic (Rare+): <b>${10 - pity.epic}</b> tarikan lagi</span>
            <span>⭐ Garansi Legendary: <b>${50 - pity.legendary}</b> tarikan lagi</span>
          </div>
        </div>

        <div class="gacha-rates-table">
          <span style="color:${RARITY_COLORS.legendary}">Legendary: 2%</span> |
          <span style="color:${RARITY_COLORS.epic}">Epic: 10%</span> |
          <span style="color:${RARITY_COLORS.rare}">Rare: 28%</span> |
          <span style="color:${RARITY_COLORS.common}">Common: 60%</span>
        </div>

        <div class="gacha-actions-row">
          <button id="btn-pull-1" class="btn gacha-btn ${canSingle ? '' : 'disabled'}">
            Tarik 1x<br><small>${costSingleStr}</small>
          </button>
          <button id="btn-pull-10" class="btn gacha-btn highlight ${canTen ? '' : 'disabled'}">
            Tarik 10x (Diskon)<br><small>${costTenStr}</small>
          </button>
        </div>

        <div id="gacha-animation-stage" class="gacha-stage hidden"></div>
      </div>
    `;

    const modal = this.createModal('Gacha Geometri Berhadiah', html);

    // Banner tab click
    modal.querySelectorAll('.gacha-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeBanner = tab.getAttribute('data-banner');
        this.showGacha();
      });
    });

    // Pull 1x
    const p1 = modal.querySelector('#btn-pull-1');
    if (p1) {
      p1.addEventListener('click', () => {
        if (!GachaSystem.canAfford(this.activeBanner, 1)) return;
        GachaSystem.deductCost(this.activeBanner, 1);
        const result = GachaSystem.pullSingle(this.activeBanner);
        this.updateCurrencies();
        this.animateGacha([result]);
      });
    }

    // Pull 10x
    const p10 = modal.querySelector('#btn-pull-10');
    if (p10) {
      p10.addEventListener('click', () => {
        if (!GachaSystem.canAfford(this.activeBanner, 10)) return;
        GachaSystem.deductCost(this.activeBanner, 10);
        const results = GachaSystem.pullTen(this.activeBanner);
        this.updateCurrencies();
        this.animateGacha(results);
      });
    }
  }

  animateGacha(results) {
    const stage = document.getElementById('gacha-animation-stage');
    if (!stage) return;

    stage.classList.remove('hidden');
    stage.innerHTML = `
      <div class="gacha-reveal-overlay">
        <div class="gacha-chest-anim">🎁</div>
        <div class="gacha-shine"></div>
        <button id="gacha-skip-btn" class="btn btn-secondary">Lewati &raquo;</button>
        <div id="gacha-cards-grid" class="cards-grid"></div>
      </div>
    `;

    const grid = stage.querySelector('#gacha-cards-grid');
    const skipBtn = stage.querySelector('#gacha-skip-btn');

    // Buat kartu-kartu
    results.forEach((res, idx) => {
      const card = document.createElement('div');
      card.className = `gacha-card ${res.rarity}`;
      card.style.borderColor = RARITY_COLORS[res.rarity];
      card.innerHTML = `
        <div class="card-rarity" style="color:${RARITY_COLORS[res.rarity]}">${res.rarity.toUpperCase()}</div>
        <div class="card-name">${res.item.name}</div>
        <div class="card-status ${res.isNew ? 'new-badge' : 'shard-badge'}">
          ${res.isNew ? 'BARU!' : `+${res.shardsGained} Shard`}
        </div>
      `;
      grid.appendChild(card);
    });

    // Sound reveal
    const highestRarity = results.some(r => r.rarity === 'legendary') ? 'legendary' :
                          results.some(r => r.rarity === 'epic') ? 'epic' : 'rare';
    Sound.playGachaReveal(highestRarity);

    // Animasi buka kartu satu per satu
    const cards = grid.querySelectorAll('.gacha-card');
    cards.forEach((c, idx) => {
      setTimeout(() => {
        c.classList.add('flipped');
      }, idx * 180 + 400);
    });

    const closeGacha = () => {
      stage.classList.add('hidden');
      this.showGacha();
    };

    skipBtn.addEventListener('click', closeGacha);
  }

  // ================= 3. KOLEKSI & SET BONUS =================
  showCollection() {
    const stats = GachaSystem.getCollectionStats();
    const allItems = GachaSystem.getAllItems();

    const itemsGridHtml = allItems.map(item => {
      const owned = window.SaveSystem.hasItem(item.id);
      return `
        <div class="collection-item ${owned ? 'owned' : 'locked'}"
             style="border-color: ${owned ? RARITY_COLORS[item.rarity] : '#475569'};">
          <div class="col-name">${owned ? item.name : '???'}</div>
          <div class="col-type">${item.type.toUpperCase()}</div>
          <div class="col-rarity" style="color:${RARITY_COLORS[item.rarity]}">${item.rarity}</div>
        </div>
      `;
    }).join('');

    const setBonusHtml = SET_BONUSES.map(sb => {
      const isActive = sb.active();
      return `
        <div class="set-bonus-card ${isActive ? 'active' : ''}">
          <b>${sb.name}</b>: <span>${sb.bonus}</span>
          <span class="set-status">${isActive ? '✅ AKTIF' : '🔒 Belum Lengkap'}</span>
        </div>
      `;
    }).join('');

    const html = `
      <div class="collection-layout">
        <div class="col-header-bar">
          <h3>Progres Koleksi Petualang: <b>${stats.owned} / ${stats.total} (${stats.percent}%)</b></h3>
        </div>
        <div class="set-bonuses-container">
          <h4>Bonus Set Aktif:</h4>
          ${setBonusHtml}
        </div>
        <h4>Daftar Koleksi:</h4>
        <div class="col-grid">${itemsGridHtml}</div>
      </div>
    `;

    this.createModal('Buku Koleksi Geometri & Bonus Set', html);
  }

  // ================= 4. PENGATURAN =================
  showSettings() {
    const html = `
      <div class="settings-layout">
        <div class="setting-row">
          <span>Efek Suara (SFX):</span>
          <button id="toggle-sfx-btn" class="btn">${SAVE.settings.sfx ? '🔊 AKTIF' : '🔇 MATI'}</button>
        </div>
        <div class="setting-row">
          <span>Musik Latar (BGM):</span>
          <button id="toggle-bgm-btn" class="btn">${SAVE.settings.music ? '🎵 AKTIF' : '🔇 MATI'}</button>
        </div>
        <hr style="border-color:#334155; margin: 16px 0;">
        <div class="setting-actions">
          <button id="btn-export-save" class="btn btn-secondary">💾 Ekspor Data Simpanan</button>
          <button id="btn-import-save" class="btn btn-secondary">📥 Impor Data Simpanan</button>
          <button id="btn-reset-save" class="btn btn-danger">⚠️ Reset Seluruh Data</button>
        </div>
      </div>
    `;

    const modal = this.createModal('Pengaturan Game & Data', html);

    modal.querySelector('#toggle-sfx-btn').addEventListener('click', (e) => {
      Sound.toggleSFX();
      saveGame();
      e.target.textContent = SAVE.settings.sfx ? '🔊 AKTIF' : '🔇 MATI';
    });

    modal.querySelector('#toggle-bgm-btn').addEventListener('click', (e) => {
      Sound.toggleMusic();
      saveGame();
      e.target.textContent = SAVE.settings.music ? '🎵 AKTIF' : '🔇 MATI';
    });

    modal.querySelector('#btn-export-save').addEventListener('click', () => {
      const dataStr = exportSaveJSON();
      navigator.clipboard?.writeText(dataStr);
      alert('Data simpanan telah disalin ke clipboard!');
    });

    modal.querySelector('#btn-import-save').addEventListener('click', () => {
      const input = prompt('Tempelkan (paste) teks JSON simpanan di sini:');
      if (input && importSaveJSON(input)) {
        alert('Data berhasil diimpor!');
        this.showSettings();
      } else if (input) {
        alert('Gagal mengimpor: Format JSON tidak valid.');
      }
    });

    modal.querySelector('#btn-reset-save').addEventListener('click', () => {
      if (confirm('Yakin ingin mereset semua kemajuan permainan?')) {
        resetSave();
        alert('Data telah direset.');
        this.showSettings();
      }
    });
  }

  // ================= 5. KONTROL SENTUH MULTI-TOUCH =================
  renderTouchControls() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const touchOverlay = document.createElement('div');
    touchOverlay.id = 'touch-controls-overlay';
    touchOverlay.className = isTouch ? 'touch-visible' : 'touch-hidden';

    touchOverlay.innerHTML = `
      <div class="touch-left-cluster">
        <button id="touch-left" class="t-btn">&larr;</button>
        <button id="touch-right" class="t-btn">&rarr;</button>
      </div>
      <div class="touch-right-cluster">
        <button id="touch-aim" class="t-btn-small">🎯 AIM</button>
        <button id="touch-swap" class="t-btn-small">🔄 GUN</button>
        <button id="touch-jump" class="t-btn-action">JUMP</button>
        <button id="touch-shoot" class="t-btn-action shoot">FIRE</button>
      </div>
    `;

    this.container.appendChild(touchOverlay);
    this.bindTouchEvents(touchOverlay);
  }

  bindTouchEvents(overlay) {
    const input = this.game.input;

    const bindHold = (btnId, onDown, onUp) => {
      const btn = overlay.querySelector(btnId);
      if (!btn) return;

      const handleDown = (e) => {
        e.preventDefault();
        try { btn.setPointerCapture(e.pointerId); } catch {}
        onDown();
      };
      const handleUp = (e) => {
        e.preventDefault();
        onUp();
      };

      btn.addEventListener('pointerdown', handleDown);
      btn.addEventListener('pointerup', handleUp);
      btn.addEventListener('pointercancel', handleUp);
    };

    bindHold('#touch-left', () => { input.left = true; }, () => { input.left = false; });
    bindHold('#touch-right', () => { input.right = true; }, () => { input.right = false; });
    bindHold('#touch-jump', () => { input.jumpJustPressed = true; }, () => { input.jumpJustPressed = false; });
    bindHold('#touch-shoot', () => { input.shoot = true; }, () => { input.shoot = false; });

    // Toggle Aim Up
    const aimBtn = overlay.querySelector('#touch-aim');
    if (aimBtn) {
      aimBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        input.aimUp = !input.aimUp;
        aimBtn.classList.toggle('active', input.aimUp);
      });
    }

    // Quick swap loadout
    const swapBtn = overlay.querySelector('#touch-swap');
    if (swapBtn) {
      swapBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        SAVE.activeLoadoutIndex = (SAVE.activeLoadoutIndex + 1) % 3;
        saveGame();
        Sound.playPowerup();
      });
    }
  }
}
