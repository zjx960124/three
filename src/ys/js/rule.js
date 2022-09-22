class R {
  constructor() {
    this.purple = 0.147;
    this.gold = 0.016;
    this.upper = 0.1;
    this.upperCount = 0;
    this.upperMax = 0;
    this.cheatOnCode = "cheaton";
    this.cheatOffCode = "cheatoff";
    this.code = [];
    this.isCheat = false;
    this.blueWeapons = [
      "amber-catalyst",
      "amenoma-kageuchi",
      "apprentices-notes",
      "beginners-protector",
      "black-tassel",
      "bloodtainted-greatsword",
      "compound-bow",
      "cool-steel",
      "crescent-pike",
      "dark-iron-sword",
      "deathmatch",
      "debate-club",
      "dragons-bane",
      "dull-blade",
      "ebony-bow",
      "emerald-orb",
      "favonius-codex",
      "favonius-greatsword",
      "favonius-warbow",
      "ferrous-shadow",
      "fillet-blade",
      "hamayumi",
      "harbinger-of-dawn",
      "hunters-bow",
      "iron-point",
      "iron-sting",
      "jade-orb",
      "katsuragikiri-nagamasa",
      "kitain-cross-spear",
      "lions-roar",
      "lost-prayer-to-the-sacred-winds",
      "magic-guide",
      "mappa-mare",
      "messenger",
      "mitternachts-waltz",
      "old-mercs-pal",
      "otherworldly-story",
      "pocket-grimoire",
      "prototype-aminus",
      "prototype-grudge",
      "prototype-malice",
      "prototype-rancour",
      "quartz",
      "rainslasher",
      "raven-bow",
      "recurve-bow",
      "royal-bow",
      "royal-greatsword",
      "royal-grimoire",
      "royal-longsword",
      "rust",
      "sacrificial-bow",
      "sacrificial-fragments",
      "sacrificial-sword",
      "seasoned-hunters-bow",
      "sharpshooters-oath",
      "silver-sword",
      "skyrider-greatsword",
      "skyrider-sword",
      "slingshot",
      "solar-pearl",
      "summit-shaper",
      "the-bell",
      "the-black-sword",
      "the-flute",
      "the-stringless",
      "the-unforged",
      "the-unforged",
      "the-widsith",
      "thrilling-tales-of-dragon-slayers",
      "thundering-pulse",
      "travelers-handy-sword",
      "twin-nephrite",
      "waster-greatsword",
      "whiteblind",
      "white-iron-greatsword",
    ];
    this.purpleWeapons = [
      "blackcliff-amulet",
      "blackcliff-longsword",
      "blackcliff-pole",
      "freedom-sworn",
      "hakushin-ring",
      "kunwus-iris-rift",
      "serpent-spine",
    ];
    this.goldWeapons = [
      "skyward-atlas",
      "skyward-blade",
      "skyward-harp",
      "skyward-pride",
      "skyward-spine",
      "aquila-favonia",
    ];
    this.sgoldWeapons = [
      "amos-bow",
      "engulfing-lightning",
      "everlasting-moonglow",
      "elegy-for-the-end",
      "mistsplitter-reforged",
      "primordial-jade-cutter",
      "song-of-broken-pines",
      "staff-of-homa",
      "vortex-vanquisher",
      "wolfs-gravestone",
    ];
    this.purpleCharacters = [
      "Amber",
      "Barbara",
      "Beidou",
      "Bennett",
      "Chongyun",
      "Diona",
      "Fischl",
      "Kaeya",
      "Lisa",
      "Ningguang",
      "Noelle",
      "Razor",
      "Rosaria",
      "Sara",
      "Sayu",
      "Sucrose",
      "Xiangling",
      "Xingqiu",
      "Xinyan",
      "Yanfei",
    ];
    this.goldCharacters = ["Diluc", "Jean", "Keqing", "Mona", "Qiqi"];
    this.sgoldCharacters = [
      "Albedo",
      "Ayaka",
      "Eula",
      "Ganyu",
      "Hu-Tao",
      "Kazuha",
      "Klee",
      "Kokomi",
      "Shogun",
      "Tartaglia",
      "Venti",
      "Xiao",
      "Yoimiya",
      "Zhongli",
    ];
    this.upperWeapons = [];
    this.upperCharacters = [];
    this.wishCount = 0;
    this.wishTotal = 0;
    this.isGold = false;
    this.isSgold = false;
    this.isPurple = false;
  }

  wish(count) {
    let result = [];
    for (let i = 0; i < count; i++) {
      if (this.wishCount >= 80 && !this.isGold) {
        this.wishCount = 0;
        this.wishTotal++;
      }
      if (this.wishCount > 60) {
        if (!this.isGold) {
          if (this.wishTotal < 2) {
            this.gold += 0.004;
            this.upper += 0.018;
          } else {
            this.gold = 1;
            this.upper = 1;
            if (this.upperMax === 0) {
              this.upperMax = Math.trunc(1 + Math.random() * 5);
              if (this.upperCount++ > this.upperMax || i == count - 1) {
                if (!this.isCheat) {
                  this.isGold = false;
                  this.isSgold = false;
                  this.wishTotal = 0;
                  this.upperMax = 0;
                  this.gold = 0.016;
                }
              }
            }
          }
        } else {
          if (!this.isCheat) {
            this.isGold = false;
            this.gold = 0.016;
            this.wishCount = 0;
            this.wishTotal++;
          }
        }
      }
      // atleast 1 purple result each 10 wishes
      if (i == count - 1 && !this.isPurple && count == 10) {
        this.purple = 1;
      }
      result.push(this.getRandomResult());
    }
    this.purple = 0.147;
    this.isPurple = false;
    result.sort((r1, r2) => this.orderResultType(r1, r2));
    return result;
  }

  getRandomResult() {
    this.wishCount++;
    const r = Math.random();
    if (r < this.gold) {
      this.isGold = true;
      const r2 = Math.random();
      if (r2 < this.upper) {
        this.isSgold = true;
        return this.getRandom(this.sgoldCharacters.concat(this.sgoldWeapons));
      } else {
        return this.getRandom(this.goldCharacters.concat(this.goldWeapons));
      }
    } else if (r < this.purple) {
      this.isPurple = true;
      return this.getRandom(this.purpleCharacters.concat(this.purpleWeapons));
    } else {
      return this.getRandom(this.blueWeapons);
    }
  }

  getRandom(array) {
    return array[Math.trunc(Math.random() * array.length)];
  }

  getResultTypes(results) {
    let defaultType = "BLUE";
    for (let result of results) {
      let type = this.getResultType(result);
      if (type === "SGOLD") {
        defaultType = type;
        break;
      }
      if (type === "GOLD") {
        defaultType = type;
        break;
      }
      if (type === "PURPLE") {
        defaultType = type;
        break;
      }
    }
    return defaultType;
  }

  getResultType(result, order) {
    if (this.blueWeapons.includes(result)) {
      return !order ? "BLUE" : 0;
    }
    if (this.purpleCharacters.concat(this.purpleWeapons).includes(result)) {
      return !order ? "PURPLE" : 1;
    }
    if (this.goldCharacters.concat(this.goldWeapons).includes(result)) {
      return !order ? "GOLD" : 2;
    }
    return !order ? "SGOLD" : 3;
  }

  orderResultType(result1, result2) {
    let t1 = this.getResultType(result1, true);
    let t2 = this.getResultType(result2, true);
    return t2 - t1;
  }

  cheat() {
    console.log(
      "%cCHEAT CODE: cheaton[开启作弊] cheatoff[关闭作弊]",
      "background: #169fe6; padding: 2px 4px;color: #fff"
    );
    document.addEventListener("keypress", (ev) => {
      this.code += String(ev.key).toLowerCase();
      if (this.code.indexOf(this.cheatOnCode) > -1) {
        console.log("cheat on");
        this.gold = 1;
        this.upper = 1;
        this.isCheat = true;
        this.code = "";
      }
      if (this.code.indexOf(this.cheatOffCode) > -1) {
        console.log("cheat off");
        this.gold = 0.016;
        this.upper = 0.1;
        this.isCheat = false;
        this.code = "";
      }
    });
  }
}
const Rule = new R();

export { Rule };
