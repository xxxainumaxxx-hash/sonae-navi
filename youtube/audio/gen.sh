m() { curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST https://api.elevenlabs.io/v1/music -H 'Content-Type: application/json' -d "{\"prompt\":\"$2 Instrumental only, no vocals. Background music under a narrator, not too busy, steady volume.\",\"music_length_ms\":$3}"; }
s() { curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST https://api.elevenlabs.io/v1/sound-generation -H 'Content-Type: application/json' -d "{\"text\":\"$2\",\"duration_seconds\":$3}"; }
m bgm2 "Uneasy, slightly comedic struggle: muted bassoon, pizzicato strings, slow tempo, minor key, light tension, things going wrong." 64000 &
m bgm3 "Quirky inventive workshop mood: clarinet, marimba, glockenspiel, ukulele, light percussion, curious and playful, 110 bpm." 165000; wait
m bgm4 "Upbeat optimistic pop with a retro 8-bit chiptune lead over real drums and bass, energetic and fun, 120 bpm." 160000 &
m bgm5 "Melancholic gentle solo piano with soft strings, reflective and quiet, slow." 48000; wait
m bgm6 "Hopeful warm piano and strings, gradually building with light percussion, uplifting and inspiring finale." 130000 &
s sfx_pop "soft cute cartoon pop, short bubble pop" 0.5; wait
s sfx_soft "very soft gentle airy whoosh, low pitched, subtle and smooth, no click, short" 0.6
