let voices: any[] = [];

window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
};

const getVoices = () => {
  return new Promise((resolve) => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
  });
};

async function tts(value: string, lang: string, voice: any, settings ?: {rate?: number, pitch?: number, volume?: number, onFinished?: () => void}) {
  // If speechSynthesis is speaking, cancel it
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  let utterance = new SpeechSynthesisUtterance(value);
  // Set the language
  utterance.lang = lang;
  // Use the default voice

  utterance.voice = voice;
  // Set the speech rate, pitch and volume here
  utterance.rate = settings?.rate ?? 1; // 0.1 to 10
  utterance.pitch = settings?.pitch ?? 1; //0 to 2
  utterance.volume = settings?.volume ?? 1; // 0 to 1

  if (settings?.onFinished) {
    utterance.onend = settings?.onFinished;
  }

  // Queue this utterance
  window.speechSynthesis.speak(utterance);
}

export async function ttsJp(value: string, onFinished?: () => void) {
  const voices: any = await getVoices();
  const japVoices = voices.filter((voice: any) => voice.lang === 'ja-JP');
  tts(value, "ja-JP", japVoices[japVoices.length-1], {rate: 0.8, onFinished});
}

export async function ttsFr(value: string, onFinished?: () => void) {
  const voices: any = await getVoices();
  const frVoices = voices.filter((voice: any) => voice.lang === 'fr-FR');
  console.log(frVoices, frVoices[frVoices.length-1]);
  tts(value, "fr-FR", frVoices[frVoices.length-1], {onFinished});
}