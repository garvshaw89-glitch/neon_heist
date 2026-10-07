export type SoundtrackMode = 'SCOUTING' | 'ALERTED';

export interface SoundtrackTelemetry {
  mode: SoundtrackMode;
  tension: number;
  isAlerted: boolean;
  isPlaying: boolean;
}

class DynamicSoundtrackEngine {
  private ctx: AudioContext;
  private isMuted: boolean = false;
  private isPaused: boolean = false;
  private masterVolume: number = 0.7;
  private isPlaying: boolean = false;

  private mode: SoundtrackMode = 'SCOUTING';
  private tensionIntensity: number = 0; // 0 to 1

  // Master Soundtrack Bus
  private masterGain: GainNode | null = null;

  // Layer 1: Low-Tension Ambient Noise (Scouting)
  private ambientGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneLfo: OscillatorNode | null = null;
  private droneLfoGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private ambientNoiseFilter: BiquadFilterNode | null = null;
  private ambientNoiseGain: GainNode | null = null;
  private radarTimer: number | null = null;

  // Layer 2: High-Tension Rhythmic Synth-Wave (Alerted)
  private synthwaveGain: GainNode | null = null;
  private schedulerTimer: number | null = null;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;
  private tempo: number = 126; // Cyberpunk synth-wave BPM
  private noiseBuffer: AudioBuffer | null = null;

  // Synthesizer Frequency Tables
  private static readonly BASS_FREQS = [
    73.42, 73.42, 87.31, 73.42, // D2, D2, F2, D2
    98.00, 73.42, 87.31, 82.41, // G2, D2, F2, E2
    73.42, 73.42, 65.41, 73.42, // D2, D2, C2, D2
    58.27, 65.41, 73.42, 55.00  // Bb1, C2, D2, A1
  ];

  private static readonly ARP_FREQS = [
    146.83, 174.61, 220.00, 293.66, // D3, F3, A3, D4
    261.63, 220.00, 174.61, 164.81, // C4, A3, F3, E3
    146.83, 174.61, 220.00, 329.63, // D3, F3, A3, E4
    293.66, 261.63, 220.00, 174.61  // D4, C4, A3, F3
  ];

  constructor(ctx: AudioContext, masterVolume: number = 0.7, isMuted: boolean = false) {
    this.ctx = ctx;
    this.masterVolume = masterVolume;
    this.isMuted = isMuted;
    this.initNoiseBuffer();
  }

