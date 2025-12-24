# Heara - Brand Identity & Design Language

**Date**: December 24, 2024  
**Version**: 1.0 (Final)

---

## 🌿 Brand Essence

> **"Hear what truly matters."**

Heara is not a productivity tool that pushes, alerts, or interrupts.  
She is a **calm companion** that observes, understands, and gently guides.

---

## 🎯 Core Principles

### Voice & Tone

**Heara speaks like:**
- A thoughtful colleague, not a drill sergeant
- An observer, not a judge
- A companion, not a taskmaster

**She is:**
- **Calm** - No urgency, no pressure
- **Lucid** - Clear without being cold
- **Bienveillante** - Caring without being intrusive  
- **Posée** - Grounded, never frantic

**She never:**
- ❌ Alerts aggressively
- ❌ Uses exclamation points excessively
- ❌ Creates artificial urgency
- ❌ Interrupts flow

---

## 📝 Language Guidelines

### Tagline (Primary)

> **"Hear what truly matters."**

**Variations** (contextual use):
- "Listen. Understand. Decide."
- "Clarity through listening."
- "Where time speaks."

### Mode Names

| Original | Heara |
|----------|-------|
| Focus | **Focus** ✅ |
| Deep Work | **Deep Focus** |
| Meeting | **Conversation** ⭐ |
| Break | **Pause** |

**Final Set**: Focus · Deep Focus · Conversation · Pause

### Conversation State Wording

**When time awareness is needed:**

❌ "Optimal time exceeded" → Too technical  
✅ **"This conversation has reached its natural point."**

❌ "Consider concluding now" → Too directive  
✅ **"You may want to wrap up or refocus."**

**Alternative (shorter):**  
✅ **"It might be a good moment to conclude."**

### Insight Messages

**Pattern**: Observation + Gentle Invitation

❌ "You're most productive on Tuesday 14h-16h"  
✅ **"You're most focused on Tuesdays between 14:00 and 16:00. Consider protecting this time."**

❌ "Block this time next week!"  
✅ **"Keep it clear if you can."**

### Signature Phrase (Rare, Momentary)

Used sparingly at key moments (end of conversation, pause transitions):

- **"Take a breath."**
- **"Let it breathe."**

---

## 🎨 Visual Identity

### Color Palette

**Primary Gradient**:
- `#667eea` (Purple) → `#764ba2` (Violet)

**Conversation States** (Gentle Awareness):
- **Flowing**: `#10b981` (Green) - < 30min
- **Awareness**: `#f59e0b` (Warm Amber) - 30-45min
- **Conclude**: `#ef4444` (Gentle Red) - > 45min

**Accent Colors**:
- Focus: Soft Purple
- Deep Focus: Calm Blue
- Conversation: Warm Amber/Orange
- Pause: Calming Green

### Typography

**Font Family**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Weights**:
- Headings: 700 (Bold) or 600 (Semibold)
- Body: 400 (Normal) or 500 (Medium)
- Subtle text: 400 (Normal)

**Sizes** (Key):
- Timer: 3-4rem (48-64px)
- Cost: 1.875rem (30px)
- Headings: 1.5-2rem (24-32px)

### Spacing & Rhythm

**Generous Breathing Room**:
- Card padding: 2rem (32px)
- Card gaps: 1-1.5rem (16-24px)
- Section spacing: 3rem (48px)

**Border Radius**:
- Cards: 1-1.5rem (16-24px)
- Buttons: 1rem (16px)
- Small elements: 0.5rem (8px)

### Animation - The "Breathe" Signature

