# Wave 1 POC Implementation Plan

## Project Setup

### 1.1 Initialize Expo Project
- Set up React Native Expo project with TypeScript
- Configure project structure (`src/` directories: `components/`, `screens/`, `services/`, `types/`, `utils/`, `store/`)
- Install core dependencies:
  - `expo` (latest)
  - `@react-navigation/native` + `@react-navigation/stack` (navigation)
  - `zustand` or `redux-toolkit` (state management)
  - `@react-native-async-storage/async-storage` (persistence)
  - `expo-linear-gradient` (UI polish)
  - `@testing-library/react-native` (UI testing)
  - `jest` + `jest-expo` (testing framework)

### 1.2 Project Structure
```
src/
  components/     # Reusable UI components
  screens/        # Main game screens
  services/       # Game logic services (tick, growth, mining)
  types/          # TypeScript types/interfaces
  utils/          # Helper functions
  store/          # State management
  constants/      # Game constants (tick rates, skill pools, etc)
  __tests__/      # Test files
    integration/  # Integration tests
```

## Core Systems

### 2.1 Time System Service
**File:** `src/services/TimeService.ts`
- Implement tick loop (1 second = 1 tick)
- Track current tick count and day number (300 ticks/day)
- Background time calculation (using timestamps)
- Sundial hold-to-skip functionality (5 second hold → advance to next day)
- Day boundary detection for watering reset

### 2.2 Data Models & Types
**Files:** `src/types/` (see design files section)
- Seed (id, class, pattern, color, skills array, recessiveSkills array)
- Plant (seedId, plantedAtTick, wateredToday, growthStage, isPassive)
- Budling (id, class, temperament, bodyType, inheritedSkills, stats)
- Excursion (team, depth, stepProgress, lootScore, active)
- Inventory (seeds, fruits, budlings, items, perks)

### 2.3 Game State Management
**File:** `src/store/gameStore.ts`
- Centralized state for:
  - Farm plots (array of Plant | null)
  - Inventory (all tabs)
  - Active Budlings
  - Active Excursions
  - Current tick/day
- Persist to AsyncStorage on state changes
- Load persisted state on app start

## Farm System

### 3.1 Farm Screen
**File:** `src/screens/FarmScreen.tsx`
- Display 2-4 farm plots (start with 2, expandable)
- Each plot shows:
  - Empty state (tap to plant)
  - Planted state (growth stage visual, water indicator)
  - Growth progress bar
- Tap plot → open seed selection modal
- Tap planted plot → show harvest/water options

### 3.2 Planting Logic
**File:** `src/services/PlantService.ts`
- Plant seed → create Plant instance
- Store `plantedAtTick` timestamp
- Initialize `wateredToday: false`
- Set `growthStage: 0`

