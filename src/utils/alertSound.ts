/**
 * Sound synthesizer for Cold Water Alert warning chimes using Web Audio API
 */
let audioCtx: AudioContext | null = null;

export function playColdWaterWarningSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Dual-frequency cool chime: High tone then Low tone
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.3); // C5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now); // A5
    osc2.frequency.exponentialRampToValueAtTime(440, now + 0.35); // A4

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.warn('Could not play alert sound', e);
  }
}

/**
 * Sends a native browser push notification if permissions are granted
 */
export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } catch (e) {
        console.warn('Browser notification failed', e);
      }
    }
  }
}
