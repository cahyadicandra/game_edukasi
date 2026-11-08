/**
 * audio.js - Synthesizer Web Audio API Murni untuk Triangle Quest
 * Tanpa dependensi file audio eksternal, latensi nol, responsif di HP & desktop.
 */

import { SAVE } from './save.js';

let audioCtx = null;
let bgmGainNode = null;
let bgmOsc1 = null;
let bgmOsc2 = null;
let bgmInterval = null;
let bgmStep = 0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const Sound = {
  init() {
    getAudioContext();
  },

  playJump() {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  },

  playShoot(coreType = 'core_orb') {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    if (coreType === 'core_fire') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);
    } else if (coreType === 'core_ice') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
    } else if (coreType === 'core_laser') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
    } else if (coreType === 'core_star') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    } else {
      // Standar
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
    }

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  },

  playHit() {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  },

  playStomp() {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  },

  playExplosion(isLarge = false) {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = isLarge ? 0.45 : 0.25;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 400 : 800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isLarge ? 0.4 : 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  },

  playCoin() {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc1.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.26);
  },

  playPowerup() {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    });
  },

  playBossRoar() {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.7);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.76);
  },

  playGachaReveal(rarity) {
    if (!SAVE.settings.sfx) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const chordMap = {
      common: [261.63, 329.63],
      rare: [329.63, 392.00, 523.25],
      epic: [392.00, 493.88, 587.33, 783.99],
      legendary: [523.25, 659.25, 783.99, 1046.50, 1318.51]
    };
    const freqs = chordMap[rarity] || chordMap.common;
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = rarity === 'legendary' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.38);
    });
  },

  startBGM() {
    if (!SAVE.settings.music) return;
    const ctx = getAudioContext();
    if (!ctx || bgmInterval) return;

    bgmGainNode = ctx.createGain();
    bgmGainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    bgmGainNode.connect(ctx.destination);

    const bassLine = [130.81, 146.83, 164.81, 174.61]; // C3, D3, E3, F3
    const leadNotes = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33];

    bgmInterval = setInterval(() => {
      if (!SAVE.settings.music) {
        Sound.stopBGM();
        return;
      }
      const now = ctx.currentTime;
      // Bass
      if (bgmStep % 4 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassG = ctx.createGain();
        bassOsc.type = 'triangle';
        const bFreq = bassLine[Math.floor(bgmStep / 4) % bassLine.length];
        bassOsc.frequency.setValueAtTime(bFreq, now);

        bassG.gain.setValueAtTime(0.12, now);
        bassG.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        bassOsc.connect(bassG);
        bassG.connect(bgmGainNode);
        bassOsc.start(now);
        bassOsc.stop(now + 0.36);
      }

      // Lead melody
      const leadOsc = ctx.createOscillator();
      const leadG = ctx.createGain();
      leadOsc.type = 'sine';
      const lFreq = leadNotes[bgmStep % leadNotes.length];
      leadOsc.frequency.setValueAtTime(lFreq, now);

      leadG.gain.setValueAtTime(0.07, now);
      leadG.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

      leadOsc.connect(leadG);
      leadG.connect(bgmGainNode);
      leadOsc.start(now);
      leadOsc.stop(now + 0.2);

      bgmStep = (bgmStep + 1) % 32;
    }, 220);
  },

  stopBGM() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    if (bgmGainNode) {
      try {
        bgmGainNode.disconnect();
      } catch {}
      bgmGainNode = null;
    }
  },

  toggleMusic() {
    SAVE.settings.music = !SAVE.settings.music;
    if (SAVE.settings.music) {
      Sound.startBGM();
    } else {
      Sound.stopBGM();
    }
  },

  toggleSFX() {
    SAVE.settings.sfx = !SAVE.settings.sfx;
  }
};
