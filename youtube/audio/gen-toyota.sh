m() { curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST https://api.elevenlabs.io/v1/music -H 'Content-Type: application/json' -d "{\"prompt\":\"$2 Instrumental only, no vocals. Background music under a narrator, not too busy, steady volume.\",\"music_length_ms\":$3}"; }
m ty0 "Intriguing documentary opener: soft ticking clock percussion, rhythmic wooden loom-like clacks, warm cello, building curiosity." 40000 &
m ty1 "Nostalgic rural Japanese mood: shakuhachi flute, koto, soft hand drum, gentle and humble, Meiji era village at night." 150000; wait
m ty2 "Inventive determined mood: clarinet and marimba with steady mechanical rhythm, like machines and gears, hopeful, 105 bpm." 160000 &
m ty3 "Bold industrious mood: brass and strings, steady march-like drums, building ambition, early automobile age, 110 bpm." 120000; wait
m ty4 "Tense and dark: low strings, sparse piano, slow pulse, financial crisis, hardship." 60000 &
m ty5 "Smart and modern: light electronic pulse with marimba and plucked strings, efficient factory, optimistic, 115 bpm." 60000; wait
m ty6 "Warm reflective finale: piano and strings, gentle build, hopeful and inspiring ending." 60000 &
m ty7 "Cheerful warm outro for a YouTube end screen: light piano, pizzicato strings, soft percussion, happy and relaxed, ends with a clean final chord." 24000; wait
