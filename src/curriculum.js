// Western Armenian curriculum. Classical (Mashtotsian) orthography, Western pronunciation.
// ALPHABET: [upper, lower, letter name, sound, hint, example, example romanized, example meaning]
const ALPHABET = [
["Ա","ա","ayp","a","a as in father","արեւ","arev","sun"],
["Բ","բ","pen","p","p as in pen","բարեւ","parev","hello"],
["Գ","գ","kim","k","k as in kite","գիրք","kirk","book"],
["Դ","դ","ta","t","t as in top","դուռ","tour","door"],
["Ե","ե","yech","ye · e","ye at the start of a word, e (as in bed) inside","երեք","yerek","three"],
["Զ","զ","za","z","z as in zoo","զանգ","zank","bell"],
["Է","է","e","e","e as in bed","էջ","ech","page"],
["Ը","ը","ət","ə","uh, like the a in about","ընկեր","ənger","friend"],
["Թ","թ","to","t","t as in top","թէյ","tey","tea"],
["Ժ","ժ","zhe","zh","like the s in measure","ժամ","zham","hour"],
["Ի","ի","ini","i","ee as in see","ինչ","inch","what"],
["Լ","լ","lyoun","l","l as in lamp","լաւ","lav","good"],
["Խ","խ","khe","kh","like ch in Bach","խնձոր","khntsor","apple"],
["Ծ","ծ","dza","dz","like ds in adds","ծով","dzov","sea"],
["Կ","կ","gen","g","g as in go","կատու","gadou","cat"],
["Հ","հ","ho","h","h as in hat","հաց","hats","bread"],
["Ձ","ձ","tsa","ts","ts as in cats","ձուկ","tsoug","fish"],
["Ղ","ղ","ghad","gh","a gargled r, like French r","աղ","agh","salt"],
["Ճ","ճ","je","j","j as in jam","ճաշ","jash","meal"],
["Մ","մ","men","m","m as in map","մայր","mayr","mother"],
["Յ","յ","hi","h · y","h at the start of a word, y inside, usually silent at the end","յոյս","houys","hope"],
["Ն","ն","nou","n","n as in net","նոր","nor","new"],
["Շ","շ","sha","sh","sh as in ship","շուն","shoun","dog"],
["Ո","ո","vo","vo · o","vo at the start of a word, o inside","ոչ","voch","no"],
["Չ","չ","cha","ch","ch as in chair","չորս","chors","four"],
["Պ","պ","be","b","b as in boy","պզտիկ","bzdig","small"],
["Ջ","ջ","che","ch","ch as in chair","ջուր","chour","water"],
["Ռ","ռ","ra","rr","a rolled r","առաւօտ","aravod","morning"],
["Ս","ս","se","s","s as in sun","սէր","ser","love"],
["Վ","վ","vev","v","v as in van","վարդ","vart","rose"],
["Տ","տ","dyoun","d","d as in dog","տուն","doun","house"],
["Ր","ր","re","r","a soft, tapped r","րոպէ","robe","minute"],
["Ց","ց","tso","ts","ts as in cats","ցուրտ","tsourd","cold"],
["Ւ","ւ","hyoun","v","v; it also builds ու, իւ and եւ","նաւ","nav","ship"],
["Փ","փ","pyour","p","p as in pen","փողոց","poghots","street"],
["Ք","ք","ke","k","k as in kite","քաղաք","kaghak","city"],
["Օ","օ","o","o","o as in more","օր","or","day"],
["Ֆ","ֆ","fe","f","f as in fun","ֆիլմ","film","film"],
// letter combinations
["Ու","ու","","ou","oo as in moon","ուրախ","ourakh","happy"],
["Եւ","եւ","","yev · ev","yev on its own (it means 'and'), ev inside a word","եւ","yev","and"],
["Իւ","իւ","","you","like the word 'you' (or French u)","ձիւն","tsyoun","snow"],
["Եա","եա","","ya","ya as in yard","սենեակ","senyag","room"],
["Ոյ","ոյ","","ouy","oo + y, like 'gooey' said quickly","լոյս","louys","light"]
];

