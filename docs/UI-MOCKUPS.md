# CostClock - UI Mockups Documentation

**Date**: December 24, 2024  
**Purpose**: Visual design reference for MVP development

---

## 🎯 Design Principles

1. **Visual Hierarchy**: Killer feature (cost counter) = most prominent
2. **Color Psychology**: Green → Orange → Red based on meeting duration
3. **Glassmorphism**: Modern, premium aesthetic
4. **Mobile-First**: Portrait orientation, thumb-friendly
5. **Instant Clarity**: No explanation needed

---

## Mockup 1: Timer Screen - Meeting Mode (KILLER FEATURE)

![Timer Meeting Mode](C:/Users/hp/.gemini/antigravity/brain/8cdc94ae-51a3-4837-a815-8e46d350ffd6/timer_meeting_mode_1766611105423.png)

### Design Specs

**Layout**:
- Gradient background: `#667eea` → `#764ba2`
- Centered content, single column
- Glassmorphism card with blur effect

**Timer Display**:
- Font size: 72px (4.5rem)
- Font weight: 700 (bold)
- Color: White
- Format: `MM:SS`

**Cost Counter (PRIMARY FOCUS)**:
- Main cost: 48px font, white, bold
- Per-minute rate: 24px font, light gray
- Format: `€XXX.XX` with `+€X.XX/min`

**Color States**:
- **< 30 min**: Green accent (#10b981)
- **30-45 min**: Orange accent (#f59e0b)
- **> 45 min**: Red accent (#ef4444) + pulse animation

**Components**:
- Mode label: "Meeting Mode" with icon
- Participants counter: Small, top right
- Alert message: Amber background when > 45min
- Control buttons: Pause (ghost), Stop (red), Participants (+/-)

---

## Mockup 2: Weekly Analytics Dashboard

![Weekly Analytics](C:/Users/hp/.gemini/antigravity/brain/8cdc94ae-51a3-4837-a815-8e46d350ffd6/weekly_analytics_dashboard_1766611132142.png)

### Design Specs

**Layout**:
- White background
- Purple accents (#667eea)
- Card-based layout with shadows

**Stat Cards (2x2 Grid)**:
1. **Focus Time**: Hours + % change
2. **Meetings**: Hours + total cost
3. **Deep Work %**: Percentage + circular indicator
4. **Cost Saved**: Amount + badge

**Chart**:
- Type: Bar chart (grouped)
- Data: Focus (purple) vs Meetings (orange)
- X-axis: Mon-Sun
- Clean gridlines, minimal decoration

**Insight Card**:
- Light amber background
- Rounded corners (12px)
- Icon + actionable text
- Example: "Your best deep work sessions occur Tuesday 14h-16h"

**Export Button**:
- Full width
- Purple gradient
- Prominent placement

---

## Mockup 3: Mode Selector Interface

![Mode Selector](C:/Users/hp/.gemini/antigravity/brain/8cdc94ae-51a3-4837-a815-8e46d350ffd6/mode_selector_interface_1766611155929.png)

### Design Specs

**Layout**:
- Gradient background (same as timer)
- Vertical stack of cards
- 16px gaps between cards

**Mode Cards** (4 total):

1. **🎯 Focus**
   - Duration: 25 min work / 5 min break
   - Subtitle: "Pomodoro technique"
   - Accent: Purple

2. **🧠 Deep Work**
   - Duration: 90 min intensive / 20 min break
   - Subtitle: "Maximum concentration"
   - Accent: Blue

3. **👥 Meeting** (KILLER FEATURE)
   - Duration: Custom with cost tracking
   - Subtitle: "Real-time expense calculator"
   - Accent: Orange
   - State: SELECTED (stronger glow)

4. **☕ Break**
   - Duration: 5-15 min recovery
   - Subtitle: "Recharge your energy"
   - Accent: Green

**Card Style**:
- Glassmorphism effect (semi-transparent white)
- Blur: 10px
- Border radius: 16px
- Soft shadow
- Selected state: glow + border

**Start Button**:
- Full width
- White with purple gradient on hover
- Large, prominent

---

## 🎨 Component Library Needed

Based on mockups, we need:

### Primitive Components
- [x] `Button.vue` (primary, ghost, danger variants)
- [ ] `Card.vue` (with glassmorphism option)
- [ ] `StatCard.vue` (for analytics)
- [ ] `ModeCard.vue` (selectable card)

### Composite Components
- [ ] `TimerDisplay.vue` (large MM:SS counter)
- [ ] `CostCounter.vue` (animated cost display)
- [ ] `ParticipantsInput.vue` (counter with +/- buttons)
- [ ] `WeeklyChart.vue` (Chart.js wrapper)
- [ ] `InsightCard.vue` (amber alert with icon)

---

## 🚀 Development Priority

**Phase 1** (Epic 1 - Timer Core):
1. `TimerDisplay.vue`
2. `Button.vue`
3. Basic timer screen layout

**Phase 2** (Epic 2 - Meeting Cost):
1. `CostCounter.vue` with real-time update
2. `ParticipantsInput.vue`
3. Color state logic (green/orange/red)

**Phase 3** (Epic 3 - Analytics):
1. `StatCard.vue`
2. `WeeklyChart.vue`
3. `InsightCard.vue`

---

## 📐 Design Tokens Reference

All values from `design-tokens.css`:

**Colors**:
- Primary: `var(--color-primary)` = #667eea
- Secondary: `var(--color-secondary)` = #764ba2
- Success: `var(--color-success)` = #10b981
- Warning: `var(--color-warning)` = #f59e0b
- Danger: `var(--color-danger)` = #ef4444

**Spacing**:
- Card padding: `var(--space-8)` = 2rem
- Card gap: `var(--space-4)` = 1rem
- Button padding: `var(--space-4)` `var(--space-6)`

**Border Radius**:
- Cards: `var(--radius-xl)` = 1.5rem
- Buttons: `var(--radius-lg)` = 1rem
- Small elements: `var(--radius-base)` = 0.5rem

**Typography**:
- Timer: `var(--font-size-5xl)` = 3rem (48px)
- Cost: `var(--font-size-3xl)` = 1.875rem (30px)
- Headings: `var(--font-size-2xl)` = 1.5rem (24px)

---

## ✅ Next Steps

1. Review mockups with user
2. Create implementation plan for Timer Core (Epic 1)
3. Build primitive components
4. Implement Timer Screen with Meeting Mode
5. Add real-time cost calculation

**Mockups approved?** → Ready to code! 🚀
