/**
 * assets.js - Asset Loader & Image Registry untuk Triangle Quest
 * Memuat semua aset PNG dari folder assets/png/<kategori>/
 * Menyediakan fallback jika gagal muat dan utilitas tint canvas offscreen.
 */

export const IMG = {};

// Daftar lengkap 101 aset PNG yang ada di folder assets/png/
export const ASSET_MANIFEST = [
  // 1. ATTACK (20 aset)
  { id: 'ammo_pack', path: 'assets/png/attack/ammo_pack.png' },
  { id: 'blaster', path: 'assets/png/attack/blaster.png' },
  { id: 'bullet_enemy', path: 'assets/png/attack/bullet_enemy.png' },
  { id: 'bullet_fire', path: 'assets/png/attack/bullet_fire.png' },
  { id: 'bullet_ice', path: 'assets/png/attack/bullet_ice.png' },
  { id: 'bullet_laser', path: 'assets/png/attack/bullet_laser.png' },
  { id: 'bullet_orb', path: 'assets/png/attack/bullet_orb.png' },
  { id: 'bullet_star', path: 'assets/png/attack/bullet_star.png' },
  { id: 'explosion_1', path: 'assets/png/attack/explosion_1.png' },
  { id: 'explosion_2', path: 'assets/png/attack/explosion_2.png' },
  { id: 'explosion_3', path: 'assets/png/attack/explosion_3.png' },
  { id: 'explosion_4', path: 'assets/png/attack/explosion_4.png' },
  { id: 'flag_checkpoint_off', path: 'assets/png/attack/flag_checkpoint_off.png' },
  { id: 'flag_checkpoint_on', path: 'assets/png/attack/flag_checkpoint_on.png' },
  { id: 'flag_goal', path: 'assets/png/attack/flag_goal.png' },
  { id: 'hit_spark_1', path: 'assets/png/attack/hit_spark_1.png' },
  { id: 'hit_spark_2', path: 'assets/png/attack/hit_spark_2.png' },
  { id: 'hit_spark_3', path: 'assets/png/attack/hit_spark_3.png' },
  { id: 'muzzle_flash', path: 'assets/png/attack/muzzle_flash.png' },
  { id: 'power_cell', path: 'assets/png/attack/power_cell.png' },

  // 2. BACKGROUND (6 aset)
  { id: 'cloud_a', path: 'assets/png/background/cloud_a.png' },
  { id: 'cloud_b', path: 'assets/png/background/cloud_b.png' },
  { id: 'cloud_c', path: 'assets/png/background/cloud_c.png' },
  { id: 'hills_far', path: 'assets/png/background/hills_far.png' },
  { id: 'hills_near', path: 'assets/png/background/hills_near.png' },
  { id: 'mountains', path: 'assets/png/background/mountains.png' },

  // 3. CHARACTER (4 aset)
  { id: 'arm_blaster_aim', path: 'assets/png/character/arm_blaster_aim.png' },
  { id: 'player_hurt', path: 'assets/png/character/player_hurt.png' },
  { id: 'player_idle', path: 'assets/png/character/player_idle.png' },
  { id: 'player_shoot', path: 'assets/png/character/player_shoot.png' },

  // 4. ENEMIES (11 aset)
  { id: 'bat_wings_down', path: 'assets/png/enemies/bat_wings_down.png' },
  { id: 'bat_wings_up', path: 'assets/png/enemies/bat_wings_up.png' },
  { id: 'ghost', path: 'assets/png/enemies/ghost.png' },
  { id: 'mushroom_walker', path: 'assets/png/enemies/mushroom_walker.png' },
  { id: 'slime_blue_idle', path: 'assets/png/enemies/slime_blue_idle.png' },
  { id: 'slime_green_idle', path: 'assets/png/enemies/slime_green_idle.png' },
  { id: 'slime_green_squash', path: 'assets/png/enemies/slime_green_squash.png' },
  { id: 'slime_green_stretch', path: 'assets/png/enemies/slime_green_stretch.png' },
  { id: 'slime_king_boss', path: 'assets/png/enemies/slime_king_boss.png' },
  { id: 'slime_purple_idle', path: 'assets/png/enemies/slime_purple_idle.png' },
  { id: 'spike_ball', path: 'assets/png/enemies/spike_ball.png' },

  // 5. NATURE (28 aset)
  { id: 'bush_berry', path: 'assets/png/nature/bush_berry.png' },
  { id: 'bush_flowers', path: 'assets/png/nature/bush_flowers.png' },
  { id: 'bush_round', path: 'assets/png/nature/bush_round.png' },
  { id: 'crate', path: 'assets/png/nature/crate.png' },
  { id: 'crystal_blue', path: 'assets/png/nature/crystal_blue.png' },
  { id: 'crystal_purple', path: 'assets/png/nature/crystal_purple.png' },
  { id: 'fence', path: 'assets/png/nature/fence.png' },
  { id: 'flowers', path: 'assets/png/nature/flowers.png' },
  { id: 'grass_tuft', path: 'assets/png/nature/grass_tuft.png' },
  { id: 'log', path: 'assets/png/nature/log.png' },
  { id: 'mushroom_red', path: 'assets/png/nature/mushroom_red.png' },
  { id: 'rock_large', path: 'assets/png/nature/rock_large.png' },
  { id: 'rock_medium', path: 'assets/png/nature/rock_medium.png' },
  { id: 'rock_mossy', path: 'assets/png/nature/rock_mossy.png' },
  { id: 'rock_pile', path: 'assets/png/nature/rock_pile.png' },
  { id: 'rock_sand', path: 'assets/png/nature/rock_sand.png' },
  { id: 'rock_small', path: 'assets/png/nature/rock_small.png' },
  { id: 'rock_snow', path: 'assets/png/nature/rock_snow.png' },
  { id: 'sign_wood', path: 'assets/png/nature/sign_wood.png' },
  { id: 'tree_apple', path: 'assets/png/nature/tree_apple.png' },
  { id: 'tree_autumn', path: 'assets/png/nature/tree_autumn.png' },
  { id: 'tree_big_oak', path: 'assets/png/nature/tree_big_oak.png' },
  { id: 'tree_cactus', path: 'assets/png/nature/tree_cactus.png' },
  { id: 'tree_dead', path: 'assets/png/nature/tree_dead.png' },
  { id: 'tree_palm', path: 'assets/png/nature/tree_palm.png' },
  { id: 'tree_pine', path: 'assets/png/nature/tree_pine.png' },
  { id: 'tree_pine_snow', path: 'assets/png/nature/tree_pine_snow.png' },
  { id: 'tree_round', path: 'assets/png/nature/tree_round.png' },

  // 6. TERRAIN (32 aset)
  { id: 'ground_tile_grass', path: 'assets/png/terrain/ground_tile_grass.png' },
  { id: 'ground_tile_sand', path: 'assets/png/terrain/ground_tile_sand.png' },
  { id: 'ground_tile_snow', path: 'assets/png/terrain/ground_tile_snow.png' },
  { id: 'ground_tile_stone', path: 'assets/png/terrain/ground_tile_stone.png' },
  { id: 'platform_grass_flat_130', path: 'assets/png/terrain/platform_grass_flat_130.png' },
  { id: 'platform_grass_flat_220', path: 'assets/png/terrain/platform_grass_flat_220.png' },
  { id: 'platform_grass_flat_360', path: 'assets/png/terrain/platform_grass_flat_360.png' },
  { id: 'platform_grass_flat_480', path: 'assets/png/terrain/platform_grass_flat_480.png' },
  { id: 'platform_grass_tri_190', path: 'assets/png/terrain/platform_grass_tri_190.png' },
  { id: 'platform_grass_tri_330', path: 'assets/png/terrain/platform_grass_tri_330.png' },
  { id: 'platform_grass_tri_500', path: 'assets/png/terrain/platform_grass_tri_500.png' },
  { id: 'platform_sand_flat_130', path: 'assets/png/terrain/platform_sand_flat_130.png' },
  { id: 'platform_sand_flat_220', path: 'assets/png/terrain/platform_sand_flat_220.png' },
  { id: 'platform_sand_flat_360', path: 'assets/png/terrain/platform_sand_flat_360.png' },
  { id: 'platform_sand_flat_480', path: 'assets/png/terrain/platform_sand_flat_480.png' },
  { id: 'platform_sand_tri_190', path: 'assets/png/terrain/platform_sand_tri_190.png' },
  { id: 'platform_sand_tri_330', path: 'assets/png/terrain/platform_sand_tri_330.png' },
  { id: 'platform_sand_tri_500', path: 'assets/png/terrain/platform_sand_tri_500.png' },
  { id: 'platform_snow_flat_130', path: 'assets/png/terrain/platform_snow_flat_130.png' },
  { id: 'platform_snow_flat_220', path: 'assets/png/terrain/platform_snow_flat_220.png' },
  { id: 'platform_snow_flat_360', path: 'assets/png/terrain/platform_snow_flat_360.png' },
  { id: 'platform_snow_flat_480', path: 'assets/png/terrain/platform_snow_flat_480.png' },
  { id: 'platform_snow_tri_190', path: 'assets/png/terrain/platform_snow_tri_190.png' },
  { id: 'platform_snow_tri_330', path: 'assets/png/terrain/platform_snow_tri_330.png' },
  { id: 'platform_snow_tri_500', path: 'assets/png/terrain/platform_snow_tri_500.png' },
  { id: 'platform_stone_flat_130', path: 'assets/png/terrain/platform_stone_flat_130.png' },
  { id: 'platform_stone_flat_220', path: 'assets/png/terrain/platform_stone_flat_220.png' },
  { id: 'platform_stone_flat_360', path: 'assets/png/terrain/platform_stone_flat_360.png' },
  { id: 'platform_stone_flat_480', path: 'assets/png/terrain/platform_stone_flat_480.png' },
  { id: 'platform_stone_tri_190', path: 'assets/png/terrain/platform_stone_tri_190.png' },
  { id: 'platform_stone_tri_330', path: 'assets/png/terrain/platform_stone_tri_330.png' },
  { id: 'platform_stone_tri_500', path: 'assets/png/terrain/platform_stone_tri_500.png' },
];