**Breathing Animation** (Heara's core signature):
```css
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.95; }
}
/* Duration: 4s, subtle, infinite */
```

**When to use**:
- Timer display (very subtle)
- Selected mode cards
- Key moments (pause, conclusion)

**Gentle Pulse** (for awareness states):
```css
@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
/* Duration: 3s, calm, not alarming */
```

**Transitions**:
- Default: 300ms ease-in-out (slow, calm)
- Fast interactions: 200ms
- Calm transitions: 400ms

---

## 📱 UI Mockups

### 1. Conversation Mode (Core Feature)

![Heara Conversation Mode](C:/Users/hp/.gemini/antigravity/brain/8cdc94ae-51a3-4837-a815-8e46d350ffd6/heara_conversation_mode_1766612062442.png)

**Key Elements**:
- Heara wordmark + tagline at top
- "Conversation" mode label with participant count
- Large timer with subtle breathing animation
- Real-time cost counter (calm, not alarming)
- Warm amber tint when natural conclusion point reached
- Gentle observation message (not alert)
- Control buttons: Pause (ghost), Stop (soft amber)

**Wording**:
- Alert: "This conversation has reached its natural point."
- Suggestion: "You may want to wrap up or refocus."

---

### 2. Weekly Insights Dashboard

![Heara Weekly Insights](C:/Users/hp/.gemini/antigravity/brain/8cdc94ae-51a3-4837-a815-8e46d350ffd6/heara_weekly_insights_1766612087528.png)

**Key Elements**:
- Clean white background with breathing room
- Four insight cards: Focus Time, Conversations, Deep Focus %, Protected Time
- Minimalist bar chart showing rhythm (not performance)
- Insight card with observation + invitation
- Subtle action link (not button): "Explore your patterns →"

**Wording**:
- Card labels: "Focus Time", "Conversations" (not "Meetings"), "Protected Time"
- Insight: "You're most focused on Tuesdays between 14:00 and 16:00. Consider protecting this time."

---

### 3. Mode Selector

![Heara Mode Selector](C:/Users/hp/.gemini/antigravity/brain/8cdc94ae-51a3-4837-a815-8e46d350ffd6/heara_mode_selector_1766612114916.png)

**Key Elements**:
- Gradient background
- Title: "Choose your rhythm" (organic, not mechanical)
- Four mode cards with glassmorphism
- Icons: 🎯 Focus, 🧠 Deep Focus, 💬 Conversation, 🌿 Pause
- Selected card has breathing glow
- Action button: "Begin" (not "Start")

**Wording**:
- Focus: "Clear, focused work"
- Deep Focus: "Sustained concentration"
- Conversation: "Mindful collaboration"
- Pause: "Rest and recover"

---

## 🛠️ Design Tokens Reference

All values defined in `src/assets/design-tokens.css`:

**Conversation State Colors**:
- `--color-conversation-flowing`: #10b981
- `--color-conversation-awareness`: #f59e0b
- `--color-conversation-conclude`: #ef4444

**Animations**:
- `.breathe` - Heara's signature breathing (4s loop)
- `.gentle-pulse` - Calm awareness state (3s loop)
- `.transition-calm` - 400ms ease-in-out

**Spacing** (Generous):
- `--space-8`: 2rem (cards)
- `--space-12`: 3rem (sections)
- `--space-20`: 5rem (major sections)

---

## 🧭 Messaging Examples

### Positive Observations
✅ "You're in a good rhythm today."  
✅ "Tuesday afternoons seem to be your strongest focus window."  
✅ "You protected 3 hours for deep work this week."

### Gentle Suggestions
✅ "Consider protecting this time."  
✅ "Keep it clear if you can."  
✅ "You may want to wrap up or refocus."  
✅ "It might be a good moment to conclude."

### Signature Moments
✅ "Take a breath." (at pause start)  
✅ "Let it breathe." (at conversation end)

### What to Avoid
❌ "You missed your goal!"  
❌ "Productivity down 23%!"  
❌ "Stop now!!!"  
❌ "⚠️ ALERT: Time exceeded"

---

## 🚀 Implementation Checklist

### Branding
- [x] Name: Heara (everywhere)
- [x] Tagline: "Hear what truly matters"
- [x] Mode names: Focus, Deep Focus, Conversation, Pause
- [ ] Remove all "CostClock" references
- [ ] No version numbers ("v2", "beta")

### Voice & Wording
- [ ] Replace all aggressive alerts with observations
- [ ] Use "conversation" instead of "meeting"
- [ ] Use gentle suggestions, not commands
- [ ] Add signature phrases at key moments

### Visual Updates
- [x] Mockups regenerated with Heara brand
- [x] Design tokens updated
- [x] Breathing animations added
- [ ] Update App.vue with Heara welcome screen
- [ ] PWA manifest with Heara name

### Documentation
- [x] README.md updated
- [x] Brand guidelines created
- [x] Mockup documentation
- [ ] Component library aligned

---

## 💎 The Heara Promise

Heara doesn't push.  
She doesn't alert.  
She doesn't interrupt.

**She listens.**  
**She understands.**  
**She helps you decide.**

Calmly. Clearly. Thoughtfully.

---

**Heara - Hear what truly matters.** 🌿
