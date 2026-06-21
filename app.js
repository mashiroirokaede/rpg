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
    ["starseed", "星核"],
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
      id: "mina_private",
      title: "ミナ個別編 癒やし手の願い",
      condition: () => getProfileBondLevel("healer") >= 2,
      reward: { potion: 3, gift: 1 },
      scenes: [
        "夜更けの診療所で、ミナは使い終えた包帯を畳んでいた。眠ればいいのに、彼女は誰かが痛がる声を聞き逃せない。",
        "主人公が手伝いを申し出ると、ミナは少しだけ肩の力を抜く。『私、守る側でいたいんです。でも本当は、守られるのも少し怖くないって知りました』",
        "二人で灯りを消すころ、ミナは小さく笑った。『明日も無茶をするなら、必ず私を呼んでくださいね』",
      ],
    },
    {
      id: "sena_private",
      title: "セナ個別編 矢羽根の約束",
      condition: () => getProfileBondLevel("ranger") >= 2,
      reward: { hide: 4, gift: 1 },
      scenes: [
        "訓練場の端で、セナは同じ的を何度も射抜いていた。狙いは正確なのに、表情だけが少し曇っている。",
        "主人公が理由を聞くと、セナは弓を下ろした。『外したくないの。あなたの背中を預かるなら、私の一射で迷いたくない』",
        "新しい矢羽根を結び直し、セナは照れたように前を向く。『だから、ちゃんと見てて。私、もっと頼れる女になるから』",
      ],
    },
    {
      id: "rio_private",
      title: "リオ個別編 工房に響く名前",
      condition: () => getProfileBondLevel("smith") >= 2,
      reward: { gear: 1, ore: 4 },
      scenes: [
        "朝の工房に、槌の音が軽やかに響く。リオは主人公の剣を磨きながら、傷の一つ一つを確かめていた。",
        "『この傷は、誰かをかばった時のものだね』リオは笑う。『武器ってさ、持ち主の優しさまで覚えるんだよ』",
        "仕上がった剣を渡す時、彼女は少しだけ真面目な顔になる。『次は武器だけじゃなくて、あなた自身も手入れさせて』",
      ],
    },
    {
      id: "yui_private",
      title: "ユイ個別編 影がほどける夜",
      condition: () => getProfileBondLevel("shinobi") >= 2,
      reward: { fiber: 4, charm: 1 },
      scenes: [
        "月のない夜、ユイは屋根の上で街を見張っていた。気配を消すのは得意なのに、今日は主人公を待っていたように見える。",
        "『命令なら、どこへでも行く』彼女は静かに言った。『でも、あなたが帰る場所に私もいていいなら……それは命令じゃなくていい』",
        "風が二人の間を抜ける。ユイは初めて、小さく手を差し出した。影ではなく、仲間として隣に立つために。",
      ],
    },
    {
      id: "festival_date",
      title: "幕間 小さな星祭り",
      condition: () => getHaremSummary().haremLevel >= 4 && (state.daily.totalClaims || 0) >= 3,
      reward: { gift: 3, gold: 60 },
      scenes: [
        "三日続けて街に顔を出した主人公のために、ヒロインたちは小さな星祭りを開いた。",
        "屋台の灯り、焼き菓子の匂い、遠くで鳴る楽器。誰かと目が合うたびに、主人公の袖が少しずつ引かれる。",
        "最後に全員で星灯りを見上げる。ここはもう、ただの拠点ではない。帰れば誰かが笑ってくれる場所だった。",
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

  STORY_CHAPTERS.push(
    {
      id: "mina_vow",
      title: "ミナ親愛編 星灯りの看護記録",
      condition: () => getProfileBondLevel("healer") >= 3,
      reward: { potion: 5, charm: 1, gift: 1 },
      scenes: [
        "夜更けの診療所で、ミナは古い看護記録を読み返していた。そこには、かつて星灯りの街を守った癒し手たちの名前が並んでいる。",
        "主人公が隣に座ると、ミナは小さく笑った。『私はまだ弱いです。でも、あなたが無茶をするなら、何度でも立たせます』",
        "翌朝、彼女は仲間全員の薬袋を縫い直した。祈りではなく、手を動かして守る。それがミナの新しい誓いだった。",
      ],
    },
    {
      id: "sena_moon_route",
      title: "セナ親愛編 月下の道案内",
      condition: () => getProfileBondLevel("ranger") >= 3,
      reward: { hide: 8, fiber: 6, gift: 1 },
      scenes: [
        "月明かりの草原で、セナは誰より先に足跡の向きを読んだ。彼女の指先は、風の流れまで地図にしていく。",
        "『迷った時は、私の声だけ聞いて』セナは振り返らずに言う。照れ隠しのように早足になった背中が、少しだけ頼もしい。",
        "帰り道、彼女は主人公の袖をつまんだ。『次は、危ない道じゃなくて……二人だけの道も、案内してあげる』",
      ],
    },
    {
      id: "rio_masterwork",
      title: "リオ親愛編 仕上げの一打",
      condition: () => getProfileBondLevel("smith") >= 3 && (state.inventory || []).some((item) => (item.level || 0) >= 5),
      reward: { ore: 12, gear: 3, relic: 1 },
      scenes: [
        "鍛冶場に火が入り、リオは強化済みの装備をじっと見つめていた。『ここから先は、ただ硬くするだけじゃ駄目なんだ』",
        "彼女は主人公の手を炉の前へ導く。熱、音、震え。その全部を一緒に感じながら、最後の一打を打ち込んだ。",
        "火花が星のように散る。リオは煤で汚れた頬をぬぐい、満足げに笑った。『次は進化だね。あんたの装備、まだ化けるよ』",
      ],
    },
    {
      id: "yui_shadow_oath",
      title: "ユイ親愛編 影が選ぶ居場所",
      condition: () => getProfileBondLevel("shinobi") >= 3,
      reward: { fiber: 8, charm: 1, relic: 1 },
      scenes: [
        "雨音の夜、ユイは屋根の上で街を見張っていた。敵の気配はない。それでも彼女は、主人公が眠る窓の灯りから目を離さない。",
        "『守る場所ができると、影は弱くなると思ってた』ユイはぽつりとこぼす。『でも違った。帰る場所があるから、私は速く動ける』",
        "翌日、彼女は仲間たちの巡回路を書き換えた。無口な影は、いつの間にか開拓団の心臓を守る刃になっていた。",
      ],
    },
    {
      id: "heroine_council",
      title: "ヒロイン合同編 星灯り作戦会議",
      condition: () => ["healer", "ranger", "smith", "shinobi"].filter((profileId) => getProfileBondLevel(profileId) >= 3).length >= 3,
      reward: { gold: 500, gift: 4, charm: 2 },
      scenes: [
        "拠点の大机に地図と装備と菓子が並ぶ。ミナは補給を、セナは道順を、リオは装備を、ユイは警戒網を確認していく。",
        "議題はボス攻略のはずなのに、いつの間にか主人公の休憩時間まで決められていた。反論の余地はない。四人とも本気だ。",
        "作戦会議の最後、彼女たちは同じ結論にたどり着く。強くなる理由は街のためだけじゃない。大切な人と帰るためだ。",
      ],
    },
  );

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
      id: "tamer",
      name: "テイマー",
      category: "combat",
      desc: "遭遇した魔物を使い魔にする可能性を持つ調教師。",
      stats: { atk: 4, scout: 5, luck: 5, supply: 3 },
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

  const CRAFT_STATIONS = {
    lodging: "宿",
    workbench: "製作台",
    forge: "鍛冶場",
    alchemy: "錬金台",
    kitchen: "調理場",
    jewel: "細工台",
    enchant: "付与台",
  };

  const FACILITY_UPGRADES = [
    { id: "lodging", name: "宿泊設備", desc: "休息効率を上げ、転生後の立て直しを楽にする。", maxLevel: 5, stats: { supply: 2, heal: 1 } },
    { id: "workbench", name: "製作台", desc: "基礎クラフトと道具製作を強化する。", maxLevel: 5, stats: { craft: 3, supply: 1 } },
    { id: "forge", name: "鍛冶場", desc: "武器防具の強化と戦闘力を伸ばす。", maxLevel: 5, stats: { craft: 2, atk: 2, def: 1 } },
    { id: "alchemy", name: "錬金台", desc: "回復とポーション運用を底上げする。", maxLevel: 5, stats: { heal: 3, luck: 1 } },
    { id: "kitchen", name: "調理場", desc: "補給と採取の継続力を伸ばす。", maxLevel: 5, stats: { supply: 3, gather: 1 } },
    { id: "jewel", name: "細工台", desc: "護符、アクセ、幸運系の効果を高める。", maxLevel: 5, stats: { luck: 3, mag: 1 } },
    { id: "enchant", name: "付与台", desc: "高位装備とボス攻略向けの魔力を引き出す。", maxLevel: 5, stats: { mag: 3, boss: 0.01 } },
  ];

  const FACILITY_UPGRADE_BY_ID = Object.fromEntries(FACILITY_UPGRADES.map((facility) => [facility.id, facility]));

  const RARITIES = [
    { id: "common", name: "コモン", rank: 1, color: "#baad99", multiplier: 1 },
    { id: "uncommon", name: "アンコモン", rank: 2, color: "#69b77a", multiplier: 1.25 },
    { id: "rare", name: "レア", rank: 3, color: "#67a9c9", multiplier: 1.55 },
    { id: "epic", name: "エピック", rank: 4, color: "#a68ad4", multiplier: 1.95 },
    { id: "legendary", name: "レジェンド", rank: 5, color: "#d7a74d", multiplier: 2.45 },
    { id: "mythic", name: "神話", rank: 6, color: "#d98aa6", multiplier: 3.1 },
  ];

  const RARITY_BY_ID = Object.fromEntries(RARITIES.map((rarity) => [rarity.id, rarity]));

  const EQUIPMENT_SLOTS = [
    { id: "weapon", label: "武器" },
    { id: "armor", label: "防具" },
    { id: "tool", label: "道具" },
    { id: "accessory", label: "アクセ" },
  ];

  const EQUIPMENT_SLOT_BY_ID = Object.fromEntries(EQUIPMENT_SLOTS.map((slot) => [slot.id, slot]));
  const EQUIPMENT_BASE_MAX_LEVEL = 5;
  const EQUIPMENT_LEVELS_PER_BREAK = 5;
  const EQUIPMENT_MAX_BREAK = 3;
  const EQUIPMENT_EVOLUTION_BONUS = 1.28;

  const BASE_PROPERTIES = [
    {
      id: "inn",
      name: "宿屋の一室",
      cost: {},
      desc: "今の滞在先。休めるだけで、本格的な製作設備はまだありません。",
      facilities: ["lodging"],
    },
    {
      id: "rented_room",
      name: "小さな借家",
      cost: { gold: 300, wood: 12 },
      desc: "仲間と暮らせる最初の拠点。製作台と調理場を置けます。",
      facilities: ["lodging", "workbench", "kitchen"],
    },
    {
      id: "workshop",
      name: "工房付き拠点",
      cost: { gold: 900, wood: 24, stone: 10 },
      desc: "錬金台と細工台を追加できる、生産職向けの拠点です。",
      facilities: ["lodging", "workbench", "kitchen", "alchemy", "jewel"],
    },
    {
      id: "forge_house",
      name: "鍛冶場付き屋敷",
      cost: { gold: 1800, ore: 18, stone: 24 },
      desc: "武器や防具を本格的に打てる鍛冶場を備えた屋敷です。",
      facilities: ["lodging", "workbench", "kitchen", "alchemy", "jewel", "forge"],
    },
    {
      id: "starlight_mansion",
      name: "星灯りの邸宅",
      cost: { gold: 3600, relic: 8, charm: 2 },
      desc: "希少素材を扱える付与台までそろった最上位の拠点です。",
      facilities: ["lodging", "workbench", "kitchen", "alchemy", "jewel", "forge", "enchant"],
    },
  ];

  const BASE_BY_ID = Object.fromEntries(BASE_PROPERTIES.map((base) => [base.id, base]));

  const MANUAL_CRAFT_RECIPES = [
    {
      id: "traveler_sword",
      name: "旅人の直剣",
      station: "workbench",
      rarity: "common",
      need: { wood: 3, ore: 2, hide: 1 },
      resultType: "equipment",
      slot: "weapon",
      stats: { atk: 4, speed: 1 },
    },
    {
      id: "gatherer_tools",
      name: "採取職の道具箱",
      station: "workbench",
      rarity: "uncommon",
      need: { wood: 8, fiber: 4, stone: 3 },
      resultType: "equipment",
      slot: "tool",
      stats: { gather: 5, supply: 2 },
    },
    {
      id: "starsteel_blade",
      name: "星鋼の片手剣",
      station: "forge",
      rarity: "rare",
      need: { ore: 14, stone: 6, gear: 1 },
      resultType: "equipment",
      slot: "weapon",
      stats: { atk: 9, speed: 2 },
    },
    {
      id: "guardian_armor",
      name: "守護者の胸鎧",
      station: "forge",
      rarity: "epic",
      need: { ore: 22, hide: 8, gear: 2 },
      resultType: "equipment",
      slot: "armor",
      stats: { def: 11, supply: 3 },
    },
    {
      id: "alchemist_flask",
      name: "月露の錬金フラスコ",
      station: "alchemy",
      rarity: "rare",
      need: { herb: 16, fiber: 5, relic: 1 },
      resultType: "equipment",
      slot: "tool",
      stats: { craft: 7, heal: 3, luck: 2 },
    },
    {
      id: "starlight_ring",
      name: "星灯りの指輪",
      station: "jewel",
      rarity: "legendary",
      need: { relic: 5, charm: 2, gold: 500 },
      resultType: "equipment",
      slot: "accessory",
      stats: { mag: 8, luck: 8, heal: 4 },
    },
    {
      id: "covenant_charm",
      name: "絆誓約の護符",
      station: "enchant",
      rarity: "mythic",
      need: { relic: 12, charm: 6, gift: 10, gold: 1200 },
      resultType: "equipment",
      slot: "accessory",
      stats: { atk: 7, def: 7, mag: 7, luck: 12 },
    },
  ];

  const AUTO_RECIPE_DEFAULTS = {
    gear: { id: "auto_gear", name: "装備強化", station: "forge", rarity: "uncommon", auto: true },
    potion: { id: "auto_potion", name: "ポーション調合", station: "alchemy", rarity: "common", auto: true },
    food: { id: "auto_food", name: "携行食調理", station: "kitchen", rarity: "common", auto: true },
    gift: { id: "auto_gift", name: "贈り物作成", station: "workbench", rarity: "uncommon", auto: true },
    charm: { id: "auto_charm", name: "護符細工", station: "jewel", rarity: "rare", auto: true },
  };

  for (const recipe of CRAFT_RECIPES) {
    Object.assign(recipe, AUTO_RECIPE_DEFAULTS[recipe.key] || {
      id: `auto_${recipe.key}`,
      name: RESOURCE_LABELS[recipe.key] || recipe.key,
      station: "workbench",
      rarity: "common",
      auto: true,
    });
  }

  CRAFT_RECIPES.push(...MANUAL_CRAFT_RECIPES);

  const EQUIPMENT_SETS = [
    {
      id: "pioneer",
      name: "開拓者セット",
      desc: "旅人の直剣と採取職の道具箱で、探索と採取が安定する。",
      pieces: ["traveler_sword", "gatherer_tools"],
      bonuses: [
        { count: 2, stats: { gather: 6, scout: 3, supply: 2 }, text: "2点: 採取+6 / 探索+3 / 補給+2" },
      ],
    },
    {
      id: "starsteel",
      name: "星鋼セット",
      desc: "星鋼の片手剣と守護者の胸鎧で、ボス戦向けの突破力を得る。",
      pieces: ["starsteel_blade", "guardian_armor"],
      bonuses: [
        { count: 2, stats: { atk: 10, def: 10, boss: 0.05 }, text: "2点: 攻撃+10 / 防御+10 / ボス勝率+5%" },
      ],
    },
    {
      id: "starlight",
      name: "星灯りセット",
      desc: "錬金・指輪・誓約護符をそろえ、魔力と親愛の力を引き出す。",
      pieces: ["alchemist_flask", "starlight_ring", "covenant_charm"],
      bonuses: [
        { count: 2, stats: { mag: 8, heal: 6, luck: 5 }, text: "2点: 魔力+8 / 回復+6 / 幸運+5" },
        { count: 3, stats: { atk: 8, def: 8, mag: 8, boss: 0.07 }, text: "3点: 全戦闘力+ / ボス勝率+7%" },
      ],
    },
  ];

  const ABILITIES = [
    {
      id: "hero_combat",
      name: "主人公: 前衛指揮",
      desc: "主人公が戦闘職の時、全員の攻撃テンポが上がる。",
      condition: () => getHeroJobCategory() === "combat",
      stats: { atk: 6, speed: 2 },
      hint: "主人公を戦闘職にする",
    },
    {
      id: "hero_craft",
      name: "主人公: 工房采配",
      desc: "主人公が生産職の時、工房作業と補給が伸びる。",
      condition: () => getHeroJobCategory() === "craft",
      stats: { craft: 7, supply: 2 },
      hint: "主人公を生産職にする",
    },
    {
      id: "hero_gather",
      name: "主人公: 踏破計画",
      desc: "主人公が採取職の時、採取と索敵が伸びる。",
      condition: () => getHeroJobCategory() === "gather",
      stats: { gather: 7, scout: 3 },
      hint: "主人公を採取職にする",
    },
    {
      id: "mina_prayer",
      name: "ミナ: 白灯の祈り",
      desc: "親愛が深まったミナが、探索中の回復と補給を支える。",
      condition: () => getProfileBondLevel("healer") >= 2,
      stats: { heal: 8, supply: 2 },
      hint: "ミナの親愛Lv.2",
    },
    {
      id: "sena_route",
      name: "セナ: 風読みの案内",
      desc: "セナが先導し、探索速度と索敵力が上がる。",
      condition: () => getProfileBondLevel("ranger") >= 2,
      stats: { scout: 7, speed: 4 },
      hint: "セナの親愛Lv.2",
    },
    {
      id: "rio_temper",
      name: "リオ: 面倒見の焼き入れ",
      desc: "リオが装備の扱いを見直し、攻撃と生産が伸びる。",
      condition: () => getProfileBondLevel("smith") >= 2,
      stats: { craft: 8, atk: 4 },
      hint: "リオの親愛Lv.2",
    },
    {
      id: "yui_shadow",
      name: "ユイ: 影守り",
      desc: "ユイが危険を先に潰し、幸運と速度が上がる。",
      condition: () => getProfileBondLevel("shinobi") >= 2,
      stats: { speed: 5, luck: 4 },
      hint: "ユイの親愛Lv.2",
    },
    {
      id: "evolved_equipment",
      name: "進化装備: 星の再鍛",
      desc: "進化済み装備を持つことで、開拓団全体が強化される。",
      condition: () => (state.inventory || []).some((item) => (item.evolution || 0) > 0),
      stats: { atk: 4, def: 4, craft: 4, luck: 2 },
      hint: "装備を1回進化させる",
    },
    {
      id: "harem_command",
      name: "ハーレム連携: 帰る場所",
      desc: "ハーレムLvが上がり、全員の連携が戦力になる。",
      condition: () => (state.haremLevel || 1) >= 3,
      stats: { atk: 4, def: 4, heal: 4, supply: 4 },
      hint: "ハーレムLv.3",
    },
  ];

  const SKILL_TREE_NODES = [
    {
      id: "battle_instinct",
      name: "戦闘勘",
      branch: "戦闘",
      desc: "通常戦闘の火力を伸ばす。",
      cost: { points: 1 },
      stats: { atk: 5, speed: 1 },
    },
    {
      id: "guard_order",
      name: "防衛指揮",
      branch: "戦闘",
      desc: "防御と回復の受けを厚くする。",
      cost: { points: 1 },
      requires: ["battle_instinct"],
      stats: { def: 5, heal: 2 },
    },
    {
      id: "boss_tactics",
      name: "強敵戦術",
      branch: "戦闘",
      desc: "ボス戦の勝率を引き上げる。",
      cost: { points: 2, starseed: 1 },
      requires: ["guard_order"],
      stats: { atk: 5, boss: 0.04 },
    },
    {
      id: "craft_focus",
      name: "工房集中",
      branch: "生産",
      desc: "クラフト速度と強化効率を伸ばす。",
      cost: { points: 1 },
      stats: { craft: 6 },
    },
    {
      id: "material_memory",
      name: "素材記憶",
      branch: "生産",
      desc: "素材の扱いが上達し、補給と幸運が伸びる。",
      cost: { points: 1 },
      requires: ["craft_focus"],
      stats: { supply: 3, luck: 2 },
    },
    {
      id: "evolution_theory",
      name: "進化理論",
      branch: "生産",
      desc: "進化装備の扱いが上手くなり、魔力と生産が伸びる。",
      cost: { points: 2, starseed: 1 },
      requires: ["material_memory"],
      stats: { craft: 6, mag: 4 },
    },
    {
      id: "pathfinder",
      name: "道読み",
      branch: "探索",
      desc: "探索中の発見力を上げる。",
      cost: { points: 1 },
      stats: { scout: 5, gather: 2 },
    },
    {
      id: "quiet_steps",
      name: "静かな足運び",
      branch: "探索",
      desc: "戦闘遭遇時の先手を取りやすくする。",
      cost: { points: 1 },
      requires: ["pathfinder"],
      stats: { speed: 4, luck: 2 },
    },
    {
      id: "starlight_cycle",
      name: "星灯りの周回術",
      branch: "転生",
      desc: "転生後の永続ボーナスを伸ばす。",
      cost: { points: 2, starseed: 2 },
      requires: ["quiet_steps", "boss_tactics"],
      stats: { atk: 3, def: 3, gather: 3, craft: 3, boss: 0.03 },
    },
  ];

  const SKILL_NODE_BY_ID = Object.fromEntries(SKILL_TREE_NODES.map((node) => [node.id, node]));

  const QUESTS = [
    {
      id: "first_home",
      name: "宿暮らしからの一歩",
      desc: "宿を出て、最初の自分たちの拠点を手に入れる。",
      requirements: [{ type: "baseOwned", amount: 2, label: "所有拠点" }],
      reward: { gold: 180, gift: 1, wood: 8 },
    },
    {
      id: "field_patrol",
      name: "草原巡回依頼",
      desc: "街道沿いの魔物を減らし、周辺の安全を確保する。",
      requirements: [{ type: "clears", key: "field", amount: 3, label: "草原クリア" }],
      reward: { gold: 160, herb: 8, hide: 4 },
    },
    {
      id: "first_weapon",
      name: "戦える装備を一振り",
      desc: "工房で武器を製作し、仲間に持たせる準備をする。",
      requirements: [{ type: "inventorySlot", key: "weapon", amount: 1, label: "武器製作" }],
      reward: { gold: 120, ore: 6, gear: 1 },
    },
    {
      id: "forge_open",
      name: "鍛冶場開設",
      desc: "本格的な鍛冶場を持つ拠点を確保する。",
      requirements: [{ type: "facility", key: "forge", amount: 1, label: "鍛冶場" }],
      reward: { gold: 260, ore: 12, stone: 8 },
    },
    {
      id: "first_boss",
      name: "初めてのボス討伐",
      desc: "草原奥のボスを倒し、開拓団の実力を示す。",
      requirements: [{ type: "bossClears", key: "field_queen", amount: 1, label: "草原ボス討伐" }],
      reward: { gold: 360, relic: 2, gift: 2 },
    },
    {
      id: "deep_cave",
      name: "灯なし洞窟調査",
      desc: "危険地帯の洞窟を攻略し、希少素材の道を開く。",
      requirements: [{ type: "clears", key: "cave", amount: 2, label: "洞窟クリア" }],
      reward: { gold: 420, relic: 3, charm: 1 },
    },
    {
      id: "bonded_party",
      name: "信頼で結ばれた開拓団",
      desc: "仲間との絆を深め、ハーレムLvを高める。",
      requirements: [{ type: "haremLevel", amount: 3, label: "ハーレムLv" }],
      reward: { gold: 300, gift: 4, charm: 1 },
    },
  ];

  const BOSS_DUNGEONS = [
    {
      id: "field_queen",
      locationId: "field",
      name: "花冠の粘精女王",
      desc: "草原の奥に巣を作った大型魔物。初めてのボス戦に向いた相手。",
      unlock: [{ type: "clears", key: "field", amount: 3, label: "草原クリア" }],
      power: 92,
      cost: { potion: 1 },
      reward: { gold: 150, herb: 10, hide: 5 },
      firstReward: { gift: 1, relic: 1 },
      exp: 90,
    },
    {
      id: "forest_guardian",
      locationId: "forest",
      name: "囁き森の古樹守",
      desc: "森の資源を守る古い精霊。採取職の働きが勝敗を分ける。",
      unlock: [{ type: "clears", key: "forest", amount: 5, label: "森クリア" }],
      power: 175,
      cost: { food: 2 },
      reward: { gold: 240, wood: 18, fiber: 10 },
      firstReward: { charm: 1 },
      exp: 150,
    },
    {
      id: "mine_golem",
      locationId: "mine",
      name: "古坑の黒鉄ゴーレム",
      desc: "鉱山深部で動き出した鉄塊。防御と鍛えた武器が重要。",
      unlock: [{ type: "clears", key: "mine", amount: 5, label: "鉱山クリア" }],
      power: 260,
      cost: { gear: 1, potion: 1 },
      reward: { gold: 360, ore: 20, stone: 14 },
      firstReward: { relic: 2 },
      exp: 220,
    },
    {
      id: "tower_wraith",
      locationId: "watchtower",
      name: "見張り塔の残響亡霊",
      desc: "塔に残る古い守護者。魔力と回復の厚さが試される。",
      unlock: [{ type: "clears", key: "watchtower", amount: 4, label: "塔クリア" }],
      power: 380,
      cost: { charm: 1, potion: 2 },
      reward: { gold: 520, relic: 4, gear: 2 },
      firstReward: { gift: 3 },
      exp: 320,
    },
    {
      id: "cave_lord",
      locationId: "cave",
      name: "灯なし洞窟の深層主",
      desc: "街周辺で最も危険なボス。鍛えた装備と高い絆が欲しい。",
      unlock: [
        { type: "clears", key: "cave", amount: 3, label: "洞窟クリア" },
        { type: "haremLevel", amount: 3, label: "ハーレムLv" },
      ],
      power: 560,
      cost: { potion: 3, gear: 2, charm: 1 },
      reward: { gold: 820, relic: 7, ore: 28 },
      firstReward: { charm: 2, gift: 4 },
      exp: 520,
    },
  ];

  const BOSS_BY_ID = Object.fromEntries(BOSS_DUNGEONS.map((boss) => [boss.id, boss]));

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

  const GUILDS = [
    { id: "adventurers", name: "星灯り冒険者ギルド", type: "戦闘派閥", desc: "魔物討伐とボス攻略を支援する王道ギルド。探索勝利で評判が伸びやすい。", stats: { atk: 3, def: 2, scout: 1 }, focus: "戦闘勝利・ボス討伐" },
    { id: "artisans", name: "月鍛冶職人工房", type: "生産派閥", desc: "鍛冶、錬金、料理、細工の作業効率を上げる職人組合。", stats: { craft: 5, supply: 2 }, focus: "クラフト・施設強化" },
    { id: "gatherers", name: "翠森採取同盟", type: "採取派閥", desc: "遠征隊と採取職の働きを伸ばす同盟。素材集めに強い。", stats: { gather: 4, scout: 3, luck: 1 }, focus: "採取・遠征" },
    { id: "salon", name: "星花サロン", type: "親愛派閥", desc: "ヒロインとの交流、親密度スキル、贈り物の効果を伸ばす社交派閥。", stats: { heal: 2, luck: 3, supply: 2 }, focus: "親密度・支援" },
  ];
  const GUILD_BY_ID = Object.fromEntries(GUILDS.map((guild) => [guild.id, guild]));

  const GUILD_REQUESTS = [
    {
      id: "field_monster_hunt",
      guildId: "adventurers",
      rank: 1,
      title: "草原の魔物討伐",
      desc: "街道沿いに出る魔物を指定数倒す、基本の討伐依頼。",
      target: { type: "monster", locationId: "field", enemyIndex: 0, amount: 3 },
      reward: { gold: 140, herb: 4 },
      reputation: 18,
    },
    {
      id: "field_red_eye_hunt",
      guildId: "adventurers",
      rank: 1,
      title: "赤目の影の討伐",
      desc: "草原で旅人を脅かす赤目の影を倒す。",
      target: { type: "monster", locationId: "field", enemyIndex: 2, amount: 2 },
      reward: { gold: 180, hide: 4 },
      reputation: 22,
    },
    {
      id: "forest_mask_hunt",
      guildId: "gatherers",
      rank: 1,
      title: "森の追跡者調査",
      desc: "採取班の安全確保のため、森の魔物を討伐する。",
      target: { type: "monster", locationId: "forest", enemyIndex: 2, amount: 3 },
      reward: { gold: 220, wood: 8, fiber: 4 },
      reputation: 24,
    },
    {
      id: "river_mist_hunt",
      guildId: "gatherers",
      rank: 1,
      title: "川辺の魔物整理",
      desc: "川辺の素材回収ルートを守るため、水辺の魔物を倒す。",
      target: { type: "monster", locationId: "river", enemyIndex: 0, amount: 4 },
      reward: { gold: 210, fish: 8 },
      reputation: 24,
    },
    {
      id: "mine_ore_threat",
      guildId: "adventurers",
      rank: 2,
      title: "鉱山の動く鉱塊",
      desc: "鉱山作業を止めている硬い魔物を排除する。",
      target: { type: "monster", locationId: "mine", enemyIndex: 1, amount: 3 },
      reward: { gold: 320, ore: 10, gear: 1 },
      reputation: 34,
    },
    {
      id: "field_queen_order",
      guildId: "adventurers",
      rank: 2,
      title: "花冠の粘精女王討伐",
      desc: "草原奥の大型魔物を討伐する昇級寄りの依頼。",
      target: { type: "boss", bossId: "field_queen", amount: 1 },
      reward: { gold: 420, relic: 1, gift: 1 },
      reputation: 45,
    },
    {
      id: "cave_deep_hunt",
      guildId: "adventurers",
      rank: 3,
      title: "洞窟深層の魔物討伐",
      desc: "暗い洞窟の深層に出る危険な魔物を倒す。",
      target: { type: "monster", locationId: "cave", enemyIndex: 2, amount: 3 },
      reward: { gold: 520, relic: 2, ore: 12 },
      reputation: 48,
    },
    {
      id: "tower_wraith_order",
      guildId: "adventurers",
      rank: 4,
      title: "見張り塔の亡霊討伐",
      desc: "見張り塔に残る強力な亡霊を討伐する高ランク依頼。",
      target: { type: "boss", bossId: "tower_wraith", amount: 1 },
      reward: { gold: 820, relic: 4, charm: 1 },
      reputation: 72,
    },
  ];
  const GUILD_REQUEST_BY_ID = Object.fromEntries(GUILD_REQUESTS.map((request) => [request.id, request]));

  const EXPEDITION_SLOTS = [
    { id: "alpha", name: "第一遠征隊", desc: "序盤から使える基本の遠征隊。近場の魔物討伐と素材回収を任せられる。", minMembers: 2, stats: { atk: 3, scout: 2 } },
    { id: "beta", name: "採取遠征隊", desc: "仲間が4人以上になると編成できる採取寄りの別働隊。", minMembers: 4, stats: { gather: 5, scout: 3 } },
    { id: "gamma", name: "討伐遠征隊", desc: "仲間が6人以上になると編成できる戦闘寄りの別働隊。", minMembers: 6, stats: { atk: 5, def: 3 } },
  ];
  const EXPEDITION_SLOT_BY_ID = Object.fromEntries(EXPEDITION_SLOTS.map((slot) => [slot.id, slot]));

  const HEROINE_RELICS = {
    healer: { name: "ミナの星祈りロッド", desc: "回復魔法を柔らかく広げる白銀の杖。", stats: { heal: 6, supply: 2 }, skillName: "やさしい星灯り", skillLevel: 2, skillStats: { heal: 8, def: 2 } },
    ranger: { name: "セナの風読みリボン", desc: "風向きと足音を読むための軽いリボン。", stats: { scout: 5, speed: 3 }, skillName: "先読みの一矢", skillLevel: 2, skillStats: { atk: 4, scout: 6 } },
    smith: { name: "リオの火花ハンマー", desc: "装備の癖まで見抜く職人用ハンマー。", stats: { craft: 6, atk: 2 }, skillName: "仕上げの一打", skillLevel: 2, skillStats: { craft: 8, def: 2 } },
    shinobi: { name: "ユイの影結び短刀", desc: "気配を隠して敵の懐へ入るための短刀。", stats: { speed: 5, luck: 3 }, skillName: "影渡り", skillLevel: 2, skillStats: { speed: 6, scout: 4 } },
    alchemist: { name: "イリスの紫晶フラスコ", desc: "薬効を安定させる錬金用フラスコ。", stats: { craft: 4, heal: 4 }, skillName: "即席調合", skillLevel: 2, skillStats: { heal: 5, luck: 4 } },
    knight: { name: "サラの誓盾ブローチ", desc: "守る意志を魔力で固める小さなブローチ。", stats: { def: 6, heal: 2 }, skillName: "誓いの護り", skillLevel: 2, skillStats: { def: 8, supply: 2 } },
    cook: { name: "ノアの香草ポーチ", desc: "携行食の質を上げる香草入りの小袋。", stats: { supply: 6, craft: 2 }, skillName: "元気の一皿", skillLevel: 2, skillStats: { supply: 8, gather: 2 } },
    mage: { name: "エルの月詠み書", desc: "魔力を整える薄い魔導書。", stats: { mag: 6, luck: 2 }, skillName: "月光詠唱", skillLevel: 2, skillStats: { mag: 8, scout: 2 } },
    scout: { name: "キリの道標コンパス", desc: "見えない抜け道を指す小型コンパス。", stats: { scout: 6, gather: 2 }, skillName: "抜け道案内", skillLevel: 2, skillStats: { scout: 8, speed: 2 } },
    jeweler: { name: "メルの星粒ルーペ", desc: "宝石と護符の細工精度を上げるルーペ。", stats: { craft: 4, luck: 4 }, skillName: "幸運研磨", skillLevel: 2, skillStats: { luck: 6, craft: 4 } },
    hunter: { name: "レイの静弦グローブ", desc: "弓弦の音を抑える狩人用グローブ。", stats: { atk: 4, gather: 4 }, skillName: "静かな狩り", skillLevel: 2, skillStats: { atk: 5, gather: 5 } },
    summoner: { name: "ルカの契約鈴", desc: "召喚体との呼吸を合わせる小さな鈴。", stats: { mag: 4, heal: 3 }, skillName: "星獣の加護", skillLevel: 2, skillStats: { mag: 5, heal: 5 } },
  };

  const ACHIEVEMENTS = [
    { id: "first_clear", title: "初勝利の開拓者", desc: "任意の探索地で1回勝利する。", condition: () => getTotalClears() >= 1, reward: { gold: 80, herb: 4 }, stats: { atk: 1, scout: 1 } },
    { id: "party_of_five", title: "にぎやかな旅団", desc: "仲間を5人以上にする。", condition: () => state.members.length >= 5, reward: { gift: 2, food: 3 }, stats: { supply: 2 } },
    { id: "first_boss_title", title: "小ボス討伐者", desc: "任意のボスを1回討伐する。", condition: () => getTotalBossClears() >= 1, reward: { relic: 1, gold: 160 }, stats: { atk: 2, def: 1 } },
    { id: "bonded_heart", title: "心を結ぶ者", desc: "ヒロイン1人の親愛Lvを2以上にする。", condition: () => state.members.some((member) => member.id !== "hero" && getBondInfo(member.affection).level >= 2), reward: { gift: 3, charm: 1 }, stats: { heal: 2, luck: 1 } },
    { id: "guild_regular", title: "ギルド常連", desc: "いずれかのギルド評判をランク3にする。", condition: () => GUILDS.some((guild) => getGuildRank(guild.id) >= 3), reward: { gold: 220, gear: 1 }, stats: { craft: 1, scout: 1, supply: 1 } },
    { id: "expedition_leader", title: "遠征隊長", desc: "遠征隊で合計5回勝利する。", condition: () => getExpeditionTotalWins() >= 5, reward: { wood: 10, ore: 8, food: 4 }, stats: { gather: 2, scout: 2 } },
    { id: "codex_keeper", title: "図鑑係", desc: "素材図鑑とモンスター図鑑を合計10件埋める。", condition: () => getCodexCompletionCount() >= 10, reward: { relic: 1, gift: 2 }, stats: { luck: 2, scout: 1 } },
    { id: "reborn_star", title: "星核を継ぐ者", desc: "転生を1回行う。", condition: () => (state.rebirth?.count || 0) >= 1, reward: { starseed: 1, charm: 1 }, stats: { atk: 1, def: 1, mag: 1, gather: 1, craft: 1 } },
  ];
  const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]));

  const SHOP_EQUIPMENT = [
    { id: "iron_sword", name: "武器屋の鉄剣", slot: "weapon", rarity: "uncommon", price: 260, stats: { atk: 8, speed: 1 } },
    { id: "hunter_bow", name: "武器屋の狩弓", slot: "weapon", rarity: "rare", price: 520, stats: { atk: 7, scout: 5, luck: 1 } },
    { id: "guard_mail", name: "防具屋の衛兵鎧", slot: "armor", rarity: "uncommon", price: 300, stats: { def: 8, supply: 1 } },
    { id: "silk_robe", name: "防具屋の術士ローブ", slot: "armor", rarity: "rare", price: 560, stats: { def: 4, mag: 6, heal: 2 } },
    { id: "tamer_whip", name: "調教師の星鞭", slot: "weapon", rarity: "rare", price: 680, stats: { atk: 5, scout: 5, luck: 4 } },
  ];
  const SHOP_EQUIPMENT_BY_ID = Object.fromEntries(SHOP_EQUIPMENT.map((item) => [item.id, item]));

  const POTION_SHOP_ITEMS = [
    { id: "potion_pack", key: "potion", name: "ポーション3本", amount: 3, price: 120 },
    { id: "food_pack", key: "food", name: "携行食3個", amount: 3, price: 90 },
    { id: "gift_pack", key: "gift", name: "小さな贈り物", amount: 1, price: 160 },
    { id: "taming_feed", key: "food", name: "テイム用の香草餌", amount: 6, price: 210 },
  ];
  const POTION_SHOP_ITEM_BY_ID = Object.fromEntries(POTION_SHOP_ITEMS.map((item) => [item.id, item]));

  const MATERIAL_BUYBACK = {
    herb: 3,
    wood: 3,
    ore: 8,
    hide: 5,
    fish: 4,
    fiber: 4,
    stone: 3,
    relic: 45,
  };

  const PLAYER_SHOP_GOODS = {
    potion: { name: "ポーション", price: 44, xp: 3 },
    food: { name: "携行食", price: 34, xp: 2 },
    gear: { name: "装備強化材", price: 92, xp: 6 },
    gift: { name: "贈り物", price: 128, xp: 8 },
    charm: { name: "護符", price: 210, xp: 12 },
  };

  const VIEW_DEFS = [
    { id: "base", label: "拠点" },
    { id: "explore", label: "探索" },
    { id: "party", label: "仲間" },
    { id: "craft", label: "工房" },
    { id: "market", label: "商店" },
    { id: "guild", label: "ギルド" },
    { id: "codex", label: "図鑑" },
    { id: "story", label: "物語" },
    { id: "account", label: "連携" },
  ];

  const VIEW_PANELS = {
    base: ["heroPanel", "basePanel", "dailyPanel", "resourcesPanel", "logPanel"],
    explore: ["mapPanel", "locationPanel", "expeditionPanel", "resourcesPanel", "dailyPanel", "logPanel"],
    party: ["heroPanel", "rosterPanel", "familiarPanel", "skillPanel", "jobsPanel", "resourcesPanel"],
    craft: ["basePanel", "craftPanel", "resourcesPanel", "logPanel"],
    market: ["marketPanel", "resourcesPanel", "logPanel"],
    guild: ["guildPanel", "achievementPanel", "resourcesPanel", "logPanel"],
    codex: ["codexPanel", "achievementPanel", "resourcesPanel"],
    story: ["storyPanel", "dailyPanel", "resourcesPanel", "logPanel"],
    account: ["accountPanel", "resourcesPanel", "logPanel"],
  };

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
    "basePanel",
    "mapPanel",
    "locationPanel",
    "expeditionPanel",
    "craftPanel",
    "storyPanel",
    "skillPanel",
    "jobsPanel",
    "familiarPanel",
    "marketPanel",
    "guildPanel",
    "codexPanel",
    "achievementPanel",
      "resourcesPanel",
      "dailyPanel",
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

      if (action === "set-view") {
        setView(actionElement.dataset.view);
      }

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

      if (action === "claim-daily") {
        claimDailyBonus();
      }

      if (action === "buy-base") {
        buyBaseProperty(actionElement.dataset.base);
      }

      if (action === "craft-recipe") {
        craftRecipe(actionElement.dataset.recipe);
      }

      if (action === "enhance-item") {
        enhanceItem(actionElement.dataset.item);
      }

      if (action === "limit-break-item") {
        limitBreakItem(actionElement.dataset.item);
      }

      if (action === "evolve-item") {
        evolveItem(actionElement.dataset.item);
      }

      if (action === "claim-quest") {
        claimQuest(actionElement.dataset.quest);
      }

      if (action === "challenge-boss") {
        challengeBoss(actionElement.dataset.boss);
      }

      if (action === "upgrade-facility") {
        upgradeFacility(actionElement.dataset.facility);
      }

      if (action === "unlock-skill") {
        unlockSkillNode(actionElement.dataset.skill);
      }

      if (action === "rebirth") {
        performRebirth();
      }

      if (action === "select-guild") {
        selectGuild(actionElement.dataset.guild);
      }

      if (action === "set-expedition-location") {
        setExpeditionLocation(actionElement.dataset.slot, actionElement.dataset.location);
      }

      if (action === "toggle-expedition") {
        toggleExpedition(actionElement.dataset.slot);
      }

      if (action === "claim-achievement") {
        claimAchievement(actionElement.dataset.achievement);
      }

      if (action === "claim-guild-request") {
        claimGuildRequest(actionElement.dataset.request);
      }

      if (action === "equip-title") {
        equipTitle(actionElement.dataset.achievement);
      }

      if (action === "buy-shop-equipment") {
        buyShopEquipment(actionElement.dataset.item);
      }

      if (action === "buy-potion-item") {
        buyPotionShopItem(actionElement.dataset.item);
      }

      if (action === "sell-material") {
        sellMaterialToGuild(actionElement.dataset.resource, actionElement.dataset.amount);
      }

      if (action === "stock-player-shop") {
        stockPlayerShop(actionElement.dataset.resource, actionElement.dataset.amount);
      }

      if (action === "toggle-player-shop") {
        togglePlayerShop();
      }

      if (action === "collect-shop-sales") {
        collectShopSales();
      }

      if (action === "upgrade-player-shop") {
        upgradePlayerShop();
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

      if (event.target.matches("[data-member-equipment]")) {
        equipItem(event.target.dataset.memberEquipment, event.target.dataset.equipmentSlot, event.target.value);
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
      view: "base",
      members: [
        {
          id: "hero",
          name: "アリア",
          level: 1,
          xp: 0,
          jobId: "sword",
          profileId: "leader",
          affection: 0,
          equipment: createEmptyEquipment(),
        },
        {
          id: "starter-mina",
          name: "ミナ",
          level: 1,
          xp: 0,
          jobId: "cleric",
          profileId: "healer",
          affection: 28,
          equipment: createEmptyEquipment(),
        },
        {
          id: "starter-sena",
          name: "セナ",
          level: 1,
          xp: 0,
          jobId: "archer",
          profileId: "ranger",
          affection: 18,
          equipment: createEmptyEquipment(),
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
        starseed: 0,
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
      daily: {
        lastClaimDate: "",
        streak: 0,
        totalClaims: 0,
      },
      quests: {
        completed: {},
      },
      bossClears: {},
      facilityLevels: {},
      skillTree: {
        points: 0,
        unlocked: {},
      },
      rebirth: {
        count: 0,
        lastGain: 0,
      },
      encounter: null,
      guild: {
        activeId: "adventurers",
        reputation: {},
      },
      guildRequests: {
        dateKey: "",
        generated: [],
        completed: {},
      },
      monsterKills: {},
      expeditions: {
        squads: {},
        totalWins: 0,
      },
      codex: {
        resources: {},
        monsters: {},
      },
      achievements: {
        claimed: {},
        activeTitleId: "",
      },
      familiars: [],
      playerShop: {
        open: false,
        level: 1,
        xp: 0,
        stock: {},
        salesGold: 0,
        totalSales: 0,
      },
      base: {
        homeId: "inn",
        owned: ["inn"],
      },
      inventory: [],
      nextItemId: 1,
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
      const normalizedInventory = normalizeInventory(parsed.inventory);
      const stateToUse = {
        ...fallback,
        ...parsed,
        view: VIEW_DEFS.some((view) => view.id === parsed.view) ? parsed.view : fallback.view,
        resources: { ...fallback.resources, ...(parsed.resources || {}) },
        clears: parsed.clears || {},
        story: normalizeStory(parsed.story),
        daily: normalizeDaily(parsed.daily),
        quests: normalizeQuests(parsed.quests),
        bossClears: normalizeCounterMap(parsed.bossClears),
        facilityLevels: normalizeFacilityLevels(parsed.facilityLevels),
        skillTree: normalizeSkillTree(parsed.skillTree),
        rebirth: normalizeRebirth(parsed.rebirth),
        encounter: normalizeEncounter(parsed.encounter),
        guild: normalizeGuild(parsed.guild),
        guildRequests: normalizeGuildRequests(parsed.guildRequests),
        monsterKills: normalizeCounterMap(parsed.monsterKills),
        expeditions: normalizeExpeditions(parsed.expeditions),
        codex: normalizeCodex(parsed.codex),
        achievements: normalizeAchievements(parsed.achievements),
        familiars: normalizeFamiliars(parsed.familiars),
        playerShop: normalizePlayerShop(parsed.playerShop),
        base: normalizeBase(parsed.base),
        inventory: normalizedInventory,
        nextItemId: Math.max(getNextItemId(normalizedInventory), Number(parsed.nextItemId) || 1),
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

      cleanupEquipmentAssignments(stateToUse);

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
      equipment: normalizeEquipment(member.equipment),
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
        equipment: createEmptyEquipment(),
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

  function getHeroJobCategory() {
    const hero = state.members[0];
    const job = JOB_BY_ID[hero?.jobId] || JOB_BY_ID.sword;
    return job.category;
  }

  function normalizeStory(story) {
    const selectedId = STORY_CHAPTERS.some((chapter) => chapter.id === story?.selectedId) ? story.selectedId : "prologue";
    return {
      selectedId,
      sceneIndex: Math.max(0, Number(story?.sceneIndex) || 0),
      completed: story?.completed && typeof story.completed === "object" ? story.completed : {},
    };
  }

  function normalizeDaily(daily) {
    if (!daily || typeof daily !== "object") {
      return {
        lastClaimDate: "",
        streak: 0,
        totalClaims: 0,
      };
    }

    return {
      lastClaimDate: String(daily.lastClaimDate || ""),
      streak: Math.max(0, Number(daily.streak) || 0),
      totalClaims: Math.max(0, Number(daily.totalClaims) || 0),
    };
  }

  function normalizeBase(base) {
    const owned = Array.isArray(base?.owned)
      ? base.owned.filter((id) => BASE_BY_ID[id])
      : ["inn"];

    if (!owned.includes("inn")) {
      owned.unshift("inn");
    }

    const homeId = BASE_BY_ID[base?.homeId] && owned.includes(base.homeId) ? base.homeId : owned[owned.length - 1];
    return {
      homeId,
      owned: Array.from(new Set(owned)),
    };
  }

  function normalizeInventory(inventory) {
    if (!Array.isArray(inventory)) {
      return [];
    }

    return inventory
      .filter((item) => item && typeof item === "object")
      .map((item, index) => {
        const limitBreak = clamp(Math.floor(Number(item.limitBreak) || 0), 0, EQUIPMENT_MAX_BREAK);
        const maxLevel = EQUIPMENT_BASE_MAX_LEVEL + limitBreak * EQUIPMENT_LEVELS_PER_BREAK;
        const baseStats = normalizeItemStats(item.baseStats || item.stats);
        return {
          id: String(item.id || `item-${index + 1}`),
          recipeId: String(item.recipeId || ""),
          name: String(item.name || "未鑑定品").slice(0, 40),
          rarity: RARITY_BY_ID[item.rarity] ? item.rarity : "common",
          slot: String(item.slot || "misc").slice(0, 24),
          baseStats,
          stats: normalizeItemStats(item.stats || baseStats),
          level: clamp(Math.floor(Number(item.level) || 0), 0, maxLevel),
          limitBreak,
          evolution: clamp(Math.floor(Number(item.evolution) || 0), 0, RARITIES.length - 1),
          createdAt: Math.max(0, Number(item.createdAt) || Date.now()),
        };
      });
  }

  function normalizeQuests(quests) {
    return {
      completed: quests?.completed && typeof quests.completed === "object" ? quests.completed : {},
    };
  }

  function normalizeCounterMap(map) {
    if (!map || typeof map !== "object") {
      return {};
    }

    return Object.fromEntries(Object.entries(map).map(([key, value]) => [key, Math.max(0, Number(value) || 0)]));
  }

  function normalizeFacilityLevels(levels) {
    const normalized = {};
    if (!levels || typeof levels !== "object") {
      return normalized;
    }

    for (const facility of FACILITY_UPGRADES) {
      const value = Math.floor(Number(levels[facility.id]) || 0);
      if (value > 0) {
        normalized[facility.id] = clamp(value, 1, facility.maxLevel);
      }
    }
    return normalized;
  }

  function normalizeSkillTree(skillTree) {
    const unlocked = skillTree?.unlocked && typeof skillTree.unlocked === "object" ? skillTree.unlocked : {};
    return {
      points: Math.max(0, Math.floor(Number(skillTree?.points) || 0)),
      unlocked: Object.fromEntries(Object.entries(unlocked).filter(([key, value]) => SKILL_NODE_BY_ID[key] && value)),
    };
  }

  function normalizeRebirth(rebirth) {
    return {
      count: Math.max(0, Math.floor(Number(rebirth?.count) || 0)),
      lastGain: Math.max(0, Math.floor(Number(rebirth?.lastGain) || 0)),
    };
  }

  function normalizeEncounter(encounter) {
    if (!encounter || typeof encounter !== "object" || !LOCATION_BY_ID[encounter.locationId]) {
      return null;
    }

    return {
      locationId: String(encounter.locationId),
      name: String(encounter.name || "魔物").slice(0, 40),
      hp: Math.max(0, Number(encounter.hp) || 0),
      maxHp: Math.max(1, Number(encounter.maxHp) || 1),
      power: Math.max(1, Number(encounter.power) || 1),
      isStrongEnemy: Boolean(encounter.isStrongEnemy),
      startedAt: Math.max(0, Number(encounter.startedAt) || Date.now()),
    };
  }

  function normalizeGuild(guild) {
    const activeId = GUILD_BY_ID[guild?.activeId] ? guild.activeId : "adventurers";
    const reputation = {};
    const source = guild?.reputation && typeof guild.reputation === "object" ? guild.reputation : {};
    for (const knownGuild of GUILDS) {
      reputation[knownGuild.id] = Math.max(0, Math.floor(Number(source[knownGuild.id]) || 0));
    }
    return { activeId, reputation };
  }

  function normalizeGuildRequests(guildRequests) {
    const completed = guildRequests?.completed && typeof guildRequests.completed === "object" ? guildRequests.completed : {};
    const generated = normalizeGeneratedGuildRequests(guildRequests?.generated);
    const generatedIds = new Set(generated.map((request) => request.id));
    return {
      dateKey: String(guildRequests?.dateKey || ""),
      generated,
      completed: Object.fromEntries(Object.entries(completed).filter(([key, value]) => value && (GUILD_REQUEST_BY_ID[key] || generatedIds.has(key)))),
    };
  }

  function normalizeGeneratedGuildRequests(generated) {
    if (!Array.isArray(generated)) {
      return [];
    }
    return generated.map(normalizeGeneratedGuildRequest).filter(Boolean).slice(0, 32);
  }

  function normalizeGeneratedGuildRequest(request) {
    if (!request || typeof request !== "object" || !GUILD_BY_ID[request.guildId]) {
      return null;
    }
    const id = String(request.id || "").slice(0, 120);
    if (!id) {
      return null;
    }
    const target = normalizeGuildRequestTarget(request.target);
    if (!target) {
      return null;
    }
    const reward = normalizeRewardMap(request.reward);
    if (Object.keys(reward).length === 0) {
      reward.gold = 80;
    }
    return {
      id,
      generated: true,
      dateKey: String(request.dateKey || ""),
      guildId: request.guildId,
      rank: clamp(Math.floor(Number(request.rank) || 1), 1, 10),
      title: String(request.title || "ランダム依頼").slice(0, 48),
      desc: String(request.desc || "ギルドが日替わりで掲示した依頼です。").slice(0, 120),
      target,
      reward,
      reputation: Math.max(1, Math.floor(Number(request.reputation) || 8)),
    };
  }

  function normalizeGuildRequestTarget(target) {
    if (!target || typeof target !== "object") {
      return null;
    }
    const amount = Math.max(1, Math.floor(Number(target.amount) || 1));
    const startValue = Math.max(0, Math.floor(Number(target.startValue) || 0));
    if (target.type === "monster") {
      const location = LOCATION_BY_ID[target.locationId];
      if (!location || !location.enemies?.length) {
        return null;
      }
      return {
        type: "monster",
        locationId: location.id,
        enemyIndex: clamp(Math.floor(Number(target.enemyIndex) || 0), 0, location.enemies.length - 1),
        amount,
        startValue,
      };
    }
    if (target.type === "boss") {
      if (!BOSS_BY_ID[target.bossId]) {
        return null;
      }
      return {
        type: "boss",
        bossId: target.bossId,
        amount,
        startValue,
      };
    }
    if (target.type === "resource") {
      if (!RESOURCE_LABELS[target.key]) {
        return null;
      }
      return {
        type: "resource",
        key: target.key,
        amount,
      };
    }
    if (target.type === "locationClear") {
      const location = LOCATION_BY_ID[target.locationId];
      if (!location || location.danger <= 0) {
        return null;
      }
      return {
        type: "locationClear",
        locationId: location.id,
        amount,
        startValue,
      };
    }
    return null;
  }

  function normalizeRewardMap(reward) {
    const normalized = {};
    if (!reward || typeof reward !== "object") {
      return normalized;
    }
    for (const [key, amount] of Object.entries(reward)) {
      if (RESOURCE_LABELS[key]) {
        normalized[key] = Math.max(1, Math.floor(Number(amount) || 0));
      }
    }
    return normalized;
  }

  function normalizeExpeditions(expeditions) {
    const squads = {};
    const source = expeditions?.squads && typeof expeditions.squads === "object" ? expeditions.squads : {};
    for (const slot of EXPEDITION_SLOTS) {
      const squad = source[slot.id] || {};
      squads[slot.id] = {
        locationId: LOCATION_BY_ID[squad.locationId]?.danger > 0 ? squad.locationId : "field",
        active: Boolean(squad.active),
        progress: clamp(Number(squad.progress) || 0, 0, 100),
        wins: Math.max(0, Math.floor(Number(squad.wins) || 0)),
      };
    }
    return {
      squads,
      totalWins: Math.max(0, Math.floor(Number(expeditions?.totalWins) || 0)),
    };
  }

  function normalizeCodex(codex) {
    return {
      resources: codex?.resources && typeof codex.resources === "object" ? { ...codex.resources } : {},
      monsters: codex?.monsters && typeof codex.monsters === "object" ? { ...codex.monsters } : {},
    };
  }

  function normalizeAchievements(achievements) {
    const claimed = achievements?.claimed && typeof achievements.claimed === "object" ? achievements.claimed : {};
    const activeTitleId = ACHIEVEMENT_BY_ID[achievements?.activeTitleId] && claimed[achievements.activeTitleId]
      ? achievements.activeTitleId
      : "";
    return {
      claimed: Object.fromEntries(Object.entries(claimed).filter(([key, value]) => ACHIEVEMENT_BY_ID[key] && value)),
      activeTitleId,
    };
  }

  function normalizeFamiliars(familiars) {
    if (!Array.isArray(familiars)) {
      return [];
    }
    return familiars
      .filter((familiar) => familiar && typeof familiar === "object")
      .slice(0, 30)
      .map((familiar, index) => ({
        id: String(familiar.id || `familiar-${index}`),
        name: String(familiar.name || "使い魔").slice(0, 40),
        locationId: LOCATION_BY_ID[familiar.locationId] ? familiar.locationId : "field",
        level: Math.max(1, Math.floor(Number(familiar.level) || 1)),
        xp: Math.max(0, Math.floor(Number(familiar.xp) || 0)),
        power: Math.max(1, Math.floor(Number(familiar.power) || 10)),
        affinity: Math.max(0, Math.floor(Number(familiar.affinity) || 0)),
        capturedAt: Math.max(0, Number(familiar.capturedAt) || Date.now()),
      }));
  }

  function normalizePlayerShop(playerShop) {
    const sourceStock = playerShop?.stock && typeof playerShop.stock === "object" ? playerShop.stock : {};
    const stock = {};
    for (const key of Object.keys(PLAYER_SHOP_GOODS)) {
      stock[key] = Math.max(0, Math.floor(Number(sourceStock[key]) || 0));
    }
    return {
      open: Boolean(playerShop?.open),
      level: clamp(Math.floor(Number(playerShop?.level) || 1), 1, 10),
      xp: Math.max(0, Math.floor(Number(playerShop?.xp) || 0)),
      stock,
      salesGold: Math.max(0, Math.floor(Number(playerShop?.salesGold) || 0)),
      totalSales: Math.max(0, Math.floor(Number(playerShop?.totalSales) || 0)),
    };
  }

  function createEmptyEquipment() {
    return Object.fromEntries(EQUIPMENT_SLOTS.map((slot) => [slot.id, ""]));
  }

  function normalizeEquipment(equipment) {
    const normalized = createEmptyEquipment();
    if (!equipment || typeof equipment !== "object") {
      return normalized;
    }

    for (const slot of EQUIPMENT_SLOTS) {
      normalized[slot.id] = String(equipment[slot.id] || "").slice(0, 80);
    }
    return normalized;
  }

  function cleanupEquipmentAssignments(targetState = state) {
    const itemById = new Map((targetState.inventory || []).map((item) => [item.id, item]));
    const used = new Set();

    for (const member of targetState.members || []) {
      member.equipment = normalizeEquipment(member.equipment);

      for (const slot of EQUIPMENT_SLOTS) {
        const itemId = member.equipment[slot.id];
        const item = itemById.get(itemId);
        if (!itemId) {
          continue;
        }

        if (!item || item.slot !== slot.id || used.has(itemId)) {
          member.equipment[slot.id] = "";
          continue;
        }

        used.add(itemId);
      }
    }
  }

  function normalizeItemStats(stats) {
    const normalized = {};
    if (!stats || typeof stats !== "object") {
      return normalized;
    }

    for (const key of Object.keys(STAT_LABELS)) {
      const value = Number(stats[key]) || 0;
      if (value > 0) {
        normalized[key] = Math.floor(value);
      }
    }
    return normalized;
  }

  function getNextItemId(inventory) {
    return inventory.reduce((max, item) => {
      const match = String(item.id || "").match(/item-(\d+)/);
      return match ? Math.max(max, Number(match[1]) + 1) : max;
    }, 1);
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
      state.encounter = null;
      state.exploring = false;
      addLog(`${LOCATION_BY_ID[locationId].name}を目的地に設定しました。`, "loot");
    }

    renderAll();
  }

  function toggleExplore() {
    const location = getSelectedLocation();

    if (location.id === "town") {
      state.exploring = false;
      state.encounter = null;
      addLog("街では生産と補給を進めます。周辺マップを選ぶと探索できます。", "loot");
      renderAll();
      return;
    }

    state.exploring = !state.exploring;
    if (!state.exploring) {
      state.encounter = null;
    }
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
      equipment: createEmptyEquipment(),
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
    addGuildReputation("salon", 5, true);
    gainHaremBond(member.name, 10 + previousBondLevel, true);
    applyXp(4 + previousBondLevel, true);

    const currentBondLevel = getBondInfo(member.affection).level;
    const levelText = currentBondLevel > previousBondLevel ? ` 親愛Lv.${currentBondLevel}に上昇。` : "";
    addLog(`${member.name}と交流。「${profile.line}」 親愛+、経験値+。${levelText}`, currentBondLevel > previousBondLevel ? "win" : "loot");
    renderAll();
  }

  function assignJob(memberId, jobId) {
    const member = state.members.find((candidate) => candidate.id === memberId);
    if (!member || member.id !== "hero" || !JOB_BY_ID[jobId]) return;
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

  function claimDailyBonus() {
    const daily = getDailyInfo();
    if (daily.claimed) {
      addLog("今日のデイリーボーナスは受け取り済みです。", "warn");
      renderLogs();
      return;
    }

    for (const [key, amount] of Object.entries(daily.reward)) {
      addResource(key, amount);
    }

    state.daily.lastClaimDate = daily.todayKey;
    state.daily.streak = daily.nextStreak;
    state.daily.totalClaims = (state.daily.totalClaims || 0) + 1;
    gainHaremBond("デイリーボーナス", 8 + daily.cycleDay * 2, true);
    addLog(`デイリーボーナス${daily.nextStreak}日目を受け取りました。${renderRewardText(daily.reward)}`, "win");
    saveState(false);
    renderAll();
  }

  function setView(viewId) {
    if (!VIEW_PANELS[viewId]) {
      return;
    }

    state.view = viewId;
    saveState(false);
    renderAll();
  }

  function buyBaseProperty(baseId) {
    const base = BASE_BY_ID[baseId];
    if (!base) {
      return;
    }

    state.base = normalizeBase(state.base);
    if (state.base.owned.includes(base.id)) {
      state.base.homeId = base.id;
      addLog(`${base.name}を現在の拠点にしました。`, "loot");
      saveState(false);
      renderAll();
      return;
    }

    if (!canAfford(base.cost)) {
      addLog(`${base.name}を購入する素材が足りません。必要: ${formatCost(base.cost)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(base.cost);
    state.base.owned.push(base.id);
    state.base.homeId = base.id;
    addLog(`${base.name}を購入しました。使える施設: ${formatFacilities(base.facilities)}`, "win");
    saveState(false);
    renderAll();
  }

  function craftRecipe(recipeId) {
    const recipe = CRAFT_RECIPES.find((candidate) => candidate.id === recipeId);
    if (!recipe) {
      return;
    }

    if (!getOwnedFacilities().has(recipe.station)) {
      addLog(`${CRAFT_STATIONS[recipe.station] || "施設"}がないため、${recipe.name}は作れません。`, "warn");
      renderLogs();
      return;
    }

    if (!canAfford(recipe.need)) {
      addLog(`${recipe.name}の素材が足りません。必要: ${formatCost(recipe.need)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(recipe.need);

    if (recipe.resultType === "equipment") {
      const item = createCraftedItem(recipe);
      state.inventory.push(item);
      addLog(`${item.name}を製作しました。${getRarity(item.rarity).name} / ${formatItemStats(getItemEffectiveStats(item))}`, "win");
    } else {
      addResource(recipe.key, recipe.amount);
      addLog(`${recipe.name}を製作しました。${RESOURCE_LABELS[recipe.key] || recipe.key}+${recipe.amount}`, "loot");
    }

    addGuildReputation("artisans", recipe.resultType === "equipment" ? 5 : 3, true);
    saveState(false);
    renderAll();
  }

  function equipItem(memberId, slotId, itemId) {
    const member = state.members.find((candidate) => candidate.id === memberId);
    if (!member || !EQUIPMENT_SLOT_BY_ID[slotId]) {
      return;
    }

    cleanupEquipmentAssignments();
    member.equipment = normalizeEquipment(member.equipment);

    if (!itemId) {
      member.equipment[slotId] = "";
      addLog(`${member.name}の${EQUIPMENT_SLOT_BY_ID[slotId].label}を外しました。`, "loot");
      saveState(false);
      renderAll();
      return;
    }

    const item = state.inventory.find((candidate) => candidate.id === itemId);
    if (!item || item.slot !== slotId) {
      addLog("その装備はこの枠に装備できません。", "warn");
      renderLogs();
      return;
    }

    for (const otherMember of state.members) {
      if (otherMember.id === member.id) {
        continue;
      }
      otherMember.equipment = normalizeEquipment(otherMember.equipment);
      for (const slot of EQUIPMENT_SLOTS) {
        if (otherMember.equipment[slot.id] === item.id) {
          otherMember.equipment[slot.id] = "";
        }
      }
    }

    member.equipment[slotId] = item.id;
    addLog(`${member.name}が${item.name}を装備しました。${formatItemStats(getItemEffectiveStats(item))}`, "win");
    saveState(false);
    renderAll();
  }

  function enhanceItem(itemId) {
    const item = getItemById(itemId);
    if (!item) {
      return;
    }

    const maxLevel = getItemMaxLevel(item);
    if ((item.level || 0) >= maxLevel) {
      addLog(`${item.name}は現在の限界Lv.${maxLevel}です。限界突破が必要です。`, "warn");
      renderLogs();
      return;
    }

    const cost = getEnhanceCost(item);
    if (!canAfford(cost)) {
      addLog(`${item.name}の強化素材が足りません。必要: ${formatCost(cost)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(cost);
    item.level = (item.level || 0) + 1;
    item.stats = getItemEffectiveStats(item);
    addLog(`${item.name}をLv.${item.level}に強化しました。${formatItemStats(getItemEffectiveStats(item))}`, "win");
    saveState(false);
    renderAll();
  }

  function limitBreakItem(itemId) {
    const item = getItemById(itemId);
    if (!item) {
      return;
    }

    const maxLevel = getItemMaxLevel(item);
    if ((item.level || 0) < maxLevel) {
      addLog(`${item.name}はLv.${maxLevel}まで強化すると限界突破できます。`, "warn");
      renderLogs();
      return;
    }

    if ((item.limitBreak || 0) >= EQUIPMENT_MAX_BREAK) {
      addLog(`${item.name}はこれ以上限界突破できません。`, "warn");
      renderLogs();
      return;
    }

    const cost = getLimitBreakCost(item);
    if (!canAfford(cost)) {
      addLog(`${item.name}の限界突破素材が足りません。必要: ${formatCost(cost)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(cost);
    item.limitBreak = (item.limitBreak || 0) + 1;
    item.stats = getItemEffectiveStats(item);
    addLog(`${item.name}が限界突破+${item.limitBreak}。最大Lv.${getItemMaxLevel(item)}になりました。`, "win");
    saveState(false);
    renderAll();
  }

  function evolveItem(itemId) {
    const item = getItemById(itemId);
    if (!item) {
      return;
    }

    const nextRarity = getNextRarity(item);
    if (!nextRarity) {
      addLog(`${item.name}は最終レア度です。これ以上進化できません。`, "warn");
      renderLogs();
      return;
    }

    const maxLevel = getItemMaxLevel(item);
    if ((item.level || 0) < maxLevel) {
      addLog(`${item.name}はLv.${maxLevel}まで強化すると進化できます。`, "warn");
      renderLogs();
      return;
    }

    const cost = getEvolutionCost(item);
    if (!canAfford(cost)) {
      addLog(`${item.name}の進化素材が足りません。必要: ${formatCost(cost)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(cost);
    const boostedStats = {};
    for (const [key, value] of Object.entries(item.baseStats || item.stats || {})) {
      boostedStats[key] = Math.max(1, Math.ceil(value * EQUIPMENT_EVOLUTION_BONUS));
    }

    item.rarity = nextRarity.id;
    item.baseStats = boostedStats;
    item.level = 0;
    item.limitBreak = 0;
    item.evolution = (item.evolution || 0) + 1;
    item.stats = getItemEffectiveStats(item);
    addLog(`${item.name}が${nextRarity.name}へ進化しました。Lvと限界突破はリセットされ、基礎能力が上昇しました。`, "win");
    saveState(false);
    renderAll();
  }

  function claimQuest(questId) {
    const quest = QUESTS.find((candidate) => candidate.id === questId);
    if (!quest) {
      return;
    }

    state.quests = normalizeQuests(state.quests);
    if (state.quests.completed[quest.id]) {
      addLog(`${quest.name}は報酬受取済みです。`, "warn");
      renderLogs();
      return;
    }

    if (!areRequirementsMet(quest.requirements)) {
      addLog(`${quest.name}はまだ達成していません。`, "warn");
      renderLogs();
      return;
    }

    state.quests.completed[quest.id] = Date.now();
    for (const [key, amount] of Object.entries(quest.reward || {})) {
      addResource(key, amount);
    }
    gainHaremBond(quest.name, 12, true);
    addLog(`依頼「${quest.name}」を報告しました。報酬: ${renderRewardText(quest.reward)}`, "win");
    saveState(false);
    renderAll();
  }

  function challengeBoss(bossId) {
    const boss = BOSS_BY_ID[bossId];
    if (!boss) {
      return;
    }

    if (!areRequirementsMet(boss.unlock)) {
      addLog(`${boss.name}はまだ出現していません。`, "warn");
      renderLogs();
      return;
    }

    if (!canAfford(boss.cost)) {
      addLog(`${boss.name}へ挑む準備が足りません。必要: ${formatCost(boss.cost)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(boss.cost);
    const stats = aggregateStats();
    const chance = estimateBossWinChance(boss, stats);
    const clears = state.bossClears[boss.id] || 0;
    markMonsterDiscovered(boss.name, boss.locationId, true);

    if (Math.random() <= chance) {
      const reward = { ...(boss.reward || {}) };
      if (clears === 0) {
        for (const [key, amount] of Object.entries(boss.firstReward || {})) {
          reward[key] = (reward[key] || 0) + amount;
        }
      }

      state.bossClears[boss.id] = clears + 1;
      for (const [key, amount] of Object.entries(reward)) {
        addResource(key, amount);
      }
      applyXp(boss.exp || 0, false);
      addGuildReputation("adventurers", 16, true);
      addGuildReputation(state.guild?.activeId, 8, true);
      gainPartyBond(6 + Math.floor((boss.power || 0) / 120), false, boss.name);
      addLog(`${boss.name}を討伐しました。報酬: ${renderRewardText(reward)} / 経験値+${boss.exp}`, "win");
    } else {
      state.progress = Math.max(0, state.progress - 25);
      addLog(`${boss.name}に敗北しました。戦力を上げ、装備を強化して再挑戦しましょう。`, "warn");
    }

    saveState(false);
    renderAll();
  }

  function upgradeFacility(facilityId) {
    const facility = FACILITY_UPGRADE_BY_ID[facilityId];
    if (!facility || !getOwnedFacilities().has(facilityId)) {
      return;
    }

    state.facilityLevels = normalizeFacilityLevels(state.facilityLevels);
    const level = getFacilityLevel(facilityId);
    if (level >= facility.maxLevel) {
      addLog(`${facility.name}は最大Lv.${facility.maxLevel}です。`, "warn");
      renderLogs();
      return;
    }

    const cost = getFacilityUpgradeCost(facilityId);
    if (!canAfford(cost)) {
      addLog(`${facility.name}の強化素材が足りません。必要: ${formatCost(cost)}`, "warn");
      renderLogs();
      return;
    }

    spendResources(cost);
    state.facilityLevels[facilityId] = level + 1;
    addLog(`${facility.name}をLv.${level + 1}に強化しました。`, "win");
    saveState(false);
    renderAll();
  }

  function unlockSkillNode(skillId) {
    const node = SKILL_NODE_BY_ID[skillId];
    if (!node) {
      return;
    }

    state.skillTree = normalizeSkillTree(state.skillTree);
    if (state.skillTree.unlocked[node.id]) {
      return;
    }

    const missingPrereq = (node.requires || []).some((requiredId) => !state.skillTree.unlocked[requiredId]);
    if (missingPrereq) {
      addLog(`${node.name}は前提スキルが必要です。`, "warn");
      renderLogs();
      return;
    }

    const pointCost = node.cost?.points || 0;
    const starseedCost = node.cost?.starseed || 0;
    if (state.skillTree.points < pointCost || (state.resources.starseed || 0) < starseedCost) {
      addLog(`${node.name}の解放コストが足りません。必要: SP${pointCost}${starseedCost ? ` / 星核${starseedCost}` : ""}`, "warn");
      renderLogs();
      return;
    }

    state.skillTree.points -= pointCost;
    if (starseedCost) {
      state.resources.starseed -= starseedCost;
    }
    state.skillTree.unlocked[node.id] = Date.now();
    addLog(`スキル「${node.name}」を解放しました。`, "win");
    saveState(false);
    renderAll();
  }

  function performRebirth() {
    const preview = getRebirthPreview();
    if (!preview.available) {
      addLog(`転生条件を満たしていません。${preview.reason}`, "warn");
      renderLogs();
      return;
    }

    if (!window.confirm(`転生して星核${preview.gain}個とSP${preview.skillPoints}を得ます。探索クリア、ボス討伐、依頼、レベルはリセットされます。実行しますか？`)) {
      return;
    }

    const keptResources = {
      gold: 160 + preview.gain * 40,
      herb: 8,
      wood: 8,
      ore: 4,
      hide: 2,
      fish: 0,
      fiber: 2,
      stone: 2,
      relic: 0,
      potion: 3,
      gear: 0,
      food: 2,
      gift: 2,
      charm: 0,
      starseed: (state.resources.starseed || 0) + preview.gain,
    };

    for (const member of state.members) {
      member.level = 1;
      member.xp = 0;
      if (member.id !== "hero") {
        member.affection = Math.max(member.affection || 0, getCompanionProfile(member).affection || 0);
      }
    }

    state.resources = keptResources;
    state.clears = {};
    state.bossClears = {};
    state.quests = { completed: {} };
    state.progress = 0;
    state.gatherProgress = 0;
    state.craftProgress = 0;
    state.encounter = null;
    state.exploring = false;
    state.selectedLocation = "town";
    state.haremLevel = 1;
    state.haremXp = 0;
    state.skillTree = normalizeSkillTree(state.skillTree);
    state.skillTree.points += preview.skillPoints;
    state.rebirth = normalizeRebirth(state.rebirth);
    state.rebirth.count += 1;
    state.rebirth.lastGain = preview.gain;
    addLog(`転生しました。星核+${preview.gain} / SP+${preview.skillPoints}。装備、仲間、拠点、施設Lv、解放済みスキルは引き継がれます。`, "win");
    saveState(false);
    renderAll();
  }

  function selectGuild(guildId) {
    if (!GUILD_BY_ID[guildId]) {
      return;
    }
    state.guild = normalizeGuild(state.guild);
    state.guild.activeId = guildId;
    addLog(`${GUILD_BY_ID[guildId].name}を現在の所属ギルドにしました。`, "loot");
    saveState(false);
    renderAll();
  }

  function setExpeditionLocation(slotId, locationId) {
    if (!EXPEDITION_SLOT_BY_ID[slotId] || !LOCATION_BY_ID[locationId] || LOCATION_BY_ID[locationId].danger <= 0) {
      return;
    }
    state.expeditions = normalizeExpeditions(state.expeditions);
    state.expeditions.squads[slotId].locationId = locationId;
    state.expeditions.squads[slotId].progress = 0;
    addLog(`${EXPEDITION_SLOT_BY_ID[slotId].name}の行き先を${LOCATION_BY_ID[locationId].name}にしました。`, "loot");
    saveState(false);
    renderAll();
  }

  function toggleExpedition(slotId) {
    const slot = EXPEDITION_SLOT_BY_ID[slotId];
    if (!slot) {
      return;
    }
    if (!isExpeditionSlotUnlocked(slot)) {
      addLog(`${slot.name}は仲間${slot.minMembers}人以上で解放されます。`, "warn");
      renderLogs();
      return;
    }
    state.expeditions = normalizeExpeditions(state.expeditions);
    const squad = state.expeditions.squads[slot.id];
    squad.active = !squad.active;
    addLog(`${slot.name}を${squad.active ? "出発" : "待機"}にしました。`, squad.active ? "loot" : "warn");
    saveState(false);
    renderAll();
  }

  function claimAchievement(achievementId) {
    const achievement = ACHIEVEMENT_BY_ID[achievementId];
    if (!achievement) {
      return;
    }
    state.achievements = normalizeAchievements(state.achievements);
    if (state.achievements.claimed[achievement.id]) {
      equipTitle(achievement.id);
      return;
    }
    if (!isAchievementUnlocked(achievement)) {
      addLog(`${achievement.title}はまだ達成していません。`, "warn");
      renderLogs();
      return;
    }
    state.achievements.claimed[achievement.id] = Date.now();
    state.achievements.activeTitleId = achievement.id;
    for (const [key, amount] of Object.entries(achievement.reward || {})) {
      addResource(key, amount);
    }
    addLog(`実績「${achievement.title}」を獲得しました。称号として装備しました。`, "win");
    saveState(false);
    renderAll();
  }

  function claimGuildRequest(requestId) {
    ensureGeneratedGuildRequests(false);
    const request = getGuildRequestById(requestId);
    if (!request) {
      return;
    }
    state.guild = normalizeGuild(state.guild);
    state.guildRequests = normalizeGuildRequests(state.guildRequests);
    if (state.guildRequests.completed[request.id]) {
      addLog(`${request.title}は報告済みです。`, "warn");
      renderLogs();
      return;
    }
    if (!isGuildRequestUnlocked(request)) {
      addLog(`${request.title}はギルドRankが足りないか、所属ギルドが違います。`, "warn");
      renderLogs();
      return;
    }
    const progress = getGuildRequestProgress(request);
    const amount = request.target.amount || 1;
    if (progress < amount) {
      addLog(`${request.title}はまだ達成していません。進行 ${progress}/${amount}`, "warn");
      renderLogs();
      return;
    }
    if (request.target?.type === "resource") {
      const cost = { [request.target.key]: amount };
      if (!canAfford(cost)) {
        addLog(`${request.title}の納品素材が足りません。必要: ${formatCost(cost)}`, "warn");
        renderLogs();
        return;
      }
      spendResources(cost);
    }
    state.guildRequests.completed[request.id] = Date.now();
    for (const [key, amountValue] of Object.entries(request.reward || {})) {
      addResource(key, amountValue);
    }
    addGuildReputation(request.guildId, request.reputation || 0, false);
    addLog(`ギルド依頼「${request.title}」を報告しました。報酬: ${renderRewardText(request.reward)}`, "win");
    saveState(false);
    renderAll();
  }

  function equipTitle(achievementId) {
    state.achievements = normalizeAchievements(state.achievements);
    if (!ACHIEVEMENT_BY_ID[achievementId] || !state.achievements.claimed[achievementId]) {
      return;
    }
    state.achievements.activeTitleId = achievementId;
    addLog(`称号「${ACHIEVEMENT_BY_ID[achievementId].title}」を装備しました。`, "loot");
    saveState(false);
    renderAll();
  }

  function buyShopEquipment(itemId) {
    const catalog = SHOP_EQUIPMENT_BY_ID[itemId];
    if (!catalog) {
      return;
    }
    if ((state.resources.gold || 0) < catalog.price) {
      addLog(`${catalog.name}を買う金貨が足りません。必要: ${catalog.price}金貨`, "warn");
      renderLogs();
      return;
    }
    state.resources.gold -= catalog.price;
    const item = createShopEquipmentItem(catalog);
    state.inventory.push(item);
    addLog(`${catalog.name}を購入しました。${getRarity(item.rarity).name} / ${formatItemStats(getItemEffectiveStats(item))}`, "win");
    saveState(false);
    renderAll();
  }

  function buyPotionShopItem(itemId) {
    const item = POTION_SHOP_ITEM_BY_ID[itemId];
    if (!item) {
      return;
    }
    if ((state.resources.gold || 0) < item.price) {
      addLog(`${item.name}を買う金貨が足りません。必要: ${item.price}金貨`, "warn");
      renderLogs();
      return;
    }
    state.resources.gold -= item.price;
    addResource(item.key, item.amount);
    addLog(`${item.name}を購入しました。${RESOURCE_LABELS[item.key] || item.key}+${item.amount}`, "loot");
    saveState(false);
    renderAll();
  }

  function sellMaterialToGuild(resourceKey, amountValue) {
    if (!MATERIAL_BUYBACK[resourceKey]) {
      return;
    }
    const owned = state.resources[resourceKey] || 0;
    const amount = amountValue === "all" ? owned : Math.min(owned, Math.max(1, Math.floor(Number(amountValue) || 1)));
    if (amount <= 0) {
      addLog(`${RESOURCE_LABELS[resourceKey] || resourceKey}の在庫がありません。`, "warn");
      renderLogs();
      return;
    }
    const rankBonus = getGuildRank(state.guild?.activeId || "adventurers") * 0.03;
    const gold = Math.max(1, Math.floor(amount * MATERIAL_BUYBACK[resourceKey] * (1 + rankBonus)));
    state.resources[resourceKey] -= amount;
    addResource("gold", gold);
    addGuildReputation(state.guild?.activeId || "adventurers", Math.max(1, Math.floor(amount / 2)), true);
    addLog(`ギルドに${RESOURCE_LABELS[resourceKey]}を${amount}個買い取ってもらいました。金貨+${gold}`, "win");
    saveState(false);
    renderAll();
  }

  function stockPlayerShop(resourceKey, amountValue) {
    if (!PLAYER_SHOP_GOODS[resourceKey]) {
      return;
    }
    state.playerShop = normalizePlayerShop(state.playerShop);
    const owned = state.resources[resourceKey] || 0;
    const amount = amountValue === "all" ? owned : Math.min(owned, Math.max(1, Math.floor(Number(amountValue) || 1)));
    if (amount <= 0) {
      addLog(`${PLAYER_SHOP_GOODS[resourceKey].name}を入荷する在庫がありません。`, "warn");
      renderLogs();
      return;
    }
    state.resources[resourceKey] -= amount;
    state.playerShop.stock[resourceKey] += amount;
    addLog(`自分の店に${PLAYER_SHOP_GOODS[resourceKey].name}を${amount}個入荷しました。`, "loot");
    saveState(false);
    renderAll();
  }

  function togglePlayerShop() {
    state.playerShop = normalizePlayerShop(state.playerShop);
    state.playerShop.open = !state.playerShop.open;
    addLog(`ショップ営業を${state.playerShop.open ? "開始" : "停止"}しました。`, state.playerShop.open ? "loot" : "warn");
    saveState(false);
    renderAll();
  }

  function collectShopSales() {
    state.playerShop = normalizePlayerShop(state.playerShop);
    if (state.playerShop.salesGold <= 0) {
      addLog("まだ回収できる売上がありません。", "warn");
      renderLogs();
      return;
    }
    const gold = state.playerShop.salesGold;
    state.playerShop.salesGold = 0;
    addResource("gold", gold);
    addLog(`ショップ売上を回収しました。金貨+${gold}`, "win");
    saveState(false);
    renderAll();
  }

  function upgradePlayerShop() {
    state.playerShop = normalizePlayerShop(state.playerShop);
    if (state.playerShop.level >= 10) {
      addLog("ショップは最大Lvです。", "warn");
      renderLogs();
      return;
    }
    const cost = getPlayerShopUpgradeCost();
    if (!canAfford(cost) || state.playerShop.xp < getPlayerShopNextXp()) {
      addLog(`ショップ強化条件が足りません。必要: 経営EXP${getPlayerShopNextXp()} / ${formatCost(cost)}`, "warn");
      renderLogs();
      return;
    }
    spendResources(cost);
    state.playerShop.xp -= getPlayerShopNextXp();
    state.playerShop.level += 1;
    addLog(`ショップをLv.${state.playerShop.level}に拡張しました。販売効率が上がります。`, "win");
    saveState(false);
    renderAll();
  }

  function simulateTick(silent) {
    if (state.selectedLocation === "town") {
      state.exploring = false;
    }

    const stats = aggregateStats();
    const activeLocation = state.exploring ? getSelectedLocation() : LOCATION_BY_ID.town;

    performGathering(stats, activeLocation, silent);
    performCrafting(stats, silent);
    performExpeditions(stats, silent);
    performPlayerShop(stats, silent);

    if (!state.exploring || activeLocation.danger <= 0) {
      state.encounter = null;
      return;
    }

    performExplorationBattle(stats, activeLocation, silent);
  }

  function performExpeditions(stats, silent) {
    state.expeditions = normalizeExpeditions(state.expeditions);
    for (const slot of EXPEDITION_SLOTS) {
      const squad = state.expeditions.squads[slot.id];
      if (!squad.active || !isExpeditionSlotUnlocked(slot)) {
        continue;
      }

      const location = LOCATION_BY_ID[squad.locationId] || LOCATION_BY_ID.field;
      if (!location || location.danger <= 0) {
        squad.active = false;
        continue;
      }

      const expeditionStats = getExpeditionStats(slot, stats);
      const gain = (3.5 + expeditionStats.scout * 0.12 + expeditionStats.gather * 0.08 + expeditionStats.speed * 0.08) / location.distance;
      squad.progress = clamp(squad.progress + Math.max(2, gain), 0, 100);

      if (squad.progress < 100) {
        continue;
      }

      squad.progress = 0;
      const chance = estimateExpeditionWinChance(slot, location, stats);
      const enemyName = location.enemies[randomInt(0, location.enemies.length - 1)] || `${location.name}の魔物`;
      markMonsterDiscovered(enemyName, location.id);

      if (Math.random() <= chance) {
        squad.wins += 1;
        state.expeditions.totalWins = (state.expeditions.totalWins || 0) + 1;
        state.clears[location.id] = (state.clears[location.id] || 0) + 1;
        recordMonsterKill(location, enemyName);
        const gold = Math.max(1, Math.floor((location.gold || 0) * randomFloat(0.35, 0.72)));
        const xp = Math.max(1, Math.floor((location.exp || 0) * randomFloat(0.28, 0.56)));
        addResource("gold", gold);
        applyLoot(location, stats, false);
        applyXp(xp, true);
        addGuildReputation("gatherers", 2, true);
        addGuildReputation("adventurers", 2, true);
        if (!silent && Math.random() < 0.45) {
          addLog(`${slot.name}が${location.name}で遠征勝利。金貨+${gold} / 経験値+${xp}`, "win");
        }
      } else if (!silent && Math.random() < 0.25) {
        addLog(`${slot.name}は${location.name}で押し返されました。進行を立て直します。`, "warn");
      }
    }
  }

  function performPlayerShop(stats, silent) {
    state.playerShop = normalizePlayerShop(state.playerShop);
    if (!state.playerShop.open) {
      return;
    }
    const stockEntries = Object.entries(state.playerShop.stock).filter(([, amount]) => amount > 0);
    if (stockEntries.length === 0) {
      return;
    }
    const sellChance = clamp(0.045 + state.playerShop.level * 0.012 + stats.luck / 2200 + stats.supply / 1800, 0.04, 0.32);
    if (Math.random() > sellChance) {
      return;
    }
    const [key] = stockEntries[randomInt(0, stockEntries.length - 1)];
    const good = PLAYER_SHOP_GOODS[key];
    const amount = Math.min(state.playerShop.stock[key], Math.random() < 0.18 + state.playerShop.level * 0.01 ? 2 : 1);
    const gold = Math.floor(amount * good.price * (1 + state.playerShop.level * 0.08 + stats.luck / 1800));
    state.playerShop.stock[key] -= amount;
    state.playerShop.salesGold += gold;
    state.playerShop.totalSales += amount;
    state.playerShop.xp += good.xp * amount;
    addGuildReputation("artisans", 1, true);
    if (!silent && Math.random() < 0.35) {
      addLog(`ショップで${good.name}が${amount}個売れました。売上+${gold}`, "loot");
    }
  }

  function performExplorationBattle(stats, location, silent) {
    if (!state.encounter || state.encounter.locationId !== location.id || state.encounter.hp <= 0) {
      state.encounter = null;
      const searchGain = (5 + stats.speed * 0.18 + stats.scout * 0.22 + Math.sqrt(stats.partySize) * 0.7) / location.distance;
      state.progress = clamp(state.progress + Math.max(2.5, searchGain), 0, 100);
      const encounterChance = clamp(location.danger * 0.035 + stats.scout / 1500 + state.progress / 720, 0.04, 0.62);

      if (state.progress >= 100 || Math.random() < encounterChance) {
        startEncounter(location, stats, silent);
      }
      return;
    }

    advanceEncounter(stats, location, silent);
  }

  function startEncounter(location, stats, silent) {
    const clears = state.clears[location.id] || 0;
    const isStrongEnemy = clears > 0 && clears % 8 === 7;
    const enemyName = isStrongEnemy ? `${location.name}の強敵` : location.enemies[randomInt(0, location.enemies.length - 1)];
    const power = getEnemyPower(location, isStrongEnemy);
    const maxHp = Math.max(32, Math.floor(power * (isStrongEnemy ? 1.32 : 0.94) + location.danger * 24 + 35));

    markMonsterDiscovered(enemyName, location.id);
    state.encounter = {
      locationId: location.id,
      name: enemyName,
      hp: maxHp,
      maxHp,
      power,
      isStrongEnemy,
      startedAt: Date.now(),
    };
    state.progress = 0;

    if (!silent) {
      addLog(`${location.name}で${enemyName}と遭遇。自動戦闘を開始しました。`, "warn");
    }
  }

  function advanceEncounter(stats, location, silent) {
    const encounter = state.encounter;
    const baseDamage = stats.atk * 0.55 + stats.mag * 0.42 + stats.speed * 0.22 + stats.combat * 0.035;
    const damage = Math.max(5, baseDamage) * randomFloat(0.82, 1.2);
    encounter.hp = Math.max(0, encounter.hp - damage);

    if (encounter.hp <= 0) {
      completeEncounterVictory(location, stats, encounter, silent);
      return;
    }

    const pressureChance = clamp(encounter.power / (stats.combat + encounter.power + 220), 0.03, 0.32);
    if (Math.random() < pressureChance) {
      sufferEncounterPressure(encounter, silent);
    }
  }

  function completeEncounterVictory(location, stats, encounter, silent) {
    const clears = state.clears[location.id] || 0;
    state.clears[location.id] = clears + 1;
    recordMonsterKill(location, encounter.name);

    const strongMultiplier = encounter.isStrongEnemy ? 2.1 : 1;
    const gold = Math.floor((location.gold || 0) * randomFloat(0.85, 1.32) * strongMultiplier);
    const xp = Math.floor((location.exp || 0) * randomFloat(0.9, 1.24) * strongMultiplier);
    addResource("gold", gold);
    applyLoot(location, stats, encounter.isStrongEnemy);
    applyXp(xp, silent);
    gainFamiliarXp(Math.max(2, Math.floor(xp * 0.18)));
    addGuildReputation("adventurers", encounter.isStrongEnemy ? 9 : 4, true);
    addGuildReputation(state.guild?.activeId, encounter.isStrongEnemy ? 5 : 2, true);
    tryTameFamiliar(encounter, location, stats, silent);
    gainPartyBond(1 + location.danger + (encounter.isStrongEnemy ? 3 : 0), silent, location.name);

    if (encounter.isStrongEnemy) {
      addResource("charm", 1);
    }

    state.encounter = null;
    state.progress = 0;

    if (!silent) {
      addLog(`${encounter.name}を撃破。金貨+${gold} / 経験値+${xp}`, "win");
    }
  }

  function sufferEncounterPressure(encounter, silent) {
    const usedPotion = state.resources.potion > 0;
    const usedFood = !usedPotion && state.resources.food > 0;

    if (usedPotion) {
      state.resources.potion -= 1;
    } else if (usedFood) {
      state.resources.food -= 1;
    } else {
      state.progress = Math.max(0, state.progress - 8);
    }

    applyXp(Math.max(1, Math.floor(encounter.power * 0.025)), true);

    if (!silent && Math.random() < 0.35) {
      const consumeText = usedPotion ? "ポーションを1個使用" : usedFood ? "携行食を1個使用" : "消耗を抑えて踏みとどまりました";
      addLog(`${encounter.name}の反撃。${consumeText}。`, "warn");
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
      addGuildReputation("gatherers", 1, true);

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
      const facilities = getOwnedFacilities();
      const recipe = CRAFT_RECIPES.find((candidate) => candidate.auto === true && facilities.has(candidate.station) && canAfford(candidate.need));

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
        if (member.id === "hero") {
          state.skillTree = normalizeSkillTree(state.skillTree);
          state.skillTree.points += 1;
        }
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
      bossBonus: 0,
      partySize: state.members.length,
    };
    let itemPower = 0;

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

      for (const item of getEquippedItems(member)) {
        const rarity = getRarity(item.rarity);
        itemPower += rarity.rank * 1.8;
        for (const [key, value] of Object.entries(getItemEffectiveStats(item))) {
          if (typeof totals[key] === "number") {
            totals[key] += value;
          }
        }
      }

      if (member.id !== "hero") {
        const relic = getHeroineRelic(member);
        if (relic) {
          applyStatBonus(totals, relic.stats);
          if (bondLevel >= relic.skillLevel) {
            applyStatBonus(totals, relic.skillStats);
          }
        }
      }
    }

    for (const ability of getActiveAbilities()) {
      applyStatBonus(totals, ability.stats);
    }

    for (const effect of getActiveSetEffects()) {
      applyStatBonus(totals, effect.stats);
    }

    state.familiars = normalizeFamiliars(state.familiars);
    for (const familiar of state.familiars) {
      applyStatBonus(totals, getFamiliarStats(familiar));
    }

    state.guild = normalizeGuild(state.guild);
    const activeGuild = GUILD_BY_ID[state.guild.activeId];
    if (activeGuild) {
      const guildRank = getGuildRank(activeGuild.id);
      const guildStats = Object.fromEntries(Object.entries(activeGuild.stats).map(([key, value]) => [key, value * guildRank]));
      applyStatBonus(totals, guildStats);
    }

    applyStatBonus(totals, getClaimedAchievementStats());

    for (const facility of FACILITY_UPGRADES) {
      if (!getOwnedFacilities().has(facility.id)) {
        continue;
      }
      const level = getFacilityLevel(facility.id);
      if (level > 0) {
        const scaledStats = Object.fromEntries(Object.entries(facility.stats).map(([key, value]) => [key, value * level]));
        applyStatBonus(totals, scaledStats);
      }
    }

    for (const node of getUnlockedSkillNodes()) {
      applyStatBonus(totals, node.stats);
    }

    state.rebirth = normalizeRebirth(state.rebirth);
    const starseed = state.resources.starseed || 0;
    totals.atk += state.rebirth.count * 3 + starseed * 0.8;
    totals.def += state.rebirth.count * 2 + starseed * 0.55;
    totals.mag += state.rebirth.count * 2 + starseed * 0.55;
    totals.gather += state.rebirth.count * 2 + starseed * 0.5;
    totals.craft += state.rebirth.count * 2 + starseed * 0.5;
    totals.luck += state.rebirth.count * 1.5 + starseed * 0.35;

    totals.luck += state.haremLevel * 0.35;
    totals.supply += state.haremLevel * 0.25;
    totals.gearBonus = state.resources.gear * 3 + state.resources.charm * 5 + state.resources.food * 0.2 + itemPower;
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

  function estimateBossWinChance(boss, stats = aggregateStats()) {
    const ratio = (stats.combat + 64) / (stats.combat + boss.power + 96);
    return clamp(ratio + stats.heal / 620 + stats.luck / 760 + stats.def / 900 + (stats.bossBonus || 0), 0.05, 0.92);
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

  function getProfileBondLevel(profileId) {
    const member = state.members.find((candidate) => candidate.profileId === profileId);
    return member ? getBondInfo(member.affection).level : 0;
  }

  function getHeroineRelic(member) {
    return HEROINE_RELICS[member?.profileId] || null;
  }

  function getTamerMembers() {
    return state.members.filter((member) => member.jobId === "tamer");
  }

  function getFamiliarLimit() {
    return 6 + getTamerMembers().length * 3 + Math.floor((state.haremLevel || 1) / 2);
  }

  function getFamiliarStats(familiar) {
    const location = LOCATION_BY_ID[familiar.locationId] || LOCATION_BY_ID.field;
    const levelScale = 1 + (familiar.level - 1) * 0.18 + familiar.affinity * 0.01;
    return {
      atk: Math.max(1, Math.floor((location.danger * 2 + familiar.power * 0.06) * levelScale)),
      def: Math.max(1, Math.floor((location.danger + familiar.power * 0.035) * levelScale)),
      scout: Math.max(1, Math.floor((2 + location.danger) * levelScale)),
      luck: Math.max(0, Math.floor(familiar.affinity / 12)),
    };
  }

  function tryTameFamiliar(encounter, location, stats, silent) {
    const tamers = getTamerMembers();
    if (tamers.length === 0 || encounter.isStrongEnemy) {
      return;
    }
    state.familiars = normalizeFamiliars(state.familiars);
    const existing = state.familiars.find((familiar) => familiar.name === encounter.name && familiar.locationId === location.id);
    const hasFood = (state.resources.food || 0) > 0;
    const chance = clamp(0.04 + tamers.length * 0.05 + stats.luck / 1800 + stats.scout / 2400 + (hasFood ? 0.04 : 0), 0.03, 0.42);
    if (Math.random() > chance) {
      return;
    }
    if (hasFood) {
      state.resources.food -= 1;
    }
    if (existing) {
      existing.affinity += randomInt(8, 15);
      existing.xp += 12 + location.danger * 2;
      levelFamiliars();
      if (!silent) {
        addLog(`${encounter.name}との絆が深まりました。使い魔親和+${existing.affinity}`, "loot");
      }
      return;
    }
    if (state.familiars.length >= getFamiliarLimit()) {
      if (!silent) {
        addLog(`${encounter.name}をテイムできそうでしたが、使い魔枠がいっぱいです。`, "warn");
      }
      return;
    }
    state.familiars.push({
      id: `familiar-${Date.now()}-${state.familiars.length}`,
      name: encounter.name,
      locationId: location.id,
      level: 1,
      xp: 0,
      power: Math.max(8, Math.floor(encounter.power)),
      affinity: randomInt(12, 24),
      capturedAt: Date.now(),
    });
    addGuildReputation("gatherers", 4, true);
    if (!silent) {
      addLog(`テイマーの導きで${encounter.name}を使い魔にしました。`, "win");
    }
  }

  function gainFamiliarXp(amount) {
    state.familiars = normalizeFamiliars(state.familiars);
    for (const familiar of state.familiars) {
      familiar.xp += Math.max(1, Math.floor(amount));
      familiar.affinity += 1;
    }
    levelFamiliars();
  }

  function levelFamiliars() {
    for (const familiar of state.familiars || []) {
      let safety = 0;
      while (familiar.xp >= getNextFamiliarXp(familiar.level) && safety < 20) {
        safety += 1;
        familiar.xp -= getNextFamiliarXp(familiar.level);
        familiar.level += 1;
        familiar.power += 4 + Math.floor(familiar.level / 2);
      }
    }
  }

  function getNextFamiliarXp(level) {
    return 34 + level * 18 + level * level * 4;
  }

  function getTotalClears() {
    return Object.values(state.clears || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  }

  function getTotalBossClears() {
    return Object.values(state.bossClears || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  }

  function getGuildRank(guildId) {
    state.guild = normalizeGuild(state.guild);
    const reputation = state.guild.reputation[guildId] || 0;
    return clamp(1 + Math.floor(reputation / 100), 1, 10);
  }

  function getGuildRankProgress(guildId) {
    state.guild = normalizeGuild(state.guild);
    return clamp(((state.guild.reputation[guildId] || 0) % 100), 0, 100);
  }

  function addGuildReputation(guildId, amount, silent) {
    if (!GUILD_BY_ID[guildId] || amount <= 0) {
      return;
    }
    state.guild = normalizeGuild(state.guild);
    const beforeRank = getGuildRank(guildId);
    state.guild.reputation[guildId] = (state.guild.reputation[guildId] || 0) + Math.floor(amount);
    const afterRank = getGuildRank(guildId);
    if (!silent && afterRank > beforeRank) {
      addLog(`${GUILD_BY_ID[guildId].name}の評判ランクが${afterRank}になりました。`, "win");
    }
  }

  function ensureGeneratedGuildRequests(force = false) {
    const todayKey = getTokyoDateKey();
    state.guildRequests = normalizeGuildRequests(state.guildRequests);
    if (!force && state.guildRequests.dateKey === todayKey && state.guildRequests.generated.length > 0) {
      return false;
    }

    const fixedCompleted = Object.fromEntries(
      Object.entries(state.guildRequests.completed || {}).filter(([key]) => GUILD_REQUEST_BY_ID[key]),
    );
    state.guildRequests = {
      dateKey: todayKey,
      generated: generateDailyGuildRequests(todayKey),
      completed: fixedCompleted,
    };
    return true;
  }

  function generateDailyGuildRequests(dateKey) {
    const requests = [];
    for (const guild of GUILDS) {
      const rand = createSeededRandom(`${dateKey}:${guild.id}:${getGuildRank(guild.id)}:${state.members.length}:${state.haremLevel}`);
      const types = getGuildRandomRequestTypes(guild.id);
      for (let slot = 0; slot < 4; slot += 1) {
        const type = types[slot % types.length];
        const request = createRandomGuildRequest(guild, type, slot, dateKey, rand);
        if (request) {
          requests.push(request);
        }
      }
    }
    return requests;
  }

  function getGuildRandomRequestTypes(guildId) {
    if (guildId === "adventurers") {
      return ["monster", "clear", "monster", "boss"];
    }
    if (guildId === "gatherers") {
      return ["resource", "clear", "monster", "resource"];
    }
    if (guildId === "artisans") {
      return ["resource", "resource", "clear", "monster"];
    }
    if (guildId === "salon") {
      return ["resource", "clear", "resource", "boss"];
    }
    return ["monster", "resource", "clear"];
  }

  function createRandomGuildRequest(guild, type, slot, dateKey, rand) {
    const guildRank = getGuildRank(guild.id);
    const rank = slot < 2 ? Math.max(1, Math.min(guildRank, 1 + Math.floor(rand() * Math.max(1, guildRank)))) : clamp(guildRank + (rand() < 0.4 ? 1 : 0), 1, 10);
    if (type === "boss" && guildRank < 2) {
      type = rand() < 0.5 ? "monster" : "clear";
    }

    if (type === "resource") {
      return createRandomResourceRequest(guild, rank, slot, dateKey, rand);
    }
    if (type === "clear") {
      return createRandomClearRequest(guild, rank, slot, dateKey, rand);
    }
    if (type === "boss") {
      return createRandomBossRequest(guild, rank, slot, dateKey, rand);
    }
    return createRandomMonsterRequest(guild, rank, slot, dateKey, rand);
  }

  function createRandomMonsterRequest(guild, rank, slot, dateKey, rand) {
    const location = pickRandom(getRandomRequestLocations(rank), rand);
    const enemyIndex = Math.floor(rand() * location.enemies.length);
    const enemyName = location.enemies[enemyIndex];
    const amount = 2 + rank + Math.floor(rand() * (2 + Math.max(1, location.danger)));
    const target = {
      type: "monster",
      locationId: location.id,
      enemyIndex,
      amount,
      startValue: state.monsterKills?.[getMonsterKillKey(location.id, enemyName)] || 0,
    };
    return makeGeneratedGuildRequest({
      guild,
      rank,
      slot,
      dateKey,
      kind: "monster",
      title: `${location.name}の討伐依頼`,
      desc: `${enemyName}を${amount}体倒す日替わり依頼です。探索か遠征隊で進められます。`,
      target,
      reward: getGeneratedRequestReward(guild.id, rank, location, "monster", rand),
      reputation: 10 + rank * 8 + location.danger * 3,
    });
  }

  function createRandomClearRequest(guild, rank, slot, dateKey, rand) {
    const location = pickRandom(getRandomRequestLocations(rank), rand);
    const amount = 1 + Math.floor(rand() * Math.max(2, rank));
    const target = {
      type: "locationClear",
      locationId: location.id,
      amount,
      startValue: state.clears?.[location.id] || 0,
    };
    return makeGeneratedGuildRequest({
      guild,
      rank,
      slot,
      dateKey,
      kind: "clear",
      title: `${location.name}の巡回依頼`,
      desc: `${location.name}で探索勝利を${amount}回達成する依頼です。放置探索でも進みます。`,
      target,
      reward: getGeneratedRequestReward(guild.id, rank, location, "clear", rand),
      reputation: 12 + rank * 7 + location.danger * 3,
    });
  }

  function createRandomResourceRequest(guild, rank, slot, dateKey, rand) {
    const key = pickRandom(getRandomRequestResourcePool(guild.id), rand);
    const rareScale = key === "gear" || key === "relic" || key === "gift" || key === "charm" ? 0.38 : 1;
    const amount = Math.max(1, Math.floor((4 + rank * 3 + Math.floor(rand() * (5 + rank))) * rareScale));
    const target = { type: "resource", key, amount };
    return makeGeneratedGuildRequest({
      guild,
      rank,
      slot,
      dateKey,
      kind: "resource",
      title: `${RESOURCE_LABELS[key]}の納品依頼`,
      desc: `${RESOURCE_LABELS[key]}を${amount}個納品する日替わり依頼です。報告時に素材を消費します。`,
      target,
      reward: getGeneratedRequestReward(guild.id, rank, null, "resource", rand),
      reputation: 8 + rank * 7,
    });
  }

  function createRandomBossRequest(guild, rank, slot, dateKey, rand) {
    const candidates = BOSS_DUNGEONS.filter((boss) => boss.rank <= Math.max(2, rank + 1));
    const boss = pickRandom(candidates.length ? candidates : BOSS_DUNGEONS, rand);
    const target = {
      type: "boss",
      bossId: boss.id,
      amount: 1,
      startValue: state.bossClears?.[boss.id] || 0,
    };
    return makeGeneratedGuildRequest({
      guild,
      rank: Math.max(rank, boss.rank || 1),
      slot,
      dateKey,
      kind: "boss",
      title: `${boss.name}の緊急討伐`,
      desc: `${boss.name}を1回討伐する緊急依頼です。ボス・ダンジョンから挑戦できます。`,
      target,
      reward: getGeneratedRequestReward(guild.id, Math.max(rank, boss.rank || 1), LOCATION_BY_ID[boss.locationId], "boss", rand),
      reputation: 24 + Math.max(rank, boss.rank || 1) * 12,
    });
  }

  function makeGeneratedGuildRequest({ guild, rank, slot, dateKey, kind, title, desc, target, reward, reputation }) {
    return {
      id: `random:${dateKey}:${guild.id}:${slot}:${kind}`,
      generated: true,
      dateKey,
      guildId: guild.id,
      rank,
      title,
      desc,
      target,
      reward,
      reputation,
    };
  }

  function getRandomRequestLocations(rank) {
    const maxDanger = Math.max(1, rank + 1);
    const locations = LOCATIONS.filter((location) => location.danger > 0 && location.danger <= maxDanger && location.enemies?.length);
    return locations.length ? locations : LOCATIONS.filter((location) => location.danger > 0 && location.enemies?.length);
  }

  function getRandomRequestResourcePool(guildId) {
    if (guildId === "artisans") {
      return ["wood", "ore", "stone", "fiber", "gear"];
    }
    if (guildId === "gatherers") {
      return ["herb", "wood", "fish", "fiber", "hide", "stone"];
    }
    if (guildId === "salon") {
      return ["gift", "food", "potion", "charm", "herb"];
    }
    return ["hide", "ore", "potion", "food", "gear"];
  }

  function getGeneratedRequestReward(guildId, rank, location, type, rand) {
    const danger = location?.danger || rank;
    const reward = {
      gold: 70 + rank * 48 + danger * 18 + Math.floor(rand() * 55),
    };
    if (type === "boss") {
      reward.relic = Math.max(1, Math.floor(rank / 2));
      if (rank >= 3) {
        reward.gift = 1;
      }
      return reward;
    }
    if (type === "resource") {
      const bonus = pickRandom(guildId === "artisans" ? ["gear", "ore", "stone"] : ["potion", "food", "gift"], rand);
      reward[bonus] = bonus === "gear" || bonus === "gift" ? 1 : 2 + rank;
      return reward;
    }
    const drops = [...(location?.loot || []), ...(location?.gather || [])].map((entry) => entry.key);
    const bonus = pickRandom(drops.length ? drops : ["herb", "hide", "ore", "fish"], rand);
    reward[bonus] = 2 + rank + Math.floor(rand() * 3);
    if (rank >= 3 && rand() < 0.45) {
      reward.relic = 1;
    }
    return reward;
  }

  function createSeededRandom(seedText) {
    let seed = 2166136261;
    for (let index = 0; index < seedText.length; index += 1) {
      seed ^= seedText.charCodeAt(index);
      seed = Math.imul(seed, 16777619);
    }
    return () => {
      seed += 0x6d2b79f5;
      let value = seed;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickRandom(entries, rand) {
    return entries[Math.floor(rand() * entries.length)] || entries[0];
  }

  function getMonsterKillKey(locationId, monsterName) {
    return `${locationId}:${monsterName}`;
  }

  function recordMonsterKill(location, monsterName) {
    if (!location || !monsterName) {
      return;
    }
    state.monsterKills = normalizeCounterMap(state.monsterKills);
    const key = getMonsterKillKey(location.id, monsterName);
    state.monsterKills[key] = (state.monsterKills[key] || 0) + 1;
  }

  function getGuildRequestById(requestId) {
    state.guildRequests = normalizeGuildRequests(state.guildRequests);
    return GUILD_REQUEST_BY_ID[requestId] || state.guildRequests.generated.find((request) => request.id === requestId) || null;
  }

  function getGuildRequestTarget(request) {
    const target = request.target || {};
    if (target.type === "boss") {
      const boss = BOSS_BY_ID[target.bossId];
      return {
        name: boss?.name || "指定ボス",
        location: boss ? LOCATION_BY_ID[boss.locationId] : null,
        amount: target.amount || 1,
      };
    }
    if (target.type === "resource") {
      return {
        name: RESOURCE_LABELS[target.key] || target.key,
        location: null,
        amount: target.amount || 1,
      };
    }
    if (target.type === "locationClear") {
      const location = LOCATION_BY_ID[target.locationId] || LOCATION_BY_ID.field;
      return {
        name: `${location.name} 探索勝利`,
        location,
        amount: target.amount || 1,
      };
    }
    const location = LOCATION_BY_ID[target.locationId] || LOCATION_BY_ID.field;
    const name = location.enemies?.[target.enemyIndex || 0] || `${location.name}の魔物`;
    return {
      name,
      location,
      amount: target.amount || 1,
    };
  }

  function getGuildRequestProgress(request) {
    const target = request.target || {};
    if (target.type === "boss") {
      return Math.max(0, (state.bossClears?.[target.bossId] || 0) - (target.startValue || 0));
    }
    if (target.type === "resource") {
      return state.resources?.[target.key] || 0;
    }
    if (target.type === "locationClear") {
      return Math.max(0, (state.clears?.[target.locationId] || 0) - (target.startValue || 0));
    }
    const requestTarget = getGuildRequestTarget(request);
    return Math.max(0, (state.monsterKills?.[getMonsterKillKey(requestTarget.location.id, requestTarget.name)] || 0) - (target.startValue || 0));
  }

  function isGuildRequestUnlocked(request) {
    state.guild = normalizeGuild(state.guild);
    return state.guild.activeId === request.guildId && getGuildRank(request.guildId) >= (request.rank || 1);
  }

  function isExpeditionSlotUnlocked(slot) {
    return state.members.length >= slot.minMembers;
  }

  function getExpeditionStats(slot, stats = aggregateStats()) {
    const totalSlots = EXPEDITION_SLOTS.filter((candidate) => isExpeditionSlotUnlocked(candidate)).length || 1;
    const share = clamp(0.42 / totalSlots + 0.14, 0.22, 0.48);
    const expeditionStats = {
      atk: stats.atk * share,
      def: stats.def * share,
      mag: stats.mag * share,
      heal: stats.heal * share,
      gather: stats.gather * share,
      craft: stats.craft * share,
      scout: stats.scout * share,
      luck: stats.luck * share,
      speed: stats.speed * share,
      supply: stats.supply * share,
      combat: stats.combat * share,
    };
    applyStatBonus(expeditionStats, slot.stats);
    return expeditionStats;
  }

  function estimateExpeditionWinChance(slot, location, stats = aggregateStats()) {
    const expeditionStats = getExpeditionStats(slot, stats);
    const enemyPower = getEnemyPower(location, false) * 0.82;
    const ratio = (expeditionStats.combat + expeditionStats.gather * 0.8 + 35) / (expeditionStats.combat + enemyPower + 85);
    return clamp(ratio + expeditionStats.scout / 700 + expeditionStats.luck / 900, 0.08, 0.84);
  }

  function getExpeditionTotalWins() {
    state.expeditions = normalizeExpeditions(state.expeditions);
    return state.expeditions.totalWins || 0;
  }

  function markResourceDiscovered(key) {
    if (!RESOURCE_LABELS[key]) {
      return;
    }
    state.codex = normalizeCodex(state.codex);
    state.codex.resources[key] = true;
  }

  function markMonsterDiscovered(name, locationId, isBoss = false) {
    state.codex = normalizeCodex(state.codex);
    const key = `${isBoss ? "boss" : "mob"}:${locationId}:${name}`;
    state.codex.monsters[key] = {
      name,
      locationId,
      isBoss,
      seenAt: Date.now(),
    };
  }

  function isMonsterDiscovered(name, locationId, isBoss = false) {
    state.codex = normalizeCodex(state.codex);
    const key = `${isBoss ? "boss" : "mob"}:${locationId}:${name}`;
    return Boolean(state.codex.monsters[key] || (isBoss ? state.bossClears?.[name] : false) || (state.clears?.[locationId] || 0) > 0);
  }

  function getCodexCompletionCount() {
    const resourceCount = RESOURCE_META.filter(([key]) => Boolean(state.codex?.resources?.[key] || (state.resources[key] || 0) > 0)).length;
    const monsterCount = getMonsterCodexEntries().filter((entry) => entry.discovered).length;
    return resourceCount + monsterCount;
  }

  function getMonsterCodexEntries() {
    const entries = [];
    for (const location of LOCATIONS.filter((candidate) => candidate.danger > 0)) {
      for (const name of location.enemies || []) {
        entries.push({
          key: `mob:${location.id}:${name}`,
          name,
          location,
          isBoss: false,
          discovered: Boolean(state.codex?.monsters?.[`mob:${location.id}:${name}`] || (state.clears?.[location.id] || 0) > 0),
        });
      }
    }
    for (const boss of BOSS_DUNGEONS) {
      entries.push({
        key: `boss:${boss.locationId}:${boss.name}`,
        name: boss.name,
        location: LOCATION_BY_ID[boss.locationId] || LOCATION_BY_ID.town,
        isBoss: true,
        discovered: Boolean(state.codex?.monsters?.[`boss:${boss.locationId}:${boss.name}`] || (state.bossClears?.[boss.id] || 0) > 0),
      });
    }
    return entries;
  }

  function isAchievementUnlocked(achievement) {
    try {
      return Boolean(achievement.condition());
    } catch (error) {
      console.warn("Achievement condition failed", error);
      return false;
    }
  }

  function getClaimedAchievementStats() {
    state.achievements = normalizeAchievements(state.achievements);
    return ACHIEVEMENTS.filter((achievement) => state.achievements.claimed[achievement.id])
      .reduce((stats, achievement) => {
        for (const [key, value] of Object.entries(achievement.stats || {})) {
          stats[key] = (stats[key] || 0) + value;
        }
        return stats;
      }, {});
  }

  function getActiveTitle() {
    state.achievements = normalizeAchievements(state.achievements);
    return ACHIEVEMENT_BY_ID[state.achievements.activeTitleId] || null;
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

  function getDailyInfo() {
    const daily = normalizeDaily(state.daily);
    state.daily = daily;
    const todayKey = getTokyoDateKey();
    const yesterdayKey = getTokyoDateKey(-1);
    const claimed = daily.lastClaimDate === todayKey;
    const continued = daily.lastClaimDate === yesterdayKey;
    const nextStreak = claimed ? daily.streak : continued ? daily.streak + 1 : 1;
    const cycleDay = ((Math.max(1, nextStreak) - 1) % 7) + 1;
    const reward = getDailyReward(cycleDay, nextStreak);

    return {
      todayKey,
      yesterdayKey,
      claimed,
      continued,
      nextStreak,
      cycleDay,
      reward,
      currentStreak: daily.streak,
      totalClaims: daily.totalClaims,
    };
  }

  function getDailyReward(cycleDay, streak) {
    const reward = {
      gold: 70 + cycleDay * 18 + Math.min(streak, 30) * 3,
      gift: 1,
    };

    if (cycleDay >= 2) {
      reward.herb = 4;
      reward.food = 2;
    }

    if (cycleDay >= 3) {
      reward.potion = 2;
      reward.ore = 2;
    }

    if (cycleDay >= 5) {
      reward.gear = 1;
      reward.relic = 1;
    }

    if (cycleDay === 7) {
      reward.gold += 120;
      reward.gift += 3;
      reward.charm = 1;
    }

    return reward;
  }

  function getTokyoDateKey(offsetDays = 0) {
    const date = new Date(Date.now() + offsetDays * 86400000);
    const parts = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function addResource(key, amount) {
    state.resources[key] = Math.max(0, (state.resources[key] || 0) + amount);
    if (amount > 0) {
      markResourceDiscovered(key);
    }
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

  function getCurrentBase() {
    state.base = normalizeBase(state.base);
    return BASE_BY_ID[state.base.homeId] || BASE_BY_ID.inn;
  }

  function getOwnedFacilities() {
    state.base = normalizeBase(state.base);
    const facilities = new Set();
    for (const baseId of state.base.owned) {
      const base = BASE_BY_ID[baseId];
      if (!base) continue;
      for (const facility of base.facilities) {
        facilities.add(facility);
      }
    }
    return facilities;
  }

  function getFacilityLevel(facilityId) {
    state.facilityLevels = normalizeFacilityLevels(state.facilityLevels);
    return Math.max(0, Math.floor(Number(state.facilityLevels[facilityId]) || 0));
  }

  function getFacilityUpgradeCost(facilityId) {
    const facility = FACILITY_UPGRADE_BY_ID[facilityId];
    const nextLevel = getFacilityLevel(facilityId) + 1;
    if (!facility || nextLevel > facility.maxLevel) {
      return {};
    }

    const cost = {
      gold: 110 + nextLevel * 85 + nextLevel * nextLevel * 22,
      wood: Math.max(2, nextLevel * 3),
      stone: Math.max(1, nextLevel * 2),
    };

    if (facilityId === "forge") {
      cost.ore = nextLevel * 3;
      cost.gear = Math.max(1, nextLevel - 1);
    } else if (facilityId === "alchemy") {
      cost.herb = nextLevel * 5;
      cost.potion = Math.max(1, nextLevel - 1);
    } else if (facilityId === "kitchen") {
      cost.fish = nextLevel * 2;
      cost.food = Math.max(1, nextLevel);
    } else if (facilityId === "jewel" || facilityId === "enchant") {
      cost.ore = nextLevel * 2;
      cost.relic = Math.max(1, nextLevel - 2);
    } else if (facilityId === "workbench") {
      cost.fiber = nextLevel * 2;
      cost.hide = Math.max(1, nextLevel - 1);
    } else {
      cost.herb = nextLevel * 2;
    }

    return cost;
  }

  function getOwnedUpgradeableFacilities() {
    const ownedFacilities = getOwnedFacilities();
    return FACILITY_UPGRADES.filter((facility) => ownedFacilities.has(facility.id));
  }

  function getUnlockedSkillNodes() {
    state.skillTree = normalizeSkillTree(state.skillTree);
    return SKILL_TREE_NODES.filter((node) => state.skillTree.unlocked[node.id]);
  }

  function canUnlockSkillNode(node) {
    state.skillTree = normalizeSkillTree(state.skillTree);
    if (!node || state.skillTree.unlocked[node.id]) {
      return false;
    }
    if ((node.requires || []).some((requiredId) => !state.skillTree.unlocked[requiredId])) {
      return false;
    }
    return state.skillTree.points >= (node.cost?.points || 0) && (state.resources.starseed || 0) >= (node.cost?.starseed || 0);
  }

  function getRebirthPreview() {
    const heroLevel = state.members[0]?.level || 1;
    const haremLevel = state.haremLevel || 1;
    const clearTotal = Object.values(state.clears || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
    const bossTotal = Object.values(state.bossClears || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
    const available = heroLevel >= 10 || haremLevel >= 4 || bossTotal >= 3;
    const gain = available
      ? Math.max(1, Math.floor(heroLevel / 8) + Math.floor(haremLevel / 3) + bossTotal + Math.floor(clearTotal / 18))
      : 0;
    const skillPoints = available ? Math.max(1, Math.floor(heroLevel / 10) + Math.floor(bossTotal / 2)) : 0;
    const reason = "主人公Lv10、ハーレムLv4、またはボス討伐3回で転生できます。";

    return {
      available,
      gain,
      skillPoints,
      heroLevel,
      haremLevel,
      clearTotal,
      bossTotal,
      reason,
    };
  }

  function formatFacilities(facilities) {
    return facilities.map((facility) => CRAFT_STATIONS[facility] || facility).join(" / ");
  }

  function getRarity(rarityId) {
    return RARITY_BY_ID[rarityId] || RARITY_BY_ID.common;
  }

  function getItemMaxLevel(item) {
    return EQUIPMENT_BASE_MAX_LEVEL + (Math.max(0, Number(item.limitBreak) || 0) * EQUIPMENT_LEVELS_PER_BREAK);
  }

  function getItemEffectiveStats(item) {
    const rarity = getRarity(item.rarity);
    const level = Math.max(0, Number(item.level) || 0);
    const limitBreak = Math.max(0, Number(item.limitBreak) || 0);
    const multiplier = 1 + level * 0.12 + limitBreak * 0.2 + (rarity.rank - 1) * 0.03;
    const stats = {};

    for (const [key, value] of Object.entries(item.baseStats || item.stats || {})) {
      stats[key] = Math.max(1, Math.ceil(value * multiplier));
    }

    return stats;
  }

  function getEnhanceCost(item) {
    const nextLevel = (Number(item.level) || 0) + 1;
    const rarity = getRarity(item.rarity);
    const cost = {
      gold: 20 + nextLevel * 18 + rarity.rank * 14,
      gear: Math.max(1, Math.ceil(nextLevel / 3)),
    };

    if (item.slot === "weapon") {
      cost.ore = 2 + rarity.rank + nextLevel;
    } else if (item.slot === "armor") {
      cost.hide = 2 + rarity.rank + Math.ceil(nextLevel / 2);
      cost.ore = 1 + rarity.rank;
    } else if (item.slot === "tool") {
      cost.wood = 2 + rarity.rank + Math.ceil(nextLevel / 2);
      cost.fiber = 1 + Math.ceil(nextLevel / 2);
    } else if (item.slot === "accessory") {
      cost.relic = Math.max(1, Math.ceil(rarity.rank / 2));
      cost.fiber = 2 + nextLevel;
    }

    return cost;
  }

  function getLimitBreakCost(item) {
    const nextBreak = (Number(item.limitBreak) || 0) + 1;
    const rarity = getRarity(item.rarity);
    return {
      gold: 180 * nextBreak + rarity.rank * 80,
      relic: nextBreak + Math.ceil(rarity.rank / 2),
      charm: Math.max(1, nextBreak),
      gear: rarity.rank + nextBreak,
    };
  }

  function getNextRarity(item) {
    const rarity = getRarity(item.rarity);
    return RARITIES.find((candidate) => candidate.rank === rarity.rank + 1) || null;
  }

  function getEvolutionCost(item) {
    const nextRarity = getNextRarity(item);
    if (!nextRarity) {
      return {};
    }

    const evolution = Math.max(0, Number(item.evolution) || 0);
    const cost = {
      gold: 420 + nextRarity.rank * 180 + evolution * 240,
      relic: Math.max(1, nextRarity.rank),
      charm: Math.max(1, Math.ceil(nextRarity.rank / 2)),
      gear: nextRarity.rank * 2 + evolution,
    };

    if (item.slot === "weapon") {
      cost.ore = 8 + nextRarity.rank * 4;
    } else if (item.slot === "armor") {
      cost.ore = 5 + nextRarity.rank * 3;
      cost.hide = 6 + nextRarity.rank * 3;
    } else if (item.slot === "tool") {
      cost.wood = 8 + nextRarity.rank * 3;
      cost.fiber = 5 + nextRarity.rank * 3;
    } else if (item.slot === "accessory") {
      cost.relic += 1;
      cost.fiber = 6 + nextRarity.rank * 3;
    }

    if (nextRarity.rank >= 5) {
      cost.gift = nextRarity.rank - 3;
    }

    return cost;
  }

  function getSlotLabel(slotId) {
    return EQUIPMENT_SLOT_BY_ID[slotId]?.label || slotId;
  }

  function getItemById(itemId) {
    return state.inventory.find((item) => item.id === itemId) || null;
  }

  function getEquippedItems(member) {
    const equipment = normalizeEquipment(member.equipment);
    return EQUIPMENT_SLOTS.map((slot) => getItemById(equipment[slot.id])).filter(Boolean);
  }

  function findItemOwnerName(itemId) {
    for (const member of state.members) {
      const equipment = normalizeEquipment(member.equipment);
      if (Object.values(equipment).includes(itemId)) {
        return member.name;
      }
    }
    return "";
  }

  function getEquippedItemIds(excludeMemberId = "") {
    const ids = new Set();
    for (const member of state.members) {
      if (member.id === excludeMemberId) {
        continue;
      }
      const equipment = normalizeEquipment(member.equipment);
      for (const itemId of Object.values(equipment)) {
        if (itemId) {
          ids.add(itemId);
        }
      }
    }
    return ids;
  }

  function getAllEquippedItems() {
    return state.members.flatMap((member) => getEquippedItems(member));
  }

  function getActiveAbilities() {
    return ABILITIES.filter((ability) => {
      try {
        return ability.condition();
      } catch (error) {
        console.warn("Ability condition failed", error);
        return false;
      }
    });
  }

  function getActiveSetEffects() {
    const equippedRecipeIds = new Set(getAllEquippedItems().map((item) => item.recipeId));
    const active = [];

    for (const set of EQUIPMENT_SETS) {
      const count = set.pieces.filter((recipeId) => equippedRecipeIds.has(recipeId)).length;
      for (const bonus of set.bonuses) {
        if (count >= bonus.count) {
          active.push({
            set,
            count,
            required: bonus.count,
            stats: bonus.stats,
            text: bonus.text,
          });
        }
      }
    }

    return active;
  }

  function applyStatBonus(totals, stats = {}) {
    for (const [key, value] of Object.entries(stats)) {
      if (key === "boss") {
        totals.bossBonus = (totals.bossBonus || 0) + value;
      } else if (typeof totals[key] === "number") {
        totals[key] += value;
      }
    }
  }

  function createCraftedItem(recipe) {
    const rarity = getRarity(recipe.rarity);
    const stats = {};
    for (const [key, value] of Object.entries(recipe.stats || {})) {
      stats[key] = Math.max(1, Math.ceil(value * rarity.multiplier));
    }

    return {
      id: `item-${state.nextItemId++}`,
      recipeId: recipe.id,
      name: recipe.name,
      rarity: recipe.rarity,
      slot: recipe.slot || "misc",
      baseStats: stats,
      stats,
      level: 0,
      limitBreak: 0,
      evolution: 0,
      createdAt: Date.now(),
    };
  }

  function createShopEquipmentItem(catalog) {
    const rarity = getRarity(catalog.rarity);
    const stats = {};
    for (const [key, value] of Object.entries(catalog.stats || {})) {
      stats[key] = Math.max(1, Math.ceil(value * rarity.multiplier));
    }
    return {
      id: `item-${state.nextItemId++}`,
      recipeId: `shop:${catalog.id}`,
      name: catalog.name,
      rarity: catalog.rarity,
      slot: catalog.slot,
      baseStats: stats,
      stats,
      level: 0,
      limitBreak: 0,
      evolution: 0,
      createdAt: Date.now(),
    };
  }

  function getPlayerShopNextXp() {
    state.playerShop = normalizePlayerShop(state.playerShop);
    return 70 + state.playerShop.level * 45;
  }

  function getPlayerShopUpgradeCost() {
    state.playerShop = normalizePlayerShop(state.playerShop);
    const nextLevel = state.playerShop.level + 1;
    return {
      gold: 260 + nextLevel * 120,
      wood: 8 + nextLevel * 3,
      stone: 4 + nextLevel * 2,
    };
  }

  function formatCost(cost) {
    const entries = Object.entries(cost || {});
    if (entries.length === 0) {
      return "無料";
    }
    return entries.map(([key, amount]) => `${RESOURCE_LABELS[key] || key}${amount}`).join(" / ");
  }

  function formatItemStats(stats) {
    const entries = Object.entries(stats || {});
    if (entries.length === 0) {
      return "効果なし";
    }
    return entries.map(([key, value]) => `${STAT_LABELS[key] || key}+${formatNumber(value)}`).join(" / ");
  }

  function formatRecipeResult(recipe) {
    if (recipe.resultType === "equipment") {
      const rarity = getRarity(recipe.rarity);
      const stats = {};
      for (const [key, value] of Object.entries(recipe.stats || {})) {
        stats[key] = Math.max(1, Math.ceil(value * rarity.multiplier));
      }
      return `${recipe.name} / ${rarity.name} / ${formatItemStats(stats)}`;
    }
    return `${RESOURCE_LABELS[recipe.key] || recipe.key}+${recipe.amount}`;
  }

  function areRequirementsMet(requirements = []) {
    return requirements.every((requirement) => getRequirementValue(requirement) >= requirement.amount);
  }

  function getRequirementValue(requirement) {
    if (requirement.type === "clears") {
      return state.clears[requirement.key] || 0;
    }
    if (requirement.type === "bossClears") {
      return state.bossClears?.[requirement.key] || 0;
    }
    if (requirement.type === "baseOwned") {
      return normalizeBase(state.base).owned.length;
    }
    if (requirement.type === "facility") {
      return getOwnedFacilities().has(requirement.key) ? 1 : 0;
    }
    if (requirement.type === "haremLevel") {
      return state.haremLevel || 1;
    }
    if (requirement.type === "heroLevel") {
      return state.members[0]?.level || 1;
    }
    if (requirement.type === "inventorySlot") {
      return (state.inventory || []).filter((item) => item.slot === requirement.key).length;
    }
    if (requirement.type === "resource") {
      return state.resources[requirement.key] || 0;
    }
    return 0;
  }

  function renderRequirementText(requirement) {
    const value = getRequirementValue(requirement);
    return `${requirement.label || requirement.key}: ${formatNumber(Math.min(value, requirement.amount))} / ${formatNumber(requirement.amount)}`;
  }

  function renderAll() {
    renderTopbar();
    renderHero();
    renderRoster();
    renderBase();
    renderMap();
    renderLocation();
    renderExpeditions();
    renderCraft();
    renderStory();
    renderSkills();
    renderJobs();
    renderFamiliars();
    renderMarket();
    renderGuild();
    renderCodex();
    renderAchievements();
    renderResources();
    renderDaily();
    renderAccount();
    renderLogs();
    applyViewVisibility();
  }

  function renderTick() {
    renderTopbar();
    renderBase();
    renderLocation();
    renderExpeditions();
    renderCraft();
    renderStory();
    renderSkills();
    renderFamiliars();
    renderMarket();
    renderGuild();
    renderCodex();
    renderAchievements();
    renderResources();
    renderDaily();
    renderLogs();

    if (!isFocusedWithin("heroPanel")) {
      renderHero();
    }

    if (!isFocusedWithin("rosterPanel")) {
      renderRoster();
    }

    applyViewVisibility();
  }

  function renderTopbar() {
    const location = getSelectedLocation();
    const stats = aggregateStats();
    const hero = state.members[0];
    const harem = getHaremSummary();
    const title = getActiveTitle();
    const status = state.exploring ? "探索中" : "拠点作業中";
    const heroXpPercent = Math.floor(clamp((hero.xp / getNextLevelXp(hero.level)) * 100, 0, 100));
    const menu = VIEW_DEFS.map((view) => {
      const active = state.view === view.id ? "active" : "";
      return `<button type="button" class="${active}" data-action="set-view" data-view="${escapeAttr(view.id)}">${escapeHtml(view.label)}</button>`;
    }).join("");

    elements.topbar.innerHTML = `
      <div class="brand">
        <h1>星灯りのハーレム開拓記</h1>
        <p>放置型ハクスラRPG / ヒロイン親愛RPG</p>
      </div>
      ${renderTopStat("現在地", `${location.name} / ${status}`)}
      ${renderTopStat("主人公Lv", `Lv.${hero.level} / ${heroXpPercent}%`)}
      ${renderTopStat("ハーレムLv", `Lv.${harem.haremLevel} / ヒロイン${harem.partners.length}人${title ? ` / ${title.title}` : ""}`)}
      ${renderTopStat("総合戦力", `${formatNumber(stats.combat)} 戦力`)}
      <div class="top-actions brand">
        <button type="button" data-action="save">保存</button>
        <button type="button" data-action="load">読込</button>
        <button type="button" data-action="reset">初期化</button>
      </div>
      <nav class="main-menu" aria-label="メインメニュー">${menu}</nav>
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
    cleanupEquipmentAssignments();
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
            ${renderMemberJobControl(member, job, isHero)}
            ${renderEquipmentControls(member)}
            ${isHero ? "" : renderHeroineRelicCard(member, bond)}
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

  function renderHeroineRelicCard(member, bond) {
    const relic = getHeroineRelic(member);
    if (!relic) {
      return "";
    }
    const active = bond.level >= relic.skillLevel;
    return `
      <div class="heroine-relic ${active ? "active" : ""}">
        <div>
          <div class="card-kicker">ヒロイン専用装備 / ${active ? "親密度スキル発動中" : `親愛Lv.${relic.skillLevel}で解放`}</div>
          <strong>${escapeHtml(relic.name)}</strong>
          <p>${escapeHtml(relic.desc)}</p>
        </div>
        <div class="stat-chip-row">${renderStatsChips(relic.stats)}</div>
        <div class="heroine-skill">
          <span>${escapeHtml(relic.skillName)}</span>
          <div class="stat-chip-row">${renderStatsChips(relic.skillStats)}</div>
        </div>
      </div>
    `;
  }

  function renderEquipmentControls(member) {
    const equipment = normalizeEquipment(member.equipment);
    const equippedByOther = getEquippedItemIds(member.id);

    return `
      <div class="equipment-grid">
        ${EQUIPMENT_SLOTS.map((slot) => {
          const currentItem = getItemById(equipment[slot.id]);
          const itemOptions = state.inventory
            .filter((item) => item.slot === slot.id && (!equippedByOther.has(item.id) || item.id === equipment[slot.id]))
            .map((item) => {
              const rarity = getRarity(item.rarity);
              const selected = item.id === equipment[slot.id] ? "selected" : "";
              return `<option value="${escapeAttr(item.id)}" ${selected}>${escapeHtml(item.name)} / ${escapeHtml(rarity.name)}</option>`;
            })
            .join("");
          const summary = currentItem
            ? `${getRarity(currentItem.rarity).name} Lv.${currentItem.level || 0}/${getItemMaxLevel(currentItem)} 突破+${currentItem.limitBreak || 0} 進化+${currentItem.evolution || 0} / ${formatItemStats(getItemEffectiveStats(currentItem))}`
            : "未装備";

          return `
            <label class="equipment-field">
              <span>${escapeHtml(slot.label)}</span>
              <select data-member-equipment="${escapeAttr(member.id)}" data-equipment-slot="${escapeAttr(slot.id)}" aria-label="${escapeAttr(member.name)}の${escapeAttr(slot.label)}">
                <option value="">未装備</option>
                ${itemOptions}
              </select>
              <small>${escapeHtml(summary)}</small>
            </label>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderMemberJobControl(member, job, isHero) {
    if (isHero) {
      return `
        <select data-member-job="${escapeAttr(member.id)}" aria-label="${escapeAttr(member.name)}の職業">
          ${renderJobOptions(member.jobId)}
        </select>
      `;
    }

    return `
      <div class="locked-job">
        <span>固定職</span>
        <strong>${escapeHtml(job.name)}</strong>
      </div>
    `;
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
    const encounter = state.encounter?.locationId === location.id ? state.encounter : null;
    const progress = encounter
      ? clamp((1 - encounter.hp / encounter.maxHp) * 100, 0, 100)
      : location.danger > 0
        ? clamp(state.progress, 0, 100)
        : clamp(state.craftProgress / 140 * 100, 0, 100);
    const progressLabel = encounter ? `${encounter.name} HP` : location.id === "town" ? "生産進行" : "モンスター探索";
    const progressText = encounter ? `${Math.ceil(encounter.hp)} / ${encounter.maxHp}` : `${Math.floor(progress)}%`;
    const clears = state.clears[location.id] || 0;
    const drops = [
      ...(location.gather || []).map((entry) => RESOURCE_LABELS[entry.key]),
      ...(location.loot || []).map((entry) => RESOURCE_LABELS[entry.key]),
    ];
    const uniqueDrops = Array.from(new Set(drops)).slice(0, 7);
    const isTown = location.id === "town";
    const actionLabel = state.exploring ? "街へ戻る" : "一緒に探索";
    const actionClass = state.exploring ? "danger-action" : "primary-action";
    const bossCards = BOSS_DUNGEONS.filter((boss) => boss.locationId === location.id)
      .map((boss) => {
        const unlocked = areRequirementsMet(boss.unlock);
        const chanceText = `${Math.round(estimateBossWinChance(boss, stats) * 100)}%`;
        const clears = state.bossClears?.[boss.id] || 0;
        const disabled = !unlocked || !canAfford(boss.cost) ? "disabled" : "";
        const requirementText = boss.unlock.map((requirement) => `<span class="tag ${getRequirementValue(requirement) >= requirement.amount ? "good" : ""}">${escapeHtml(renderRequirementText(requirement))}</span>`).join("");
        const buttonText = unlocked ? "ボスに挑戦" : "未出現";

        return `
          <article class="boss-card ${unlocked ? "ready" : ""}">
            <div>
              <div class="card-kicker">${unlocked ? `勝率 ${chanceText} / 討伐 ${clears}回` : "出現条件未達成"}</div>
              <h3>${escapeHtml(boss.name)}</h3>
              <p>${escapeHtml(boss.desc)}</p>
            </div>
            <div class="tag-row">${requirementText}</div>
            <div class="boss-meta">挑戦費用: ${escapeHtml(formatCost(boss.cost))} / 報酬: ${escapeHtml(renderRewardText({ ...(boss.reward || {}), ...(clears ? {} : boss.firstReward || {}) }))}</div>
            <button type="button" class="danger-action" data-action="challenge-boss" data-boss="${escapeAttr(boss.id)}" ${disabled}>${escapeHtml(buttonText)}</button>
          </article>
        `;
      })
      .join("");
    const bossPanel = bossCards
      ? `
        <div class="boss-section">
          <h3 class="section-label">ボス・ダンジョン</h3>
          <div class="boss-grid">${bossCards}</div>
        </div>
      `
      : "";

    const battlePanel = encounter
      ? `
        <div class="battle-card active">
          <div>
            <div class="card-kicker">${encounter.isStrongEnemy ? "強敵遭遇" : "通常遭遇"} / 自動戦闘中</div>
            <h3>${escapeHtml(encounter.name)}</h3>
            <p>パーティーが自動で攻撃しています。閉じていても探索中なら戦闘は進みます。</p>
          </div>
          <div class="battle-hp">
            <span>HP ${Math.ceil(encounter.hp)} / ${encounter.maxHp}</span>
            <div class="progress-bar" aria-hidden="true"><i style="--value: ${clamp((encounter.hp / encounter.maxHp) * 100, 0, 100)}%"></i></div>
          </div>
        </div>
      `
      : !isTown
        ? `
          <div class="battle-card">
            <div>
              <div class="card-kicker">遭遇探索</div>
              <h3>モンスターを捜索中</h3>
              <p>探索ゲージが進むほど遭遇率が上がります。敵が出たら自動で戦闘に入ります。</p>
            </div>
          </div>
        `
        : "";

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
            <span>${escapeHtml(progressLabel)}</span>
            <strong>${escapeHtml(progressText)}</strong>
          </div>
          <div class="progress-bar" aria-hidden="true"><i style="--value: ${progress}%"></i></div>
          <div class="tag-row">
            <span class="tag good">全員同行 ${state.members.length}人 / 上限なし</span>
            <span class="tag">勝利で親愛上昇</span>
            <span class="tag">戦力 ${formatNumber(stats.combat)}</span>
            <span class="tag">採取 ${formatNumber(stats.gather)}</span>
            <span class="tag">生産 ${formatNumber(stats.craft)}</span>
          </div>
          ${battlePanel}
        </div>
      </div>
      ${bossPanel}
    `;
  }

  function renderExpeditions() {
    state.expeditions = normalizeExpeditions(state.expeditions);
    const locationButtons = LOCATIONS.filter((location) => location.danger > 0);
    const cards = EXPEDITION_SLOTS.map((slot) => {
      const unlocked = isExpeditionSlotUnlocked(slot);
      const squad = state.expeditions.squads[slot.id];
      const location = LOCATION_BY_ID[squad.locationId] || LOCATION_BY_ID.field;
      const chance = unlocked ? Math.round(estimateExpeditionWinChance(slot, location) * 100) : 0;
      const buttonText = squad.active ? "待機させる" : "出発させる";
      const disabled = unlocked ? "" : "disabled";
      const stats = renderStatsChips(slot.stats);

      return `
        <article class="expedition-card ${squad.active ? "active" : ""} ${unlocked ? "" : "locked"}">
          <div>
            <div class="card-kicker">${unlocked ? (squad.active ? "遠征中" : "待機中") : `仲間${slot.minMembers}人で解放`} / 勝利${squad.wins}回</div>
            <h3>${escapeHtml(slot.name)}</h3>
            <p>${escapeHtml(slot.desc)}</p>
          </div>
          <div class="stat-chip-row">${stats}</div>
          <div class="expedition-targets">
            ${locationButtons.map((candidate) => {
              const selected = candidate.id === squad.locationId ? "active" : "";
              return `<button type="button" class="${selected}" data-action="set-expedition-location" data-slot="${escapeAttr(slot.id)}" data-location="${escapeAttr(candidate.id)}" ${disabled}>${escapeHtml(candidate.name)}</button>`;
            }).join("")}
          </div>
          <div class="progress-top">
            <span>${escapeHtml(location.name)} / 勝率目安 ${chance}%</span>
            <strong>${Math.floor(squad.progress)}%</strong>
          </div>
          <div class="progress-bar" aria-hidden="true"><i style="--value: ${squad.progress}%"></i></div>
          <button type="button" data-action="toggle-expedition" data-slot="${escapeAttr(slot.id)}" ${disabled}>${escapeHtml(buttonText)}</button>
        </article>
      `;
    }).join("");

    elements.expeditionPanel.innerHTML = `
      <div class="panel-title">
        <h2>遠征隊の分割</h2>
        <small>合計勝利 ${getExpeditionTotalWins()}回</small>
      </div>
      <div class="expedition-grid">${cards}</div>
    `;
  }

  function renderFamiliars() {
    state.familiars = normalizeFamiliars(state.familiars);
    const familiarCards = state.familiars.length
      ? state.familiars.map((familiar) => {
          const location = LOCATION_BY_ID[familiar.locationId] || LOCATION_BY_ID.field;
          const nextXp = getNextFamiliarXp(familiar.level);
          const xpPercent = clamp((familiar.xp / nextXp) * 100, 0, 100);
          return `
            <article class="familiar-card">
              <div>
                <div class="card-kicker">${escapeHtml(location.name)} / 親和 ${familiar.affinity}</div>
                <h3>${escapeHtml(familiar.name)}</h3>
                <p>テイマーが絆を結んだ使い魔。探索と戦闘を補助します。</p>
              </div>
              <div class="mini-meter-row">
                <span>Lv.${familiar.level}</span>
                <div class="mini-meter" aria-hidden="true"><i style="--value: ${xpPercent}%"></i></div>
                <strong>${Math.floor(xpPercent)}%</strong>
              </div>
              <div class="stat-chip-row">${renderStatsChips(getFamiliarStats(familiar))}</div>
            </article>
          `;
        }).join("")
      : '<p class="empty-log">テイマー職の仲間がいる状態でモンスターを倒すと、確率で使い魔になります。</p>';

    elements.familiarPanel.innerHTML = `
      <div class="panel-title">
        <h2>使い魔</h2>
        <small>${state.familiars.length} / ${getFamiliarLimit()}体</small>
      </div>
      <div class="familiar-grid">${familiarCards}</div>
    `;
  }

  function renderMarket() {
    state.playerShop = normalizePlayerShop(state.playerShop);
    const equipmentCards = SHOP_EQUIPMENT.map((item) => {
      const rarity = getRarity(item.rarity);
      const disabled = (state.resources.gold || 0) < item.price ? "disabled" : "";
      return `
        <article class="market-card" style="--rarity-color: ${escapeAttr(rarity.color)}">
          <div>
            <div class="card-kicker">${escapeHtml(getSlotLabel(item.slot))} / ${escapeHtml(rarity.name)}</div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(formatItemStats(item.stats))}</p>
          </div>
          <div class="quest-reward">価格: 金貨${item.price}</div>
          <button type="button" data-action="buy-shop-equipment" data-item="${escapeAttr(item.id)}" ${disabled}>購入する</button>
        </article>
      `;
    }).join("");
    const potionCards = POTION_SHOP_ITEMS.map((item) => {
      const disabled = (state.resources.gold || 0) < item.price ? "disabled" : "";
      return `
        <article class="market-card">
          <div>
            <div class="card-kicker">ポーション屋 / ${escapeHtml(RESOURCE_LABELS[item.key] || item.key)}</div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(RESOURCE_LABELS[item.key] || item.key)}を${item.amount}個入手します。</p>
          </div>
          <div class="quest-reward">価格: 金貨${item.price}</div>
          <button type="button" data-action="buy-potion-item" data-item="${escapeAttr(item.id)}" ${disabled}>購入する</button>
        </article>
      `;
    }).join("");
    const stockCards = Object.entries(PLAYER_SHOP_GOODS).map(([key, good]) => {
      const owned = state.resources[key] || 0;
      const stocked = state.playerShop.stock[key] || 0;
      return `
        <article class="shop-stock-card">
          <div>
            <div class="card-kicker">在庫 ${stocked} / 所持 ${owned}</div>
            <h3>${escapeHtml(good.name)}</h3>
            <p>販売目安: 1個あたり金貨${good.price} / 経営EXP+${good.xp}</p>
          </div>
          <div class="shop-stock-actions">
            <button type="button" data-action="stock-player-shop" data-resource="${escapeAttr(key)}" data-amount="1" ${owned < 1 ? "disabled" : ""}>1個入荷</button>
            <button type="button" data-action="stock-player-shop" data-resource="${escapeAttr(key)}" data-amount="5" ${owned < 1 ? "disabled" : ""}>5個入荷</button>
            <button type="button" data-action="stock-player-shop" data-resource="${escapeAttr(key)}" data-amount="all" ${owned < 1 ? "disabled" : ""}>全部</button>
          </div>
        </article>
      `;
    }).join("");
    const nextXp = getPlayerShopNextXp();
    const upgradeCost = getPlayerShopUpgradeCost();
    const upgradeDisabled = state.playerShop.level >= 10 || state.playerShop.xp < nextXp || !canAfford(upgradeCost) ? "disabled" : "";

    elements.marketPanel.innerHTML = `
      <div class="panel-title">
        <h2>商店街・ショップ経営</h2>
        <small>自店Lv.${state.playerShop.level} / 売上待ち ${formatNumber(state.playerShop.salesGold)}金貨</small>
      </div>
      <h3 class="section-label">武器・防具屋</h3>
      <div class="market-grid">${equipmentCards}</div>
      <h3 class="section-label">ポーション屋</h3>
      <div class="market-grid">${potionCards}</div>
      <h3 class="section-label">ショップ経営</h3>
      <div class="shop-management">
        <article class="market-card ${state.playerShop.open ? "active" : ""}">
          <div>
            <div class="card-kicker">${state.playerShop.open ? "営業中" : "準備中"} / 総販売 ${state.playerShop.totalSales}個</div>
            <h3>星灯り露店</h3>
            <p>商品を入荷して営業中にすると、放置中に少しずつ売れて売上が貯まります。</p>
          </div>
          <div class="mini-meter-row">
            <span>経営EXP</span>
            <div class="mini-meter" aria-hidden="true"><i style="--value: ${clamp((state.playerShop.xp / nextXp) * 100, 0, 100)}%"></i></div>
            <strong>${state.playerShop.xp}/${nextXp}</strong>
          </div>
          <div class="shop-actions">
            <button type="button" data-action="toggle-player-shop">${state.playerShop.open ? "営業停止" : "営業開始"}</button>
            <button type="button" data-action="collect-shop-sales" ${state.playerShop.salesGold <= 0 ? "disabled" : ""}>売上回収</button>
            <button type="button" data-action="upgrade-player-shop" ${upgradeDisabled}>店を拡張</button>
          </div>
          <div class="quest-reward">拡張費用: ${escapeHtml(formatCost(upgradeCost))}</div>
        </article>
        <div class="shop-stock-grid">${stockCards}</div>
      </div>
    `;
  }

  function renderGuild() {
    state.guild = normalizeGuild(state.guild);
    const cards = GUILDS.map((guild) => {
      const active = state.guild.activeId === guild.id;
      const rank = getGuildRank(guild.id);
      const progress = getGuildRankProgress(guild.id);
      const scaledStats = Object.fromEntries(Object.entries(guild.stats).map(([key, value]) => [key, value * rank]));
      return `
        <article class="guild-card ${active ? "active" : ""}">
          <div>
            <div class="card-kicker">${escapeHtml(guild.type)} / Rank ${rank} / 評判 ${state.guild.reputation[guild.id] || 0}</div>
            <h3>${escapeHtml(guild.name)}</h3>
            <p>${escapeHtml(guild.desc)}</p>
          </div>
          <div class="progress-bar" aria-hidden="true"><i style="--value: ${progress}%"></i></div>
          <div class="stat-chip-row">${renderStatsChips(scaledStats)}</div>
          <div class="quest-reward">伸びやすい行動: ${escapeHtml(guild.focus)}</div>
          <button type="button" data-action="select-guild" data-guild="${escapeAttr(guild.id)}" ${active ? "disabled" : ""}>${active ? "所属中" : "このギルドに所属"}</button>
        </article>
      `;
    }).join("");
    state.guildRequests = normalizeGuildRequests(state.guildRequests);
    const requestCards = GUILD_REQUESTS.filter((request) => request.guildId === state.guild.activeId)
      .map((request) => {
        const target = getGuildRequestTarget(request);
        const progress = getGuildRequestProgress(request);
        const required = target.amount;
        const completed = Boolean(state.guildRequests.completed[request.id]);
        const unlocked = isGuildRequestUnlocked(request);
        const ready = unlocked && progress >= required;
        const status = completed ? "報告済み" : !unlocked ? `Rank ${request.rank}で解放` : ready ? "報告可能" : "進行中";
        const disabled = completed || !ready ? "disabled" : "";
        const progressPercent = clamp((Math.min(progress, required) / required) * 100, 0, 100);

        return `
          <article class="guild-request-card ${ready ? "ready" : ""} ${completed ? "done" : ""} ${unlocked ? "" : "locked"}">
            <div>
              <div class="card-kicker">${escapeHtml(status)} / ${escapeHtml(target.location?.name || "指定地")}</div>
              <h3>${escapeHtml(request.title)}</h3>
              <p>${escapeHtml(request.desc)}</p>
            </div>
            <div class="progress-top">
              <span>討伐対象: ${escapeHtml(target.name)}</span>
              <strong>${Math.min(progress, required)} / ${required}</strong>
            </div>
            <div class="progress-bar" aria-hidden="true"><i style="--value: ${progressPercent}%"></i></div>
            <div class="quest-reward">報酬: ${escapeHtml(renderRewardText(request.reward))} / 評判+${request.reputation}</div>
            <button type="button" data-action="claim-guild-request" data-request="${escapeAttr(request.id)}" ${disabled}>${completed ? "報告済み" : "報告する"}</button>
          </article>
        `;
      }).join("");
    const generatedChanged = ensureGeneratedGuildRequests(false);
    if (generatedChanged) {
      saveState(false);
    }
    state.guildRequests = normalizeGuildRequests(state.guildRequests);
    const randomRequestCards = state.guildRequests.generated
      .filter((request) => request.guildId === state.guild.activeId)
      .map((request) => {
        const target = getGuildRequestTarget(request);
        const progress = getGuildRequestProgress(request);
        const required = target.amount;
        const completed = Boolean(state.guildRequests.completed[request.id]);
        const unlocked = isGuildRequestUnlocked(request);
        const ready = unlocked && progress >= required;
        const status = completed ? "報告済み" : !unlocked ? `Rank ${request.rank}で解放` : ready ? "報告可能" : "進行中";
        const disabled = completed || !ready ? "disabled" : "";
        const progressPercent = clamp((Math.min(progress, required) / required) * 100, 0, 100);
        const actionText = completed ? "報告済み" : request.target?.type === "resource" ? "納品する" : "報告する";

        return `
          <article class="guild-request-card ${ready ? "ready" : ""} ${completed ? "done" : ""} ${unlocked ? "" : "locked"}">
            <div>
              <div class="card-kicker">日替わり / ${escapeHtml(status)} / ${escapeHtml(target.location?.name || "納品")}</div>
              <h3>${escapeHtml(request.title)}</h3>
              <p>${escapeHtml(request.desc)}</p>
            </div>
            <div class="progress-top">
              <span>対象: ${escapeHtml(target.name)}</span>
              <strong>${Math.min(progress, required)} / ${required}</strong>
            </div>
            <div class="progress-bar" aria-hidden="true"><i style="--value: ${progressPercent}%"></i></div>
            <div class="quest-reward">報酬: ${escapeHtml(renderRewardText(request.reward))} / 評判+${request.reputation}</div>
            <button type="button" data-action="claim-guild-request" data-request="${escapeAttr(request.id)}" ${disabled}>${escapeHtml(actionText)}</button>
          </article>
        `;
      }).join("");
    const buybackCards = Object.entries(MATERIAL_BUYBACK).map(([key, price]) => {
      const owned = state.resources[key] || 0;
      return `
        <article class="buyback-card">
          <div>
            <div class="card-kicker">基準単価 ${price}金貨 / 所持 ${owned}</div>
            <h3>${escapeHtml(RESOURCE_LABELS[key] || key)}</h3>
            <p>ギルドが開拓素材として買い取ります。所属ギルドRankで少し買取額が上がります。</p>
          </div>
          <div class="shop-stock-actions">
            <button type="button" data-action="sell-material" data-resource="${escapeAttr(key)}" data-amount="1" ${owned < 1 ? "disabled" : ""}>1個売る</button>
            <button type="button" data-action="sell-material" data-resource="${escapeAttr(key)}" data-amount="5" ${owned < 1 ? "disabled" : ""}>5個売る</button>
            <button type="button" data-action="sell-material" data-resource="${escapeAttr(key)}" data-amount="all" ${owned < 1 ? "disabled" : ""}>全部売る</button>
          </div>
        </article>
      `;
    }).join("");

    elements.guildPanel.innerHTML = `
      <div class="panel-title">
        <h2>ギルド・派閥</h2>
        <small>所属: ${escapeHtml(GUILD_BY_ID[state.guild.activeId]?.name || "未所属")}</small>
      </div>
      <div class="guild-grid">${cards}</div>
      <h3 class="section-label">ギルド討伐依頼掲示板</h3>
      <div class="guild-request-grid">${requestCards || '<p class="empty-log">所属中のギルド依頼はまだありません。</p>'}</div>
      <h3 class="section-label">今日のランダム依頼</h3>
      <div class="guild-request-grid">${randomRequestCards || '<p class="empty-log">今日のランダム依頼はまだありません。</p>'}</div>
      <h3 class="section-label">ギルド素材買取</h3>
      <div class="buyback-grid">${buybackCards}</div>
    `;
  }

  function renderCodex() {
    state.codex = normalizeCodex(state.codex);
    const resourceCards = RESOURCE_META.map(([key, label]) => {
      const discovered = Boolean(state.codex.resources[key] || (state.resources[key] || 0) > 0);
      const locations = LOCATIONS.filter((location) => {
        return (location.gather || []).some((entry) => entry.key === key) || (location.loot || []).some((entry) => entry.key === key);
      }).map((location) => location.name);

      return `
        <article class="codex-card ${discovered ? "active" : "locked"}">
          <div>
            <div class="card-kicker">${discovered ? "発見済み" : "未発見"} / 所持 ${formatNumber(state.resources[key] || 0)}</div>
            <h3>${escapeHtml(discovered ? label : "？？？")}</h3>
            <p>${escapeHtml(discovered ? `主な入手先: ${locations.slice(0, 3).join(" / ") || "報酬・クラフト"}` : "探索や報酬で一度入手すると記録されます。")}</p>
          </div>
        </article>
      `;
    }).join("");
    const monsterCards = getMonsterCodexEntries().map((entry) => `
      <article class="codex-card ${entry.discovered ? "active" : "locked"}">
        <div>
          <div class="card-kicker">${entry.isBoss ? "ボス" : "モンスター"} / ${entry.discovered ? "発見済み" : "未発見"}</div>
          <h3>${escapeHtml(entry.discovered ? entry.name : "？？？")}</h3>
          <p>${escapeHtml(entry.discovered ? `出現地: ${entry.location.name}` : "その場所で遭遇、または討伐すると記録されます。")}</p>
        </div>
      </article>
    `).join("");

    elements.codexPanel.innerHTML = `
      <div class="panel-title">
        <h2>素材図鑑・モンスター図鑑</h2>
        <small>登録 ${getCodexCompletionCount()}件</small>
      </div>
      <h3 class="section-label">素材図鑑</h3>
      <div class="codex-grid">${resourceCards}</div>
      <h3 class="section-label">モンスター図鑑</h3>
      <div class="codex-grid">${monsterCards}</div>
    `;
  }

  function renderAchievements() {
    state.achievements = normalizeAchievements(state.achievements);
    const activeTitle = getActiveTitle();
    const cards = ACHIEVEMENTS.map((achievement) => {
      const unlocked = isAchievementUnlocked(achievement);
      const claimed = Boolean(state.achievements.claimed[achievement.id]);
      const active = activeTitle?.id === achievement.id;
      const buttonText = claimed ? (active ? "装備中" : "称号にする") : unlocked ? "報酬を受け取る" : "未達成";
      const action = claimed ? "equip-title" : "claim-achievement";
      const disabled = (!unlocked || active) ? "disabled" : "";
      return `
        <article class="achievement-card ${claimed ? "active" : ""} ${unlocked ? "ready" : "locked"}">
          <div>
            <div class="card-kicker">${claimed ? "獲得済み" : unlocked ? "達成済み" : "未達成"} / 称号</div>
            <h3>${escapeHtml(achievement.title)}</h3>
            <p>${escapeHtml(achievement.desc)}</p>
          </div>
          <div class="stat-chip-row">${renderStatsChips(achievement.stats)}</div>
          <div class="quest-reward">報酬: ${escapeHtml(renderRewardText(achievement.reward))}</div>
          <button type="button" data-action="${action}" data-achievement="${escapeAttr(achievement.id)}" ${disabled}>${escapeHtml(buttonText)}</button>
        </article>
      `;
    }).join("");

    elements.achievementPanel.innerHTML = `
      <div class="panel-title">
        <h2>称号・実績</h2>
        <small>${activeTitle ? `装備中: ${escapeHtml(activeTitle.title)}` : "称号未装備"}</small>
      </div>
      <div class="achievement-grid">${cards}</div>
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

  function renderStatsChips(stats = {}) {
    return Object.entries(stats)
      .map(([key, value]) => {
        const label = key === "boss" ? "ボス勝率" : STAT_LABELS[key] || key;
        const text = key === "boss" ? `+${Math.round(value * 100)}%` : `+${formatNumber(value)}`;
        return `<span class="stat-chip">${escapeHtml(label)} ${escapeHtml(text)}</span>`;
      })
      .join("");
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
      mina_private: "ミナの親愛Lv.2",
      sena_private: "セナの親愛Lv.2",
      rio_private: "リオ加入後、親愛Lv.2",
      yui_private: "ユイ加入後、親愛Lv.2",
      festival_date: "ハーレムLv.4、デイリー受取3回",
      mina_vow: "ミナの親愛Lv.3",
      sena_moon_route: "セナの親愛Lv.3",
      rio_masterwork: "リオの親愛Lv.3、Lv5以上の装備を所持",
      yui_shadow_oath: "ユイの親愛Lv.3",
      heroine_council: "主要ヒロイン3人の親愛Lv.3",
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
        const chips = renderStatsChips(job.stats);
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

  function renderSkills() {
    const activeAbilityIds = new Set(getActiveAbilities().map((ability) => ability.id));
    const abilityCards = ABILITIES.map((ability) => {
      const active = activeAbilityIds.has(ability.id);
      return `
        <article class="ability-card ${active ? "active" : ""}">
          <div>
            <div class="card-kicker">${active ? "発動中" : "未発動"} / ${escapeHtml(ability.hint)}</div>
            <h3>${escapeHtml(ability.name)}</h3>
            <p>${escapeHtml(ability.desc)}</p>
          </div>
          <div class="stat-chip-row">${renderStatsChips(ability.stats)}</div>
        </article>
      `;
    }).join("");

    const setEffects = getActiveSetEffects();
    const equippedRecipeIds = new Set(getAllEquippedItems().map((item) => item.recipeId));
    const setCards = EQUIPMENT_SETS.map((set) => {
      const count = set.pieces.filter((recipeId) => equippedRecipeIds.has(recipeId)).length;
      const activeEffects = setEffects.filter((effect) => effect.set.id === set.id);
      const active = activeEffects.length > 0;
      const pieceText = `${count} / ${set.pieces.length}点`;
      const bonusText = activeEffects.length ? activeEffects.map((effect) => effect.text).join(" / ") : set.bonuses.map((bonus) => bonus.text).join(" / ");

      return `
        <article class="set-card ${active ? "active" : ""}">
          <div>
            <div class="card-kicker">${active ? "発動中" : "未発動"} / ${escapeHtml(pieceText)}</div>
            <h3>${escapeHtml(set.name)}</h3>
            <p>${escapeHtml(set.desc)}</p>
          </div>
          <div class="quest-reward">${escapeHtml(bonusText)}</div>
        </article>
      `;
    }).join("");

    state.skillTree = normalizeSkillTree(state.skillTree);
    const skillTreeCards = SKILL_TREE_NODES.map((node) => {
      const unlocked = Boolean(state.skillTree.unlocked[node.id]);
      const missingPrereq = (node.requires || []).some((requiredId) => !state.skillTree.unlocked[requiredId]);
      const affordable = state.skillTree.points >= (node.cost?.points || 0) && (state.resources.starseed || 0) >= (node.cost?.starseed || 0);
      const canUnlock = !unlocked && !missingPrereq && affordable;
      const disabled = canUnlock ? "" : "disabled";
      const costText = `SP${node.cost?.points || 0}${node.cost?.starseed ? ` / 星核${node.cost.starseed}` : ""}`;
      const prereqText = (node.requires || []).length
        ? node.requires.map((requiredId) => SKILL_NODE_BY_ID[requiredId]?.name || requiredId).join(" / ")
        : "なし";
      const status = unlocked ? "解放済み" : missingPrereq ? `前提: ${prereqText}` : affordable ? "解放可能" : `不足: ${costText}`;

      return `
        <article class="skill-node-card ${unlocked ? "active" : ""} ${missingPrereq ? "locked" : ""}">
          <div>
            <div class="card-kicker">${escapeHtml(node.branch)} / ${escapeHtml(status)}</div>
            <h3>${escapeHtml(node.name)}</h3>
            <p>${escapeHtml(node.desc)}</p>
          </div>
          <div class="stat-chip-row">${renderStatsChips(node.stats)}</div>
          <div class="quest-reward">費用: ${escapeHtml(costText)}</div>
          <button type="button" data-action="unlock-skill" data-skill="${escapeAttr(node.id)}" ${disabled}>${unlocked ? "解放済み" : "スキル解放"}</button>
        </article>
      `;
    }).join("");

    elements.skillPanel.innerHTML = `
      <div class="panel-title">
        <h2>スキル・セット効果</h2>
        <small>SP ${state.skillTree.points} / 星核 ${state.resources.starseed || 0}</small>
      </div>
      <h3 class="section-label">主人公スキルツリー</h3>
      <div class="skill-tree-grid">${skillTreeCards}</div>
      <h3 class="section-label">スキル・アビリティ</h3>
      <div class="ability-grid">${abilityCards}</div>
      <h3 class="section-label">装備セット効果</h3>
      <div class="set-grid">${setCards}</div>
    `;
  }

  function renderBase() {
    const current = getCurrentBase();
    const facilities = Array.from(getOwnedFacilities());
    const owned = new Set(state.base.owned);
    const facilityTags = facilities
      .map((facility) => `<span class="tag good">${escapeHtml(CRAFT_STATIONS[facility] || facility)}</span>`)
      .join("");

    const cards = BASE_PROPERTIES.map((base) => {
      const isOwned = owned.has(base.id);
      const isCurrent = current.id === base.id;
      const affordable = canAfford(base.cost);
      const disabled = isCurrent || (!isOwned && !affordable) ? "disabled" : "";
      const buttonText = isOwned ? (isCurrent ? "滞在中" : "ここに移る") : "購入する";
      const status = isOwned ? "所有済み" : `費用 ${formatCost(base.cost)}`;

      return `
        <article class="base-card ${isCurrent ? "active" : ""}">
          <div>
            <div class="card-kicker">${escapeHtml(status)}</div>
            <h3>${escapeHtml(base.name)}</h3>
            <p>${escapeHtml(base.desc)}</p>
          </div>
          <div class="tag-row">
            ${base.facilities.map((facility) => `<span class="tag">${escapeHtml(CRAFT_STATIONS[facility] || facility)}</span>`).join("")}
          </div>
          <button type="button" data-action="buy-base" data-base="${escapeAttr(base.id)}" ${disabled}>${escapeHtml(buttonText)}</button>
        </article>
      `;
    }).join("");
    state.quests = normalizeQuests(state.quests);
    const questCards = QUESTS.map((quest) => {
      const completed = Boolean(state.quests.completed[quest.id]);
      const ready = areRequirementsMet(quest.requirements);
      const requirementText = quest.requirements.map((requirement) => `<span class="tag ${ready ? "good" : ""}">${escapeHtml(renderRequirementText(requirement))}</span>`).join("");
      const buttonText = completed ? "受取済み" : ready ? "報酬を受け取る" : "進行中";
      const disabled = completed || !ready ? "disabled" : "";

      return `
        <article class="quest-card ${ready ? "ready" : ""} ${completed ? "done" : ""}">
          <div>
            <div class="card-kicker">${completed ? "完了" : ready ? "達成" : "依頼"}</div>
            <h3>${escapeHtml(quest.name)}</h3>
            <p>${escapeHtml(quest.desc)}</p>
          </div>
          <div class="tag-row">${requirementText}</div>
          <div class="quest-reward">報酬: ${escapeHtml(renderRewardText(quest.reward))}</div>
          <button type="button" data-action="claim-quest" data-quest="${escapeAttr(quest.id)}" ${disabled}>${escapeHtml(buttonText)}</button>
        </article>
      `;
    }).join("");

    const rebirthPreview = getRebirthPreview();
    const rebirthDisabled = rebirthPreview.available ? "" : "disabled";
    const rebirthCard = `
      <article class="rebirth-card ${rebirthPreview.available ? "ready" : ""}">
        <div>
          <div class="card-kicker">周回・転生 / ${rebirthPreview.available ? "実行可能" : "条件未達成"}</div>
          <h3>星核転生</h3>
          <p>レベルや探索クリアはリセットされますが、仲間・装備・拠点・施設Lv・解放済みスキルは残ります。</p>
        </div>
        <div class="tag-row">
          <span class="tag ${rebirthPreview.available ? "good" : ""}">主人公Lv.${rebirthPreview.heroLevel}</span>
          <span class="tag ${rebirthPreview.haremLevel >= 4 ? "good" : ""}">ハーレムLv.${rebirthPreview.haremLevel}</span>
          <span class="tag ${rebirthPreview.bossTotal >= 3 ? "good" : ""}">ボス討伐 ${rebirthPreview.bossTotal}</span>
          <span class="tag">探索勝利 ${rebirthPreview.clearTotal}</span>
        </div>
        <div class="quest-reward">獲得予定: 星核+${rebirthPreview.gain} / SP+${rebirthPreview.skillPoints}</div>
        <button type="button" class="danger-action" data-action="rebirth" ${rebirthDisabled}>転生する</button>
      </article>
    `;
    const facilityCards = getOwnedUpgradeableFacilities().map((facility) => {
      const level = getFacilityLevel(facility.id);
      const maxed = level >= facility.maxLevel;
      const cost = getFacilityUpgradeCost(facility.id);
      const disabled = maxed || !canAfford(cost) ? "disabled" : "";
      const nextStats = Object.fromEntries(Object.entries(facility.stats).map(([key, value]) => [key, value * (level + 1)]));

      return `
        <article class="facility-card ${level > 0 ? "active" : ""}">
          <div>
            <div class="card-kicker">Lv.${level} / ${facility.maxLevel}</div>
            <h3>${escapeHtml(facility.name)}</h3>
            <p>${escapeHtml(facility.desc)}</p>
          </div>
          <div class="stat-chip-row">${renderStatsChips(nextStats)}</div>
          <div class="quest-reward">${maxed ? "最大強化済み" : `費用: ${escapeHtml(formatCost(cost))}`}</div>
          <button type="button" data-action="upgrade-facility" data-facility="${escapeAttr(facility.id)}" ${disabled}>${maxed ? "最大Lv" : "施設を強化"}</button>
        </article>
      `;
    }).join("");

    elements.basePanel.innerHTML = `
      <div class="panel-title">
        <h2>拠点</h2>
        <small>${escapeHtml(current.name)} / ${owned.size}件所有</small>
      </div>
      <div class="base-summary">
        <div>
          <span>現在の滞在先</span>
          <strong>${escapeHtml(current.name)}</strong>
          <p>${current.id === "inn" ? "今は宿屋に泊まっています。素材を集めて、自分たちの拠点を購入しましょう。" : escapeHtml(current.desc)}</p>
        </div>
        <div class="tag-row">${facilityTags}</div>
      </div>
      <h3 class="section-label">周回・転生</h3>
      <div class="rebirth-grid">${rebirthCard}</div>
      <h3 class="section-label">施設アップグレード</h3>
      <div class="facility-grid">${facilityCards || '<p class="empty-log">購入済み拠点の施設がここに表示されます。</p>'}</div>
      <h3 class="section-label">依頼掲示板</h3>
      <div class="quest-grid">${questCards}</div>
      <h3 class="section-label">拠点購入</h3>
      <div class="base-grid">${cards}</div>
    `;
  }

  function renderCraft() {
    const facilities = getOwnedFacilities();
    const facilityText = Array.from(facilities).map((facility) => CRAFT_STATIONS[facility] || facility).join(" / ");
    const recipeCards = CRAFT_RECIPES.map((recipe) => {
      const rarity = getRarity(recipe.rarity);
      const hasFacility = facilities.has(recipe.station);
      const affordable = canAfford(recipe.need);
      const disabled = !hasFacility || !affordable ? "disabled" : "";
      const stateText = !hasFacility ? `${CRAFT_STATIONS[recipe.station] || "施設"}が必要` : affordable ? "製作可能" : "素材不足";
      const typeText = recipe.auto ? "自動生産" : "手動製作";

      return `
        <article class="recipe-card" style="--rarity-color: ${escapeAttr(rarity.color)}">
          <div class="recipe-head">
            <div>
              <div class="card-kicker">${escapeHtml(typeText)} / ${escapeHtml(CRAFT_STATIONS[recipe.station] || recipe.station)}</div>
              <h3>${escapeHtml(recipe.name)}</h3>
            </div>
            <span class="rarity-pill">${escapeHtml(rarity.name)}</span>
          </div>
          <p>${escapeHtml(formatRecipeResult(recipe))}</p>
          <div class="recipe-cost">必要素材: ${escapeHtml(formatCost(recipe.need))}</div>
          <button type="button" data-action="craft-recipe" data-recipe="${escapeAttr(recipe.id)}" ${disabled}>${escapeHtml(stateText)}</button>
        </article>
      `;
    }).join("");

    const inventory = [...(state.inventory || [])].slice(-10).reverse();
    const inventoryRows = inventory.length
      ? inventory.map((item) => {
          const rarity = getRarity(item.rarity);
          const ownerName = findItemOwnerName(item.id);
          const ownerText = ownerName ? ` / 装備中: ${ownerName}` : " / 未装備";
          const maxLevel = getItemMaxLevel(item);
          const enhanceCost = getEnhanceCost(item);
          const limitCost = getLimitBreakCost(item);
          const nextRarity = getNextRarity(item);
          const evolutionCost = getEvolutionCost(item);
          const enhanceDisabled = (item.level || 0) >= maxLevel || !canAfford(enhanceCost) ? "disabled" : "";
          const limitDisabled = (item.level || 0) < maxLevel || (item.limitBreak || 0) >= EQUIPMENT_MAX_BREAK || !canAfford(limitCost) ? "disabled" : "";
          const evolutionDisabled = !nextRarity || (item.level || 0) < maxLevel || !canAfford(evolutionCost) ? "disabled" : "";
          return `
            <div class="inventory-row" style="--rarity-color: ${escapeAttr(rarity.color)}">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(rarity.name)} / ${escapeHtml(getSlotLabel(item.slot))} / Lv.${item.level || 0}/${maxLevel} / 突破+${item.limitBreak || 0} / 進化+${item.evolution || 0}${escapeHtml(ownerText)}</span>
              <span>${escapeHtml(formatItemStats(getItemEffectiveStats(item)))}</span>
              <span>強化費用: ${escapeHtml((item.level || 0) >= maxLevel ? "限界です" : formatCost(enhanceCost))}</span>
              <span>進化先: ${escapeHtml(nextRarity ? nextRarity.name : "最終進化")} / 費用: ${escapeHtml(nextRarity ? formatCost(evolutionCost) : "-")}</span>
              <div class="inventory-actions">
                <button type="button" data-action="enhance-item" data-item="${escapeAttr(item.id)}" ${enhanceDisabled}>強化</button>
                <button type="button" data-action="limit-break-item" data-item="${escapeAttr(item.id)}" ${limitDisabled}>限界突破</button>
                <button type="button" data-action="evolve-item" data-item="${escapeAttr(item.id)}" ${evolutionDisabled}>進化</button>
              </div>
            </div>
          `;
        }).join("")
      : '<p class="empty-log">まだ製作した装備はありません。</p>';

    elements.craftPanel.innerHTML = `
      <div class="panel-title">
        <h2>工房・クラフト</h2>
        <small>${escapeHtml(facilityText || "施設なし")}</small>
      </div>
      <div class="craft-layout">
        <div>
          <h3 class="section-label">レシピ</h3>
          <div class="craft-grid">${recipeCards}</div>
        </div>
        <aside class="inventory-box">
          <h3 class="section-label">製作品</h3>
          <div class="inventory-list">${inventoryRows}</div>
        </aside>
      </div>
    `;
  }

  function applyViewVisibility() {
    const activePanels = new Set(VIEW_PANELS[state.view] || VIEW_PANELS.base);
    for (const [id, element] of Object.entries(elements)) {
      if (!element || id === "topbar") {
        continue;
      }
      element.hidden = !activePanels.has(id);
    }

    if (typeof document.querySelectorAll !== "function") {
      return;
    }

    document.querySelectorAll(".left-column, .center-column, .right-column").forEach((column) => {
      const visibleChild = Array.from(column.children).some((child) => !child.hidden);
      column.hidden = !visibleChild;
    });
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

  function renderDaily() {
    const daily = getDailyInfo();
    const rewardText = renderRewardText(daily.reward);
    const calendar = Array.from({ length: 7 }, (_, index) => {
      const day = index + 1;
      const active = day === daily.cycleDay ? "active" : "";
      const special = day === 7 ? "special" : "";
      return `
        <div class="daily-day ${active} ${special}">
          <span>${day}日目</span>
          <strong>${day === 7 ? "特別" : "報酬"}</strong>
        </div>
      `;
    }).join("");

    elements.dailyPanel.innerHTML = `
      <div class="panel-title">
        <h2>デイリーボーナス</h2>
        <small>${daily.claimed ? "受取済み" : "受取可能"}</small>
      </div>
      <div class="daily-card ${daily.claimed ? "claimed" : ""}">
        <div>
          <span>連続ログイン</span>
          <strong>${formatNumber(daily.claimed ? daily.currentStreak : daily.nextStreak)}日</strong>
        </div>
        <button type="button" class="primary-action" data-action="claim-daily" ${daily.claimed ? "disabled" : ""}>
          ${daily.claimed ? "今日は受取済み" : "受け取る"}
        </button>
      </div>
      <div class="daily-reward">今日の報酬: ${escapeHtml(rewardText)}</div>
      <div class="daily-calendar">${calendar}</div>
      <p class="account-note">日本時間で毎日リセット。7日目は護符と贈り物が多めです。</p>
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
