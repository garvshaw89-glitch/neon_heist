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
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAlarm();
      this.stopTension();
    }
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
