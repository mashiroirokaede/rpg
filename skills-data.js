(function (global) {
  "use strict";

  const SKILL_RANKS = {
    common: {
      id: "common",
      name: "コモンスキル",
      order: 1,
      colorClass: "rank-common",
      description: "誰でも習得できる基礎スキル。行動で自然に育つ。",
    },
    extra: {
      id: "extra",
      name: "エクストラスキル",
      order: 2,
      colorClass: "rank-extra",
      description: "コモンスキルの熟練や特殊条件で得られる上位スキル。",
    },
    unique: {
      id: "unique",
      name: "ユニークスキル",
      order: 3,
      colorClass: "rank-unique",
      description: "キャラクターの個性、親愛、称号、ボス討伐、物語進行などで得られる希少スキル。",
    },
    ultimate: {
      id: "ultimate",
      name: "アルティメットスキル",
      order: 4,
      colorClass: "rank-ultimate",
      description: "複数のユニークスキルや高難度条件を満たすことで覚醒する最上位スキル。",
    },
  };

  const DOMAIN_LABELS = {
    battle: "戦闘",
    magic: "魔法",
    defense: "防御",
    mobility: "移動・回避",
    analyze: "解析",
    explore: "探索",
    gather: "採取",
    craft: "クラフト",
    social: "親愛・交渉",
    familiar: "使い魔",
    resistance: "耐性",
    growth: "成長",
    boss: "ボス",
    support: "仲間支援",
    economy: "市場・取引",
    story: "物語・称号",
  };

  const DOMAINS = Object.keys(DOMAIN_LABELS);

  const EFFECT_KEYS_BY_DOMAIN = {
    battle: ["atkPct", "critRate", "momentumOnHit", "comboDamagePct"],
    magic: ["magPct", "damageFlat", "tensionGain", "critDamagePct"],
    defense: ["defPct", "guardRate", "momentumOnGuard", "enemyDamageDownPct"],
    mobility: ["dodgeRate", "travelSpeedPct", "exploreSpeedPct", "counterRate"],
    analyze: ["telegraphRevealRate", "scoutPct", "hiddenRouteRate", "momentumOnHit"],
    explore: ["exploreSpeedPct", "eventFindRate", "hiddenRouteRate", "dangerDownPct"],
    gather: ["gatherAmountPct", "rareMaterialRate", "rareFindRate", "dropRatePct"],
    craft: ["craftSuccessPct", "craftQualityPct", "upgradeSuccessPct", "materialRefundRate"],
    social: ["affectionGainPct", "heroineSupportRate", "giftEffectPct", "goldGainPct"],
    familiar: ["familiarExpPct", "familiarAssistRate", "supportTriggerRate", "companionExpPct"],
    resistance: ["physicalResistPct", "magicResistPct", "debuffResistPct", "enemyDamageDownPct"],
    growth: ["expGainPct", "jobExpPct", "skillExpPct", "dropRatePct"],
    boss: ["bossDamagePct", "enemyDamageDownPct", "tensionCostDown", "supportTriggerRate"],
    support: ["supportTriggerRate", "autoHealRate", "autoHealPct", "companionExpPct"],
    economy: ["goldGainPct", "dropRatePct", "materialRefundRate", "rareCraftRate"],
    story: ["affectionGainPct", "eventFindRate", "skillExpPct", "hiddenRouteRate"],
  };

  const RESISTANCE_EFFECTS = [
    "poisonResistPct",
    "fireResistPct",
    "iceResistPct",
    "sleepResistPct",
    "curseResistPct",
    "physicalResistPct",
    "magicResistPct",
    "debuffResistPct",
  ];

  const DOMAIN_NOUNS = {
    battle: ["剣筋", "連撃", "斬光", "戦勘"],
    magic: ["魔核", "火花", "星術", "霊脈"],
    defense: ["小盾", "結界", "護り", "不動"],
    mobility: ["瞬歩", "風足", "間合い", "先駆"],
    analyze: ["鑑定", "予兆", "解析", "星読み"],
    explore: ["道標", "踏破", "地図", "開拓"],
    gather: ["薬草", "鉱脈", "採取", "露探し"],
    craft: ["鍛冶", "錬成", "補修", "炉火"],
    social: ["親愛", "交渉", "贈り物", "心結び"],
    familiar: ["使い魔", "共鳴", "調教", "獣笛"],
    resistance: ["耐毒", "耐炎", "耐眠", "耐呪"],
    growth: ["経験", "修練", "熟達", "魔核循環"],
    boss: ["巨敵", "討伐", "弱点", "覇気"],
    support: ["援護", "結束", "治癒", "号令"],
    economy: ["相場", "仕入れ", "値付け", "目利き"],
    story: ["称号", "誓い", "物語", "星約"],
  };

  const RANK_PREFIXES = {
    common: [
      "朝露",
      "若草",
      "小星",
      "初風",
      "灯花",
      "薄明",
      "白砂",
      "青芽",
      "静音",
      "鈴鳴",
      "淡月",
      "火種",
      "水脈",
      "石標",
      "綿雲",
      "早鐘",
      "草笛",
      "浅瀬",
      "黄昏",
      "旅籠",
    ],
    extra: [
      "流星",
      "蒼燈",
      "銀嶺",
      "霧裂",
      "影走",
      "紅蓮",
      "翠風",
      "月環",
      "雷紋",
      "琥珀",
      "星紡",
      "黒曜",
      "白銀",
      "深緑",
      "黎光",
      "天幕",
      "夜明",
      "鋼花",
      "水晶",
      "虹縁",
    ],
    unique: [
      "星灯り",
      "開拓者",
      "恋結び",
      "魔核炉",
      "絆環",
      "祈星",
      "森羅",
      "影縫い",
      "鍛冶姫",
      "月詠み",
      "蒼き旅団",
      "ギルド暁",
      "使い魔座",
      "逆転",
      "炉心",
      "白夜",
      "竜脈",
      "星雫",
      "境界",
      "巡礼",
    ],
    ultimate: [
      "星冠",
      "黎明",
      "天穹",
      "神域",
      "月虹",
      "深淵灯",
      "竜脈",
      "蒼天",
      "永星",
      "創炉",
      "絆環",
      "星界",
      "暁天",
      "白銀界",
      "黒曜天",
      "開拓極",
      "魔導暁",
      "祈星界",
      "旅路終",
      "新天地",
    ],
  };

  const RANK_SUFFIXES = {
    common: ["の芽", "の型", "の勘", "の手ほどき", "の基礎"],
    extra: ["の流儀", "の極意", "の連鎖", "の秘訣", "の熟達"],
    unique: ["の加護", "の誓約", "の才覚", "の星印", "の導き"],
    ultimate: ["の大系", "の極光", "の天啓", "の星域", "の真核"],
  };

  const METHOD_BY_DOMAIN = {
    battle: ["battle"],
    magic: ["battle", "skill"],
    defense: ["guard", "battle"],
    mobility: ["travel", "battle"],
    analyze: ["observe", "explore"],
    explore: ["explore", "travel"],
    gather: ["gather", "explore"],
    craft: ["craft"],
    social: ["affection", "guild"],
    familiar: ["familiar", "battle"],
    resistance: ["damage", "battle"],
    growth: ["battle", "explore"],
    boss: ["boss"],
    support: ["support", "affection"],
    economy: ["shop", "guild"],
    story: ["story", "title"],
  };

  const DOMAIN_HINTS = {
    battle: "攻撃や討伐を重ねると習得しやすい。",
    magic: "魔法系の行動や必殺技で育ちやすい。",
    defense: "防御や受け流しを成功させると育つ。",
    mobility: "移動、回避、間合い調整で成長する。",
    analyze: "観察や鑑定、敵の予兆看破で伸びる。",
    explore: "探索完了や新しい土地の発見で育つ。",
    gather: "採取や素材発見で習得しやすい。",
    craft: "工房や鍛冶場での製作成功で育つ。",
    social: "親愛、贈り物、ギルド交渉で成長する。",
    familiar: "使い魔の育成や支援発動で伸びる。",
    resistance: "対応する被害や状態異常を受けると育つ。",
    growth: "戦闘、探索、職業修練の積み重ねで伸びる。",
    boss: "強敵やボス討伐で解放されやすい。",
    support: "仲間援護やヒロイン支援で育つ。",
    economy: "売買、素材買取、ショップ経営で伸びる。",
    story: "物語進行、称号、イベント達成で解放される。",
  };

  const RANK_SCALE = {
    common: { maxLevel: 10, base: 0.012, step: 0.004, flat: 1, type: "passive" },
    extra: { maxLevel: 15, base: 0.035, step: 0.007, flat: 2, type: "passive" },
    unique: { maxLevel: 10, base: 0.08, step: 0.012, flat: 4, type: "conditional" },
    ultimate: { maxLevel: 5, base: 0.15, step: 0.025, flat: 8, type: "ultimate" },
  };

  const SEEDED_SKILLS = {
    common: [
      seed("blade_basics", "剣筋補正", "battle", "近接攻撃の軌道を整え、斬り込みの安定感を少し高める。", ["battle", "atk", "near"], { atkPct: 0.025, momentumOnHit: 1 }, ["extra_blade_flow_001"]),
      seed("simple_appraisal", "簡易鑑定", "analyze", "敵の予兆や素材の違和感を読み取る基礎技術。", ["analyze", "scout", "battle", "explore"], { telegraphRevealRate: 0.04, scoutPct: 0.03 }, ["extra_starlight_reading_001"]),
      seed("trap_reading", "罠読み", "explore", "探索中の危険な気配や古い仕掛けに気づきやすくなる。", ["explore", "trap", "scout"], { trapAvoidRate: 0.06, dangerDownPct: 0.02 }, ["danger_foresight"]),
      seed("herb_scent", "薬草嗅ぎ", "gather", "薬草や回復素材の香りを追い、採取の成果を少し増やす。", ["explore", "gather", "herb"], { rareFindRate: 0.02, gatherAmountPct: 0.035 }, ["herb_poison_lore"]),
      seed("flash_step", "瞬歩", "mobility", "一歩目を軽くし、回避と間合い調整を少し助ける。", ["battle", "speed", "explore"], { dodgeRate: 0.035, travelSpeedPct: 0.02 }, ["shadow_runner"]),
      seed("ironwall", "鉄壁化", "defense", "防御姿勢を固め、被害と戦況低下を抑える。", ["battle", "guard", "resist"], { defPct: 0.03, guardRate: 0.035, momentumOnGuard: 1 }, ["life_ward"]),
      seed("healing_light", "癒光", "support", "淡い癒やしの光で、仲間支援や損失軽減を助ける。", ["heal", "support", "battle"], { autoHealRate: 0.03, autoHealPct: 0.025, supportTriggerRate: 0.015 }, ["life_ward"]),
      seed("spark_art", "火花術", "magic", "小さな火花を戦闘に添え、追加ダメージを狙う。", ["battle", "fire", "magic"], { magPct: 0.025, damageFlat: 2, tensionGain: 1 }, ["azure_flame_barrage"]),
      seed("shadow_pin", "影踏み", "battle", "敵の足元を乱し、大技の出だしを崩しやすくする。", ["battle", "shadow", "interrupt"], { interruptRate: 0.04, momentumOnHit: 2 }, ["shadow_stitch_dance"]),
      seed("smith_soul", "鍛冶魂", "craft", "工房や鍛冶場で、製作品質と成功率を少し高める。", ["craft", "forge", "equipment"], { craftSuccessPct: 0.025, craftQualityPct: 0.025 }, ["magic_forging_talent"]),
      seed("poison_resistance", "毒耐性", "resistance", "毒や薬害に慣れ、毒系の被害を抑える。", ["resistance", "poison"], { poisonResistPct: 0.055, debuffResistPct: 0.015 }, []),
      seed("flame_resistance", "炎耐性", "resistance", "火花や炎熱の被害に体を慣らす。", ["resistance", "fire"], { fireResistPct: 0.055, magicResistPct: 0.012 }, []),
      seed("sleep_resistance", "眠り耐性", "resistance", "眠気や行動不能の気配に抗う。", ["resistance", "sleep"], { sleepResistPct: 0.055, debuffResistPct: 0.015 }, []),
      seed("physical_resistance", "物理耐性", "resistance", "打撃や斬撃への踏ん張りを育てる。", ["resistance", "physical", "guard"], { physicalResistPct: 0.04, defPct: 0.015 }, []),
      seed("curse_resistance", "呪い耐性", "resistance", "重い魔力や呪いの圧を受け流しやすくする。", ["resistance", "curse", "boss"], { curseResistPct: 0.05, debuffResistPct: 0.015 }, []),
      seed("ambush_art", "奇襲術", "battle", "戦闘開始時や援護時に敵の体勢を崩しやすくする。", ["battle", "support", "speed"], { momentumOnHit: 2, critRate: 0.02 }, ["extra_moonstep_ambush_001"]),
      seed("guild_talk", "ギルド話術", "social", "依頼人や受付との会話で、報酬の取りこぼしを減らす。", ["guild", "social", "economy"], { goldGainPct: 0.02, affectionGainPct: 0.015 }, []),
      seed("familiar_handshake", "使い魔なじみ", "familiar", "使い魔との距離を縮め、支援と成長を少し助ける。", ["familiar", "support"], { familiarExpPct: 0.03, familiarAssistRate: 0.02 }, []),
      seed("market_eye", "素材目利き", "economy", "素材の価値を見抜き、取引とショップ経営を少し助ける。", ["shop", "guild", "economy"], { goldGainPct: 0.02, materialRefundRate: 0.015 }, []),
      seed("camp_focus", "野営集中", "growth", "探索の合間に修練を積み、経験の伸びを少し高める。", ["growth", "explore"], { expGainPct: 0.02, skillExpPct: 0.02 }, []),
    ],
    extra: [
      seed("extra_blade_flow_001", "流星剣", "battle", "剣筋補正から派生した流れる斬撃。攻撃と戦況上昇を助ける。", ["battle", "atk", "combo"], { atkPct: 0.07, comboDamagePct: 0.04, momentumOnHit: 3 }, ["unique_vow_blade_001"]),
      seed("extra_starlight_reading_001", "星灯り読解", "analyze", "簡易鑑定を深め、予兆や隠し道の読み取りを高める。", ["analyze", "scout", "explore"], { telegraphRevealRate: 0.09, hiddenRouteRate: 0.035, scoutPct: 0.04 }, ["starlight_analysis"]),
      seed("danger_foresight", "危険予知", "analyze", "罠読みが発展し、危険の起点を事前に感じ取りやすくなる。", ["explore", "trap", "scout", "advanced"], { trapAvoidRate: 0.12, dangerDownPct: 0.05, telegraphRevealRate: 0.04 }, ["unique_frontier_sense_001"]),
      seed("azure_flame_barrage", "蒼炎連弾", "magic", "火花術が発展し、短い連弾で敵の守りを削る。", ["battle", "fire", "magic", "advanced"], { magPct: 0.08, damageFlat: 6, tensionGain: 2 }, ["unique_blue_flame_oath_001"]),
      seed("shadow_stitch_dance", "影縫い乱舞", "battle", "影踏みが発展し、敵の大技の流れを切りやすくなる。", ["battle", "shadow", "interrupt", "advanced"], { interruptRate: 0.11, momentumOnHit: 4, dodgeRate: 0.03 }, ["unique_shadow_thread_001"]),
      seed("shadow_runner", "影走り", "mobility", "瞬歩と影踏みの型を合わせ、回避と先制の精度を高める。", ["battle", "speed", "shadow"], { dodgeRate: 0.07, counterRate: 0.04, travelSpeedPct: 0.04 }, ["unique_silent_path_001"]),
      seed("life_ward", "生命の結界", "defense", "癒光と鉄壁化の流れを重ね、被害軽減と回復支援を高める。", ["guard", "heal", "support", "advanced"], { defPct: 0.08, autoHealRate: 0.05, autoHealPct: 0.04 }, ["unique_guardian_bond_001"]),
      seed("herb_poison_lore", "薬毒知識", "gather", "薬草嗅ぎと毒耐性の経験を合わせ、採取と毒対策を高める。", ["gather", "herb", "poison", "advanced"], { rareMaterialRate: 0.05, poisonResistPct: 0.08, gatherAmountPct: 0.05 }, ["unique_forest_ear_001"]),
      seed("magic_forging_talent", "魔鍛冶の才", "craft", "鍛冶魂と魔核の扱いを結び、装備製作の質を高める。", ["craft", "forge", "magic"], { craftSuccessPct: 0.06, craftQualityPct: 0.08, upgradeSuccessPct: 0.04 }, ["unique_forge_blessing_001"]),
      seed("magic_furnace_core", "魔導炉心", "growth", "魔核循環を発展させ、戦闘勝利時のスキル成長を助ける。", ["battle", "growth", "magic", "advanced"], { skillExpPct: 0.08, tensionGain: 2, expGainPct: 0.035 }, ["unique_core_pact_001"]),
    ],
    unique: [
      seed("starlight_analysis", "星灯りの解析眼", "analyze", "敵の予兆や探索中の異変を星灯りの揺らぎとして見抜く。", ["analyze", "scout", "battle", "explore"], { telegraphRevealRate: 0.15, rareFindRate: 0.04, momentumOnHit: 4 }, ["starlight_wisdom"]),
      seed("starlight_wisdom", "星灯りの叡智", "analyze", "解析眼が磨かれ、戦場と未知の土地の流れを深く読む。", ["analyze", "awaken", "battle", "explore"], { telegraphRevealRate: 0.2, hiddenRouteRate: 0.07, skillExpPct: 0.04 }, ["ultimate_star_observer_001"]),
      seed("magic_core_cycle", "魔核循環", "growth", "魔核を巡らせ、戦闘勝利時のスキル経験値を追加で得る。", ["battle", "growth", "magic"], { skillExpPct: 0.1, tensionGain: 2 }, ["magic_furnace_core"]),
      seed("lovebind_blessing", "恋結びの加護", "social", "親愛の積み重ねが、ヒロイン支援と絆の成長を後押しする。", ["bond", "support", "blessing"], { affectionGainPct: 0.1, heroineSupportRate: 0.08, giftEffectPct: 0.06 }, ["ultimate_bond_guardian_001"]),
      seed("pioneer_title", "開拓者の称号", "story", "未踏の土地へ踏み出す者に宿る称号。探索と採取を支える。", ["title", "explore", "gather", "base"], { hiddenRouteRate: 0.06, gatherAmountPct: 0.07, eventFindRate: 0.05 }, ["pioneer_intuition"]),
      seed("prayer_blessing", "祈りの加護", "support", "回復役の祈りが仲間を包み、支援と敗北時の損失軽減に働く。", ["heal", "support", "blessing"], { supportTriggerRate: 0.08, autoHealRate: 0.06, autoHealPct: 0.06 }, []),
      seed("sniper_sense", "狙撃勘", "battle", "遠距離から敵の隙を拾い、予兆と弱点を読みやすくする。", ["battle", "scout", "ranged"], { critRate: 0.07, telegraphRevealRate: 0.08, bossDamagePct: 0.04 }, []),
      seed("unique_vow_blade_001", "星誓いの剣才", "battle", "積み重ねた剣筋が誓いとなり、強敵相手の一撃を支える。", ["battle", "atk", "boss"], { atkPct: 0.14, bossDamagePct: 0.08, momentumOnHit: 5 }, ["ultimate_starcrown_pioneer_001"]),
      seed("unique_frontier_sense_001", "開拓者の直感", "explore", "地図にない細道や危険な沈黙を、肌で感じ取る希少な勘。", ["explore", "analyze", "title"], { hiddenRouteRate: 0.1, trapAvoidRate: 0.09, eventFindRate: 0.07 }, ["pioneer_intuition"]),
      seed("unique_forge_blessing_001", "鍛冶姫の祝福", "craft", "炉火に宿る祝福が、装備製作と強化の成功を支える。", ["craft", "forge", "support"], { craftQualityPct: 0.14, upgradeSuccessPct: 0.09, rareCraftRate: 0.05 }, ["ultimate_divine_forge_001"]),
    ],
    ultimate: [
      seed("ultimate_starcrown_pioneer_001", "星冠の開拓者", "story", "開拓と戦闘の積み重ねが星冠となり、未知への踏破力を高める。", ["ultimate", "story", "explore", "battle"], { atkPct: 0.18, hiddenRouteRate: 0.12, skillExpPct: 0.08 }, []),
      seed("ultimate_star_observer_001", "星界の観測者", "analyze", "戦場と探索地の流れを読み切る、解析系の最上位覚醒。", ["ultimate", "analyze", "battle", "explore"], { telegraphRevealRate: 0.28, scoutPct: 0.16, momentumOnHit: 8 }, []),
      seed("ultimate_bond_guardian_001", "絆環の守護者", "support", "親愛と仲間支援が環となり、危機の瞬間に味方を守る。", ["ultimate", "bond", "support"], { supportTriggerRate: 0.18, heroineSupportRate: 0.15, autoHealPct: 0.12 }, []),
      seed("ultimate_divine_forge_001", "神域錬成炉", "craft", "鍛冶と魔核の知識が神域の炉となり、最高品質の製作を助ける。", ["ultimate", "craft", "forge"], { craftQualityPct: 0.22, rareCraftRate: 0.12, materialRefundRate: 0.08 }, []),
      seed("pioneer_intuition", "天穹の開拓直感", "explore", "称号、解析、罠読みが共鳴し、未知の地でも進むべき道を捉える。", ["ultimate", "explore", "analyze", "title"], { hiddenRouteRate: 0.16, trapAvoidRate: 0.14, eventFindRate: 0.12 }, []),
    ],
  };

  const RANK_OFFSETS = { common: 0, extra: 3, unique: 6, ultimate: 9 };
  const SKILL_DEFS = {};
  const generatedIdsByRankIndex = {};

  for (const rank of Object.keys(SKILL_RANKS)) {
    const seeds = SEEDED_SKILLS[rank] || [];
    for (const entry of seeds) {
      addSkill(entry);
    }
    for (let number = seeds.length + 1; number <= 100; number += 1) {
      const domain = DOMAINS[(number + RANK_OFFSETS[rank]) % DOMAINS.length];
      const id = makeGeneratedId(rank, domain, number);
      const skill = createGeneratedSkill(rank, domain, number, id);
      generatedIdsByRankIndex[`${rank}:${number}`] = id;
      addSkill(skill);
    }
  }

  for (let number = 1; number <= 100; number += 1) {
    wireGeneratedEvolution("common", "extra", number);
    wireGeneratedEvolution("extra", "unique", number);
    wireGeneratedEvolution("unique", "ultimate", number);
  }

  const SKILL_MERGE_RULES = [
    { id: "merge_shadow_runner", required: { flash_step: 5, shadow_pin: 5 }, grant: "shadow_runner" },
    { id: "merge_life_ward", required: { healing_light: 5, ironwall: 5 }, grant: "life_ward" },
    { id: "merge_herb_poison", required: { herb_scent: 4, poison_resistance: 3 }, grant: "herb_poison_lore" },
    { id: "merge_magic_forge", required: { smith_soul: 4, magic_core_cycle: 4 }, grant: "magic_forging_talent" },
    { id: "merge_pioneer_intuition", required: { starlight_analysis: 6, trap_reading: 5, pioneer_title: 3 }, grant: "pioneer_intuition" },
    { id: "merge_star_observer", required: { starlight_analysis: 10, starlight_wisdom: 8, unique_frontier_sense_001: 5 }, grant: "ultimate_star_observer_001" },
    { id: "merge_bond_guardian", required: { lovebind_blessing: 8, prayer_blessing: 6, life_ward: 6 }, grant: "ultimate_bond_guardian_001" },
    { id: "merge_divine_forge", required: { unique_forge_blessing_001: 8, magic_forging_talent: 8, magic_furnace_core: 6 }, grant: "ultimate_divine_forge_001" },
  ];

  const PLAYER_STARTING_SKILLS = ["blade_basics", "simple_appraisal", "trap_reading", "herb_scent"];

  const PROFILE_SKILL_PRESETS = {
    healer: ["healing_light", "prayer_blessing"],
    ranger: ["trap_reading", "sniper_sense"],
    smith: ["smith_soul"],
    shinobi: ["flash_step", "shadow_pin", "ambush_art"],
    alchemist: ["spark_art", "herb_scent"],
    knight: ["ironwall", "physical_resistance"],
    cook: ["healing_light", "herb_scent"],
    mage: ["spark_art", "magic_core_cycle"],
    scout: ["trap_reading", "flash_step"],
    jeweler: ["lovebind_blessing"],
    hunter: ["trap_reading", "sniper_sense"],
    summoner: ["familiar_handshake", "magic_core_cycle"],
  };

  const JOB_SKILL_PRESETS = {
    sword: ["blade_basics", "flash_step"],
    cleric: ["healing_light"],
    brawler: ["flash_step", "physical_resistance"],
    lancer: ["flash_step", "blade_basics"],
    dualist: ["flash_step", "ambush_art"],
    guardian: ["ironwall"],
    paladin: ["ironwall", "healing_light"],
    gunner: ["sniper_sense"],
    archer: ["sniper_sense"],
    hunter: ["sniper_sense", "trap_reading"],
    scout: ["trap_reading", "flash_step"],
    shinobi: ["shadow_pin", "flash_step"],
    mage: ["spark_art", "magic_core_cycle"],
    summoner: ["familiar_handshake", "magic_core_cycle"],
    tamer: ["trap_reading", "familiar_handshake"],
    blacksmith: ["smith_soul"],
    alchemist: ["herb_scent", "poison_resistance"],
    herbalist: ["herb_scent"],
    cook: ["healing_light"],
  };

  const SKILL_ID_ALIASES = {
    starlight_wisdom_old: "starlight_wisdom",
    analysis_basics: "simple_appraisal",
    sword_basics: "blade_basics",
  };

  const validation = validateSkillDefinitions(SKILL_DEFS, SKILL_RANKS);
  if (!validation.ok) {
    console.warn("Skill definition validation warnings:", validation.errors, validation.counts);
  }

  global.STARLIGHT_SKILL_DATA = {
    ranks: SKILL_RANKS,
    rankList: Object.values(SKILL_RANKS),
    domainLabels: DOMAIN_LABELS,
    domains: DOMAINS,
    defs: SKILL_DEFS,
    list: Object.values(SKILL_DEFS),
    mergeRules: SKILL_MERGE_RULES,
    startingSkills: PLAYER_STARTING_SKILLS,
    profilePresets: PROFILE_SKILL_PRESETS,
    jobPresets: JOB_SKILL_PRESETS,
    aliases: SKILL_ID_ALIASES,
    validateSkillDefinitions,
    validation,
  };

  function seed(id, name, domain, description, tags, effects, evolveTo) {
    const rank = rankFromSeedTarget(id);
    return {
      id,
      name,
      rank,
      domain,
      type: rank === "ultimate" ? "ultimate" : rank === "unique" ? "conditional" : "passive",
      maxLevel: RANK_SCALE[rank]?.maxLevel || 10,
      description,
      tags,
      effects,
      obtain: {
        methods: METHOD_BY_DOMAIN[domain] || [domain],
        hint: DOMAIN_HINTS[domain] || "関連する行動で成長する。",
      },
      evolveTo: Array.isArray(evolveTo) ? evolveTo : evolveTo ? [evolveTo] : [],
    };
  }

  function rankFromSeedTarget(id) {
    if (id.startsWith("ultimate_") || id === "pioneer_intuition") return "ultimate";
    if (id.startsWith("unique_") || ["starlight_analysis", "starlight_wisdom", "magic_core_cycle", "lovebind_blessing", "pioneer_title", "prayer_blessing", "sniper_sense"].includes(id)) return "unique";
    if (id.startsWith("extra_") || ["danger_foresight", "azure_flame_barrage", "shadow_stitch_dance", "shadow_runner", "life_ward", "herb_poison_lore", "magic_forging_talent", "magic_furnace_core"].includes(id)) return "extra";
    return "common";
  }

  function addSkill(skill) {
    if (!skill || !skill.id) return;
    SKILL_DEFS[skill.id] = skill;
  }

  function makeGeneratedId(rank, domain, number) {
    return `${rank}_${domain}_${String(number).padStart(3, "0")}`;
  }

  function createGeneratedSkill(rank, domain, number, id) {
    const scale = RANK_SCALE[rank];
    const prefix = RANK_PREFIXES[rank][number % RANK_PREFIXES[rank].length];
    const noun = DOMAIN_NOUNS[domain][number % DOMAIN_NOUNS[domain].length];
    const suffix = RANK_SUFFIXES[rank][Math.floor(number / RANK_PREFIXES[rank].length) % RANK_SUFFIXES[rank].length];
    const name = `${prefix}${noun}${suffix}`;
    const label = DOMAIN_LABELS[domain] || domain;
    const rankLabel = SKILL_RANKS[rank]?.name || rank;
    const description = `${name}は${label}で培った感覚を伸ばす${rankLabel}。星灯りの開拓団での行動に応じて少しずつ力を増す。`;
    const tags = Array.from(new Set([domain, rank, ...(METHOD_BY_DOMAIN[domain] || [])]));
    const effects = buildEffects(rank, domain, number);
    const unlockText = rank === "common"
      ? DOMAIN_HINTS[domain]
      : rank === "extra"
        ? `関連するコモンスキルを育てると解放される。${DOMAIN_HINTS[domain]}`
        : rank === "unique"
          ? `称号、親愛、ボス討伐、職業経験などが重なると目覚める。${DOMAIN_HINTS[domain]}`
          : `複数のユニークスキル、高難度ボス、物語進行が重なると覚醒する。`;

    return {
      id,
      name,
      rank,
      domain,
      type: scale.type,
      maxLevel: scale.maxLevel,
      description,
      tags,
      effects,
      obtain: {
        methods: METHOD_BY_DOMAIN[domain] || [domain],
        hint: unlockText,
      },
      evolveTo: [],
    };
  }

  function buildEffects(rank, domain, number) {
    const scale = RANK_SCALE[rank];
    const keys = domain === "resistance" ? RESISTANCE_EFFECTS : EFFECT_KEYS_BY_DOMAIN[domain] || EFFECT_KEYS_BY_DOMAIN.battle;
    const first = keys[number % keys.length];
    const second = keys[(number + 2) % keys.length];
    const third = rank === "ultimate" || rank === "unique" ? keys[(number + 3) % keys.length] : "";
    const value = Number((scale.base + (number % 5) * scale.step).toFixed(3));
    const secondary = Number(Math.max(scale.base * 0.6, value * 0.65).toFixed(3));
    const effects = {};
    effects[first] = isFlatEffect(first) ? Math.max(1, scale.flat + (number % 4)) : value;
    effects[second] = isFlatEffect(second) ? Math.max(1, scale.flat + ((number + 1) % 4)) : secondary;
    if (third && third !== first && third !== second) {
      effects[third] = isFlatEffect(third) ? Math.max(1, scale.flat + 2 + (number % 4)) : Number(Math.max(scale.base * 0.5, value * 0.5).toFixed(3));
    }
    return effects;
  }

  function isFlatEffect(key) {
    return ["damageFlat", "momentumOnHit", "momentumOnGuard", "tensionGain"].includes(key);
  }

  function wireGeneratedEvolution(fromRank, toRank, number) {
    const fromId = generatedIdsByRankIndex[`${fromRank}:${number}`] || findSkillIdByRankNumber(fromRank, number);
    const toId = generatedIdsByRankIndex[`${toRank}:${number}`] || findSkillIdByRankNumber(toRank, number);
    if (!fromId || !toId || !SKILL_DEFS[fromId] || !SKILL_DEFS[toId]) return;
    if (!Array.isArray(SKILL_DEFS[fromId].evolveTo)) {
      SKILL_DEFS[fromId].evolveTo = SKILL_DEFS[fromId].evolveTo ? [SKILL_DEFS[fromId].evolveTo] : [];
    }
    if (!SKILL_DEFS[fromId].evolveTo.includes(toId)) {
      SKILL_DEFS[fromId].evolveTo.push(toId);
    }
  }

  function findSkillIdByRankNumber(rank, number) {
    const list = Object.values(SKILL_DEFS).filter((skill) => skill.rank === rank);
    return list[number - 1]?.id || "";
  }

  function validateSkillDefinitions(defs = {}, ranks = SKILL_RANKS) {
    const list = Object.values(defs || {});
    const counts = { common: 0, extra: 0, unique: 0, ultimate: 0 };
    const ids = new Set();
    const names = new Set();
    const errors = [];

    for (const skill of list) {
      if (!skill || typeof skill !== "object") {
        errors.push("不正なスキル定義があります。");
        continue;
      }
      if (!skill.id) errors.push("idが空のスキルがあります。");
      if (!skill.name) errors.push(`${skill.id || "unknown"} のnameが空です。`);
      if (!ranks[skill.rank]) errors.push(`${skill.id || skill.name} のrankが不明です。`);
      if (!skill.description) errors.push(`${skill.id || skill.name} のdescriptionが空です。`);
      if (!skill.effects || !Object.keys(skill.effects).length) errors.push(`${skill.id || skill.name} のeffectsが空です。`);
      if (skill.id && ids.has(skill.id)) errors.push(`id重複: ${skill.id}`);
      if (skill.name && names.has(skill.name)) errors.push(`name重複: ${skill.name}`);
      if (skill.id) ids.add(skill.id);
      if (skill.name) names.add(skill.name);
      if (counts[skill.rank] !== undefined) counts[skill.rank] += 1;
    }

    for (const rank of Object.keys(counts)) {
      if (counts[rank] !== 100) {
        errors.push(`${rank} の定義数が100ではありません: ${counts[rank]}`);
      }
    }
    if (list.length !== 400) {
      errors.push(`合計スキル数が400ではありません: ${list.length}`);
    }

    return {
      ok: errors.length === 0,
      total: list.length,
      counts,
      duplicateIds: list.length - ids.size,
      duplicateNames: list.length - names.size,
      errors,
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
