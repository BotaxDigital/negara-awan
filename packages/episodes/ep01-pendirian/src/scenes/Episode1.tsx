import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, spring, sequence } from 'remotion';
import { EpisodeMetadata, ScriptLine } from '@negara-awan/core';
import { HookScene } from './HookScene';
import { LoreIntroScene } from './LoreIntroScene';
import { PresidenEntranceScene } from './PresidenEntranceScene';
import { SumpahScene } from './SumpahScene';
import { BukaPendaftaranScene } from './BukaPendaftaranScene';
import { TeaserScene } from './TeaserScene';
import { CTAScene } from './CTAScene';

interface Episode1Props {
  episodeData: EpisodeMetadata;
}

export const Episode1: React.FC<Episode1Props> = ({ episodeData }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  // Hitung frame start untuk setiap scene berdasarkan durasi script
  const sceneTimings = useMemo(() => {
    let currentFrame = 0;
    return episodeData.script.map((line: ScriptLine) => {
      const startFrame = currentFrame;
      const endFrame = currentFrame + Math.round(line.durationSec * fps);
      currentFrame = endFrame;
      return { id: line.id, startFrame, endFrame, line };
    });
  }, [episodeData.script]);

  return (
    <>
      {/* Scene 1: Hook (0:00-0:15) */}
      <HookScene
        startFrame={sceneTimings.find(s => s.id === 's01_hook')?.startFrame || 0}
        endFrame={sceneTimings.find(s => s.id === 's01_hook')?.endFrame || 450}
        line={sceneTimings.find(s => s.id === 's01_hook')?.line}
      />
      
      {/* Scene 2: Lore Intro (0:15-0:45) */}
      <LoreIntroScene
        startFrame={sceneTimings.find(s => s.id === 's02_lore_intro')?.startFrame || 450}
        endFrame={sceneTimings.find(s => s.id === 's02_lore_intro')?.endFrame || 1350}
        line={sceneTimings.find(s => s.id === 's02_lore_intro')?.line}
        lore={episodeData.loreUpdate}
      />
      
      {/* Scene 3: Presiden Entrance (0:45-0:55) */}
      <PresidenEntranceScene
        startFrame={sceneTimings.find(s => s.id === 's03_presiden_entrance')?.startFrame || 1350}
        endFrame={sceneTimings.find(s => s.id === 's03_presiden_entrance')?.endFrame || 1500}
        line={sceneTimings.find(s => s.id === 's03_presiden_entrance')?.line}
      />
      
      {/* Scene 4: Sumpah (0:55-1:30) */}
      <SumpahScene
        startFrame={sceneTimings.find(s => s.id === 's04_sumpah')?.startFrame || 1500}
        endFrame={sceneTimings.find(s => s.id === 's04_sumpah')?.endFrame || 2160}
        line={sceneTimings.find(s => s.id === 's04_sumpah')?.line}
      />
      
      {/* Scene 5: Buka Pendaftaran (1:30-2:15) */}
      <BukaPendaftaranScene
        startFrame={sceneTimings.find(s => s.id === 's05_buka_pendaftaran')?.startFrame || 2160}
        endFrame={sceneTimings.find(s => s.id === 's05_buka_pendaftaran')?.endFrame || 2700}
        line={sceneTimings.find(s => s.id === 's05_buka_pendaftaran')?.line}
      />
      
      {/* Scene 6: Teaser Ep 2 (2:15-2:45) */}
      <TeaserScene
        startFrame={sceneTimings.find(s => s.id === 's06_teaser_ep2')?.startFrame || 2700}
        endFrame={sceneTimings.find(s => s.id === 's06_teaser_ep2')?.endFrame || 2970}
        line={sceneTimings.find(s => s.id === 's06_teaser_ep2')?.line}
      />
      
      {/* Scene 7: CTA (2:45-3:00) */}
      <CTAScene
        startFrame={sceneTimings.find(s => s.id === 's07_cta')?.startFrame || 2970}
        endFrame={sceneTimings.find(s => s.id === 's07_cta')?.endFrame || 3240}
        line={sceneTimings.find(s => s.id === 's07_cta')?.line}
      />
    </>
  );
};