### 3.3 Growth System
**File:** `src/services/GrowthService.ts`
- On each tick, for each plant:
  - Check if watered today
  - If watered: advance growth stage based on seed's Growth Speed skill
  - If not watered: pause growth (don't reverse)
- Growth stages: 0 → 1 → 2 → 3 → 4 (harvestable)
- Visual representation per stage

### 3.4 Watering System
- Tap plant → show "Water" button if not watered today
- Watering sets `wateredToday: true`
- Day boundary resets all `wateredToday` flags
- Visual indicator (water droplet icon) when needs water

### 3.5 Harvest Logic
**File:** `src/services/HarvestService.ts`
- When plant reaches harvestable stage:
  - Generate 1 clone seed (same as parent, slight positive drift)
  - Generate fruit (type based on seed class)
  - Add to inventory
  - Remove plant from plot
  - Handle inventory overflow (block harvest if full)

## Seed System

### 4.1 Seed Generation
**File:** `src/services/SeedService.ts`
- Create initial starter seeds (3-5 seeds with random classes/patterns/colors)
- Clone seed generation (from harvest):
  - Copy parent seed
  - Apply slight positive drift to skill levels (±1 level, bias upward)
- Seed display component showing:
  - Visual representation (class color + pattern + pattern color)
  - 3 visible skills with levels
  - Class/Pattern/Color names

### 4.2 Seed Genetics (Simplified)
- Each seed has:
  - Class (Botanical, Dark, Fungal, Aquatic, Mineral, Arcane)
  - Pattern (stripes, dots, fractals, swirls)
  - Pattern Color
  - 3 skills (each with name, level 1-10, XP)
- Skills mapped to classes (each class has 2 associated skills)
- No recessive skills visible in POC (store but don't show)

### 4.3 Seed Inventory Tab
**File:** `src/screens/InventoryScreen.tsx` → Seeds tab
- List all seeds in inventory
- Show seed card with visual + skills
- Tap to select for planting or Budling creation

## Budling System

### 5.1 Budling Creation
**File:** `src/services/BudlingService.ts`
- Convert seed → Budling:
  - Class → Budling Class
  - Pattern → Budling Temperament
  - Pattern Color → Budling Body Type
  - Inherit skills from seed
  - Initialize stats: HP=100, Hunger=100, Energy=100
- Add to Budling inventory

### 5.2 Budling Display
**File:** `src/components/BudlingCard.tsx`
- Show Budling visual (based on class/temperament/bodyType)
- Display inherited skills
- Show current stats (HP/Hunger/Energy)

### 5.3 Budling Inventory Tab
- List all Budlings
- Tap to select for mining team

## Mining/Excursion System

### 6.1 Mining Screen
**File:** `src/screens/MiningScreen.tsx`
- Display current active excursion (if any)
- Show:
  - Budling icons (1 Budling for POC)
  - Current depth number
  - Horizontal progress bar (stepProgress within depth)
  - Shared HP/Hunger/Energy bars
  - LootScore box (fill indicator)
- "Start Excursion" button → select Budling → start
- "Return" button → convert LootScore to items

### 6.2 Excursion Logic
**File:** `src/services/MiningService.ts`
- On each tick for active excursion:
  - Calculate forward chance based on skills, hunger, energy
  - If success: advance stepProgress
  - Chance to add to lootScore
  - Apply HP/Hunger/Energy drain
  - If any stat hits 0: Budling passes out, excursion pauses
  - If all pass out: require manual return
- Depth progression: after X steps, advance to next depth

### 6.3 Loot Conversion
**File:** `src/services/LootService.ts`
- When excursion returns:
  - Convert lootScore → items (fruits, ores, gems)
  - Early depths give tiny point values
  - Add to inventory
  - Reset excursion

## Inventory System

### 7.1 Inventory Screen
**File:** `src/screens/InventoryScreen.tsx`
- Tab navigation: Seeds | Fruits | Budlings | Items | Perks
- Each tab shows filtered list
- Basic storage limit (start with 50 slots per category)
- Overflow handling: block new additions if full

### 7.2 Inventory Management
**File:** `src/services/InventoryService.ts`
- Add/remove items
- Check capacity
- Handle overflow (prevent harvest/loot collection)

## UI/UX

### 8.1 Navigation Structure
**File:** `src/navigation/AppNavigator.tsx`
- Bottom tab navigator:
  - Farm (main screen)
  - Mining
  - Inventory
- Stack navigator for modals (seed selection, Budling selection)

### 8.2 Core Components
- `PlotTile.tsx` - Farm plot display
- `SeedCard.tsx` - Seed visualization
- `BudlingCard.tsx` - Budling display
- `StatBar.tsx` - HP/Hunger/Energy bars
- `SundialButton.tsx` - Hold-to-skip button (always visible)

### 8.3 Visual Design
- Portrait mode only
- One-handed friendly (bottom navigation)
- Color-coded classes
- Pattern overlays for seeds
- Simple but clear UI

## Persistence

### 9.1 Save System
**File:** `src/services/SaveService.ts`
- Save game state to AsyncStorage on:
  - State changes
  - App backgrounding
- Load on app start
- Calculate offline progress (time since last save)

## Testing & Quality Assurance

### 10.1 Unit Tests (Services & Logic)
**File:** `src/services/__tests__/`
- **TimeService tests:**
  - Tick increments correctly (1 second = 1 tick)
  - Day boundary detection (300 ticks = 1 day)
  - Background time calculation accuracy
  - Sundial skip advances to next day correctly
  - Day reset triggers watering reset
- **GrowthService tests:**
  - Growth advances when watered
  - Growth pauses when unwatered (doesn't reverse)
  - Growth stage progression (0→1→2→3→4)
  - Skill-based growth speed modifiers
- **HarvestService tests:**
  - Clone seed generation (always 1)
  - Clone seed skill drift (slight positive bias)
  - Fruit generation based on seed class
  - Inventory overflow handling
- **SeedService tests:**
  - Starter seed generation (valid classes/patterns/colors)
  - Clone seed creation (matches parent with drift)
  - Skill inheritance logic
- **BudlingService tests:**
  - Seed → Budling conversion (class→class, pattern→temperament, color→bodyType)
  - Stats initialization (HP/Hunger/Energy = 100)
  - Skill inheritance from seed
- **MiningService tests:**
  - Forward chance calculation (based on skills/stats)
  - Step progression logic
  - LootScore accumulation
  - Stat drain rates (HP/Hunger/Energy)
  - Pass-out detection (stat = 0)
  - Depth progression
- **LootService tests:**
  - LootScore → items conversion
  - Early-depth reward balancing (tiny values)
  - Item type distribution
- **InventoryService tests:**
  - Add/remove items
  - Capacity limits
  - Overflow prevention
- **SaveService tests:**
  - State serialization/deserialization
  - AsyncStorage read/write
  - Offline progress calculation
  - Corrupted save handling

### 10.2 Integration Tests (Game Flow)
**File:** `src/__tests__/integration/`
- **Core Loop Test:**
  - Plant seed → wait for growth → harvest → verify clone seed + fruit
  - Create Budling from seed → verify conversion
  - Start mining excursion → verify progression → return → verify loot
  - Full cycle: Plant → Grow → Harvest → Clone → Budling → Mine → Loot
- **Time System Integration:**
  - App backgrounding → resume → verify offline progress
  - Sundial usage → verify day advancement affects all systems
  - Day boundary → verify watering reset
- **State Persistence Integration:**
  - Save game → close app → reopen → verify state restored
  - Verify all systems resume correctly after restore

### 10.3 UI Component Tests
**File:** `src/components/__tests__/`
- **PlotTile tests (React Native Testing Library):**
  - Renders empty state correctly
  - Renders planted state with growth stage
  - Shows water indicator when needs water
  - Handles tap for planting
  - Handles tap for watering/harvesting
  - Visual representation matches growth stage
- **SeedCard tests:**
  - Displays seed visual (class color + pattern + pattern color)
  - Shows all 3 skills with levels
  - Displays class/pattern/color names correctly
  - Handles selection interaction
- **BudlingCard tests:**
  - Displays Budling visual based on traits
  - Shows inherited skills
  - Displays current stats (HP/Hunger/Energy bars)
  - Stat bars update correctly
- **StatBar tests:**
  - Renders with correct value/percentage
  - Updates when value changes
  - Visual representation matches stat level
  - Color changes at thresholds (e.g., red when low)
- **SundialButton tests:**
  - Renders hold button correctly
  - Detects hold gesture (5 seconds)
  - Triggers day skip on successful hold
  - Shows visual feedback during hold
  - Resets on release before completion

### 10.4 Screen/Flow Tests (E2E-like)
**File:** `src/screens/__tests__/`
- **FarmScreen tests:**
  - Renders correct number of plots (2-4)
  - Empty plot tap → opens seed selection modal
  - Planted plot tap → shows water/harvest options
  - Watering updates visual state
  - Harvest removes plant and adds items to inventory
  - Growth stages visually update over time
- **MiningScreen tests:**
  - Renders active excursion state correctly
  - Shows Budling icons
  - Displays depth number
  - Progress bar updates with stepProgress
  - Stat bars update with current values
  - LootScore indicator fills correctly
  - Start excursion → opens Budling selection
  - Return button → converts loot and resets excursion
- **InventoryScreen tests:**
  - Tab navigation works (Seeds/Fruits/Budlings/Items/Perks)
  - Each tab shows correct filtered items
  - Item lists render correctly
  - Capacity limits displayed
  - Overflow warnings shown when full
  - Item selection works for planting/Budling creation

### 10.5 Visual Regression & Accessibility Tests
- **Visual consistency:**
  - All seed classes render with correct colors
  - Patterns display correctly
  - UI elements maintain consistent styling
  - Portrait mode layout works on different screen sizes
- **Accessibility:**
  - Touch targets meet minimum size (44x44pt)
  - Text is readable (minimum font size)
  - Color contrast meets WCAG standards
  - Screen reader compatibility (if using accessibility features)

### 10.6 Performance Tests
- **Tick loop performance:**
  - 60 ticks/second doesn't cause lag
  - Multiple plants don't slow down growth calculations
  - Multiple active excursions process efficiently
- **Rendering performance:**
  - Farm screen with 4 plots renders smoothly
  - Inventory lists scroll smoothly with 50+ items
  - No frame drops during state updates
- **Memory:**
  - No memory leaks during extended play
  - State doesn't grow unbounded

### 10.7 Edge Case & Error Handling Tests
- **Edge cases:**
  - Plant seed when inventory full
  - Harvest when inventory full
  - Start excursion with no Budlings
  - Return excursion with all Budlings passed out
  - Sundial during active growth/harvest
  - App killed during save operation
- **Error handling:**
  - Corrupted save file recovery
  - Invalid state recovery
  - Network errors (if any async operations)
  - Invalid seed data handling

### 10.8 POC Validation Checklist
- [ ] Core loop works: Plant → Grow → Harvest → Clone → Budling → Mine → Loot
- [ ] Time system works (tick, day, sundial)
- [ ] State persists across app restarts
- [ ] No crashes on basic operations
- [ ] UI is responsive and intuitive
- [ ] All visual states render correctly
- [ ] Performance is acceptable (60fps, no lag)
- [ ] Edge cases handled gracefully

## Excluded from Wave 1
- Crossbreeding system
- Rare seeds
- Recessive skill visibility
- Passive plants
- Mana economy
- Team synergy (1 Budling only)
- Auto-sell
- Barn upgrades
- Full skill pools (use subset)
- Prestige system