/**
 * Buat gambar placeholder jika aset gagal dimuat (menghindari game crash)
 */
function createPlaceholderImage(name, color = '#f59e0b') {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name.slice(0, 8), 32, 36);
  return canvas;
}

/**
 * Pemuat semua aset berbasis Promise dengan callback progress
 */
export function loadAllAssets(onProgress) {
  let loadedCount = 0;
  const total = ASSET_MANIFEST.length;

  return new Promise((resolve) => {
    if (total === 0) {
      resolve(IMG);
      return;
    }

    ASSET_MANIFEST.forEach((item) => {
      const img = new Image();
      img.onload = () => {
        IMG[item.id] = img;
        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
        if (loadedCount >= total) resolve(IMG);
      };
      img.onerror = () => {
        console.warn(`[Assets] Gagal memuat aset: "${item.path}". Menggunakan placeholder.`);
        IMG[item.id] = createPlaceholderImage(item.id);
        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
        if (loadedCount >= total) resolve(IMG);
      };
      img.src = item.path;
    });
  });
}

/**
 * Cache offscreen canvas untuk pewarnaan blaster/partikel (tint)
 */
const tintCache = new Map();

export function getTintedImage(sourceImg, colorHex) {
  if (!sourceImg || !colorHex) return sourceImg;
  const cacheKey = `${sourceImg.src || 'img'}_${colorHex}`;
  if (tintCache.has(cacheKey)) {
    return tintCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = sourceImg.width || 64;
  canvas.height = sourceImg.height || 64;
  const ctx = canvas.getContext('2d');

  // Gambar dasar
  ctx.drawImage(sourceImg, 0, 0);

  // Terapkan warna tint dengan blend mode multiply / source-atop
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'source-over';
  tintCache.set(cacheKey, canvas);
  return canvas;
}
