# **🌱 SEEDBREEDER — FULL GAME MANIFEST**

A complete architecture for a one-handed portrait-mode mobile game blending plant breeding, genetics, farming, mining, and companion (Budling) progression into one unified loop.

---

# **0. GAME TITLE & GLOSSARY**

**Title:** **Seedbreeder**
**Companions:** **Budlings**
**Players:** Plant-breeders engineering lineages of rare, powerful seeds and creatures.

### **Core Terms**

* **Seed:** A plantable unit with *3 Qualities* (Class, Pattern, Color), *3 Skills*, and *Skill Alleles* (dominant + recessive).
* **Plant:** A seed that’s been planted, grows across days, and generates loot.
* **Budling:** A bred-from-seeds companion that goes mining. Inherits traits from seed qualities.
* **Tick:** 1 second of real time.
* **Day:** 300 ticks.
* **Sundial:** A hold-to-skip function that advances to the start of the next day.

---

# **1. TIME SYSTEM**

### **1.1. Real-Time Progression**

* Game ticks every **1 real-time second**.
* App closed → time **continues like Stardew** (plants grow, Budlings continue mining, hunger/energy drain).

### **1.2. Daily Cycle**

* Day = **300 ticks**.
* Watering must occur **once per day**.
* Day boundary resets watering requirement.

### **1.3. Sundial System**

* Press and **hold for ~5 seconds**.
* Skips forward to the **start of the next day**.
* Advances:

  * Plant growth
  * Budling excursion steps
  * Hunger / HP / Energy drain
  * Passive generation
  * Breeding day progression
* No cooldown, but requires hold.

---

# **2. FARM & PLANTS**

### **2.1. Farm Layout**

* Starts with **2 plots**.
* Expandable to **6×6**.
* Each new plot costs exponentially more gold/gems.

### **2.2. Plant Behavior**

* Plants must be **watered** once per day.
* If unwatered → growth **pauses**, not reverses.
* Some plants are **active-yield** (harvestable).
* Some are **passive** (provide permanent aura bonuses for occupying a space).

### **2.3. Rare Seeds**

* Produce powerful loot.
* Usually **wither after one harvest**.
* Some exceptions produce permanent aura effects.

### **2.4. Crossbreeding**

* Adjacent plants: **5% base chance** that the second seed is a hybrid.
* Cloning rule:

  * Every harvest always produces **1 clone seed**.
  * Rare chance of **extra seed** (native seed).

### **2.5. Native Seeds**

(Naming TBD, but concept is solid)

Native seeds:

* Are the *non-clone* seeds produced as the bonus seed.
* Their Skills are drawn from the **natural skill pools associated with each Quality**.

---

# **3. SEEDS & GENETICS**

### **3.1. Qualities**

Each seed has:

1. **Class** (background color mapped to species)

   * Botanical
   * Dark
   * Fungal
   * Aquatic
   * Mineral
   * Arcane
   * etc.

2. **Pattern** (stripes / dots / fractals / swirls / etc)

3. **Pattern Color**

### **3.2. Skills**

* Each quality (e.g., “Fungal”) has 2 associated skills:

  * **Dominant Skill**
  * **Recessive Skill**
* A seed contains:

  * 3 phenotyped (visible) skills
  * Up to 3 recessive (hidden) skills

### **3.3. Skill Levels**

* Each skill has **its own XP bar**.
* Max level (for now): **10**.
* Every new seed generation:

  * Skill can **drift up or down**, but **averages up** over time.

### **3.4. Breeding Inheritance**

* Clone seed:

  * Always the same visible skills.
  * Slight positive drift.
* Crossbred seed:

  * Skill levels inherited per allele.
  * Level = exactly inherited from parents.
  * If new skill introduced (from a recessive): starts at **Level 1**.

### **3.5. Level Cap Behavior**

* Soft cap = Level 10.
* Future version: Prestiging branches (see appendix).

---

# **4. BUDLINGS (COMPANIONS)**

