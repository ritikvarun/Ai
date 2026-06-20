# Cozy & Fresh Design System: AuraFlow (Sage, Oat & Coral)

AuraFlow is a hybrid productivity suite blending the structural clarity of Notion with the infinite canvas of Miro. The visual language is **cozy, modern, clean, and fresh**. It avoids clinical coldness by utilizing warm, grounded earth tones, while staying highly energetic and fresh with soft neon pastel accent highlights.

---

## 🎨 Color Palette

We specify a dual-mode semantic color scale mapped to our CSS variables.

### Base System Colors

| Token Name | Light Mode Hex | Dark Mode Hex | Description |
| :--- | :--- | :--- | :--- |
| `bg-primary` | `#FAF9F5` (Warm Cream) | `#141412` (Soft Pitch) | App background |
| `bg-sidebar` | `#F1ECE2` (Warm Oatmeal) | `#1C1C19` (Obsidian Oat) | Left panel / Sidebar background |
| `bg-card` | `#FFFFFF` (Pure Alabaster) | `#23221F` (Warm Slate) | Cards, panels, modal container |
| `text-primary` | `#2D2B28` (Charcoal Oat) | `#EAE9E2` (Warm Alabaster) | Main headings & paragraph text |
| `text-muted` | `#706B63` (Muted Hazel) | `#9C988F` (Muted Warm Gray) | Help text, sidebar category labels |
| `border-cozy` | `#E3DEC9` (Oat Wheat Border) | `#2E2C29` (Charcoal Border) | Component separators & grid lines |
| `hover-cozy` | `#EAE4D5` (Soft Hazel Hover) | `#2B2A27` (Soft Obsidian Hover) | Hover background selectors |

### Colorful Icon Accents (Fresh Pastels & Glows)
To keep the cozy theme from feeling dull, we assign a distinct fresh accent color to each functional workspace icon:

| Page / MenuItem | Accent Tone | Light Mode Color | Dark Mode Color | Lucide Icon |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | Soft Emerald | `#10B981` | `#34D399` | `LayoutDashboard` |
| **AI Assistant** | Bright Coral | `#EF4444` | `#FF6B5A` | `Sparkles` |
| **Calendar** | Cozy Amber | `#D97706` | `#FBBF24` | `Calendar` |
| **Task / Kanban** | Pastel Indigo | `#6366F1` | `#818CF8` | `KanbanSquare` |
| **Notes** | Warm Teal | `#0D9488` | `#2DD4BF` | `Notebook` |
| **Whiteboard** | Bright Cyan | `#06B6D4` | `#22D3EE` | `Presentation` |
| **Pages / Spaces** | Rose Pink | `#EC4899` | `#F472B6` | `FolderOpen` |
| **AI Template Builder** | Neon Violet | `#8B5CF6` | `#A78BFA` | `Cpu` |
| **Settings** | Slate Blue | `#475569` | `#94A3B8` | `Settings` |

---

## ✍️ Typography

- **Font Family**: Inter, Outfit, or system sans-serif (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Weights**:
  - `400` (Regular)
  - `500` (Medium) - Default for sidebar navigation text
  - `600` (Semi-Bold)
  - `700` (Bold)
- **Scale**:
  - `xs`: `0.75rem` (12px) - Sidebar categories, footer helper text
  - `sm`: `0.85rem` (13.6px) - **Sidebar menu options (smaller, compact style)**
  - `base`: `0.95rem` (15.2px) - Main copy text
  - `lg`: `1.125rem` (18px) - Card headers, subheadings
  - `xl`: `1.5rem` (24px) - Large titles
  - `2xl`: `2.25rem` (36px) - Hero sections

---

## 📐 Spacing & Borders

- **Densities**: Elements are nested tightly but comfortably to evoke a "workspace notebook" feel.
- **Sidebar Padding**: Smaller, tighter item gap (`gap-1` or `0.25rem` vertically) and horizontal padding (`0.5rem` or `8px`).
- **Border Radius**: Warm, soft shapes.
  - Controls, tags, buttons: `6px` (`rounded-sm`) or `8px` (`rounded-md`)
  - Cards & layout containers: `12px` (`rounded-lg`) or `16px` (`rounded-xl`)
- **Shadows**: Soft, diffuse ambient occlusion shadows instead of heavy black edges:
  - Cozy Glow Shadow: `0 4px 20px -2px rgba(107, 102, 95, 0.1)`

---

## ✨ Micro-Animations & Guidelines

1. **Collapsible Sidebar Transition**:
   - Sidebar transition duration: `300ms` with `cubic-bezier(0.4, 0, 0.2, 1)` easing.
   - Hides text labels and app title seamlessly while retaining centered colorful icons.
2. **Hover States**:
   - Active state has a left-accent indicator line (`2px` thick, matching the page's custom accent color) and a soft background highlight.
   - Text scales/lifts slightly (`scale-[1.01]`) or triggers a soft transition when hovered.
