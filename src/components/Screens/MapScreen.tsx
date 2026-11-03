import React from 'react';
import type { PlayerProfile } from '../../types/game';
import { TopHeader } from '../Header/TopHeader';
import type { LevelNodeData, WorldData } from '../../data/worlds';
import { LevelNodeButton } from './LevelNodeButton';
import { IslandPathLine } from './IslandPathLine';
import { WorldBanner } from './WorldBanner';
import { ShapeCollectionCard } from './ShapeCollectionCard';
import { MapTitleBanner } from './MapTitleBanner';
import './MapScreen.css';

interface MapScreenProps {
  player: PlayerProfile;
  worlds: WorldData[];
  onOpenProfile: () => void;
  onAddStars: () => void;
  onAddDiamonds: () => void;
  onOpenSettings: () => void;
  onSelectLevel: (level: LevelNodeData, world: WorldData) => void;
  onOpenCollection: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  player,
  worlds,
  onOpenProfile,
  onAddStars,
  onAddDiamonds,
  onOpenSettings,
  onSelectLevel,
  onOpenCollection,
}) => {
  return (
    <div className="map-screen">
      {/* Langit biru cerah dengan gradien petualangan */}
      <div className="map-sky">
        <div className="map-cloud cloud-1" />
        <div className="map-cloud cloud-2" />
        <div className="map-cloud cloud-3" />
      </div>

      {/* Header atas: profil + koin + pengaturan */}
      <header className="map-header">
        <TopHeader
          player={player}
          onOpenProfile={onOpenProfile}
          onAddStars={onAddStars}
          onAddDiamonds={onAddDiamonds}
          onOpenSettings={onOpenSettings}
        />
      </header>

      {/* Area gulir pulau-pulau 3D */}
      <div className="map-islands-scroll">
        {/* Spanduk Vektor Peta Petualangan terpusat di bagian atas */}
        <div className="map-title-row">
          <MapTitleBanner />
        </div>

        <div className="map-islands-stack">
          {worlds.map((world) => (
            <div key={world.id} className={`world-item align-${world.align}`}>
              {/* Spanduk nama dunia vektor murni */}
              <div className="world-banner-wrap">
                <WorldBanner
                  worldNumber={world.number}
                  worldName={world.name}
                  subtitle={world.subtitle}
                />
              </div>

              {/* Wadah gambar pulau 3D dari castle + garis jalur + tombol level */}
              <div className="world-image-wrap">
                <img
                  src={world.image}
                  alt={`Pulau ${world.name}`}
                  className="world-island-img"
                  draggable={false}
                />

                {/* Garis jalur putus-putus penghubung antar level */}
                <IslandPathLine levels={world.levels} />

                {/* Tombol-tombol level interaktif */}
                {world.levels.map((lvl) => (
                  <LevelNodeButton
                    key={lvl.num}
                    level={lvl}
                    onSelect={() => onSelectLevel(lvl, world)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Kartu koleksi bentuk vektor & dinamis di akhir peta */}
          <ShapeCollectionCard
            collected={player.inventory?.collectedCards?.length || 0}
            total={13}
            onClick={onOpenCollection}
          />
        </div>
      </div>
    </div>
  );
};