const P = s => s.trim().split("\n").map(l => { const [hy, tr, en] = l.trim().split("|"); return { hy: hy.replace(/'/g, "՚"), tr, en }; });
const L = (title, words, sentences, tip) => ({ title, words: P(words), sentences: P(sentences), tip });
const A = (title, letters, tip) => ({ title, letters, tip });

const UNITS = [
{ title: "The Alphabet", desc: "All 38 letters, the Western way", lessons: [
A("Letters 1: Ա to Զ", [0,1,2,3,4,5], `<p>Armenian has 38 letters and is written left to right. Each letter has a capital and a small form.</p><p><b>The Western shift.</b> Western Armenian pronounces several consonants differently from Eastern Armenian. In this course <b>Բ = p</b>, <b>Գ = k</b>, <b>Դ = t</b>. Trust the sounds taught here, not what an Eastern chart says.</p>`),
A("Letters 2: Է to Լ", [6,7,8,9,10,11], `<p><b>Է</b> and <b>Ե</b> both sound like e, but Ե at the start of a word says <i>ye</i>.</p><p><b>Ը</b> is the short "uh". Armenian often says this sound between consonants without writing it: <span class="hy">պզտիկ</span> is read <i>bzdig</i> with tiny "uh" sounds helping it along.</p>`),
A("Letters 3: Խ to Ղ", [12,13,14,15,16,17], `<p>More of the Western shift: <b>Կ = g</b>, <b>Ծ = dz</b>, <b>Ձ = ts</b>.</p><p><b>Խ</b> (kh) is raspy, made at the back of the mouth. <b>Ղ</b> (gh) is the same place but voiced, like a gargle.</p>`),
A("Letters 4: Ճ to Շ", [18,19,20,21,22], `<p><b>Ճ = j</b> in Western Armenian.</p><p><b>Յ</b> changes by position: <i>h</i> at the start (<span class="hy">յոյս</span> houys), <i>y</i> in the middle (<span class="hy">մայր</span> mayr), and usually silent at the end (<span class="hy">տղայ</span> dgha).</p>`),
A("Letters 5: Ո to Ս", [23,24,25,26,27,28], `<p><b>Պ = b</b> and <b>Ջ = ch</b> in Western Armenian.</p><p><b>Ո</b> says <i>vo</i> at the start of a word and <i>o</i> elsewhere. <b>Ռ</b> is a strong rolled r.</p>`),
A("Letters 6: Վ to Ւ", [29,30,31,32,33], `<p><b>Տ = d</b> in Western Armenian.</p><p><b>Ր</b> is a light tapped r. <b>Ւ</b> is rarely alone: it mostly appears in the pairs you will meet in the last alphabet lesson.</p>`),
A("Letters 7: Փ to Ֆ", [34,35,36,37], `<p><b>Փ</b>, <b>Ք</b> are p and k. So Western Armenian has pairs that sound alike: Բ/Փ (p), Գ/Ք (k), Դ/Թ (t), Ձ/Ց (ts), Ջ/Չ (ch). Spelling them correctly is a matter of memory, like English "c" and "k".</p><p><b>Օ</b> is o. <b>Ֆ</b> is f and appears mostly in borrowed words.</p>`),
A("Letter pairs: ու, եւ, իւ, եա, ոյ", [38,39,40,41,42], `<p>Some sounds are written with two letters. <b>ու</b> is the vowel "oo". <b>իւ</b> sounds like "you". <b>եա</b> is "ya". <b>ոյ</b> is "ooy". <b>եւ</b> is "yev" as a word and "ev" inside one.</p><p>Punctuation: the full stop is <b>։</b> and the question mark <b>՞</b> sits on top of the stressed vowel of the word being asked about: <span class="hy">ի՞նչ</span> "what?"</p>`)
]},

{ title: "Greetings", desc: "Hello, thank you, goodbye", lessons: [
L("Hello", `
բարեւ|parev|hello
այո|ayo|yes
ոչ|voch|no
հաճիս|hajis|please
շնորհակալութիւն|shnorhagaloutyoun|thank you
ներողութիւն|neroghoutyoun|sorry
լաւ|lav|good
ինչպէս|inchbes|how`, `
Բարեւ, ինչպէ՞ս ես։|Parev, inchbes es?|Hello, how are you?
Լաւ եմ, շնորհակալութիւն։|Lav em, shnorhagaloutyoun.|I am well, thank you.
Այո, հաճիս։|Ayo, hajis.|Yes, please.
Ոչ, շնորհակալութիւն։|Voch, shnorhagaloutyoun.|No, thank you.`,
`<p><span class="hy">շնորհակալութիւն</span> is the full "thank you". In everyday speech Western Armenians also say <span class="hy">մերսի</span> (<i>mersi</i>).</p><p><span class="hy">ինչպէ՞ս ես</span> is "how are you?" to one person you know well.</p>`),
L("Through the day", `
բարի լոյս|pari louys|good morning
բարի իրիկուն|pari irigoun|good evening
գիշեր բարի|kisher pari|good night
ցտեսութիւն|tsdesoutyoun|goodbye
մնաք բարով|mnak parov|goodbye (said by the one leaving)
երթաք բարով|yertak parov|goodbye (said to the one leaving)
խնդրեմ|khntrem|you are welcome / please
շատ|shad|very`, `
Բարի լոյս, ինչպէ՞ս էք։|Pari louys, inchbes ek?|Good morning, how are you?
Շատ լաւ եմ։|Shad lav em.|I am very well.
Գիշեր բարի, ցտեսութիւն։|Kisher pari, tsdesoutyoun.|Good night, goodbye.
Շատ շնորհակալ եմ։|Shad shnorhagal em.|Thank you very much.`,
`<p><span class="hy">բարի լոյս</span> literally means "good light".</p><p>There are two goodbyes: the person leaving says <span class="hy">մնաք բարով</span> ("stay well") and the person staying answers <span class="hy">երթաք բարով</span> ("go well"). To one friend, say <span class="hy">մնաս բարով</span> and <span class="hy">երթաս բարով</span>.</p><p><span class="hy">խնդրեմ</span> answers a thank-you and also means "please" or "here you go". Another reply to thanks is <span class="hy">չ՚արժեր</span> (<i>charzher</i>, "it's nothing").</p><p><span class="hy">ինչպէ՞ս էք</span> is the polite or plural "how are you?"</p>`),
L("Names", `
անուն|anoun|name
ինչ|inch|what
ես|yes|I
դուն|toun|you (one person, informal)
դուք|touk|you (polite or plural)
ուրախ|ourakh|happy
ալ|al|also
հայ|hay|Armenian (person)`, `
Անունդ ի՞նչ է։|Anount inch e?|What is your name?
Անունս Արամ է։|Anouns Aram e.|My name is Aram.
Ես հայ եմ։|Yes hay em.|I am Armenian.
Դուն հա՞յ ես։|Toun hay es?|Are you Armenian?
Ես ալ լաւ եմ։|Yes al lav em.|I am fine too.
Ուրախ եմ։|Ourakh em.|I am glad.`,
`<p>Add <b>-ս</b> to a noun for "my" and <b>-դ</b> for "your": <span class="hy">անունս</span> my name, <span class="hy">անունդ</span> your name.</p><p>Careful: <span class="hy">ես</span> is both "I" (read <i>yes</i>) and "you are" (read <i>es</i>, after another word).</p>`)
]},

{ title: "People", desc: "To be, family, my and your", lessons: [
L("I am, you are", `
ան|an|he / she
մենք|menk|we
անոնք|anonk|they
հոս|hos|here
հոն|hon|there
ուսանող|ousanogh|student
ուսուցիչ|ousoutsich|teacher
բժիշկ|pzhishg|doctor`, `
Ան ուսուցիչ է։|An ousoutsich e.|She is a teacher.
Մենք հոս ենք։|Menk hos enk.|We are here.
Անոնք հոն են։|Anonk hon en.|They are there.
Դուք բժի՞շկ էք։|Touk pzhishg ek?|Are you a doctor?
Ես ուսանող եմ։|Yes ousanogh em.|I am a student.`,
`<p><b>To be</b> comes after the word it describes:</p><table><tr><td>ես … <b>եմ</b></td><td>I am</td><td>մենք … <b>ենք</b></td><td>we are</td></tr><tr><td>դուն … <b>ես</b></td><td>you are</td><td>դուք … <b>էք</b></td><td>you are</td></tr><tr><td>ան … <b>է</b></td><td>he/she is</td><td>անոնք … <b>են</b></td><td>they are</td></tr></table><p>Armenian has no grammatical gender: <span class="hy">ան</span> is he, she and it.</p>`),
L("I am not", `
չեմ|chem|I am not
չէ|che|is not
բայց|payts|but
եւ|yev|and
կամ|gam|or
հիմա|hima|now`, `
Ես բժիշկ չեմ։|Yes pzhishg chem.|I am not a doctor.
Ան հոս չէ։|An hos che.|He is not here.
Հիմա հոս չեմ։|Hima hos chem.|I am not here now.
Ան ուսուցիչ է, բայց ես ուսանող եմ։|An ousoutsich e, payts yes ousanogh em.|She is a teacher but I am a student.
Դուն եւ ես հոս ենք։|Toun yev yes hos enk.|You and I are here.
Ուսանո՞ղ ես, կամ ուսուցիչ։|Ousanogh es, gam ousoutsich?|Are you a student or a teacher?`,
`<p>To say "not", put <b>չ</b> on the front of the verb: <span class="hy">չեմ, չես, չէ, չենք, չէք, չեն</span>.</p>`),
L("Family", `
մայր|mayr|mother
հայր|hayr|father
եղբայր|yeghpayr|brother
քոյր|kouyr|sister
ընտանիք|əndanik|family
իմ|im|my
քու|kou|your
մեծ|medz|big
ասիկա|asiga|this (one)`, `
Ասիկա իմ մայրս է։|Asiga im mayrs e.|This is my mother.
Քու եղբայրդ ուսանո՞ղ է։|Kou yeghpayrt ousanogh e?|Is your brother a student?
Հայրս բժիշկ է։|Hayrs pzhishg e.|My father is a doctor.
Քոյրս հոս չէ։|Kouyrs hos che.|My sister is not here.
Ընտանիքս մեծ է։|Əndaniks medz e.|My family is big.`,
`<p>Possession is marked on the noun: <b>-ս</b> my, <b>-դ</b> your, <b>-ը / -ն</b> his or her. You can add <span class="hy">իմ</span>, <span class="hy">քու</span>, <span class="hy">իր</span> in front for emphasis, and the ending stays: <span class="hy">իմ մայրս</span>.</p><p>The other possessives are <span class="hy">մեր</span> (our), <span class="hy">ձեր</span> (your, plural) and <span class="hy">իրենց</span> (their).</p>`),
L("More people", `
տղայ|dgha|boy / son
աղջիկ|aghchig|girl / daughter
մարդ|mart|man / person
կին|gin|woman / wife
ամուսին|amousin|husband
ընկեր|ənger|friend
զաւակ|zavag|child
մեծ մայր|medz mayr|grandmother
մեծ հայր|medz hayr|grandfather
ուր|our|where`, `
Ան իմ ընկերս է։|An im əngers e.|He is my friend.
Տղաս ուսանող է։|Dghas ousanogh e.|My son is a student.
Աղջիկդ ո՞ւր է։|Aghchigt our e?|Where is your daughter?
Մեծ մայրս հայ է։|Medz mayrs hay e.|My grandmother is Armenian.
Կինս ուսուցիչ է։|Gins ousoutsich e.|My wife is a teacher.`,
`<p>The silent <span class="hy">յ</span> at the end of <span class="hy">տղայ</span> drops when an ending is added: <span class="hy">տղաս</span> "my son".</p>`)
]},

{ title: "Numbers and things", desc: "Counting, a and the, plurals", lessons: [
L("One to five", `
մէկ|meg|one
երկու|yergou|two
երեք|yerek|three
չորս|chors|four
հինգ|hink|five
ունիմ|ounim|I have
ունիս|ounis|you have
քանի|kani|how many`, `
Երկու եղբայր ունիմ։|Yergou yeghpayr ounim.|I have two brothers.
Երեք քոյր ունիմ։|Yerek kouyr ounim.|I have three sisters.
Մէկ տղայ եւ մէկ աղջիկ ունիմ։|Meg dgha yev meg aghchig ounim.|I have one son and one daughter.
Քանի՞ զաւակ ունիս։|Kani zavag ounis?|How many children do you have?`,
`<p>After a number the noun stays singular: <span class="hy">երկու եղբայր</span>, literally "two brother".</p><p>"To have": <span class="hy">ունիմ, ունիս, ունի, ունինք, ունիք, ունին</span>. Negative: <span class="hy">չունիմ</span>.</p>`),
L("Six to a hundred", `
վեց|vets|six
եօթը|yotə|seven
ութ|out|eight
ինը|inə|nine
տասը|dasə|ten
քսան|ksan|twenty
երեսուն|yeresoun|thirty
հարիւր|haryour|hundred
տարեկան|daregan|years old`, `
Քանի՞ տարեկան ես։|Kani daregan es?|How old are you?
Ես երեսուն տարեկան եմ։|Yes yeresoun daregan em.|I am thirty years old.
Տղաս տասը տարեկան է։|Dghas dasə daregan e.|My son is ten years old.
Քոյրս քսան տարեկան է։|Kouyrs ksan daregan e.|My sister is twenty years old.
Վեց ընկեր ունիմ։|Vets ənger ounim.|I have six friends.`,
`<p>Tens: <span class="hy">քսան</span> 20, <span class="hy">երեսուն</span> 30, <span class="hy">քառասուն</span> 40, <span class="hy">յիսուն</span> 50. Join tens and units directly: <span class="hy">քսանմէկ</span> 21, <span class="hy">երեսունհինգ</span> 35. The teens use <span class="hy">տասն-</span>: <span class="hy">տասներկու</span> 12.</p>`),
L("A and the", `
գիրք|kirk|book
տուն|doun|house
դուռ|tour|door
սեղան|seghan|table
աթոռ|ator|chair
կատու|gadou|cat
շուն|shoun|dog
մը|mə|a / an`, `
Ասիկա գիրք մըն է։|Asiga kirk mən e.|This is a book.
Կատու մը ունիմ։|Gadou mə ounim.|I have a cat.
Շունը մեծ է։|Shounə medz e.|The dog is big.
Կատուն հոս է։|Gadoun hos e.|The cat is here.
Տունը մեծ չէ։|Dounə medz che.|The house is not big.
Դուռը ո՞ւր է։|Tourə our e?|Where is the door?`,
`<p><b>The</b> is an ending: <b>-ը</b> after a consonant (<span class="hy">շունը</span> the dog), <b>-ն</b> after a vowel (<span class="hy">կատուն</span> the cat). You will also see <b>-ն</b> on a consonant-final word when the next word starts with a vowel.</p><p><b>A / an</b> is the separate word <span class="hy">մը</span> placed <i>after</i> the noun: <span class="hy">կատու մը</span>. Before <span class="hy">է</span> (and the other "to be" forms) or <span class="hy">ալ</span> it becomes <span class="hy">մըն</span>.</p>`),
L("Describing things", `
պզտիկ|bzdig|small
նոր|nor|new
հին|hin|old
գեղեցիկ|keghetsig|beautiful
գէշ|kesh|bad
այս|ays|this
այդ|ayt|that`, `
Այս գիրքը նոր է։|Ays kirkə nor e.|This book is new.
Այդ տունը հին է։|Ayt dounə hin e.|That house is old.
Տուները գեղեցիկ են։|Dounerə keghetsig en.|The houses are beautiful.
Կատուները պզտիկ են։|Gadounerə bzdig en.|The cats are small.
Նոր գիրքեր ունիմ։|Nor kirker ounim.|I have new books.
Պզտիկ շուն մը ունիս։|Bzdig shoun mə ounis.|You have a small dog.`,
`<p><b>Plural:</b> add <b>-եր</b> to one-syllable words (<span class="hy">տուներ</span>) and <b>-ներ</b> to longer ones (<span class="hy">կատուներ</span>).</p><p>Adjectives come before the noun and never change. After <span class="hy">այս</span> / <span class="hy">այդ</span> the noun still takes "the": <span class="hy">այս գիրքը</span>.</p>`)
]},

{ title: "Food and drink", desc: "The present tense", lessons: [
L("Eat and drink", `
հաց|hats|bread
ջուր|chour|water
կաթ|gat|milk
թէյ|tey|tea
սուրճ|sourj|coffee
պանիր|banir|cheese
կ'ուտեմ|g'oudem|I eat
կը խմեմ|gə khmem|I drink`, `
Հաց կ'ուտեմ։|Hats g'oudem.|I eat bread.
Ջուր կը խմեմ։|Chour gə khmem.|I drink water.
Սուրճ կը խմե՞ս։|Sourj gə khmes?|Do you drink coffee?
Ան թէյ կը խմէ։|An tey gə khme.|He drinks tea.
Հաց եւ պանիր կ'ուտենք։|Hats yev banir g'oudenk.|We eat bread and cheese.`,
`<p>The present tense is <b>կը</b> + the verb. Before a vowel it shortens to <b>կ'</b>.</p><table><tr><td>կը խմ<b>եմ</b></td><td>I drink</td><td>կը խմ<b>ենք</b></td><td>we drink</td></tr><tr><td>կը խմ<b>ես</b></td><td>you drink</td><td>կը խմ<b>էք</b></td><td>you drink</td></tr><tr><td>կը խմ<b>է</b></td><td>he/she drinks</td><td>կը խմ<b>են</b></td><td>they drink</td></tr></table><p>The verb usually comes last, and the pronoun can be left out. This one tense covers both "I drink" and "I am drinking". In speech you will also hear <span class="hy">կոր</span> added for "right now": <span class="hy">կը խմեմ կոր</span>.</p>`),
L("I want, I like", `
միս|mis|meat
ձուկ|tsoug|fish
հաւ|hav|chicken
հաւկիթ|havgit|egg
խնձոր|khntsor|apple
պտուղ|bdough|fruit
կ'ուզեմ|g'ouzem|I want
կը սիրեմ|gə sirem|I like / I love`, `
Խնձոր մը կ'ուզեմ։|Khntsor mə g'ouzem.|I want an apple.
Ձուկ կը սիրե՞ս։|Tsoug gə sires?|Do you like fish?
Միս շատ կը սիրեմ։|Mis shad gə sirem.|I like meat very much.
Ի՞նչ կ'ուզես։|Inch g'ouzes?|What do you want?
Սուրճ մը կ'ուզեմ, հաճիս։|Sourj mə g'ouzem, hajis.|I want a coffee please.
Անոնք հաւ կ'ուտեն։|Anonk hav g'ouden.|They eat chicken.`,
`<p>A question has the same word order as a statement. In writing, <b>՞</b> marks the word being asked about; in speech, your voice rises on it.</p>`),
L("I don't", `
չեմ ուտեր|chem ouder|I do not eat
չեմ խմեր|chem khmer|I do not drink
անօթի|anoti|hungry
ծարաւ|dzarav|thirsty
համով|hamov|tasty
աղ|agh|salt
շաքար|shakar|sugar
առանց|arants|without`, `
Միս չեմ ուտեր։|Mis chem ouder.|I do not eat meat.
Սուրճ չեմ խմեր։|Sourj chem khmer.|I do not drink coffee.
Անօթի եմ։|Anoti em.|I am hungry.
Ծարա՞ւ ես։|Dzarav es?|Are you thirsty?
Հացը շատ համով է։|Hatsə shad hamov e.|The bread is very tasty.
Սուրճ կը խմեմ առանց շաքարի։|Sourj gə khmem arants shakari.|I drink coffee without sugar.`,
`<p><b>Negative present:</b> drop <span class="hy">կը</span>, use <span class="hy">չեմ / չես / չի / չենք / չէք / չեն</span>, and change the verb ending to <b>-ր</b>: <span class="hy">կ՚ուտեմ → չեմ ուտեր</span>, <span class="hy">կը խմես → չես խմեր</span>.</p><p>For "he / she doesn't" use <span class="hy">չի</span> (or <span class="hy">չ՚</span> before a vowel): <span class="hy">չի խմեր</span>, <span class="hy">չ՚ուտեր</span>.</p>`)
]},

{ title: "Verbs in action", desc: "Speak, go, read, can, must", lessons: [
L("Speaking Armenian", `
կը խօսիմ|gə khosim|I speak
կը հասկնամ|gə hasgnam|I understand
գիտեմ|kidem|I know
կը սորվիմ|gə sorvim|I learn
հայերէն|hayeren|Armenian (language)
անգլերէն|ankleren|English (language)
քիչ մը|kich mə|a little
լեզու|lezou|language`, `
Հայերէն կը խօսի՞ս։|Hayeren gə khosis?|Do you speak Armenian?
Քիչ մը հայերէն կը խօսիմ։|Kich mə hayeren gə khosim.|I speak a little Armenian.
Հայերէն կը սորվիմ։|Hayeren gə sorvim.|I am learning Armenian.
Չեմ հասկնար։|Chem hasgnar.|I do not understand.
Չեմ գիտեր։|Chem kider.|I do not know.
Անգլերէն կը հասկնա՞ք։|Ankleren gə hasgnak?|Do you understand English?`,
`<p>Verbs come in three families, named after the dictionary form:</p><table><tr><td><b>-ել</b> (խմել)</td><td>-եմ -ես -է -ենք -էք -են</td></tr><tr><td><b>-իլ</b> (խօսիլ)</td><td>-իմ -իս -ի -ինք -իք -ին</td></tr><tr><td><b>-ալ</b> (հասկնալ)</td><td>-ամ -աս -այ -անք -աք -ան</td></tr></table><p><span class="hy">գիտեմ</span> (I know), <span class="hy">ունիմ</span> (I have) and <span class="hy">կրնամ</span> (I can) never take <span class="hy">կը</span>.</p>`),
L("Coming and going", `
կ'երթամ|g'ertam|I go
կու գամ|gou kam|I come
երբ|yerp|when
այսօր|aysor|today
վաղը|vaghə|tomorrow
խանութ|khanout|store
եկեղեցի|yegeghetsi|church
դպրոց|tbrots|school
գործ|kordz|work`, `
Ո՞ւր կ'երթաս։|Our g'ertas?|Where are you going?
Դպրոց կ'երթամ։|Tbrots g'ertam.|I am going to school.
Այսօր գործի կ'երթամ։|Aysor kordzi g'ertam.|I am going to work today.
Ե՞րբ կու գաս։|Yerp gou kas?|When are you coming?
Վաղը կու գամ։|Vaghə gou kam.|I am coming tomorrow.
Մայրս եկեղեցի կ'երթայ։|Mayrs yegeghetsi g'erta.|My mother goes to church.`,
`<p>Three short verbs use <b>կու</b> instead of <span class="hy">կը</span>: <span class="hy">կու գամ</span> I come, <span class="hy">կու տամ</span> I give, <span class="hy">կու լամ</span> I cry.</p><p>No word is needed for "to" with a destination: <span class="hy">դպրոց կ՚երթամ</span> is "I go (to) school".</p>`),
L("Every day", `
կը կարդամ|gə gartam|I read
կը գրեմ|gə krem|I write
կ'աշխատիմ|g'ashkhadim|I work
կ'ապրիմ|g'abrim|I live
կը տեսնեմ|gə desnem|I see
կ'ընեմ|g'ənem|I do
ամէն օր|amen or|every day
նամակ|namag|letter`, `
Ի՞նչ կ'ընես։|Inch g'ənes?|What are you doing?
Գիրք մը կը կարդամ։|Kirk mə gə gartam.|I am reading a book.
Նամակ մը կը գրեմ։|Namag mə gə krem.|I am writing a letter.
Ո՞ւր կ'ապրիս։|Our g'abris?|Where do you live?
Ամէն օր կ'աշխատիմ։|Amen or g'ashkhadim.|I work every day.
Հայրս հոս կ'աշխատի։|Hayrs hos g'ashkhadi.|My father works here.`,
`<p><span class="hy">Ի՞նչ կ՚ընես</span> is also a casual "what's up?"</p><p>For "I live in…" you will also hear the more formal <span class="hy">կը բնակիմ</span>.</p>`),
L("Can and must", `
կրնամ|grnam|I can
պէտք է|bedk e|must
օգնել|oknel|to help
խօսիլ|khosil|to speak
երթալ|yertal|to go
ըսել|əsel|to say
կամաց|gamats|slowly
նորէն|noren|again`, `
Կրնա՞ս օգնել։|Grnas oknel?|Can you help?
Հայերէն կրնամ խօսիլ։|Hayeren grnam khosil.|I can speak Armenian.
Պէտք է երթամ։|Bedk e yertam.|I must go.
Հաճիս, կամաց խօսէ։|Hajis, gamats khose.|Please speak slowly.
Նորէն ըսէ, հաճիս։|Noren əse, hajis.|Say it again please.
Չեմ կրնար երթալ։|Chem grnar yertal.|I cannot go.`,
`<p><span class="hy">կրնամ</span> is followed by the dictionary form: <span class="hy">կրնամ խօսիլ</span>.</p><p><span class="hy">պէտք է</span> is followed by the verb with its personal ending but without <span class="hy">կը</span>: <span class="hy">պէտք է երթամ</span> "I must go", <span class="hy">պէտք է երթաս</span> "you must go".</p><p>Commands to one person end in <b>-է</b> for -ել and -իլ verbs: <span class="hy">խօսէ</span> speak!, <span class="hy">ըսէ</span> say!</p>`)
]},

{ title: "Where things are", desc: "In, on, with, from", lessons: [
L("In, on, under", `
մէջ|mech|in
վրայ|vra|on
տակ|dag|under
քով|kov|beside
սենեակ|senyag|room
պատուհան|badouhan|window
կայ|ga|there is
չկայ|chga|there is not`, `
Գիրքը սեղանին վրան է։|Kirkə seghanin vran e.|The book is on the table.
Կատուն աթոռին տակն է։|Gadoun atorin dagn e.|The cat is under the chair.
Շունը պատուհանին քովն է։|Shounə badouhanin kovn e.|The dog is beside the window.
Մայրս սենեակին մէջն է։|Mayrs senyagin mechn e.|My mother is in the room.
Սենեակին մէջ աթոռ չկայ։|Senyagin mech ator chga.|There is no chair in the room.`,
`<p>Words like in, on and under come <i>after</i> the noun, and the noun takes the ending <b>-ին</b> ("of the"): <span class="hy">սեղան<b>ին</b> վրայ</span>, literally "the table's top".</p><p>Directly before <span class="hy">է, եմ, ես…</span> the position word usually takes "the" as well: <span class="hy">սեղանին վրա<b>ն</b> է</span>, <span class="hy">աթոռին տակ<b>ն</b> է</span>. In the negative it does not: <span class="hy">սեղանին վրայ չէ</span>.</p><p>That <b>-ի / -ին</b> ending is also how you say "of" and "to": <span class="hy">Արամին գիրքը</span> Aram's book.</p>`),
L("With, for, from", `
հետ|hed|with
համար|hamar|for
ինծի|indzi|me / to me
քեզի|kezi|you / to you
ինքնաշարժ|inknasharzh|car`, `
Ինծի հետ կու գա՞ս։|Indzi hed gou kas?|Are you coming with me?
Ասիկա քեզի համար է։|Asiga kezi hamar e.|This is for you.
Ինքնաշարժով կ'երթամ։|Inknasharzhov g'ertam.|I am going by car.
Դպրոցէն կու գամ։|Tbrotsen gou kam.|I am coming from school.
Քեզի հետ կ'աշխատիմ։|Kezi hed g'ashkhadim.|I work with you.`,
`<p>Two more endings do the work of English prepositions:</p><p><b>-է / -էն</b> = from: <span class="hy">դպրոցէն</span> from school.<br><b>-ով</b> = by, with (a tool): <span class="hy">ինքնաշարժով</span> by car.</p>`),
L("Places", `
երկիր|yergir|country
Հայաստան|Hayasdan|Armenia
Ամերիկա|Ameriga|America
Լիբանան|Lipanan|Lebanon
ուրկէ|ourge|from where
քաղաք|kaghak|city
մօտ|mod|near
հեռու|herou|far`, `
Ուրկէ՞ ես։|Ourge es?|Where are you from?
Ես Ամերիկայէն եմ։|Yes Amerigayen em.|I am from America.
Մեծ հայրս Լիբանանէն է։|Medz hayrs Lipananen e.|My grandfather is from Lebanon.
Հայաստան գեղեցիկ երկիր մըն է։|Hayasdan keghetsig yergir mən e.|Armenia is a beautiful country.
Ամերիկա կ'ապրիմ։|Ameriga g'abrim.|I live in America.
Խանութը հեռու չէ։|Khanoutə herou che.|The store is not far.`,
`<p>Add <b>-ցի</b> to a place for a person from there: <span class="hy">ամերիկացի</span> an American, <span class="hy">լիբանանցի</span> a Lebanese person.</p>`)
]},

{ title: "Time", desc: "Days, the future, the past", lessons: [
L("Day and night", `
օր|or|day
շաբաթ|shapat|week
ամիս|amis|month
տարի|dari|year
ժամ|zham|hour
առտու|ardou|morning
իրիկուն|irigoun|evening
գիշեր|kisher|night
երէկ|yereg|yesterday`, `
Ժամը քանի՞ է։|Zhamə kani e?|What time is it?
Ժամը երեք է։|Zhamə yerek e.|It is three o'clock.
Առտուն սուրճ կը խմեմ։|Ardoun sourj gə khmem.|I drink coffee in the morning.
Ամէն շաբաթ եկեղեցի կ'երթանք։|Amen shapat yegeghetsi g'ertank.|We go to church every week.
Գիշերը կը կարդամ։|Kisherə gə gartam.|I read at night.`,
`<p>To say "in the morning" or "at night", add "the" to the time word: <span class="hy">առտուն</span> in the morning, <span class="hy">իրիկունը</span> in the evening, <span class="hy">գիշերը</span> at night. The more formal word for morning is <span class="hy">առաւօտ</span>.</p>`),
L("Days of the week", `
երկուշաբթի|yergoushapti|Monday
երեքշաբթի|yerekshapti|Tuesday
չորեքշաբթի|chorekshapti|Wednesday
հինգշաբթի|hinkshapti|Thursday
ուրբաթ|ourpat|Friday
շաբաթ օր|shapat or|Saturday
կիրակի|giragi|Sunday`, `
Այսօր ուրբաթ է։|Aysor ourpat e.|Today is Friday.
Վաղը շաբաթ է։|Vaghə shapat e.|Tomorrow is Saturday.
Կիրակի եկեղեցի կ'երթամ։|Giragi yegeghetsi g'ertam.|I go to church on Sunday.
Երկուշաբթի կ'աշխատիմ։|Yergoushapti g'ashkhadim.|I work on Monday.`,
`<p>Monday to Thursday are simply "second, third, fourth, fifth day of the week": <span class="hy">երկու-, երեք-, չորեք-, հինգ-</span> + <span class="hy">շաբթի</span>.</p>`),
L("I will", `
պիտի|bidi|will
յետոյ|hedo|then / afterwards
շուտով|shoudov|soon
անշուշտ|anshousht|of course
թերեւս|terevs|maybe`, `
Վաղը պիտի աշխատիմ։|Vaghə bidi ashkhadim.|I will work tomorrow.
Հայաստան պիտի երթանք։|Hayasdan bidi yertank.|We will go to Armenia.
Յետոյ պիտի խօսինք։|Hedo bidi khosink.|We will talk afterwards.
Պիտի չգամ։|Bidi chkam.|I will not come.
Ե՞րբ պիտի գաս։|Yerp bidi kas?|When will you come?
Շուտով պիտի գամ։|Shoudov bidi kam.|I will come soon.`,
`<p><b>Future:</b> replace <span class="hy">կը</span> with <span class="hy">պիտի</span>: <span class="hy">կ՚երթամ</span> I go → <span class="hy">պիտի երթամ</span> I will go.</p><p>For the negative, put <b>չ</b> on the verb: <span class="hy">պիտի չերթամ</span> I will not go.</p>`),
L("I did", `
գացի|katsi|I went
եկայ|yega|I came
կերայ|gera|I ate
խմեցի|khmetsi|I drank
տեսայ|desa|I saw
ըսի|əsi|I said
ըրի|əri|I did
էի|ei|I was`, `
Երէկ դպրոց գացի։|Yereg tbrots katsi.|I went to school yesterday.
Ի՞նչ ըրիր։|Inch ərir?|What did you do?
Հաց եւ պանիր կերայ։|Hats yev banir gera.|I ate bread and cheese.
Երէկ հոս էի։|Yereg hos ei.|I was here yesterday.
Ընկերս տեսայ։|Əngers desa.|I saw my friend.
Ան եկաւ։|An yegav.|He came.
Սուրճ խմեցինք։|Sourj khmetsink.|We drank coffee.`,
`<p><b>Simple past</b> of regular -ել verbs: <span class="hy">խմ<b>եցի</b>, խմ<b>եցիր</b>, խմ<b>եց</b>, խմ<b>եցինք</b>, խմ<b>եցիք</b>, խմ<b>եցին</b></span>.</p><p>-իլ verbs use <span class="hy">-եցայ, -եցար, -եցաւ, -եցանք, -եցաք, -եցան</span>: <span class="hy">խօսեցայ</span> I spoke.</p><p>The most common verbs are irregular and worth memorising as they are: <span class="hy">գացի</span> went, <span class="hy">եկայ</span> came, <span class="hy">կերայ</span> ate, <span class="hy">տեսայ</span> saw, <span class="hy">ըսի</span> said, <span class="hy">ըրի</span> did.</p><p>"Was": <span class="hy">էի, էիր, էր, էինք, էիք, էին</span>.</p>`)
]},

{ title: "Describing the world", desc: "Colours, feelings, weather, health", lessons: [
L("Colours", `
կարմիր|garmir|red
կապոյտ|gabouyd|blue
կանաչ|ganach|green
դեղին|teghin|yellow
սեւ|sev|black
ճերմակ|jermag|white
գոյն|kouyn|colour`, `
Խնձորը կարմիր է։|Khntsorə garmir e.|The apple is red.
Կատուս սեւ է։|Gadous sev e.|My cat is black.
Ճերմակ շուն մը ունիմ։|Jermag shoun mə ounim.|I have a white dog.
Ինքնաշարժդ ի՞նչ գոյն է։|Inknasharzht inch kouyn e?|What colour is your car?
Կապոյտ գիրքը նոր է։|Gabouyd kirkə nor e.|The blue book is new.`,
`<p>Red, blue and orange (<span class="hy">նարնջագոյն</span>) are the colours of the Armenian flag.</p>`),
L("How you feel", `
յոգնած|hoknadz|tired
հիւանդ|hivant|sick
տխուր|dkhour|sad
տաք|dak|hot
պաղ|bagh|cold
դիւրին|tyourin|easy
դժուար|tzhvar|difficult
ինչու|inchou|why`, `
Այսօր յոգնած եմ։|Aysor hoknadz em.|I am tired today.
Հիւա՞նդ ես։|Hivant es?|Are you sick?
Ջուրը պաղ է։|Chourə bagh e.|The water is cold.
Սուրճը տաք է։|Sourjə dak e.|The coffee is hot.
Հայերէնը դժուար չէ։|Hayerenə tzhvar che.|Armenian is not difficult.
Ինչո՞ւ տխուր ես։|Inchou dkhour es?|Why are you sad?`,
`<p>Question words so far: <span class="hy">ի՞նչ</span> what, <span class="hy">ո՞վ</span> who, <span class="hy">ո՞ւր</span> where, <span class="hy">ե՞րբ</span> when, <span class="hy">ինչո՞ւ</span> why, <span class="hy">ինչպէ՞ս</span> how, <span class="hy">քանի՞</span> how many.</p>`),
L("Weather", `
օդ|ot|weather / air
արեւ|arev|sun
անձրեւ|antsrev|rain
ձիւն|tsyoun|snow
հով|hov|wind
ցուրտ|tsourd|cold (weather)
ամառ|amar|summer
ձմեռ|tsmer|winter`, `
Այսօր օդը տաք է։|Aysor otə dak e.|The weather is hot today.
Անձրեւ կու գայ։|Antsrev gou ka.|It is raining.
Ձմեռը ձիւն կու գայ։|Tsmerə tsyoun gou ka.|It snows in winter.
Այսօր ցուրտ է։|Aysor tsourd e.|It is cold today.
Ամառը շատ կը սիրեմ։|Amarə shad gə sirem.|I like summer very much.`,
`<p>Rain and snow "come" in Armenian: <span class="hy">անձրեւ կու գայ</span>, literally "rain comes".</p>`),
L("Body and health", `
գլուխ|kloukh|head
ձեռք|tserk|hand
ոտք|vodk|foot
աչք|achk|eye
սիրտ|sird|heart
դեղ|tegh|medicine
կը ցաւի|gə tsavi|it hurts
պէտք ունիմ|bedk ounim|I need`, `
Գլուխս կը ցաւի։|Kloukhs gə tsavi.|My head hurts.
Ոտքս կը ցաւի։|Vodks gə tsavi.|My foot hurts.
Բժիշկի պէտք ունիմ։|Pzhishgi bedk ounim.|I need a doctor.
Աչքերդ գեղեցիկ են։|Achkert keghetsig en.|Your eyes are beautiful.
Դեղ ունի՞ս։|Tegh ounis?|Do you have medicine?`,
`<p>"I need X" is "I have need of X": the thing needed takes <b>-ի</b>, then <span class="hy">պէտք ունիմ</span>.</p>`)
]},

{ title: "Out and about", desc: "Shopping, eating out, directions", lessons: [
L("Shopping", `
դրամ|tram|money
սուղ|sough|expensive
աժան|azhan|cheap
քանի է|kani e|how much is it
կ'առնեմ|g'arnem|I buy / I take
կու տամ|gou dam|I give
հատ|had|piece
չունիմ|chounim|I do not have`, `
Ասիկա քանի՞ է։|Asiga kani e?|How much is this?
Շատ սուղ է։|Shad sough e.|It is very expensive.
Ասիկա կ'առնեմ։|Asiga g'arnem.|I am buying this.
Դրամ չունիմ։|Tram chounim.|I do not have money.
Երկու հատ կ'ուզեմ։|Yergou had g'ouzem.|I want two of them.
Քեզի դրամ կու տամ։|Kezi tram gou dam.|I give you money.`,
`<p><span class="hy">հատ</span> is a counting word: <span class="hy">երկու հատ</span> "two (of them)", <span class="hy">քանի՞ հատ</span> "how many (pieces)?"</p>`),
L("At the table", `
ճաշարան|jasharan|restaurant
ճաշ|jash|meal
գինի|kini|wine
հաշիւ|hashiv|bill
հրամմեցէք|hrammetsek|come in, help yourself
բարի ախորժակ|pari akhorzhag|enjoy your meal
անուշ|anoush|sweet
կենացդ|genatst|cheers`, `
Սեղան մը կ'ուզենք, հաճիս։|Seghan mə g'ouzenk, hajis.|We want a table please.
Ի՞նչ կ'ուզէք ուտել։|Inch g'ouzek oudel?|What do you want to eat?
Հաշիւը, հաճիս։|Hashivə, hajis.|The bill please.
Ճաշը շատ համով էր։|Jashə shad hamov er.|The meal was very tasty.
Գինի կը խմե՞ս։|Kini gə khmes?|Do you drink wine?`,
`<p><span class="hy">հրամմեցէք</span> is what a host says to invite you in, to the table, or to take more. After a meal you can tell the cook <span class="hy">ձեռքերդ դալար</span>, "may your hands stay green".</p><p><span class="hy">անուշ</span> also means "sweetly": <span class="hy">անուշ ըլլայ</span>, "may it be sweet", is said to someone eating or drinking.</p>`),
L("Finding your way", `
աջ|ach|right
ձախ|tsakh|left
շիտակ|shidag|straight
օգնութիւն|oknoutyoun|help
հիւանդանոց|hivantanots|hospital
հեռաձայն|heratsayn|telephone
կորսուած|gorsvadz|lost
փողոց|poghots|street`, `
Հիւանդանոցը ո՞ւր է։|Hivantanotsə our e?|Where is the hospital?
Աջ գացէք։|Ach katsek.|Go right.
Շիտակ գացէք։|Shidag katsek.|Go straight.
Օգնութեան պէտք ունիմ։|Oknoutyan bedk ounim.|I need help.
Հեռաձայնս ո՞ւր է։|Heratsayns our e?|Where is my telephone?
Կորսուած եմ։|Gorsvadz em.|I am lost.`,
`<p>Words ending in <span class="hy">-ութիւն</span> change it to <span class="hy">-ութեան</span> for "of": <span class="hy">օգնութիւն → օգնութեան</span>.</p><p><span class="hy">գացէք</span> is the polite command "go"; to a friend say <span class="hy">գնա՛</span> (<i>kna</i>).</p>`)
]},

{ title: "Heart and home", desc: "Affection, celebrations, everyday expressions", lessons: [
L("Affection", `
քեզ|kez|you (object)
զիս|zis|me (object)
սէր|ser|love
սիրելիս|sirelis|my darling
աշխարհ|ashkharh|world
կարօտցած եմ|garodtsadz em|I miss (I am longing)`, `
Քեզ կը սիրեմ։|Kez gə sirem.|I love you.
Զիս կը սիրե՞ս։|Zis gə sires?|Do you love me?
Քեզի կարօտցած եմ։|Kezi garodtsadz em.|I miss you.
Սիրելիս, ինչպէ՞ս ես։|Sirelis, inchbes es?|My darling, how are you?
Դուն իմ աշխարհն ես։|Toun im ashkharhn es.|You are my world.`,
`<p>The object forms: <span class="hy">զիս</span> me, <span class="hy">քեզ</span> you, <span class="hy">մեզ</span> us, <span class="hy">ձեզ</span> you (pl.). In everyday speech many people use the "to" forms instead: <span class="hy">ինծի</span>, <span class="hy">քեզի</span>.</p><p>"I miss you" is literally "I have become longing for you": <span class="hy">քեզի կարօտցած եմ</span>.</p>`),
L("Celebrations", `
Շնորհաւոր|Shnorhavor|congratulations / happy
տարեդարձ|daretarts|birthday
Նոր Տարի|Nor Dari|New Year
Սուրբ Ծնունդ|Sourp Dznount|Christmas
Զատիկ|Zadig|Easter
Աստուած|Asdvadz|God`, `
Շնորհաւոր տարեդարձ։|Shnorhavor daretarts.|Happy birthday.
Շնորհաւոր Նոր Տարի եւ Սուրբ Ծնունդ։|Shnorhavor Nor Dari yev Sourp Dznount.|Happy New Year and Merry Christmas.
Քրիստոս ծնաւ եւ յայտնեցաւ։|Krisdos dznav yev haydnetsav.|Christ is born and revealed.
Քրիստոս յարեաւ ի մեռելոց։|Krisdos haryav i merelots.|Christ is risen from the dead.`,
`<p>Armenian Christmas is on January 6. The greeting is <span class="hy">Քրիստոս ծնաւ եւ յայտնեցաւ</span>, answered with <span class="hy">Օրհնեալ է յայտնութիւնն Քրիստոսի</span> ("Blessed is the revelation of Christ").</p><p>At Easter the greeting is <span class="hy">Քրիստոս յարեաւ ի մեռելոց</span>, answered with <span class="hy">Օրհնեալ է յարութիւնն Քրիստոսի</span> ("Blessed is the resurrection of Christ"). These two greetings are in the old church language, so their grammar differs from everyday speech.</p><p>You can also say <span class="hy">Բարի տարեդարձ</span> for "happy birthday".</p>`),
L("Everyday expressions", `
ինչ կայ չկայ|inch ga chga|what is new
ամէն ինչ|amen inch|everything
իրաւ|irav|really
աղէկ|agheg|fine, okay (colloquial)
երթանք|yertank|let us go
վայ|vay|oh no / wow`, `
Ի՞նչ կայ չկայ։|Inch ga chga?|What is new?
Ամէն ինչ լաւ է։|Amen inch lav e.|Everything is fine.
Աղէկ եմ։|Agheg em.|I am okay.
Իրա՞ւ։|Irav?|Really?
Երթա՛նք։|Yertank!|Let us go!
Այո, կու գամ։|Ayo, gou kam.|Yes I am coming.`,
`<p><span class="hy">Ի՞նչ կայ չկայ</span> is literally "what is there, what isn't there?"</p><p>You have finished the course path. Keep the Review tab going daily, switch off romanisation in Settings, and start reading and listening to real Western Armenian. A good next step is a tutor or conversation partner, since nothing here can correct your accent.</p>`)

]}
];
UNITS.forEach((u, ui) => u.lessons.forEach((l, li) => { l.id = `u${ui + 1}l${li + 1}`; }));
if (typeof module !== "undefined") module.exports = { ALPHABET, UNITS };
