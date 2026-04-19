
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Record<string, HTMLAudioElement> = {};
  private audioContext: AudioContext | null = null;

  private constructor() {
    // AudioContext is initialized on first user interaction to comply with browser policies
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public loadSound(name: string, path: string) {
    const audio = new Audio(path);
    this.sounds[name] = audio;
  }

  public play(name: string) {
    const sound = this.sounds[name];
    if (sound) {
      // Clone the node to allow overlapping sounds of the same type
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.play().catch(e => console.warn(`Sound playback failed for ${name}:`, e));
    } else {
      console.warn(`Sound ${name} not found.`);
    }
  }

  public init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
}