### **4.1. Origin**

Budlings are created from seeds.
Their:

* **Class** → Budling Class
* **Pattern** → Budling Temperament
* **Pattern Color** → Budling Body Type

### **4.2. Stats**

Budlings share party-wide stats:

* **HP**
* **Hunger**
* **Energy**

No death. Instead:

### **4.3. Passing Out**

A Budling passes out when any stat reaches 0.

* They fall unconscious.
* Remaining Budlings continue (weaker).
* If *all* pass out → must send rescue team.

### **4.4. Budling Limit**

* Barn-limited (upgradable).

### **4.5. Team Composition**

* Start: **1 Budling per excursion**
* Upgradable to 3–5
* Synergy bonuses:

  * Same Class
  * Same Pattern
  * Same Pattern Color
  * Shared Skills (e.g., Haul Boost)

### **4.6. Food**

* Universal fruit feeds all.
* Bonus if fruit type matches Budling Class.

---

# **5. MINING / EXCURSIONS**

### **5.1. Structure**

* Depth-based infinite tower.
* Each depth has many “steps.”
* At each tick:

  * Chance to move forward
  * Chance to find loot
  * Chance of event (good/bad)
  * Hunger/HP/Energy drain

### **5.2. Loot System**

Loot is NOT individual items while underground.
Instead:

* Loot accumulates as **Score Points** (the “black box”).
* Upon returning:

  * Score Points → actual items (fruits, ores, gems, perks, seeds).

### **5.3. Early-Depth Loot Balancing**

* Early depths grant **tiny point values** to avoid junk spam.

### **5.4. Retreat Logic**

* Budlings naturally **slow down** when low on Hunger/Energy.
* They avoid death by reducing risk.
* Perk can allow auto-return when stats <20%.

---

# **6. SKILLS (MASTER LIST)**

### **6.1. Plant Skills**

* Growth Speed
* Water Efficiency
* Multi-Seed
* Multi-Fruit
* Fruit Quality Up
* Rare Seed Chance
* Seed Quality Up
* Crossbreed Rate Up
* Trait Stabilization
* Recessive Reveal
* Mutation Drift
* Adjacent Tile Bonus
* Auto-Water Chance
* Mana Spark (rare)

### **6.2. Budling Skills**

* Depth Speed
* Skip-Shallow-Floors
* Scout Instinct
* Hunger Efficiency
* Energy Efficiency
* Gem Finder
* Ore Scent
* Big Find Chance
* Haul Capacity
* Team Aura
* Morale Link

### **6.3. Meta Skills**

* Prestige XP Boost
* God-Fruit Chance
* Consistent Harvest
* Plot Influence

---

# **7. ECONOMY**

### **7.1. Currencies**

* **Gold** (basic) – from fruit
* **Gems** (rare) – from mining
* **Mana** (ultra-rare) – from rare plants, exotic events

### **7.2. Use Cases**

Gold:

* Farm expansions
* Basic tools

Gems:

* Mining equipment
* High-end farm equipment
* Seed packs

Mana:

* God-tier perks
* Revivals (future?)
* Rare seed packs
* Prestige catalysts

---

# **8. INVENTORY**

### **8.1. Tabs**

* Seeds
* Fruit
* Budlings
* Items / Ore
* Perks

### **8.2. Storage**

* Limited storage.
* Upgrades purchasable.
* Stars allow marking “never sell” items.

### **8.3. Auto-Sell**

* Unlockable.
* Settings: “sell only duplicates,” “sell low rarity,” etc.

### **8.4. Overflow**

* Harvest or loot cannot be collected until inventory cleaned.

---

# **9. PERKS**

### **9.1. Types**

* Permanent
* Equipment-type
* Consumables

### **9.2. Effects**

Touch every system:

* Growth
* Crossbreeding
* Mining success
* Stats
* Time acceleration
* Inventory
* Auto-water
* etc.

---

# **10. USER INTERFACE**