  private initNoiseBuffer() {
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 2.0);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut * 0.94) + (white * 0.06);
        data[i] = lastOut * 2.8;
      }
    } catch {
      this.noiseBuffer = null;
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isPaused = false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // Master Soundtrack Output Bus
    this.masterGain = this.ctx.createGain();
    const effectiveVol = this.isMuted || this.isPaused ? 0.0001 : this.masterVolume;
    this.masterGain.gain.setValueAtTime(effectiveVol, now);
    this.masterGain.connect(this.ctx.destination);

    // Setup Low-Tension Ambient Noise Layer
    this.setupAmbientLayer();

    // Setup High-Tension Rhythmic Synth-Wave Layer
    this.setupSynthwaveLayer();

    // Initial state balancing
    this.applyModeGains(true);
  }

  private setupAmbientLayer() {
    if (!this.masterGain) return;
    const now = this.ctx.currentTime;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.20, now);
    this.ambientGain.connect(this.masterGain);

    // Sub-bass drones (sine 55Hz & triangle 82.4Hz)
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(160, now);
    this.droneFilter.Q.setValueAtTime(2.5, now);
    this.droneFilter.connect(this.ambientGain);

    // LFO for slow breathing of ambient filter (0.12 Hz)
    this.droneLfo = this.ctx.createOscillator();
    this.droneLfo.frequency.setValueAtTime(0.12, now);
    this.droneLfoGain = this.ctx.createGain();
    this.droneLfoGain.gain.setValueAtTime(65, now);
    this.droneLfo.connect(this.droneLfoGain);
    this.droneLfoGain.connect(this.droneFilter.frequency);
    this.droneLfo.start(now);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(55, now); // A1 sub
    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc1.start(now);

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(82.41, now); // E2 fifth
    this.droneOsc2.detune.setValueAtTime(4, now);
    this.droneOsc2.connect(this.droneFilter);
    this.droneOsc2.start(now);

    // Looped atmospheric cyber air / ventilation noise
    if (this.noiseBuffer) {
      this.ambientNoiseSource = this.ctx.createBufferSource();
      this.ambientNoiseSource.buffer = this.noiseBuffer;
      this.ambientNoiseSource.loop = true;

      this.ambientNoiseFilter = this.ctx.createBiquadFilter();
      this.ambientNoiseFilter.type = 'bandpass';
      this.ambientNoiseFilter.frequency.setValueAtTime(540, now);
      this.ambientNoiseFilter.Q.setValueAtTime(1.8, now);

      this.ambientNoiseGain = this.ctx.createGain();
      this.ambientNoiseGain.gain.setValueAtTime(0.045, now);

      this.ambientNoiseSource.connect(this.ambientNoiseFilter);
      this.ambientNoiseFilter.connect(this.ambientNoiseGain);
      this.ambientNoiseGain.connect(this.ambientGain);
      this.ambientNoiseSource.start(now);
    }

    // Occasional scouting sonar radar blip (every 7 seconds)
    this.radarTimer = window.setInterval(() => {
      if (this.mode === 'SCOUTING' && !this.isPaused && !this.isMuted) {
        this.triggerScoutingPing();
      }
    }, 7000);
  }

  private triggerScoutingPing() {
    if (!this.ambientGain || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Ignore ping failure
    }
  }

  private setupSynthwaveLayer() {
    if (!this.masterGain) return;
    const now = this.ctx.currentTime;

    this.synthwaveGain = this.ctx.createGain();
    this.synthwaveGain.gain.setValueAtTime(0.0001, now);
    this.synthwaveGain.connect(this.masterGain);

    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.startScheduler();
  }

  private startScheduler() {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
    }

    this.schedulerTimer = window.setInterval(() => {
      if (!this.isPlaying || this.isPaused) return;

      const secondsPer16th = 60 / this.tempo / 4;
      const scheduleHorizon = 0.12;

      while (this.nextNoteTime < this.ctx.currentTime + scheduleHorizon) {
        this.scheduleStep(this.currentStep, this.nextNoteTime);
        this.nextNoteTime += secondsPer16th;
        this.currentStep = (this.currentStep + 1) % 16;
      }
    }, 30);
  }

  private scheduleStep(step: number, time: number) {
    if (!this.synthwaveGain) return;

    // 1. Rhythmic Synth-Wave Bassline (D minor progression)
    this.playSynthwaveBass(step, time);

    // 2. Punchy Cyberpunk Percussion
    this.playSynthwaveDrums(step, time);

    // 3. Cyberpunk Synth Lead / Arpeggiator (increases with tension)
    if (this.mode === 'ALERTED' || this.tensionIntensity > 0.15) {
      this.playSynthwaveArp(step, time);
    }
  }

  private playSynthwaveBass(step: number, time: number) {
    if (!this.synthwaveGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const freq = DynamicSoundtrackEngine.BASS_FREQS[step];
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      const baseCutoff = this.mode === 'ALERTED' ? 950 + this.tensionIntensity * 800 : 450;
      filter.frequency.setValueAtTime(baseCutoff, time);
      filter.frequency.exponentialRampToValueAtTime(110, time + 0.12);
      filter.Q.setValueAtTime(4.0, time);

      const bassVol = this.mode === 'ALERTED' ? 0.22 : 0.05;
      gain.gain.setValueAtTime(bassVol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.synthwaveGain);

      osc.start(time);
      osc.stop(time + 0.14);
    } catch {
      // Audio error catch
    }
  }

  private playSynthwaveDrums(step: number, time: number) {
    if (!this.synthwaveGain) return;

    try {
      // Kick: 4-on-the-floor on steps 0, 4, 8, 12 (+ double-kick on 14 if high alert)
      const isKick = step % 4 === 0 || (this.tensionIntensity > 0.65 && step === 14);
      if (isKick) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, time);
        osc.frequency.exponentialRampToValueAtTime(38, time + 0.075);

        gain.gain.setValueAtTime(0.32, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

        osc.connect(gain);
        gain.connect(this.synthwaveGain);

        osc.start(time);
        osc.stop(time + 0.15);
      }

      // Snare / Cyber Clap: steps 4 and 12 (beats 2 and 4)
      if (step === 4 || step === 12) {
        if (this.noiseBuffer) {
          const snareNoise = this.ctx.createBufferSource();
          snareNoise.buffer = this.noiseBuffer;

          const snareFilter = this.ctx.createBiquadFilter();
          snareFilter.type = 'bandpass';
          snareFilter.frequency.setValueAtTime(1800, time);
          snareFilter.Q.setValueAtTime(2.0, time);

          const snareGain = this.ctx.createGain();
          snareGain.gain.setValueAtTime(0.24, time);
          snareGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

          snareNoise.connect(snareFilter);
          snareFilter.connect(snareGain);
          snareGain.connect(this.synthwaveGain);

          snareNoise.start(time);
          snareNoise.stop(time + 0.15);
        }

        const bodyOsc = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(210, time);
        bodyOsc.frequency.exponentialRampToValueAtTime(80, time + 0.05);

        bodyGain.gain.setValueAtTime(0.12, time);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(this.synthwaveGain);

        bodyOsc.start(time);
        bodyOsc.stop(time + 0.07);
      }

      // Hi-hat: offbeat 8ths (steps 2, 6, 10, 14) and softer 16ths
      if (this.noiseBuffer) {
        const isOffbeat = step % 4 === 2;
        const hatSource = this.ctx.createBufferSource();
        hatSource.buffer = this.noiseBuffer;

        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(7500, time);

        const hatGain = this.ctx.createGain();
        const hatVol = isOffbeat ? 0.08 : 0.035;
        hatGain.gain.setValueAtTime(hatVol, time);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

        hatSource.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.synthwaveGain);

        hatSource.start(time);
        hatSource.stop(time + 0.05);
      }
    } catch {
      // Audio error catch
    }
  }

  private playSynthwaveArp(step: number, time: number) {
    if (!this.synthwaveGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const noteFreq = DynamicSoundtrackEngine.ARP_FREQS[step];
      osc.frequency.setValueAtTime(noteFreq, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000 + this.tensionIntensity * 1200, time);
      filter.Q.setValueAtTime(3.0, time);

      const arpVol = 0.06 + this.tensionIntensity * 0.09;
      gain.gain.setValueAtTime(arpVol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.synthwaveGain);

      osc.start(time);
      osc.stop(time + 0.1);
    } catch {
      // Audio error catch
    }
  }

  public updateState(isAlerted: boolean, tensionIntensity: number) {
    const nextMode: SoundtrackMode = isAlerted ? 'ALERTED' : 'SCOUTING';
    const modeChanged = nextMode !== this.mode;
    this.mode = nextMode;
    this.tensionIntensity = Math.min(1, Math.max(0, tensionIntensity));

    this.applyModeGains(modeChanged);
  }

  private applyModeGains(modeChanged: boolean) {
    if (!this.ambientGain || !this.synthwaveGain || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;

      if (this.mode === 'ALERTED') {
        // Security AI is Alerted -> Dynamic High-Tension Rhythmic Synth-Wave
        this.ambientGain.gain.linearRampToValueAtTime(0.03, now + 0.4);

        const targetSynthwaveVol = 0.22 + (this.tensionIntensity * 0.10);
        this.synthwaveGain.gain.linearRampToValueAtTime(targetSynthwaveVol, now + (modeChanged ? 0.35 : 0.15));
      } else {
        // Scouting Mode -> Low-Tension Ambient Noise
        this.ambientGain.gain.linearRampToValueAtTime(0.20, now + (modeChanged ? 0.8 : 0.15));
        this.synthwaveGain.gain.linearRampToValueAtTime(0.0001, now + (modeChanged ? 1.4 : 0.2));
      }
    } catch {
      // Audio error catch
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = vol;
    if (this.masterGain && this.ctx) {
      const effectiveVol = this.isMuted || this.isPaused ? 0.0001 : this.masterVolume;
      try {
        this.masterGain.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
      } catch {
        // Audio error catch
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const effectiveVol = muted || this.isPaused ? 0.0001 : this.masterVolume;
      try {
        this.masterGain.gain.linearRampToValueAtTime(effectiveVol, this.ctx.currentTime + 0.1);
      } catch {
        // Audio error catch
      }
    }
  }

  public pause() {
    this.isPaused = true;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      } catch {
        // Audio error catch
      }
    }
  }

  public resume() {
    this.isPaused = false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      const effectiveVol = this.isMuted ? 0.0001 : this.masterVolume;
      try {
        this.masterGain.gain.linearRampToValueAtTime(effectiveVol, this.ctx.currentTime + 0.15);
      } catch {
        // Audio error catch
      }
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.radarTimer !== null) {
      clearInterval(this.radarTimer);
      this.radarTimer = null;
    }

    try {
      this.droneOsc1?.stop();
      this.droneOsc1?.disconnect();
      this.droneOsc2?.stop();
      this.droneOsc2?.disconnect();
      this.droneLfo?.stop();
      this.droneLfo?.disconnect();
      this.ambientNoiseSource?.stop();
      this.ambientNoiseSource?.disconnect();
      this.masterGain?.disconnect();
    } catch {
      // Ignore if already stopped
    }

    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneLfo = null;
    this.droneLfoGain = null;
    this.droneFilter = null;
    this.ambientNoiseSource = null;
    this.ambientNoiseFilter = null;
    this.ambientNoiseGain = null;
    this.ambientGain = null;
    this.synthwaveGain = null;
    this.masterGain = null;
  }

  public getTelemetry(): SoundtrackTelemetry {
    return {
      mode: this.mode,
      tension: Math.round(this.tensionIntensity * 100),
      isAlerted: this.mode === 'ALERTED',
      isPlaying: this.isPlaying && !this.isPaused && !this.isMuted
    };
  }
}

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private masterVolume: number = 0.7;
  private ambientGain: GainNode | null = null;
  private alarmOsc: OscillatorNode | null = null;
  private alarmGain: GainNode | null = null;
  private tensionGain: GainNode | null = null;
  private tensionOsc: OscillatorNode | null = null;
  private soundtrackEngine: DynamicSoundtrackEngine | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, sfx: number) {
    this.masterVolume = master;
    this.sfxVolume = sfx;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0.12 * master, this.ctx.currentTime);
    }
    this.soundtrackEngine?.setMasterVolume(master);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAlarm();
      this.stopTension();
    }
    this.soundtrackEngine?.setMuted(muted);
  }

  // Dynamic Soundtrack Management API
  public startSoundtrack() {
    this.initContext();
    if (!this.ctx) return;
    if (!this.soundtrackEngine) {
      this.soundtrackEngine = new DynamicSoundtrackEngine(this.ctx, this.masterVolume, this.isMuted);
    }
    this.soundtrackEngine.start();
  }

  public stopSoundtrack() {
    this.soundtrackEngine?.stop();
  }

  public pauseSoundtrack() {
    this.soundtrackEngine?.pause();
  }

  public resumeSoundtrack() {
    this.soundtrackEngine?.resume();
  }

  public updateSoundtrack(isAlerted: boolean, tensionIntensity: number) {
    if (!this.soundtrackEngine && !this.isMuted) {
      this.startSoundtrack();
    }
    this.soundtrackEngine?.updateState(isAlerted, tensionIntensity);
  }

  public getSoundtrackTelemetry(): SoundtrackTelemetry {
    return this.soundtrackEngine
      ? this.soundtrackEngine.getTelemetry()
      : { mode: 'SCOUTING', tension: 0, isAlerted: false, isPlaying: false };
  }

  // Soft futuristic UI click
  public playUiClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.15 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Hover tone
  public playUiHover() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1750, this.ctx.currentTime + 0.03);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.04 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Confirmation / Data Accepted
  public playConfirm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume * this.masterVolume, now + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.18);
    });
  }

  // Realistic AR Scanner Activation
  public playScannerMode(active: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(8, now);

    if (active) {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.18);
    } else {
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.15);
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    }

    gain.gain.setValueAtTime(0.08 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Realistic Physical Light Switch
  public playLightSwitch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);

    gain.gain.setValueAtTime(0.15 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Realistic Heavy Mechanical Flight Case Open
  public playFlightCaseOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Dual latch click
    [0, 0.09].forEach(offset => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now + offset);
      osc.frequency.exponentialRampToValueAtTime(90, now + offset + 0.04);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume * this.masterVolume, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.06);
    });
  }

  // Realistic Pneumatic Door Slide
  public playHydraulicDoor() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(300, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.4);
  }

  // Realistic Distant Thunder Roll
  public playThunder() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.linearRampToValueAtTime(28, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2 * this.sfxVolume * this.masterVolume, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // Stealth Cloak Trigger
  public playCloak(active: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    if (active) {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
    } else {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.25);
    }

    gain.gain.setValueAtTime(0.15 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // EMP Blast / Distraction throw
  public playEmpPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low sub impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.5);

    subGain.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.55);

    // Noise crackle
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18 * this.sfxVolume * this.masterVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.32);
  }

  // Footstep acoustic sound
  public playFootstep(isCrouched: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isCrouched ? 80 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

    const vol = (isCrouched ? 0.02 : 0.07) * this.sfxVolume * this.masterVolume;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Hacking sound: node rotate
  public playHackRotate() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(740, now + 0.03);

    gain.gain.setValueAtTime(0.08 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Hacking sound: sequence success
  public playHackSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [659.25, 880, 1174.66].forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      gain.gain.setValueAtTime(0.12 * this.sfxVolume * this.masterVolume, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.22);
    });
  }

  // Guard suspicion chirp
  public playSuspicionAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.linearRampToValueAtTime(550, now + 0.12);

    gain.gain.setValueAtTime(0.08 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Alarm sound toggle
  public startAlarm() {
    if (this.isMuted || this.alarmOsc) return;
    this.initContext();
    if (!this.ctx) return;

    this.alarmOsc = this.ctx.createOscillator();
    this.alarmGain = this.ctx.createGain();

    this.alarmOsc.type = 'sawtooth';
    const now = this.ctx.currentTime;

    // Siren pulse modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(1.5, now); // 1.5 Hz siren cycle
    lfoGain.gain.setValueAtTime(220, now); // swing between ~600 and ~1040 Hz
    this.alarmOsc.frequency.setValueAtTime(820, now);
    lfo.connect(this.alarmOsc.frequency);
    lfo.start(now);

    this.alarmGain.gain.setValueAtTime(0.12 * this.sfxVolume * this.masterVolume, now);

    this.alarmOsc.connect(this.alarmGain);
    this.alarmGain.connect(this.ctx.destination);
    this.alarmOsc.start(now);
  }

  public stopAlarm() {
    if (this.alarmOsc && this.ctx) {
      try {
        this.alarmGain?.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        setTimeout(() => {
          this.alarmOsc?.stop();
          this.alarmOsc?.disconnect();
          this.alarmOsc = null;
        }, 220);
      } catch {
        this.alarmOsc = null;
      }
    }
  }

  // Tension heartbeat bass drone
  public setTensionLevel(level: number) { // level from 0 to 1
    if (this.isMuted || !this.ctx) return;
    if (level <= 0.05) {
      this.stopTension();
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    if (!this.tensionOsc) {
      this.tensionOsc = this.ctx.createOscillator();
      this.tensionGain = this.ctx.createGain();
      this.tensionOsc.type = 'sine';
      this.tensionOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      this.tensionGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.tensionOsc.connect(this.tensionGain);
      this.tensionGain.connect(this.ctx.destination);
      this.tensionOsc.start();
    }

    if (this.tensionGain) {
      const targetVol = Math.min(0.2, level * 0.18) * this.masterVolume;
      this.tensionGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.1);
    }
    if (this.tensionOsc) {
      // Frequency ramps up slightly with tension
      this.tensionOsc.frequency.linearRampToValueAtTime(55 + level * 30, this.ctx.currentTime + 0.1);
    }
  }

  public stopTension() {
    if (this.tensionOsc && this.ctx) {
      try {
        this.tensionGain?.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          this.tensionOsc?.stop();
          this.tensionOsc?.disconnect();
          this.tensionOsc = null;
        }, 320);
      } catch {
        this.tensionOsc = null;
      }
    }
  }

  // Terminal boot click and data beep
  public playTerminalBoot() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(0.09 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Tactical Pause sound
  public playPause() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Tactical Resume sound
  public playResume() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.1);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Classified Achievement Unlocked fanfare
  public playAchievementUnlocked() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [330, 440, 554.37, 659.25, 880];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.08 * this.sfxVolume * this.masterVolume, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.28);
    });
  }
}

export const sound = new SoundSystem();
