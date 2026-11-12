m() { curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST https://api.elevenlabs.io/v1/music -H 'Content-Type: application/json' -d "{\"prompt\":\"$2 Instrumental only, no vocals. Background music under a narrator, not too busy, steady volume.\",\"music_length_ms\":$3}"; }
m as0 "Curious playful documentary opener: light pizzicato strings, soft marimba, a gentle bouncing rhythm like sneakers on a gym floor, building curiosity." 40000 &
m as1 "Nostalgic postwar Japanese port town: warm acoustic guitar and soft piano, humble but hopeful, quiet determination." 170000; wait
m as2 "Inventive sporty momentum: light drums, bass, plucked strings and bright piano, steady running tempo, hopeful, 118 bpm." 200000 &
m as3 "1960s to 1970s American road trip feel: acoustic guitar and soft electric piano, friendly, then slowly more tense and serious, 105 bpm." 160000; wait
m as4 "Modern global and confident: light electronic beat with piano and strings, uplifting, world stage, 115 bpm." 130000 &
m as5 "Warm reflective finale: piano and strings, gentle build, hopeful and inspiring ending." 60000; wait
m as6 "Cheerful warm outro for a YouTube end screen: light piano, pizzicato strings, soft percussion, happy and relaxed, ends with a clean final chord." 24000; wait
