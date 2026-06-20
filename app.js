(() => {
  "use strict";

  const STORAGE_KEY = "starlight_idle_hack_rpg_v1";
  const FIREBASE_CONFIG_STORAGE_KEY = "starlight_firebase_config_v1";
  const FIREBASE_SDK_VERSION = "12.15.0";

  const CATEGORY_LABELS = {
    combat: "戦闘職",
    craft: "生産職",
    gather: "採取職",
  };

  const STAT_LABELS = {
    atk: "攻撃",
    def: "防御",
    mag: "魔力",
    heal: "回復",
    gather: "採取",
    craft: "生産",
    scout: "探索",
    luck: "幸運",
    speed: "速度",
    supply: "補給",
  };

  const RESOURCE_META = [
    ["gold", "金貨"],
    ["herb", "薬草"],
    ["wood", "木材"],
    ["ore", "鉱石"],
    ["hide", "皮材"],
    ["fish", "魚"],
    ["fiber", "繊維"],
    ["stone", "石材"],
    ["relic", "遺物"],
    ["potion", "ポーション"],
    ["gear", "装備強化"],
    ["food", "携行食"],
    ["gift", "贈り物"],
    ["charm", "護符"],
  ];

  const RESOURCE_LABELS = Object.fromEntries(RESOURCE_META);

  const COMPANION_PROFILES = [
    {
      id: "healer",
      name: "ミナ",
      title: "癒やし系の白魔導士",
      line: "あなたが無茶をするなら、私が隣で治します。",
      jobId: "cleric",
      affection: 28,
    },
    {
      id: "ranger",
      name: "セナ",
      title: "勝ち気な弓使い",
      line: "背中は任せて。代わりに、勝ったらちゃんと褒めてよね。",
      jobId: "archer",
      affection: 18,
    },
    {
      id: "smith",
      name: "リオ",
      title: "面倒見のいい鍛冶師",
      line: "装備も心も、手入れを怠るとすぐ鈍るよ。",
      jobId: "blacksmith",
      affection: 12,
    },
    {
      id: "shinobi",
      name: "ユイ",
      title: "静かな忍び",
      line: "命令なら従う。でも、あなたの本音も聞かせて。",
      jobId: "shinobi",
      affection: 10,
    },
    {
      id: "alchemist",
      name: "イリス",
      title: "好奇心旺盛な錬金術師",
      line: "実験台にする気はないよ。たぶん。少しだけ。",
      jobId: "alchemist",
      affection: 9,
    },
    {
      id: "knight",
      name: "サラ",
      title: "誠実な盾騎士",
      line: "あなたの理想が本物なら、私は盾になります。",
      jobId: "guardian",
      affection: 8,
    },
    {
      id: "cook",
      name: "ノア",
      title: "甘やかし上手な料理人",
      line: "お腹が空いてると判断も鈍るでしょ。はい、あーん。",
      jobId: "cook",
      affection: 11,
    },
    {
      id: "mage",
      name: "エル",
      title: "高飛車な魔術師",
      line: "私を退屈させないなら、少しだけ認めてあげる。",
      jobId: "mage",
      affection: 6,
    },
    {
      id: "scout",
      name: "キリ",
      title: "距離感近めの斥候",
      line: "次の道、見つけてあるよ。あなたと二人で確認する？",
      jobId: "scout",
      affection: 13,
    },
    {
      id: "jeweler",
      name: "メル",
      title: "夢見がちな細工師",
      line: "きれいなものは、好きな人に持っていてほしいの。",
      jobId: "jeweler",
      affection: 14,
    },
    {
      id: "hunter",
      name: "レイ",
      title: "無口な狩人",
      line: "言葉は少ない。でも、あなたの足音は覚えた。",
      jobId: "hunter",
      affection: 7,
    },
    {
      id: "summoner",
      name: "ルカ",
      title: "人懐っこい召喚士",
      line: "ねえ、今日はどこ行く？ 私も一緒がいい。",
      jobId: "summoner",
      affection: 15,
    },
  ];

  const PROFILE_VISUALS = {
    leader: { hue: 38, hair: "#fff8ff", hair2: "#cfc9e8", eye: "#ffffff", outfit: "#fff3f7", accent: "#b85a67", bg: "#f6dfe6" },
    healer: { hue: 330, hair: "#fff8ff", hair2: "#d9d2ef", eye: "#ffffff", outfit: "#fff4f8", accent: "#cc6679", bg: "#f7dfe8" },
    ranger: { hue: 145, hair: "#f9fbff", hair2: "#d3d8f0", eye: "#ffffff", outfit: "#fff5ed", accent: "#86b66b", bg: "#f1eadb" },
    smith: { hue: 18, hair: "#fff4fb", hair2: "#dcc7df", eye: "#ffffff", outfit: "#fff2f3", accent: "#c56f54", bg: "#f5dfdc" },
    shinobi: { hue: 254, hair: "#f8f4ff", hair2: "#c7c0ea", eye: "#ffffff", outfit: "#f7f3ff", accent: "#8f77c9", bg: "#e8e0f6" },
    alchemist: { hue: 284, hair: "#fbf4ff", hair2: "#d8c4f2", eye: "#ffffff", outfit: "#fff2fb", accent: "#9b78d5", bg: "#efe0f6" },
    knight: { hue: 210, hair: "#f8fbff", hair2: "#cfd9ef", eye: "#ffffff", outfit: "#f5f9ff", accent: "#7ca8c9", bg: "#dfeaf5" },
    cook: { hue: 28, hair: "#fff8f4", hair2: "#e9cfca", eye: "#ffffff", outfit: "#fff4ed", accent: "#b85a67", bg: "#f6e4dc" },
    mage: { hue: 270, hair: "#faf4ff", hair2: "#cfc0f0", eye: "#ffffff", outfit: "#f7efff", accent: "#a879d3", bg: "#eadff7" },
    scout: { hue: 176, hair: "#f7fbff", hair2: "#c7dde8", eye: "#ffffff", outfit: "#f0fbfa", accent: "#6aaea3", bg: "#dff1ef" },
    jeweler: { hue: 316, hair: "#fff3fb", hair2: "#e6c2e1", eye: "#ffffff", outfit: "#fff0f8", accent: "#d879a7", bg: "#f6deee" },
    hunter: { hue: 92, hair: "#fbfbf2", hair2: "#d8dfc8", eye: "#ffffff", outfit: "#f4faed", accent: "#8ba86a", bg: "#e6efd8" },
    summoner: { hue: 198, hair: "#f5fbff", hair2: "#c2deed", eye: "#ffffff", outfit: "#f0f9ff", accent: "#72a9c9", bg: "#dceef6" },
  };

  const STORY_CHAPTERS = [
    {
      id: "prologue",
      title: "第1章 星灯りの契約",
      condition: () => true,
      reward: { gold: 20, gift: 1 },
      scenes: [
        "辺境の街に、消えない星の灯が降った夜。主人公は、古いギルド跡で一冊の契約書を見つける。",
        "契約書に触れた瞬間、街の結界が再起動し、失われた開拓団の名前だけが浮かび上がった。",
        "ミナとセナは、主人公が街を見捨てないと知って同行を申し出る。これは戦利品を集めるだけの旅ではない。街と、隣に立つ彼女たちの居場所を取り戻す物語だ。",
      ],
    },
    {
      id: "field_oath",
      title: "第2章 草原の誓い",
      condition: () => (state.clears.field || 0) >= 2,
      reward: { herb: 4, gift: 1 },
      scenes: [
        "ひなたの草原で、開拓団は赤目の魔物に襲われた行商人を助ける。",
        "荷車に残された古い地図には、星灯りの街を囲む七つの封印が描かれていた。",
        "セナは地図を握りしめ、照れ隠しのように笑う。『あなた一人で背負う話じゃないでしょ。私たちもいるんだから』",
      ],
    },
    {
      id: "workshop",
      title: "第3章 工房の朝",
      condition: () => (state.resources.gear || 0) >= 1 || (state.resources.potion || 0) >= 4,
      reward: { gold: 25, wood: 3 },
      scenes: [
        "街の工房に朝日が差し込む。鍛冶の火、薬草の香り、焼きたての携行食。ヒロインたちはそれぞれのやり方で街を支え始める。",
        "リオは装備を直しながら、主人公に言う。『強くなるって、誰かを置いていくことじゃないよ』",
        "開拓団は、戦うだけでなく、作り、集め、守る場所を増やしていく。",
      ],
    },
    {
      id: "forest_whisper",
      title: "第4章 森のささやき",
      condition: () => (state.clears.forest || 0) >= 3,
      reward: { fiber: 4, gift: 2 },
      scenes: [
        "ささやきの森の奥で、開拓団は古い祠を見つける。祠には、星灯りの街を守った巫女たちの名前が刻まれていた。",
        "ミナは祠の前で小さく祈る。『守られてきたものを、今度は私たちが守る番なんですね』",
        "祠の光がヒロインたちの胸元に宿り、親愛の絆が淡く強くなる。",
      ],
    },
    {
      id: "tower_signal",
      title: "第5章 北塔の狼煙",
      condition: () => (state.clears.watchtower || 0) >= 1,
      reward: { relic: 1, charm: 1 },
      scenes: [
        "北の見張り塔で、主人公は街へ向けられた古い狼煙台を見つける。",
        "火を入れると、遠くの山稜に同じ光が応えた。星灯りの街は孤立していなかった。",
        "エルは悔しそうに笑う。『ふん、退屈しないじゃない。あなたの隣、しばらく予約しておくわ』",
      ],
    },
    {
      id: "harem_bloom",
      title: "第6章 咲き始める絆",
      condition: () => getHaremSummary().haremLevel >= 3,
      reward: { gift: 3, gold: 40 },
      scenes: [
        "街の広場で、小さな収穫祭が開かれる。ヒロインたちはそれぞれの店を手伝い、主人公は一日中引っ張りだこになる。",
        "誰かに頼られるたび、誰かが隣に来る。笑い声が重なり、開拓団はただの戦力ではなく家族のような輪になっていく。",
        "その夜、星灯りはいつもより明るく見えた。主人公の選んだ言葉と行動が、彼女たちの未来を少しずつ変えている。",
      ],
    },
    {
      id: "cave_truth",
      title: "第7章 灯なしの真実",
      condition: () => (state.clears.cave || 0) >= 2,
      reward: { relic: 2, gear: 1 },
      scenes: [
        "灯なしの洞窟の深部で、開拓団は星灯りを吸い込む黒い結晶を発見する。",
        "結晶には、かつて街を守るために封じられた魔王の残響が宿っていた。",
        "恐怖で足が止まりかけた時、ヒロインたちが主人公の手を取る。『今度は私たちが、あなたを前に進ませる番』",
      ],
    },
    {
      id: "future",
      title: "第8章 まだ見ぬ明日へ",
      condition: () => state.members.length >= 8 && state.members[0].level >= 5,
      reward: { charm: 1, gift: 5, gold: 80 },
      scenes: [
        "仲間が増え、街に灯が戻り、主人公の名前は周辺の村々にも届き始めた。",
        "けれど、物語はまだ序章にすぎない。東の湖、南の交易都市、西の古城。地図の外には新しい出会いと脅威が待っている。",
        "ヒロインたちは笑って主人公を見る。次にどこへ行くかは、もう一人で決めなくていい。",
      ],
    },
  ];

  const JOBS = [
    {
      id: "sword",
      name: "剣士",
      category: "combat",
      desc: "扱いやすい前衛。序盤の探索を安定させる。",
      stats: { atk: 8, def: 3, speed: 2 },
    },
    {
      id: "guardian",
      name: "盾騎士",
      category: "combat",
      desc: "守りに優れ、敗走時の損耗を抑える。",
      stats: { atk: 4, def: 10, supply: 1 },
    },
    {
      id: "lancer",
      name: "槍兵",
      category: "combat",
      desc: "攻守と速度のバランスが良い戦闘職。",
      stats: { atk: 7, def: 4, speed: 3 },
    },
    {
      id: "dualist",
      name: "双剣士",
      category: "combat",
      desc: "手数で押す高速型。幸運も少し伸びる。",
      stats: { atk: 7, speed: 7, luck: 1 },
    },
    {
      id: "archer",
      name: "弓使い",
      category: "combat",
      desc: "遠距離攻撃と索敵で安全な進行を支える。",
      stats: { atk: 6, scout: 6, luck: 2 },
    },
    {
      id: "mage",
      name: "魔術師",
      category: "combat",
      desc: "魔力で危険度の高い敵を崩す。",
      stats: { atk: 2, mag: 10, luck: 1 },
    },
    {
      id: "cleric",
      name: "僧侶",
      category: "combat",
      desc: "回復と補給で長い探索に強い。",
      stats: { heal: 10, def: 2, supply: 2 },
    },
    {
      id: "brawler",
      name: "武闘家",
      category: "combat",
      desc: "素早い近接戦で探索進行も速める。",
      stats: { atk: 8, def: 2, speed: 4 },
    },
    {
      id: "shinobi",
      name: "忍び",
      category: "combat",
      desc: "速度、索敵、幸運をまとめて伸ばす。",
      stats: { atk: 5, speed: 8, scout: 5, luck: 3 },
    },
    {
      id: "gunner",
      name: "砲術士",
      category: "combat",
      desc: "一撃の火力が高く、強敵討伐に向く。",
      stats: { atk: 11, def: 1, supply: 1 },
    },
    {
      id: "summoner",
      name: "召喚士",
      category: "combat",
      desc: "魔力と回復を併せ持つ支援火力。",
      stats: { mag: 8, heal: 3, luck: 2 },
    },
    {
      id: "paladin",
      name: "聖騎士",
      category: "combat",
      desc: "防御と回復を備えた高耐久の戦闘職。",
      stats: { atk: 6, def: 7, heal: 5 },
    },
    {
      id: "blacksmith",
      name: "鍛冶師",
      category: "craft",
      desc: "鉱石を装備強化へ変える主力生産職。",
      stats: { craft: 10, atk: 2, def: 2 },
    },
    {
      id: "alchemist",
      name: "錬金術師",
      category: "craft",
      desc: "薬草からポーションを作りやすい。",
      stats: { craft: 8, heal: 4, luck: 2 },
    },
    {
      id: "cook",
      name: "料理人",
      category: "craft",
      desc: "携行食を整え、探索の継続力を上げる。",
      stats: { craft: 7, supply: 8 },
    },
    {
      id: "tailor",
      name: "裁縫師",
      category: "craft",
      desc: "繊維と皮材を扱い、防具面を支える。",
      stats: { craft: 8, def: 4, supply: 2 },
    },
    {
      id: "carpenter",
      name: "木工師",
      category: "craft",
      desc: "木材を使った道具作りで探索を補助する。",
      stats: { craft: 8, scout: 2, supply: 4 },
    },
    {
      id: "jeweler",
      name: "細工師",
      category: "craft",
      desc: "遺物や鉱石から幸運を呼ぶ護符を作る。",
      stats: { craft: 8, luck: 5 },
    },
    {
      id: "enchanter",
      name: "付与術師",
      category: "craft",
      desc: "装備に魔力を与え、戦力を底上げする。",
      stats: { craft: 8, mag: 5 },
    },
    {
      id: "builder",
      name: "建築家",
      category: "craft",
      desc: "拠点設備を整え、全体の防御と補給を伸ばす。",
      stats: { craft: 7, def: 4, supply: 5 },
    },
    {
      id: "scribe",
      name: "書記官",
      category: "craft",
      desc: "探索記録から地図と手順を整える。",
      stats: { craft: 6, scout: 5, luck: 2 },
    },
    {
      id: "artificer",
      name: "魔具師",
      category: "craft",
      desc: "魔力を帯びた道具で高難度探索を支援する。",
      stats: { craft: 10, mag: 4 },
    },
    {
      id: "machinist",
      name: "機工師",
      category: "craft",
      desc: "探索器具を作り、速度と補給を伸ばす。",
      stats: { craft: 9, speed: 3, supply: 3 },
    },
    {
      id: "brewer",
      name: "醸造師",
      category: "craft",
      desc: "食材と薬草の効果を高める補助生産職。",
      stats: { craft: 7, heal: 3, supply: 5 },
    },
    {
      id: "miner",
      name: "採掘師",
      category: "gather",
      desc: "鉱石と石材の確保に強い採取職。",
      stats: { gather: 10, def: 2 },
    },
    {
      id: "woodcutter",
      name: "木こり",
      category: "gather",
      desc: "木材を効率よく集め、攻撃も少し伸びる。",
      stats: { gather: 9, atk: 3 },
    },
    {
      id: "herbalist",
      name: "薬草師",
      category: "gather",
      desc: "薬草集めと回復支援が得意。",
      stats: { gather: 8, heal: 5 },
    },
    {
      id: "fisher",
      name: "漁師",
      category: "gather",
      desc: "魚と補給の確保に優れる。",
      stats: { gather: 8, supply: 5, luck: 1 },
    },
    {
      id: "hunter",
      name: "狩人",
      category: "gather",
      desc: "皮材を集めながら戦闘にも参加できる。",
      stats: { gather: 8, atk: 4, scout: 2 },
    },
    {
      id: "scout",
      name: "斥候",
      category: "gather",
      desc: "索敵と移動で探索の回転率を上げる。",
      stats: { gather: 5, scout: 9, speed: 3 },
    },
    {
      id: "geologist",
      name: "地質学者",
      category: "gather",
      desc: "鉱脈と希少素材を見つけやすい。",
      stats: { gather: 7, scout: 4, luck: 4 },
    },
    {
      id: "trapper",
      name: "罠師",
      category: "gather",
      desc: "事前準備で敵との遭遇を有利にする。",
      stats: { gather: 7, scout: 6, def: 2 },
    },
    {
      id: "forager",
      name: "野草摘み",
      category: "gather",
      desc: "街道沿いでも素材を拾い続ける。",
      stats: { gather: 10, luck: 2 },
    },
    {
      id: "relicseeker",
      name: "遺物探し",
      category: "gather",
      desc: "古い遺物や珍品を見つけやすい。",
      stats: { gather: 6, scout: 4, luck: 7 },
    },
    {
      id: "cartographer",
      name: "地図師",
      category: "gather",
      desc: "探索路を整え、移動速度を高める。",
      stats: { gather: 5, scout: 10, speed: 4 },
    },
    {
      id: "porter",
      name: "運び屋",
      category: "gather",
      desc: "持ち帰り量と補給を増やす縁の下の力持ち。",
      stats: { gather: 6, supply: 8, speed: 2 },
    },
  ];

  const LOCATIONS = [
    {
      id: "town",
      name: "星灯りの街",
      tone: "town",
      tagline: "拠点",
      desc: "宿、工房、倉庫がまとまった開拓団の拠点。探索していない間はここで生産と補給を進める。",
      danger: 0,
      richness: 0.75,
      distance: 1,
      x: 2,
      y: 2,
      gather: [
        { key: "herb", weight: 4, min: 1, max: 2 },
        { key: "wood", weight: 3, min: 1, max: 2 },
        { key: "fiber", weight: 2, min: 1, max: 1 },
        { key: "fish", weight: 1, min: 1, max: 1 },
      ],
      enemies: [],
    },
    {
      id: "field",
      name: "ひなたの草原",
      tone: "field",
      tagline: "街道沿いの低危険地帯",
      desc: "街の南に広がる草地。薬草と皮材が多く、初期の鍛錬に向いている。",
      danger: 1,
      richness: 1,
      distance: 1,
      x: 2,
      y: 3,
      exp: 16,
      gold: 8,
      enemies: ["草原の魔物", "ならず者", "赤目の影"],
      gather: [
        { key: "herb", weight: 5, min: 1, max: 3 },
        { key: "hide", weight: 3, min: 1, max: 2 },
        { key: "fiber", weight: 2, min: 1, max: 2 },
      ],
      loot: [
        { key: "herb", chance: 0.65, min: 1, max: 2 },
        { key: "hide", chance: 0.38, min: 1, max: 2 },
      ],
    },
    {
      id: "forest",
      name: "ささやきの森",
      tone: "forest",
      tagline: "木材と薬草の森",
      desc: "街の東にある薄暗い森。木材、薬草、繊維をまとめて集めやすい。",
      danger: 2,
      richness: 1.1,
      distance: 1.15,
      x: 3,
      y: 2,
      exp: 25,
      gold: 13,
      enemies: ["森の魔物", "絡みつく蔦", "仮面の追跡者"],
      gather: [
        { key: "wood", weight: 5, min: 1, max: 3 },
        { key: "herb", weight: 3, min: 1, max: 2 },
        { key: "fiber", weight: 3, min: 1, max: 2 },
        { key: "hide", weight: 1, min: 1, max: 1 },
      ],
      loot: [
        { key: "wood", chance: 0.64, min: 1, max: 3 },
        { key: "fiber", chance: 0.42, min: 1, max: 2 },
        { key: "herb", chance: 0.35, min: 1, max: 2 },
      ],
    },
    {
      id: "river",
      name: "霧の川辺",
      tone: "river",
      tagline: "水辺の素材場",
      desc: "霧の立つ川岸。魚、薬草、繊維が採れる。補給を整える遠征向け。",
      danger: 2,
      richness: 1.15,
      distance: 1.25,
      x: 1,
      y: 2,
      exp: 24,
      gold: 12,
      enemies: ["水辺の魔物", "霧まとう影", "沈黙の盗掘者"],
      gather: [
        { key: "fish", weight: 5, min: 1, max: 3 },
        { key: "herb", weight: 3, min: 1, max: 2 },
        { key: "fiber", weight: 2, min: 1, max: 2 },
      ],
      loot: [
        { key: "fish", chance: 0.66, min: 1, max: 3 },
        { key: "herb", chance: 0.32, min: 1, max: 2 },
      ],
    },
    {
      id: "mine",
      name: "古びた採掘場",
      tone: "mine",
      tagline: "鉱石と石材の採掘場",
      desc: "崩れかけた坑道。鉱石と石材が多く、装備強化を進めやすい。",
      danger: 3,
      richness: 1.25,
      distance: 1.35,
      x: 3,
      y: 3,
      exp: 34,
      gold: 18,
      enemies: ["坑道の魔物", "動く鉱塊", "奥から響く足音"],
      gather: [
        { key: "ore", weight: 5, min: 1, max: 3 },
        { key: "stone", weight: 4, min: 1, max: 3 },
        { key: "relic", weight: 1, min: 1, max: 1 },
      ],
      loot: [
        { key: "ore", chance: 0.7, min: 1, max: 3 },
        { key: "stone", chance: 0.45, min: 1, max: 3 },
        { key: "relic", chance: 0.12, min: 1, max: 1 },
      ],
    },
    {
      id: "watchtower",
      name: "北の見張り塔",
      tone: "ruin",
      tagline: "遺物が眠る廃塔",
      desc: "街の北に残る古い塔。遺物と金貨の入手量が高いが、敵も手強い。",
      danger: 4,
      richness: 1.05,
      distance: 1.55,
      x: 2,
      y: 1,
      exp: 46,
      gold: 28,
      enemies: ["廃塔の番人", "古鎧の幻", "沈んだ旗印"],
      gather: [
        { key: "relic", weight: 4, min: 1, max: 2 },
        { key: "stone", weight: 3, min: 1, max: 2 },
        { key: "ore", weight: 2, min: 1, max: 2 },
      ],
      loot: [
        { key: "relic", chance: 0.42, min: 1, max: 2 },
        { key: "ore", chance: 0.35, min: 1, max: 2 },
        { key: "gold", chance: 0.5, min: 8, max: 20 },
      ],
    },
    {
      id: "cave",
      name: "灯なしの洞窟",
      tone: "cave",
      tagline: "周辺最高危険度",
      desc: "街の西に口を開ける洞窟。鉱石と遺物を多く得られるが、十分な戦力が必要。",
      danger: 5,
      richness: 1.35,
      distance: 1.8,
      x: 1,
      y: 3,
      exp: 62,
      gold: 36,
      enemies: ["暗がりの魔物", "石の獣", "深層から来るもの"],
      gather: [
        { key: "ore", weight: 5, min: 1, max: 4 },
        { key: "relic", weight: 3, min: 1, max: 2 },
        { key: "stone", weight: 3, min: 1, max: 3 },
      ],
      loot: [
        { key: "ore", chance: 0.74, min: 1, max: 4 },
        { key: "relic", chance: 0.3, min: 1, max: 2 },
        { key: "gear", chance: 0.1, min: 1, max: 1 },
      ],
    },
  ];

  const CRAFT_RECIPES = [
    {
      key: "gear",
      amount: 1,
      need: { ore: 4, wood: 2, hide: 1 },
      text: "鍛冶班が装備を強化した",
    },
    {
      key: "potion",
      amount: 2,
      need: { herb: 4, fiber: 1 },
      text: "錬金班がポーションを補充した",
    },
    {
      key: "food",
      amount: 2,
      need: { fish: 2, herb: 1 },
      text: "調理班が携行食を仕込んだ",
    },
    {
      key: "gift",
      amount: 1,
      need: { herb: 2, fiber: 1, gold: 4 },
      text: "交流用の贈り物を包んだ",
    },
    {
      key: "charm",
      amount: 1,
      need: { relic: 2, fiber: 3, ore: 1 },
      text: "細工班が護符を仕上げた",
    },
  ];

  const RECRUIT_NAMES = [
    "リオ",
    "ミナ",
    "カイ",
    "セナ",
    "トウマ",
    "ユイ",
    "ロイ",
    "ノア",
    "イリス",
    "レン",
    "サラ",
    "ルカ",
    "ニナ",
    "エル",
    "マオ",
    "キリ",
    "アキ",
    "フィン",
    "レイ",
    "メル",
  ];

  const JOB_BY_ID = Object.fromEntries(JOBS.map((job) => [job.id, job]));
  const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((location) => [location.id, location]));

  const elements = {};
  let selectedCategory = "combat";
  let state = loadState();
  let firebaseConfig = loadFirebaseConfig();
  let firebaseServices = null;
  let firebaseUser = null;
  let firebaseStatus = "";
  let firebaseError = "";
  let firebaseInitPromise = null;

  init();

  function init() {
    for (const id of [
      "topbar",
      "heroPanel",
      "rosterPanel",
      "mapPanel",
      "locationPanel",
      "storyPanel",
      "jobsPanel",
      "resourcesPanel",
      "accountPanel",
      "logPanel",
    ]) {
      elements[id] = document.getElementById(id);
    }

    applyOfflineProgress();
    renderAll();
    bindEvents();
    registerServiceWorker();
    initializeFirebaseFromStorage();

    setInterval(() => {
      simulateTick(false);
      state.lastTick = Date.now();
      renderTick();
    }, 1000);

    setInterval(() => {
      saveState(false);
    }, 5000);
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-action]");
      if (!actionElement) return;

      const { action } = actionElement.dataset;

      if (action === "select-location") {
        selectLocation(actionElement.dataset.location);
      }

      if (action === "toggle-explore") {
        toggleExplore();
      }

      if (action === "set-category") {
        selectedCategory = actionElement.dataset.category;
        renderJobs();
      }

      if (action === "assign-hero-job") {
        assignJob(state.members[0].id, actionElement.dataset.job);
        renderAll();
      }

      if (action === "recruit") {
        recruitMember();
      }

      if (action === "bond-member") {
        bondWithMember(actionElement.dataset.member);
      }

      if (action === "select-story") {
        selectStory(actionElement.dataset.story);
      }

      if (action === "story-prev") {
        moveStory(-1);
      }

      if (action === "story-next") {
        moveStory(1);
      }

      if (action === "save") {
        addLog("手動セーブしました。", "loot");
        saveState(true);
        renderAll();
      }

      if (action === "load") {
        state = loadState();
        addLog("保存データを読み込みました。", "loot");
        renderAll();
      }

      if (action === "reset") {
        if (window.confirm("現在のセーブデータを削除して最初から始めますか？")) {
          localStorage.removeItem(STORAGE_KEY);
          state = createDefaultState();
          addLog("新しい開拓団を結成しました。", "loot");
          saveState(false);
          renderAll();
        }
      }

      if (action === "save-firebase-config") {
        saveFirebaseConfigFromInputs();
      }

      if (action === "clear-firebase-config") {
        clearFirebaseConfig();
      }

      if (action === "firebase-login") {
        signInWithFirebase();
      }

      if (action === "firebase-logout") {
        signOutFromFirebase();
      }

      if (action === "firebase-cloud-save") {
        saveToFirebaseCloud();
      }

      if (action === "firebase-cloud-load") {
        loadFromFirebaseCloud();
      }

      if (action === "firebase-use-name") {
        applyFirebaseNameToHero();
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.id !== "heroName") return;
      const name = event.target.value.trim().slice(0, 18) || "主人公";
      state.heroName = name;
      state.members[0].name = name;
      renderTopbar();
      if (!isFocusedWithin("rosterPanel")) {
        renderRoster();
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.matches("[data-member-job]")) {
        assignJob(event.target.dataset.memberJob, event.target.value);
        renderAll();
      }
    });

    document.addEventListener(
      "blur",
      (event) => {
        if (event.target.id === "heroName") {
          renderHero();
        }
      },
      true,
    );
  }

  function createDefaultState() {
    return {
      heroName: "アリア",
      members: [
        {
          id: "hero",
          name: "アリア",
          level: 1,
          xp: 0,
          jobId: "sword",
          profileId: "leader",
          affection: 0,
        },
        {
          id: "starter-mina",
          name: "ミナ",
          level: 1,
          xp: 0,
          jobId: "cleric",
          profileId: "healer",
          affection: 28,
        },
        {
          id: "starter-sena",
          name: "セナ",
          level: 1,
          xp: 0,
          jobId: "archer",
          profileId: "ranger",
          affection: 18,
        },
      ],
      resources: {
        gold: 120,
        herb: 6,
        wood: 4,
        ore: 2,
        hide: 1,
        fish: 0,
        fiber: 1,
        stone: 0,
        relic: 0,
        potion: 2,
        gear: 0,
        food: 1,
        gift: 2,
        charm: 0,
      },
      selectedLocation: "town",
      exploring: false,
      progress: 0,
      gatherProgress: 0,
      craftProgress: 0,
      clears: {},
      story: {
        selectedId: "prologue",
        sceneIndex: 0,
        completed: {},
      },
      logs: [
        {
          text: "星灯りの街で、主人公とヒロインたちの開拓生活が始まった。",
          type: "loot",
          time: Date.now(),
        },
      ],
      lastTick: Date.now(),
      nextRecruitId: 3,
      haremLevel: 1,
      haremXp: 0,
      haremVersion: 2,
      firebaseUser: null,
      cloudSavedAt: 0,
    };
  }

  function loadState() {
    const fallback = createDefaultState();
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw);
      const normalizedMembers = migrateHaremMembers(normalizeMembers(parsed.members), parsed.haremVersion);
      const stateToUse = {
        ...fallback,
        ...parsed,
        resources: { ...fallback.resources, ...(parsed.resources || {}) },
        clears: parsed.clears || {},
        story: normalizeStory(parsed.story),
        logs: Array.isArray(parsed.logs) ? parsed.logs.slice(0, 80) : fallback.logs,
        members: normalizedMembers,
        haremLevel: Math.max(1, Number(parsed.haremLevel) || 1),
        haremXp: Math.max(0, Number(parsed.haremXp) || 0),
        haremVersion: 2,
        firebaseUser: normalizeFirebaseUser(parsed.firebaseUser || parsed.googleAccount),
        cloudSavedAt: Math.max(0, Number(parsed.cloudSavedAt) || 0),
      };

      if (!LOCATION_BY_ID[stateToUse.selectedLocation]) {
        stateToUse.selectedLocation = "town";
        stateToUse.exploring = false;
      }

      return stateToUse;
    } catch (error) {
      console.warn("Failed to load save data", error);
      return fallback;
    }
  }

  function normalizeMembers(members) {
    if (!Array.isArray(members) || members.length === 0) {
      return createDefaultState().members;
    }

    return members.map((member, index) => ({
      id: String(member.id || (index === 0 ? "hero" : `member-${index}`)),
      name: String(member.name || getFallbackMemberName(index)).slice(0, 18),
      level: Math.max(1, Number(member.level) || 1),
      xp: Math.max(0, Number(member.xp) || 0),
      jobId: JOB_BY_ID[member.jobId] ? member.jobId : index === 0 ? "sword" : JOBS[index % JOBS.length].id,
      profileId: index === 0 ? "leader" : getValidProfileId(member.profileId, index),
      affection: index === 0 ? 0 : Math.max(0, Number(member.affection) || getCompanionProfileByIndex(index).affection || 0),
    }));
  }

  function migrateHaremMembers(members, haremVersion) {
    if (haremVersion || members.length >= 3) {
      return members;
    }

    const migrated = [...members];
    for (let index = migrated.length; index < 3; index += 1) {
      const profile = COMPANION_PROFILES[index - 1];
      migrated.push({
        id: `starter-${profile.id}`,
        name: profile.name,
        level: 1,
        xp: 0,
        jobId: profile.jobId,
        profileId: profile.id,
        affection: profile.affection,
      });
    }
    return migrated;
  }

  function getFallbackMemberName(index) {
    if (index === 0) {
      return "主人公";
    }
    return getCompanionProfileByIndex(index).name;
  }

  function getValidProfileId(profileId, index) {
    if (COMPANION_PROFILES.some((profile) => profile.id === profileId)) {
      return profileId;
    }
    return getCompanionProfileByIndex(index).id;
  }

  function getCompanionProfileByIndex(index) {
    return COMPANION_PROFILES[(Math.max(1, index) - 1) % COMPANION_PROFILES.length];
  }

  function getCompanionProfile(member, index = 1) {
    return COMPANION_PROFILES.find((profile) => profile.id === member.profileId) || getCompanionProfileByIndex(index);
  }

  function normalizeStory(story) {
    const selectedId = STORY_CHAPTERS.some((chapter) => chapter.id === story?.selectedId) ? story.selectedId : "prologue";
    return {
      selectedId,
      sceneIndex: Math.max(0, Number(story?.sceneIndex) || 0),
      completed: story?.completed && typeof story.completed === "object" ? story.completed : {},
    };
  }

  function normalizeFirebaseUser(user) {
    if (!user || typeof user !== "object" || !(user.uid || user.sub)) {
      return null;
    }

    return {
      uid: String(user.uid || user.sub).slice(0, 160),
      name: String(user.displayName || user.name || "Firebaseユーザー").slice(0, 80),
      email: String(user.email || "").slice(0, 160),
      picture: String(user.photoURL || user.picture || "").slice(0, 500),
      linkedAt: Math.max(0, Number(user.linkedAt) || Date.now()),
    };
  }

  function loadFirebaseConfig() {
    const bundledConfig = sanitizeFirebaseConfig(window.STARLIGHT_FIREBASE_CONFIG);
    if (bundledConfig) {
      return bundledConfig;
    }

    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return sanitizeFirebaseConfig(JSON.parse(raw));
    } catch (error) {
      console.warn("Failed to load Firebase config", error);
      return null;
    }
  }

  function sanitizeFirebaseConfig(config) {
    if (!config || typeof config !== "object") {
      return null;
    }

    const sanitized = {
      apiKey: String(config.apiKey || "").trim(),
      authDomain: String(config.authDomain || "").trim(),
      projectId: String(config.projectId || "").trim(),
      storageBucket: String(config.storageBucket || "").trim(),
      messagingSenderId: String(config.messagingSenderId || "").trim(),
      appId: String(config.appId || "").trim(),
    };

    if (!sanitized.apiKey || !sanitized.authDomain || !sanitized.projectId || !sanitized.appId) {
      return null;
    }

    return sanitized;
  }

  function hasBundledFirebaseConfig() {
    return Boolean(sanitizeFirebaseConfig(window.STARLIGHT_FIREBASE_CONFIG));
  }

  function saveState() {
    state.lastTick = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applyOfflineProgress() {
    const elapsed = Math.floor((Date.now() - Number(state.lastTick || Date.now())) / 1000);
    const capped = clamp(elapsed, 0, 7200);

    if (capped < 20) {
      return;
    }

    const beforeGold = state.resources.gold;
    const beforeGear = state.resources.gear;
    const beforePotion = state.resources.potion;
    const beforeGift = state.resources.gift;
    const beforeHaremLevel = state.haremLevel;
    const beforeClears = Object.values(state.clears).reduce((sum, value) => sum + value, 0);

    for (let index = 0; index < capped; index += 1) {
      simulateTick(true);
    }

    const afterClears = Object.values(state.clears).reduce((sum, value) => sum + value, 0);
    const minutes = Math.floor(capped / 60);
    const gainedGold = state.resources.gold - beforeGold;
    const gainedGear = state.resources.gear - beforeGear;
    const gainedPotion = state.resources.potion - beforePotion;
    const gainedGift = state.resources.gift - beforeGift;
    const clears = afterClears - beforeClears;
    const haremText = state.haremLevel > beforeHaremLevel ? `、ハーレムLv.${state.haremLevel}` : "";

    addLog(
      `不在中の${minutes}分を計算。金貨+${gainedGold}、贈り物+${gainedGift}、装備強化+${gainedGear}、ポーション+${gainedPotion}、討伐${clears}回${haremText}。`,
      "loot",
    );
  }

  function selectLocation(locationId) {
    if (!LOCATION_BY_ID[locationId]) return;

    const previous = state.selectedLocation;
    state.selectedLocation = locationId;

    if (previous !== locationId) {
      state.progress = 0;
      state.exploring = false;
      addLog(`${LOCATION_BY_ID[locationId].name}を目的地に設定しました。`, "loot");
    }

    renderAll();
  }

  function toggleExplore() {
    const location = getSelectedLocation();

    if (location.id === "town") {
      state.exploring = false;
      addLog("街では生産と補給を進めます。周辺マップを選ぶと探索できます。", "loot");
      renderAll();
      return;
    }

    state.exploring = !state.exploring;
    addLog(state.exploring ? `${location.name}へヒロインたちと探索に出発。同行人数は${state.members.length}人、上限なし。` : "探索隊が街へ戻りました。", state.exploring ? "loot" : "warn");
    renderAll();
  }

  function recruitMember() {
    const cost = getRecruitCost();
    if (state.resources.gold < cost) {
      addLog(`金貨が不足しています。雇用には${cost}枚必要です。`, "warn");
      renderLogs();
      return;
    }

    state.resources.gold -= cost;
    const index = state.nextRecruitId || state.members.length;
    const profile = getCompanionProfileByIndex(index);
    const sameProfileCount = state.members.filter((member) => member.profileId === profile.id).length;
    const name = sameProfileCount > 0 ? `${profile.name}${sameProfileCount + 1}` : profile.name;
    const job = JOB_BY_ID[profile.jobId] || JOBS[(index * 5) % JOBS.length];

    state.members.push({
      id: `member-${Date.now()}-${index}`,
      name,
      level: 1,
      xp: 0,
      jobId: job.id,
      profileId: profile.id,
      affection: profile.affection,
    });
    state.nextRecruitId = index + 1;
    addLog(`${name}が仲間になりました。「${profile.line}」 探索パーティーは${state.members.length}人、上限なし。`, "loot");
    gainHaremBond(name, 8, true);
    renderAll();
  }

  function bondWithMember(memberId) {
    const memberIndex = state.members.findIndex((candidate) => candidate.id === memberId);
    const member = state.members[memberIndex];

    if (!member || member.id === "hero") {
      return;
    }

    if ((state.resources.gift || 0) < 1) {
      addLog("贈り物が足りません。街の生産や探索で用意できます。", "warn");
      renderLogs();
      return;
    }

    const profile = getCompanionProfile(member, memberIndex);
    const previousBondLevel = getBondInfo(member.affection).level;
    state.resources.gift -= 1;
    member.affection += randomInt(16, 24) + Math.floor(aggregateStats().luck / 35);
    member.xp += 8 + previousBondLevel * 2;
    gainHaremBond(member.name, 10 + previousBondLevel, true);
    applyXp(4 + previousBondLevel, true);

    const currentBondLevel = getBondInfo(member.affection).level;
    const levelText = currentBondLevel > previousBondLevel ? ` 親愛Lv.${currentBondLevel}に上昇。` : "";
    addLog(`${member.name}と交流。「${profile.line}」 親愛+、経験値+。${levelText}`, currentBondLevel > previousBondLevel ? "win" : "loot");
    renderAll();
  }

  function assignJob(memberId, jobId) {
    const member = state.members.find((candidate) => candidate.id === memberId);
    if (!member || !JOB_BY_ID[jobId]) return;
    member.jobId = jobId;
  }

  function selectStory(storyId) {
    const chapter = getUnlockedStories().find((candidate) => candidate.id === storyId);
    if (!chapter) {
      return;
    }

    state.story.selectedId = chapter.id;
    state.story.sceneIndex = 0;
    renderAll();
  }

  function moveStory(direction) {
    const chapter = getCurrentStory();
    if (!chapter) {
      return;
    }

    const nextIndex = clamp(state.story.sceneIndex + direction, 0, chapter.scenes.length - 1);
    state.story.sceneIndex = nextIndex;

    if (direction > 0 && nextIndex === chapter.scenes.length - 1) {
      completeStory(chapter);
    }

    renderAll();
  }

  function completeStory(chapter) {
    if (state.story.completed[chapter.id]) {
      return;
    }

    state.story.completed[chapter.id] = true;
    for (const [key, amount] of Object.entries(chapter.reward || {})) {
      addResource(key, amount);
    }
    gainHaremBond(chapter.title, 18, true);
    addLog(`${chapter.title}を読了。物語報酬を受け取り、絆が深まりました。`, "win");
  }

  function simulateTick(silent) {
    if (state.selectedLocation === "town") {
      state.exploring = false;
    }

    const stats = aggregateStats();
    const activeLocation = state.exploring ? getSelectedLocation() : LOCATION_BY_ID.town;

    performGathering(stats, activeLocation, silent);
    performCrafting(stats, silent);

    if (!state.exploring || activeLocation.danger <= 0) {
      return;
    }

    const progressGain = (8 + stats.speed * 0.28 + stats.scout * 0.18 + Math.sqrt(stats.partySize) * 0.9) / activeLocation.distance;
    state.progress += Math.max(3, progressGain);

    if (state.progress >= 100) {
      state.progress -= 100;
      resolveEncounter(activeLocation, stats, silent);
    }
  }

  function performGathering(stats, location, silent) {
    const gatheringPower = Math.max(2, stats.gather * 0.72 + stats.scout * 0.24 + stats.supply * 0.08 + stats.partySize * 0.8);
    state.gatherProgress += gatheringPower * location.richness;

    let safety = 0;
    while (state.gatherProgress >= 100 && safety < 4) {
      safety += 1;
      state.gatherProgress -= 100;
      const drop = rollWeighted(location.gather);
      const amount = randomInt(drop.min, drop.max) + Math.floor(Math.random() * Math.max(1, stats.gather / 35));
      addResource(drop.key, amount);

      if (!silent && Math.random() < 0.55) {
        addLog(`${location.name}の作業で${RESOURCE_LABELS[drop.key]}を${amount}個得ました。`, "loot");
      }
    }
  }

  function performCrafting(stats, silent) {
    const craftPower = Math.max(1, stats.craft * 0.78 + stats.supply * 0.35 + stats.luck * 0.08 + stats.partySize * 0.35);
    state.craftProgress += craftPower * (state.exploring ? 0.58 : 1.18);

    let safety = 0;
    while (state.craftProgress >= 140 && safety < 3) {
      safety += 1;
      const recipe = CRAFT_RECIPES.find((candidate) => canAfford(candidate.need));

      if (!recipe) {
        state.craftProgress = 120;
        if (!silent && Math.random() < 0.4) {
          addResource("gold", 1);
          addLog("生産班が街の依頼を片付け、金貨を1枚得ました。", "loot");
        }
        break;
      }

      spendResources(recipe.need);
      addResource(recipe.key, recipe.amount);
      state.craftProgress -= 140;

      if (!silent) {
        addLog(`${recipe.text}。${RESOURCE_LABELS[recipe.key]}+${recipe.amount}`, "loot");
      }
    }
  }

  function resolveEncounter(location, stats, silent) {
    const clears = state.clears[location.id] || 0;
    const isStrongEnemy = clears > 0 && clears % 8 === 7;
    const enemyName = isStrongEnemy ? `${location.name}の強敵` : location.enemies[randomInt(0, location.enemies.length - 1)];
    const enemyPower = getEnemyPower(location, isStrongEnemy);
    const chance = estimateWinChance(location, stats, isStrongEnemy);

    if (Math.random() <= chance) {
      state.clears[location.id] = clears + 1;

      const gold = Math.floor((location.gold || 0) * randomFloat(0.85, 1.3) * (isStrongEnemy ? 2.2 : 1));
      const xp = Math.floor((location.exp || 0) * randomFloat(0.9, 1.25) * (isStrongEnemy ? 2 : 1));
      addResource("gold", gold);
      applyLoot(location, stats, isStrongEnemy);
      applyXp(xp, silent);
      gainPartyBond(1 + location.danger + (isStrongEnemy ? 3 : 0), silent, location.name);

      if (isStrongEnemy) {
        addResource("charm", 1);
      }

      if (!silent) {
        addLog(`${enemyName}を撃破。金貨+${gold}、経験値+${xp}。`, "win");
      }
      return;
    }

    state.progress = Math.max(0, state.progress - 18);
    const usedPotion = state.resources.potion > 0;
    const usedFood = !usedPotion && state.resources.food > 0;

    if (usedPotion) {
      state.resources.potion -= 1;
    } else if (usedFood) {
      state.resources.food -= 1;
    }

    applyXp(Math.max(2, Math.floor(enemyPower * 0.08)), true);

    if (!silent) {
      const consumeText = usedPotion ? "ポーションを1個消費。" : usedFood ? "携行食を1個消費。" : "消耗を抑えて撤退。";
      addLog(`${enemyName}に押し返されました。${consumeText}`, "warn");
    }
  }

  function applyLoot(location, stats, isStrongEnemy) {
    for (const loot of location.loot || []) {
      const chance = clamp(loot.chance + stats.luck / 450 + (isStrongEnemy ? 0.12 : 0), 0, 0.98);
      if (Math.random() <= chance) {
        addResource(loot.key, randomInt(loot.min, loot.max));
      }
    }

    const rareChance = 0.045 + stats.luck / 700 + (isStrongEnemy ? 0.08 : 0);
    if (Math.random() < rareChance) {
      addResource("gear", 1);
    }

    if (Math.random() < 0.035 + stats.luck / 900 + (isStrongEnemy ? 0.06 : 0)) {
      addResource("gift", 1);
    }
  }

  function applyXp(amount, silent) {
    const levelUps = [];

    for (const member of state.members) {
      const job = JOB_BY_ID[member.jobId];
      const factor = job.category === "combat" ? 1 : job.category === "gather" ? 0.86 : 0.8;
      member.xp += Math.max(1, Math.floor(amount * factor));

      let safety = 0;
      while (member.xp >= getNextLevelXp(member.level) && safety < 20) {
        safety += 1;
        member.xp -= getNextLevelXp(member.level);
        member.level += 1;
        levelUps.push(`${member.name} Lv.${member.level}`);
      }
    }

    if (!silent && levelUps.length > 0) {
      addLog(`成長: ${levelUps.slice(0, 4).join("、")}${levelUps.length > 4 ? " ほか" : ""}`, "loot");
    }
  }

  function gainPartyBond(amount, silent, source) {
    const partners = state.members.filter((member) => member.id !== "hero");
    if (partners.length === 0) {
      return;
    }

    const levelUps = [];
    for (const member of partners) {
      const before = getBondInfo(member.affection).level;
      member.affection += amount + randomInt(0, 2);
      const after = getBondInfo(member.affection).level;

      if (after > before) {
        levelUps.push(`${member.name} 親愛Lv.${after}`);
      }
    }

    gainHaremBond(source, Math.max(1, Math.floor(amount * partners.length * 0.65)), silent);

    if (!silent && levelUps.length > 0) {
      addLog(`親愛上昇: ${levelUps.slice(0, 3).join("、")}${levelUps.length > 3 ? " ほか" : ""}`, "win");
    }
  }

  function gainHaremBond(source, amount, silent) {
    state.haremXp += Math.max(1, Math.floor(amount));

    const levelUps = [];
    let safety = 0;
    while (state.haremXp >= getNextHaremXp(state.haremLevel) && safety < 20) {
      safety += 1;
      state.haremXp -= getNextHaremXp(state.haremLevel);
      state.haremLevel += 1;
      levelUps.push(state.haremLevel);
    }

    if (!silent && levelUps.length > 0) {
      addLog(`${source}でハーレムLv.${levelUps[levelUps.length - 1]}に上昇。全員の連携が深まりました。`, "win");
    }
  }

  function aggregateStats() {
    const totals = {
      atk: 0,
      def: 0,
      mag: 0,
      heal: 0,
      gather: 0,
      craft: 0,
      scout: 0,
      luck: 0,
      speed: 0,
      supply: 0,
      partySize: state.members.length,
    };

    for (const member of state.members) {
      const job = JOB_BY_ID[member.jobId] || JOB_BY_ID.sword;
      const levelScale = 1 + (member.level - 1) * 0.06;
      const bondLevel = member.id === "hero" ? 0 : getBondInfo(member.affection).level;

      for (const [key, value] of Object.entries(job.stats)) {
        totals[key] += value * levelScale;
      }

      totals.atk += member.level * 1.08;
      totals.def += member.level * 0.62;
      totals.gather += member.level * 0.18;
      totals.craft += member.level * 0.14;
      totals.luck += member.level * 0.05;
      totals.heal += bondLevel * 0.18;
      totals.luck += bondLevel * 0.22;
      totals.supply += bondLevel * 0.2;
    }

    totals.luck += state.haremLevel * 0.35;
    totals.supply += state.haremLevel * 0.25;
    totals.gearBonus = state.resources.gear * 3 + state.resources.charm * 5 + state.resources.food * 0.2;
    totals.combat = totals.atk * 2 + totals.mag * 1.8 + totals.def * 1.35 + totals.heal * 1.15 + totals.speed * 0.55 + totals.gearBonus;
    totals.work = totals.gather + totals.craft + totals.scout + totals.supply * 0.4;
    return totals;
  }

  function getEnemyPower(location, isStrongEnemy) {
    const clears = state.clears[location.id] || 0;
    const base = location.danger * 42 + (location.exp || 0) * 0.45 + clears * 1.3;
    return base * (isStrongEnemy ? 1.85 : 1);
  }

  function estimateWinChance(location, stats = aggregateStats(), isStrongEnemy = false) {
    if (location.danger <= 0) return 1;
    const enemyPower = getEnemyPower(location, isStrongEnemy);
    const ratio = (stats.combat + 38) / (stats.combat + enemyPower + 58);
    return clamp(ratio + stats.heal / 420 + stats.luck / 500 - location.danger * 0.025, 0.06, 0.96);
  }

  function getRecruitCost() {
    const count = state.members.length;
    return Math.floor(45 + count * 22 + Math.pow(count, 1.45) * 8);
  }

  function getNextLevelXp(level) {
    return Math.floor(28 + level * level * 12 + level * 8);
  }

  function getNextBondXp(level) {
    return Math.floor(32 + level * 22);
  }

  function getNextHaremXp(level) {
    return Math.floor(70 + level * 48);
  }

  function getBondInfo(affection) {
    let level = 1;
    let spent = 0;
    let next = getNextBondXp(level);
    const total = Math.max(0, Number(affection) || 0);

    while (total >= spent + next && level < 99) {
      spent += next;
      level += 1;
      next = getNextBondXp(level);
    }

    const current = total - spent;
    return {
      level,
      current,
      next,
      percent: clamp((current / next) * 100, 0, 100),
      total,
    };
  }

  function getHaremSummary() {
    const partners = state.members.filter((member) => member.id !== "hero");
    const totalAffection = partners.reduce((sum, member) => sum + getBondInfo(member.affection).total, 0);
    const totalBondLevel = partners.reduce((sum, member) => sum + getBondInfo(member.affection).level, 0);
    const next = getNextHaremXp(state.haremLevel);

    return {
      partners,
      totalAffection,
      totalBondLevel,
      haremLevel: state.haremLevel,
      haremXp: state.haremXp,
      next,
      percent: clamp((state.haremXp / next) * 100, 0, 100),
      averageBondLevel: partners.length ? totalBondLevel / partners.length : 0,
    };
  }

  function getUnlockedStories() {
    return STORY_CHAPTERS.filter((chapter) => {
      try {
        return chapter.condition();
      } catch (error) {
        console.warn("Story condition failed", error);
        return false;
      }
    });
  }

  function getCurrentStory() {
    const unlocked = getUnlockedStories();
    if (!unlocked.some((chapter) => chapter.id === state.story.selectedId)) {
      state.story.selectedId = unlocked[unlocked.length - 1]?.id || "prologue";
      state.story.sceneIndex = 0;
    }
    return STORY_CHAPTERS.find((chapter) => chapter.id === state.story.selectedId) || STORY_CHAPTERS[0];
  }

  function getNextLockedStory() {
    const unlockedIds = new Set(getUnlockedStories().map((chapter) => chapter.id));
    return STORY_CHAPTERS.find((chapter) => !unlockedIds.has(chapter.id));
  }

  function addResource(key, amount) {
    state.resources[key] = Math.max(0, (state.resources[key] || 0) + amount);
  }

  function canAfford(cost) {
    return Object.entries(cost).every(([key, amount]) => (state.resources[key] || 0) >= amount);
  }

  function spendResources(cost) {
    for (const [key, amount] of Object.entries(cost)) {
      state.resources[key] -= amount;
    }
  }

  function addLog(text, type = "loot") {
    state.logs.unshift({
      text,
      type,
      time: Date.now(),
    });
    state.logs = state.logs.slice(0, 80);
  }

  function getSelectedLocation() {
    return LOCATION_BY_ID[state.selectedLocation] || LOCATION_BY_ID.town;
  }

  function renderAll() {
    renderTopbar();
    renderHero();
    renderRoster();
    renderMap();
    renderLocation();
    renderStory();
    renderJobs();
    renderResources();
    renderAccount();
    renderLogs();
  }

  function renderTick() {
    renderTopbar();
    renderLocation();
    renderStory();
    renderResources();
    renderLogs();

    if (!isFocusedWithin("heroPanel")) {
      renderHero();
    }

    if (!isFocusedWithin("rosterPanel")) {
      renderRoster();
    }
  }

  function renderTopbar() {
    const location = getSelectedLocation();
    const stats = aggregateStats();
    const hero = state.members[0];
    const harem = getHaremSummary();
    const status = state.exploring ? "探索中" : "拠点作業中";
    const heroXpPercent = Math.floor(clamp((hero.xp / getNextLevelXp(hero.level)) * 100, 0, 100));

    elements.topbar.innerHTML = `
      <div class="brand">
        <h1>星灯りのハーレム開拓記</h1>
        <p>放置型ハクスラRPG / ヒロイン親愛RPG</p>
      </div>
      ${renderTopStat("現在地", `${location.name} / ${status}`)}
      ${renderTopStat("主人公Lv", `Lv.${hero.level} / ${heroXpPercent}%`)}
      ${renderTopStat("ハーレムLv", `Lv.${harem.haremLevel} / ヒロイン${harem.partners.length}人`)}
      ${renderTopStat("総合戦力", `${formatNumber(stats.combat)} 戦力`)}
      <div class="top-actions brand">
        <button type="button" data-action="save">保存</button>
        <button type="button" data-action="load">読込</button>
        <button type="button" data-action="reset">初期化</button>
      </div>
    `;
  }

  function renderTopStat(label, value) {
    return `
      <div class="top-stat">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  }

  function renderHero() {
    const hero = state.members[0];
    const job = JOB_BY_ID[hero.jobId] || JOB_BY_ID.sword;
    const stats = aggregateStats();
    const harem = getHaremSummary();
    const nextXp = getNextLevelXp(hero.level);
    const xpPercent = clamp((hero.xp / nextXp) * 100, 0, 100);

    elements.heroPanel.innerHTML = `
      <div class="panel-title">
        <h2>主人公</h2>
        <small>名前変更 / Lv育成</small>
      </div>
      <div class="hero-name-row">
        <label class="field-label" for="heroName">名前</label>
        <input id="heroName" maxlength="18" value="${escapeAttr(hero.name)}" autocomplete="off">
      </div>
      <div class="hero-card">
        <div class="hero-meta">
          <h3>${escapeHtml(hero.name)}</h3>
          <p>Lv.${hero.level} / ${escapeHtml(job.name)}</p>
          <p>次の成長 ${formatNumber(hero.xp)} / ${formatNumber(nextXp)}</p>
          <p>ハーレムLv.${harem.haremLevel} / 平均親愛Lv.${harem.averageBondLevel.toFixed(1)}</p>
        </div>
      </div>
      <div class="meter-stack">
        ${renderMeter("主人公Lv", xpPercent, `Lv.${hero.level}`)}
        ${renderMeter("ハーレム", harem.percent, `Lv.${harem.haremLevel}`)}
        ${renderMeter("戦力", clamp(stats.combat / 3, 0, 100), formatNumber(stats.combat))}
        ${renderMeter("採取", clamp(stats.gather * 2.4, 0, 100), formatNumber(stats.gather))}
        ${renderMeter("生産", clamp(stats.craft * 2.4, 0, 100), formatNumber(stats.craft))}
      </div>
      <div class="tag-row">
        <span class="tag good">全員探索参加</span>
        <span class="tag warn">ヒロイン枠上限なし</span>
        <span class="tag">親愛合計 ${formatNumber(harem.totalAffection)}</span>
        <span class="tag">${escapeHtml(CATEGORY_LABELS[job.category])}</span>
      </div>
    `;
  }

  function renderMeter(label, value, text) {
    return `
      <div class="meter-row">
        <span>${escapeHtml(label)}</span>
        <div class="meter" aria-hidden="true"><i style="--value: ${value}%"></i></div>
        <strong>${escapeHtml(text)}</strong>
      </div>
    `;
  }

  function renderLivePortrait(member, index, size) {
    const profile = member.id === "hero" ? { id: "leader", title: "主人公" } : getCompanionProfile(member, index);
    const visual = PROFILE_VISUALS[profile.id] || PROFILE_VISUALS.healer;
    const assetId = PROFILE_VISUALS[profile.id] ? profile.id : "healer";
    const assetPath = `assets/portraits/${assetId}.png`;
    const style = [
      `--portrait-hue: ${visual.hue}`,
      `--hair: ${visual.hair}`,
      `--hair-2: ${visual.hair2}`,
      `--eye: ${visual.eye}`,
      `--outfit: ${visual.outfit}`,
      `--accent: ${visual.accent}`,
      `--portrait-bg: ${visual.bg}`,
      `--float-delay: ${index * -0.37}s`,
    ].join("; ");

    return `
      <div class="live-portrait image-portrait ${escapeAttr(size)}" style="${escapeAttr(style)}" aria-label="${escapeAttr(member.name)}のアニメ調ポートレート写真">
        <img class="portrait-image" src="${escapeAttr(assetPath)}" alt="${escapeAttr(member.name)}のポートレート" loading="lazy">
        <span class="portrait-photo-gloss" aria-hidden="true"></span>
      </div>
    `;
  }

  function renderRoster() {
    const previousList = elements.rosterPanel.querySelector(".member-list");
    const previousScrollTop = previousList ? previousList.scrollTop : 0;
    const wasNearBottom = previousList
      ? previousList.scrollTop + previousList.clientHeight >= previousList.scrollHeight - 8
      : false;
    const cost = getRecruitCost();
    const disabled = state.resources.gold < cost ? "disabled" : "";
    const harem = getHaremSummary();
    const rows = state.members
      .map((member, index) => {
        const job = JOB_BY_ID[member.jobId] || JOB_BY_ID.sword;
        const nextXp = getNextLevelXp(member.level);
        const xpPercent = clamp((member.xp / nextXp) * 100, 0, 100);
        const isHero = member.id === "hero";
        const profile = isHero ? null : getCompanionProfile(member, index);
        const bond = isHero ? null : getBondInfo(member.affection);
        const bondDisabled = (state.resources.gift || 0) < 1 ? "disabled" : "";
        const note = isHero
          ? "全員から信頼される中心人物。戦闘と親愛の両方でパーティーを伸ばす。"
          : profile.title;
        const bondArea = isHero
          ? ""
          : `
            <div class="mini-meter-row">
              <span>親愛Lv.${bond.level}</span>
              <div class="mini-meter" aria-hidden="true"><i style="--value: ${bond.percent}%"></i></div>
              <strong>${Math.floor(bond.percent)}%</strong>
            </div>
            <button type="button" class="bond-button" data-action="bond-member" data-member="${escapeAttr(member.id)}" ${bondDisabled}>交流する</button>
          `;
        return `
          <div class="member-row">
            <div class="member-profile">
              ${isHero ? "" : renderLivePortrait(member, index, "small")}
              <div class="member-profile-copy">
                <div class="member-line">
                  <span class="member-name">${escapeHtml(isHero ? `${member.name} / 主人公` : member.name)}</span>
                  <span class="member-level">Lv.${member.level} ${escapeHtml(CATEGORY_LABELS[job.category])}</span>
                </div>
                <div class="member-note">${escapeHtml(note)}</div>
              </div>
            </div>
            <div class="mini-meter-row">
              <span>経験値</span>
              <div class="mini-meter" aria-hidden="true"><i style="--value: ${xpPercent}%"></i></div>
              <strong>${Math.floor(xpPercent)}%</strong>
            </div>
            <select data-member-job="${escapeAttr(member.id)}" aria-label="${escapeAttr(member.name)}の職業">
              ${renderJobOptions(member.jobId)}
            </select>
            ${bondArea}
          </div>
        `;
      })
      .join("");

    elements.rosterPanel.innerHTML = `
      <div class="panel-title">
        <h2>ヒロイン名簿</h2>
        <small>ハーレムLv.${harem.haremLevel} / ${harem.partners.length}人</small>
      </div>
      <div class="roster-tools">
        <button type="button" data-action="recruit" ${disabled}>ヒロインを迎える</button>
        <span class="cost-note">費用 ${cost}金貨 / 交流は贈り物1個</span>
      </div>
      <div class="member-list">
        ${rows}
      </div>
    `;

    const nextList = elements.rosterPanel.querySelector(".member-list");
    if (nextList) {
      const maxScrollTop = Math.max(0, nextList.scrollHeight - nextList.clientHeight);
      nextList.scrollTop = wasNearBottom ? maxScrollTop : Math.min(previousScrollTop, maxScrollTop);
    }
  }

  function renderJobOptions(selectedJobId) {
    return Object.entries(CATEGORY_LABELS)
      .map(([category, label]) => {
        const options = JOBS.filter((job) => job.category === category)
          .map((job) => `<option value="${escapeAttr(job.id)}" ${job.id === selectedJobId ? "selected" : ""}>${escapeHtml(job.name)}</option>`)
          .join("");
        return `<optgroup label="${escapeAttr(label)}">${options}</optgroup>`;
      })
      .join("");
  }

  function renderMap() {
    const nodes = LOCATIONS.map((location) => {
      const selected = location.id === state.selectedLocation ? "selected" : "";
      const pips = Array.from({ length: 5 }, (_, index) => `<i class="danger-pip ${index < location.danger ? "on" : ""}"></i>`).join("");

      return `
        <button
          type="button"
          class="map-node ${escapeAttr(location.tone)} ${selected}"
          style="grid-column: ${location.x}; grid-row: ${location.y};"
          data-action="select-location"
          data-location="${escapeAttr(location.id)}"
        >
          <span class="node-top">
            <b>${escapeHtml(location.name)}</b>
            <span>${escapeHtml(location.tagline)}</span>
          </span>
          <span class="danger-row" aria-label="危険度${location.danger}">${pips}</span>
        </button>
      `;
    }).join("");

    elements.mapPanel.innerHTML = `
      <div class="panel-title">
        <h2>周辺マップ</h2>
        <small>場所を選んで探索へ出発</small>
      </div>
      <div class="map-grid">
        ${nodes}
      </div>
    `;
  }

  function renderLocation() {
    const location = getSelectedLocation();
    const stats = aggregateStats();
    const chance = estimateWinChance(location, stats);
    const progress = location.danger > 0 ? clamp(state.progress, 0, 100) : clamp(state.craftProgress / 140 * 100, 0, 100);
    const clears = state.clears[location.id] || 0;
    const drops = [
      ...(location.gather || []).map((entry) => RESOURCE_LABELS[entry.key]),
      ...(location.loot || []).map((entry) => RESOURCE_LABELS[entry.key]),
    ];
    const uniqueDrops = Array.from(new Set(drops)).slice(0, 7);
    const isTown = location.id === "town";
    const actionLabel = state.exploring ? "街へ戻る" : "一緒に探索";
    const actionClass = state.exploring ? "danger-action" : "primary-action";

    elements.locationPanel.innerHTML = `
      <div class="panel-title">
        <h2>探索指示</h2>
        <small>${state.exploring ? "自動進行中" : "待機中"}</small>
      </div>
      <div class="location-layout">
        <div class="location-copy">
          <h3>${escapeHtml(location.name)}</h3>
          <p>${escapeHtml(location.desc)}</p>
          <div class="tag-row">
            <span class="tag">危険度 ${location.danger}</span>
            <span class="tag">勝率目安 ${isTown ? "安全" : `${Math.round(chance * 100)}%`}</span>
            <span class="tag">クリア ${clears}回</span>
          </div>
          <div class="tag-row">
            ${uniqueDrops.map((drop) => `<span class="tag">${escapeHtml(drop)}</span>`).join("")}
          </div>
          <div class="location-actions">
            <button type="button" class="${actionClass}" data-action="toggle-explore" ${isTown ? "disabled" : ""}>${escapeHtml(actionLabel)}</button>
            <button type="button" data-action="select-location" data-location="town">拠点へ設定</button>
          </div>
        </div>
        <div class="progress-card">
          <div class="progress-top">
            <span>${isTown ? "生産進行" : "遭遇まで"}</span>
            <strong>${Math.floor(progress)}%</strong>
          </div>
          <div class="progress-bar" aria-hidden="true"><i style="--value: ${progress}%"></i></div>
          <div class="tag-row">
            <span class="tag good">全員同行 ${state.members.length}人 / 上限なし</span>
            <span class="tag">勝利で親愛上昇</span>
            <span class="tag">戦力 ${formatNumber(stats.combat)}</span>
            <span class="tag">採取 ${formatNumber(stats.gather)}</span>
            <span class="tag">生産 ${formatNumber(stats.craft)}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderStory() {
    const unlocked = getUnlockedStories();
    const current = getCurrentStory();
    const sceneIndex = clamp(state.story.sceneIndex, 0, current.scenes.length - 1);
    state.story.sceneIndex = sceneIndex;
    const completed = Boolean(state.story.completed[current.id]);
    const nextLocked = getNextLockedStory();
    const progressText = `${sceneIndex + 1} / ${current.scenes.length}`;
    const rewardText = renderRewardText(current.reward);
    const chapterButtons = unlocked
      .map((chapter) => {
        const active = chapter.id === current.id ? "active" : "";
        const done = state.story.completed[chapter.id] ? " done" : "";
        return `<button type="button" class="${active}${done}" data-action="select-story" data-story="${escapeAttr(chapter.id)}">${escapeHtml(chapter.title)}</button>`;
      })
      .join("");

    elements.storyPanel.innerHTML = `
      <div class="panel-title">
        <h2>ストーリー</h2>
        <small>解放 ${unlocked.length} / ${STORY_CHAPTERS.length}章</small>
      </div>
      <div class="story-layout">
        <div class="story-reader">
          <div class="story-kicker">${escapeHtml(progressText)} ${completed ? "/ 読了済み" : ""}</div>
          <h3>${escapeHtml(current.title)}</h3>
          <p>${escapeHtml(current.scenes[sceneIndex])}</p>
          <div class="story-reward">読了報酬: ${rewardText}</div>
          <div class="story-actions">
            <button type="button" data-action="story-prev" ${sceneIndex <= 0 ? "disabled" : ""}>前へ</button>
            <button type="button" class="primary-action" data-action="story-next" ${sceneIndex >= current.scenes.length - 1 ? "disabled" : ""}>次へ</button>
          </div>
        </div>
        <div class="story-list">
          ${chapterButtons}
          ${nextLocked ? `<div class="story-hint">次の章: ${escapeHtml(nextLocked.title)}<br>${escapeHtml(getStoryHint(nextLocked.id))}</div>` : '<div class="story-hint">現在の章はすべて解放済みです。次の地方を実装できます。</div>'}
        </div>
      </div>
    `;
  }

  function renderRewardText(reward) {
    return Object.entries(reward || {})
      .map(([key, amount]) => `${RESOURCE_LABELS[key] || key}+${amount}`)
      .join("、");
  }

  function getStoryHint(storyId) {
    const hints = {
      field_oath: "ひなたの草原を2回クリア",
      workshop: "装備強化1個、またはポーション4個",
      forest_whisper: "ささやきの森を3回クリア",
      tower_signal: "北の見張り塔を1回クリア",
      harem_bloom: "ハーレムLv.3",
      cave_truth: "灯なしの洞窟を2回クリア",
      future: "ヒロイン8人以上、主人公Lv.5",
    };
    return hints[storyId] || "探索と交流を進める";
  }

  function renderJobs() {
    const currentHeroJob = state.members[0].jobId;
    const tabs = Object.entries(CATEGORY_LABELS)
      .map(([category, label]) => {
        const active = selectedCategory === category ? "active" : "";
        return `<button type="button" class="${active}" data-action="set-category" data-category="${escapeAttr(category)}">${escapeHtml(label)}</button>`;
      })
      .join("");

    const cards = JOBS.filter((job) => job.category === selectedCategory)
      .map((job) => {
        const active = job.id === currentHeroJob ? "active" : "";
        const chips = Object.entries(job.stats)
          .map(([key, value]) => `<span class="stat-chip">${escapeHtml(STAT_LABELS[key] || key)} +${formatNumber(value)}</span>`)
          .join("");
        return `
          <article class="job-card ${active}">
            <h3>${escapeHtml(job.name)}</h3>
            <p>${escapeHtml(job.desc)}</p>
            <div class="stat-chip-row">${chips}</div>
            <button type="button" data-action="assign-hero-job" data-job="${escapeAttr(job.id)}" ${active ? "disabled" : ""}>
              ${active ? "主人公の職業" : "主人公に設定"}
            </button>
          </article>
        `;
      })
      .join("");

    elements.jobsPanel.innerHTML = `
      <div class="panel-title">
        <h2>職業</h2>
        <small>${JOBS.length}職 / 戦闘・生産・採取</small>
      </div>
      <div class="job-tabs">${tabs}</div>
      <div class="jobs-grid">${cards}</div>
    `;
  }

  function renderResources() {
    const chips = RESOURCE_META.map(([key, label]) => {
      return `
        <div class="resource-chip">
          <span>${escapeHtml(label)}</span>
          <b>${formatNumber(state.resources[key] || 0)}</b>
        </div>
      `;
    }).join("");

    elements.resourcesPanel.innerHTML = `
      <div class="panel-title">
        <h2>倉庫</h2>
        <small>戦利品と素材</small>
      </div>
      <div class="resource-grid">${chips}</div>
    `;
  }

  function renderAccount() {
    const user = normalizeFirebaseUser(firebaseUser || state.firebaseUser);
    state.firebaseUser = user;
    const originSupported = isFirebaseOriginSupported();
    const configStatus = firebaseConfig ? "設定済み" : "未設定";
    const userStatus = user ? "ログイン中" : configStatus;
    const lastCloudSave = state.cloudSavedAt
      ? new Date(state.cloudSavedAt).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      : "未保存";
    const authDisabled = !originSupported ? "disabled" : "";
    const cloudDisabled = !firebaseConfig || !user ? "disabled" : "";
    const bundledConfig = hasBundledFirebaseConfig();
    const setupSummary = firebaseConfig ? `管理者用 Firebase設定 / ${firebaseConfig.projectId}` : "管理者用 Firebase設定";
    const needsSetup = !firebaseConfig;

    const originWarning = originSupported
      ? ""
      : `<p class="account-warning">Firebase連携は file:// では動きません。今のページを http://127.0.0.1:4175/ か https で開いてください。</p>`;

    const configActions = firebaseConfig
      ? `
        <div class="firebase-config-summary">
          <span>Project ID</span>
          <strong>${escapeHtml(firebaseConfig.projectId)}</strong>
        </div>
        <div class="account-actions">
          <button type="button" data-action="clear-firebase-config">設定削除</button>
          <button type="button" data-action="save-firebase-config">設定更新</button>
        </div>
      `
      : '<button type="button" data-action="save-firebase-config">Firebase設定を保存</button>';

    const setupPanel = bundledConfig
      ? ""
      : `
        <details class="firebase-setup">
          <summary>${escapeHtml(setupSummary)}</summary>
          <p class="account-note setup-note">ここは公開前に開発者だけが設定します。プレイヤーは入力不要です。</p>
          <div class="firebase-config">
            <div class="firebase-grid">
              ${renderFirebaseConfigInput("firebaseApiKey", "apiKey", firebaseConfig?.apiKey || "")}
              ${renderFirebaseConfigInput("firebaseAuthDomain", "authDomain", firebaseConfig?.authDomain || "")}
              ${renderFirebaseConfigInput("firebaseProjectId", "projectId", firebaseConfig?.projectId || "")}
              ${renderFirebaseConfigInput("firebaseAppId", "appId", firebaseConfig?.appId || "")}
              ${renderFirebaseConfigInput("firebaseStorageBucket", "storageBucket", firebaseConfig?.storageBucket || "")}
              ${renderFirebaseConfigInput("firebaseMessagingSenderId", "messagingSenderId", firebaseConfig?.messagingSenderId || "")}
            </div>
            ${configActions}
          </div>
        </details>
      `;

    const userBody = user
      ? `
        <div class="account-profile">
          ${user.picture ? `<img src="${escapeAttr(user.picture)}" alt="" referrerpolicy="no-referrer">` : '<span class="account-avatar">F</span>'}
          <div>
            <strong>${escapeHtml(user.name)}</strong>
            <span>${escapeHtml(user.email || "メール未取得")}</span>
            <small>クラウド保存 ${escapeHtml(lastCloudSave)}</small>
          </div>
        </div>
        <div class="account-actions">
          <button type="button" data-action="firebase-cloud-save" ${cloudDisabled}>クラウド保存</button>
          <button type="button" data-action="firebase-cloud-load" ${cloudDisabled}>クラウド読込</button>
        </div>
        <div class="account-actions">
          <button type="button" data-action="firebase-use-name">主人公名へ反映</button>
          <button type="button" data-action="firebase-logout">ログアウト</button>
        </div>
      `
      : `
        <div class="account-actions single">
          <button type="button" class="firebase-login-button" data-action="firebase-login" ${authDisabled}>Googleで連携</button>
        </div>
        <p class="account-note">${firebaseConfig ? "このボタンを押すとGoogleのアカウント選択画面が開きます。" : "Google連携はまだ準備中です。公開前に管理者がFirebase設定を入れると使えるようになります。"}</p>
      `;

    elements.accountPanel.innerHTML = `
      <div class="panel-title">
        <h2>Firebase連携</h2>
        <small>${escapeHtml(userStatus)}</small>
      </div>
      ${originWarning}
      ${userBody}
      ${setupPanel}
      <p class="account-note">${needsSetup ? "公開後のプレイヤーには、この設定欄を見せずにGoogle連携ボタンだけ出す想定です。" : "スマホではGoogleログインをリダイレクト方式で開きます。"}</p>
      ${firebaseStatus ? `<p class="account-note">${escapeHtml(firebaseStatus)}</p>` : ""}
      ${firebaseError ? `<p class="account-warning">${escapeHtml(firebaseError)}</p>` : ""}
    `;
  }

  function renderFirebaseConfigInput(id, label, value) {
    return `
      <label>
        <span>${escapeHtml(label)}</span>
        <input id="${escapeAttr(id)}" value="${escapeAttr(value)}" autocomplete="off" spellcheck="false">
      </label>
    `;
  }

  function registerServiceWorker() {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator) || !isFirebaseOriginSupported()) {
      return;
    }

    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  }

  async function initializeFirebaseFromStorage() {
    if (!firebaseConfig || firebaseInitPromise) {
      return firebaseInitPromise;
    }

    firebaseInitPromise = (async () => {
      try {
        firebaseStatus = "Firebaseを初期化中...";
        firebaseError = "";
        renderAccount();

        const modules = await loadFirebaseModules();
        const appName = `starlight-rpg-${firebaseConfig.projectId}`;
        const existingApp = modules.getApps().find((app) => app.name === appName);
        const app = existingApp || modules.initializeApp(firebaseConfig, appName);
        const auth = modules.getAuth(app);
        const db = modules.getFirestore(app);
        const provider = new modules.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        firebaseServices = { app, auth, db, provider, modules };
        modules.onAuthStateChanged(auth, (user) => {
          firebaseUser = normalizeFirebaseUser(user);
          state.firebaseUser = firebaseUser;
          if (firebaseUser) {
            firebaseStatus = `${firebaseUser.name} でログイン中`;
          }
          saveState(false);
          renderAccount();
        });

        try {
          const redirectResult = await modules.getRedirectResult(auth);
          if (redirectResult?.user) {
            firebaseUser = normalizeFirebaseUser(redirectResult.user);
            state.firebaseUser = firebaseUser;
            addLog(`${firebaseUser.name} でFirebaseログインしました。`, "loot");
            saveState(false);
          }
        } catch (error) {
          console.warn("Firebase redirect result failed", error);
        }

        firebaseStatus = "Firebase準備完了";
        firebaseError = "";
        renderAccount();
      } catch (error) {
        firebaseServices = null;
        firebaseStatus = "";
        firebaseError = "Firebase初期化に失敗しました。設定と通信状態を確認してください。";
        console.warn("Firebase initialization failed", error);
        renderAccount();
      }
    })();

    return firebaseInitPromise;
  }

  async function loadFirebaseModules() {
    const baseUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import(`${baseUrl}/firebase-app.js`),
      import(`${baseUrl}/firebase-auth.js`),
      import(`${baseUrl}/firebase-firestore.js`),
    ]);

    return {
      initializeApp: appModule.initializeApp,
      getApps: appModule.getApps,
      getAuth: authModule.getAuth,
      GoogleAuthProvider: authModule.GoogleAuthProvider,
      signInWithPopup: authModule.signInWithPopup,
      signInWithRedirect: authModule.signInWithRedirect,
      getRedirectResult: authModule.getRedirectResult,
      onAuthStateChanged: authModule.onAuthStateChanged,
      signOut: authModule.signOut,
      getFirestore: firestoreModule.getFirestore,
      doc: firestoreModule.doc,
      getDoc: firestoreModule.getDoc,
      setDoc: firestoreModule.setDoc,
      serverTimestamp: firestoreModule.serverTimestamp,
    };
  }

  function getFirebaseConfigFromInputs() {
    return sanitizeFirebaseConfig({
      apiKey: document.getElementById("firebaseApiKey")?.value,
      authDomain: document.getElementById("firebaseAuthDomain")?.value,
      projectId: document.getElementById("firebaseProjectId")?.value,
      appId: document.getElementById("firebaseAppId")?.value,
      storageBucket: document.getElementById("firebaseStorageBucket")?.value,
      messagingSenderId: document.getElementById("firebaseMessagingSenderId")?.value,
    });
  }

  function saveFirebaseConfigFromInputs() {
    const nextConfig = getFirebaseConfigFromInputs();
    if (!nextConfig) {
      firebaseError = "apiKey、authDomain、projectId、appId は必須です。FirebaseのWebアプリ設定を入力してください。";
      renderAccount();
      return;
    }

    firebaseConfig = nextConfig;
    firebaseServices = null;
    firebaseInitPromise = null;
    firebaseError = "";
    firebaseStatus = "Firebase設定を保存しました。";
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(firebaseConfig));
    addLog("Firebase設定を保存しました。", "loot");
    renderAccount();
    initializeFirebaseFromStorage();
  }

  function clearFirebaseConfig() {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
    firebaseConfig = null;
    firebaseServices = null;
    firebaseInitPromise = null;
    firebaseUser = null;
    state.firebaseUser = null;
    firebaseStatus = "";
    firebaseError = "";
    saveState(false);
    renderAccount();
  }

  async function signInWithFirebase() {
    if (!firebaseConfig) {
      firebaseError = "Google連携はまだ準備中です。公開前に管理者がFirebase設定を入れると、このボタンからアカウント選択が開きます。";
      renderAccount();
      return;
    }

    await initializeFirebaseFromStorage();
    if (!firebaseServices) {
      return;
    }

    try {
      firebaseError = "";
      firebaseStatus = "Googleログインを開始します...";
      renderAccount();

      if (shouldUseRedirectAuth()) {
        await firebaseServices.modules.signInWithRedirect(firebaseServices.auth, firebaseServices.provider);
        return;
      }

      const result = await firebaseServices.modules.signInWithPopup(firebaseServices.auth, firebaseServices.provider);
      firebaseUser = normalizeFirebaseUser(result.user);
      state.firebaseUser = firebaseUser;
      addLog(`${firebaseUser.name} でFirebaseログインしました。`, "loot");
      saveState(false);
      renderAll();
    } catch (error) {
      if (error?.code === "auth/popup-blocked" || error?.code === "auth/popup-closed-by-user") {
        await firebaseServices.modules.signInWithRedirect(firebaseServices.auth, firebaseServices.provider);
        return;
      }

      firebaseStatus = "";
      firebaseError = "Firebaseログインに失敗しました。Firebase AuthenticationでGoogleログインが有効か確認してください。";
      console.warn("Firebase sign-in failed", error);
      renderAccount();
    }
  }

  async function signOutFromFirebase() {
    await initializeFirebaseFromStorage();
    if (firebaseServices) {
      await firebaseServices.modules.signOut(firebaseServices.auth).catch((error) => console.warn("Firebase sign-out failed", error));
    }

    firebaseUser = null;
    state.firebaseUser = null;
    firebaseStatus = "ログアウトしました。";
    addLog("Firebaseからログアウトしました。", "warn");
    saveState(false);
    renderAll();
  }

  async function saveToFirebaseCloud() {
    await initializeFirebaseFromStorage();
    const user = normalizeFirebaseUser(firebaseUser || state.firebaseUser);
    if (!firebaseServices || !user) {
      firebaseError = "Firebaseログイン後にクラウド保存できます。";
      renderAccount();
      return;
    }

    try {
      state.cloudSavedAt = Date.now();
      state.firebaseUser = user;
      await firebaseServices.modules.setDoc(getCloudSaveRef(user.uid), {
        state: getCloudStateSnapshot(),
        clientUpdatedAt: state.cloudSavedAt,
        updatedAt: firebaseServices.modules.serverTimestamp(),
      });
      saveState(false);
      firebaseStatus = "クラウドへ保存しました。";
      firebaseError = "";
      addLog("Firebaseクラウドへ保存しました。", "loot");
      renderAll();
    } catch (error) {
      firebaseError = "クラウド保存に失敗しました。Firestoreの有効化とルールを確認してください。";
      console.warn("Firebase cloud save failed", error);
      renderAccount();
    }
  }

  async function loadFromFirebaseCloud() {
    await initializeFirebaseFromStorage();
    const user = normalizeFirebaseUser(firebaseUser || state.firebaseUser);
    if (!firebaseServices || !user) {
      firebaseError = "Firebaseログイン後にクラウド読込できます。";
      renderAccount();
      return;
    }

    try {
      const snap = await firebaseServices.modules.getDoc(getCloudSaveRef(user.uid));
      if (!snap.exists()) {
        firebaseStatus = "";
        firebaseError = "クラウドセーブがまだありません。先にクラウド保存してください。";
        renderAccount();
        return;
      }

      const data = snap.data();
      const loadedState = data?.state;
      if (!loadedState || typeof loadedState !== "object") {
        throw new Error("Cloud state is invalid");
      }

      const nextState = {
        ...loadedState,
        firebaseUser: user,
        cloudSavedAt: Math.max(Number(data.clientUpdatedAt) || 0, Number(loadedState.cloudSavedAt) || 0),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      state = loadState();
      firebaseUser = user;
      state.firebaseUser = user;
      firebaseStatus = "クラウドセーブを読み込みました。";
      firebaseError = "";
      addLog("Firebaseクラウドから読み込みました。", "loot");
      saveState(false);
      renderAll();
    } catch (error) {
      firebaseError = "クラウド読込に失敗しました。";
      console.warn("Firebase cloud load failed", error);
      renderAccount();
    }
  }

  function getCloudSaveRef(uid) {
    return firebaseServices.modules.doc(firebaseServices.db, "users", uid, "saves", "main");
  }

  function getCloudStateSnapshot() {
    return JSON.parse(JSON.stringify(state));
  }

  function applyFirebaseNameToHero() {
    const user = normalizeFirebaseUser(firebaseUser || state.firebaseUser);
    if (!user) {
      return;
    }

    const name = user.name.slice(0, 18) || "主人公";
    state.heroName = name;
    state.members[0].name = name;
    addLog(`主人公名を ${name} に変更しました。`, "loot");
    saveState(false);
    renderAll();
  }

  function isFirebaseOriginSupported() {
    const protocol = window.location?.protocol || "";
    return protocol !== "file:";
  }

  function shouldUseRedirectAuth() {
    const narrow = typeof window.matchMedia === "function" && window.matchMedia("(max-width: 760px)").matches;
    const mobileAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    return narrow || mobileAgent;
  }

  function renderLogs() {
    const entries = state.logs
      .slice(0, 16)
      .map((entry) => {
        const time = new Date(entry.time).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return `<div class="log-entry ${escapeAttr(entry.type)}">[${time}] ${escapeHtml(entry.text)}</div>`;
      })
      .join("");

    elements.logPanel.innerHTML = `
      <div class="panel-title">
        <h2>ログ</h2>
        <small>最新16件</small>
      </div>
      <div class="log-list">
        ${entries || '<div class="empty-log">まだ記録がありません。</div>'}
      </div>
    `;
  }

  function rollWeighted(entries) {
    const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * total;

    for (const entry of entries) {
      roll -= entry.weight;
      if (roll <= 0) {
        return entry;
      }
    }

    return entries[entries.length - 1];
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatNumber(value) {
    return Math.floor(Number(value) || 0).toLocaleString("ja-JP");
  }

  function isFocusedWithin(id) {
    const element = elements[id];
    return Boolean(element && element.contains(document.activeElement));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return map[character];
    });
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
