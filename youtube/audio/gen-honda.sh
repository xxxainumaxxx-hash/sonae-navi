m() { curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST https://api.elevenlabs.io/v1/music -H 'Content-Type: application/json' -d "{\"prompt\":\"$2 Instrumental only, no vocals. Background music under a narrator, not too busy, steady volume.\",\"music_length_ms\":$3}"; }
m hd0 "Playful curious documentary opener: light putt-putt rhythmic percussion like a small two-stroke engine, plucky bass, warm strings, building curiosity." 40000 &
m hd1 "Nostalgic postwar Japanese town: harmonica and acoustic guitar, soft brushes, humble but hopeful, 1940s." 170000; wait
m hd2 "Upbeat buddy duo mood: jazzy swing with clarinet, upright bass and light drums, two partners working together, playful and confident, 120 bpm." 170000 &
m hd3 "Racing challenge: tense pulsing build with driving drums and strings, then triumphant brass, motorcycle race spirit, 125 bpm." 140000; wait
m hd4 "Bright global journey: ukulele, marimba and light percussion, cheerful everyday life in towns around the world, 112 bpm." 110000 &
m hd5 "Warm reflective finale: piano and strings, gentle build, hopeful and inspiring ending." 60000; wait
m hd6 "Cheerful warm outro for a YouTube end screen: light piano, pizzicato strings, soft percussion, happy and relaxed, ends with a clean final chord." 24000; wait
