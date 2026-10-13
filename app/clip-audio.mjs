// Breath, changing vowel resonances, and uneven syllables, not a pitched beep.
export function renderClipChatter(sampleRate, beat) {
  const samples = new Float32Array(Math.ceil(sampleRate * beat.duration));
  const vowels = [[560, 1040], [420, 1460], [330, 870], [640, 1220]];
  const formants = vowels[beat.vowel];
  const filters = formants.map((frequency) => {
    const angle = 2 * Math.PI * frequency / sampleRate;
    const alpha = Math.sin(angle) / 2.2;
    return { b: alpha / (1 + alpha), a1: -2 * Math.cos(angle) / (1 + alpha), a2: (1 - alpha) / (1 + alpha), x1: 0, x2: 0, y1: 0, y2: 0 };
  });
  let seed = beat.seed;
  let phase = 0;
  let breath = 0;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate;
    const position = i / Math.max(1, samples.length - 1);
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    breath += .3 * (noise - breath);
    const pitch = beat.pitch * (1 + .045 * Math.sin(t * 31 + beat.seed) - .07 * position);
    phase += 2 * Math.PI * pitch / sampleRate;
    let voiced = Math.sin(phase);
    for (let harmonic = 2; harmonic <= 10; harmonic++) voiced += Math.sin(phase * harmonic) / harmonic ** 1.7;
    const input = voiced * .75 + breath * .3;
    let resonance = 0;
    for (const filter of filters) {
      const y = filter.b * (input - filter.x2) - filter.a1 * filter.y1 - filter.a2 * filter.y2;
      filter.x2 = filter.x1; filter.x1 = input;
      filter.y2 = filter.y1; filter.y1 = y;
      resonance += y;
    }
    const envelope = Math.sin(Math.PI * position) ** 1.2;
    samples[i] = (voiced * .12 + resonance * 1.8 + breath * .06) * envelope;
    peak = Math.max(peak, Math.abs(samples[i]));
  }
  const level = .13 / Math.max(.001, peak);
  for (let i = 0; i < samples.length; i++) samples[i] *= level;
  return samples;
}

export function playClipChatter(context, beat) {
  if (!beat || context.state !== "running") return;
  const samples = renderClipChatter(context.sampleRate, beat);
  const buffer = context.createBuffer(1, samples.length, context.sampleRate);
  buffer.copyToChannel(samples, 0);
  const voice = context.createBufferSource();
  voice.buffer = buffer;
  voice.connect(context.destination);
  voice.onended = () => voice.disconnect();
  voice.start();
  voice.stop(context.currentTime + beat.duration + .01);
}
