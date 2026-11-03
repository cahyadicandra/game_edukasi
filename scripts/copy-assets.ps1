$src = Join-Path $PSScriptRoot '..\assets-ref'
$dst = Join-Path $PSScriptRoot '..\public\assets\ui'
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$map = @{
  '01_player_profile_card.png'   = 'profile-card.png'
  '02_currency_bar.png'          = 'currency-bar.png'
  '03_settings_button.png'       = 'btn-settings.png'
  '04_back_button.png'           = 'btn-back.png'
  '05_map_title_banner.png'      = 'banner-map-title.png'
  '06_daily_mission_card.png'    = 'card-daily-mission.png'
  '07_world_01_pulau_bentuk.png' = 'world-01-pulau-bentuk.png'
  '08_world_02_hutan_segi_empat.png' = 'world-02-hutan-segi-empat.png'
  '09_world_03_pegunungan_segitiga.png' = 'world-03-pegunungan-segitiga.png'
  '10_world_04_danau_lingkaran.png' = 'world-04-danau-lingkaran.png'
  '11_world_05_kastil_geometri.png' = 'world-05-kastil-geometri.png'
  '12_shape_collection_card.png' = 'card-shape-collection.png'
  '12_world_01_banner.png'       = 'banner-world-01.png'
  '13_world_02_banner.png'       = 'banner-world-02.png'
  '14_world_03_banner.png'       = 'banner-world-03.png'
  '15_world_04_banner.png'       = 'banner-world-04.png'
  '16_world_05_banner.png'       = 'banner-world-05.png'
  '14_nav_home.png'              = 'nav-home.png'
  '15_nav_map.png'               = 'nav-map.png'
  '16_nav_achievements.png'      = 'nav-achievements.png'
  '17_nav_materials.png'         = 'nav-materials.png'
  '18_nav_profile.png'           = 'nav-profile.png'
  '19_level_01_active_node.png'  = 'node-level-active.png'
  '20_level_02_node.png'         = 'node-level-open.png'
  '21_level_03_locked_node.png'  = 'node-level-locked.png'
  '22_triangle_hero_map_crop.png' = 'hero-triangle.png'
}

foreach ($k in $map.Keys) {
  Copy-Item (Join-Path $src $k) (Join-Path $dst $map[$k]) -Force
}

(Get-ChildItem $dst | Measure-Object).Count