### **10.1. Farm Tiles**

Show:

* Growth stage
* Seed icon
* Water droplet if needed

### **10.2. Mining View**

Shows:

* Budling icons
* A horizontal line showing progress within the current depth
* Current depth #
* Shared HP/Hunger/Energy bar
* Loot box fill indicator

---

# **11. DATA MODELS (POC-READY)**

### **11.1. Seed**

```
Seed {
    id
    class
    pattern
    color
    skills: [
        { name, level, xp, isDominant }
        { name, level, xp, isDominant }
        { name, level, xp, isDominant }
    ]
    recessiveSkills: [
        { name, level }
        { name, level }
        { name, level }
    ]
}
```

### **11.2. Plant**

```
Plant {
   seedId
   plantedAtTick
   wateredToday: bool
   growthStage
   isPassive
}
```

### **11.3. Budling**

```
Budling {
    id
    class
    temperament
    bodyType
    inheritedSkills: [...]
    stats: {
        hp, hunger, energy
    }
}
```

### **11.4. Excursion**

```
Excursion {
    team: [BudlingIDs]
    depth
    stepProgress
    lootScore
    active
}
```

---

# **12. ALGORITHMS / MECHANICS**

### **12.1. Tick Loop**

Every tick:

* For each plant:

  * If watered: grow
* For each Budling in excursions:

  * Compute forward-chance = f(skills, hunger, energy)
  * Maybe advance depth step
  * Add lootScore if success
  * Apply drain
  * Apply event RNG
* Update time-of-day
* Reset watering at 0:00

### **12.2. Harvest Logic**

Harvest yields:

* Guaranteed 1 clone seed
* Chance: native seed
* Fruit
* Rare fruit chance
* Perks (rare)
* Mana (extremely rare)

### **12.3. Crossbreeding Logic**

If adjacent parent A & B:

* If bonus seed generated:

  * 5% baseline of hybrid
  * Mix qualities
  * Create new Skill alleles
  * Level inheritance as discussed

---

# **13. CORE GAME LOOP**

1. Plant seeds
2. water → grow → harvest
3. Get clone + native/hybrid seeds
4. Breed next-gen seeds → optimize skills
5. Convert seeds into Budlings
6. Send Budlings on mining excursions
7. Get gems → upgrade farm & mines
8. Repeat → push lineage higher → get rare classes → reach mana tier

---

# **POC MANIFEST (WHAT TO BUILD FIRST)**

### **Included**

* Time system & sundial
* Basic farm with 2–4 plots
* Seed genetics (simple version)
* Plant growth & watering
* Harvest → clone seed + fruit
* Basic Budling creation from seeds
* Mining system with:

  * Depth
  * Step progress
  * Hunger/Energy/HP drain
  * LootScore box
* Inventory tabs
* No rare seeds, no prestige, no recessives revealed yet
* No passive plants
* No mana
* Basic perks only if trivial

### **Excluded (add later)**

* Rare plants
* Prestige branches
* Crossbreeding system
* Full recessive allele system
* Native seeds
* Team synergy
* Early-depth skip
* Mana economy
* God-level perks
* Auto-sell
* Barn upgrades
* Full skill pools

Keep POC laser focused.

---

# **FUTURE FEATURES APPENDIX**

Everything here exists but is deferred:

* Skill prestiging
* Dual-branch skill trees
* Recessive skill lines
* Rare seed archetypes (Heartsap, Voidroot, Everfrost, etc)
* Multi-biome farms
* Multi-biome mines
* Budling personalities & mini dialog
* Passive plants that buff adjacency
* Ultra-rare mana plants
* Events (eclipses, dark moons, flood seasons)
* Legendary Budling classes
* Auto-return logic
* Breeding labs
* Genetic locking serums
* Masterwork seed lines
* Seasonal seeds
* Cosmetic-only seeds
* Achievements
* Daily/weekly quests
* Cloud saving
* Online seed trading

Everything above integrates cleanly with the architecture.
