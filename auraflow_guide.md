# 🌟 AuraFlow — Complete User Guide

> **Notion × Miro × AI** — ek jagah sab kuch

---

## 📱 Responsive Status

| Screen | Behavior |
|--------|----------|
| **Desktop (1024px+)** | Full sidebar + navbar + content — best experience ✅ |
| **Tablet (768px+)** | Sidebar collapse karo, content full width ✅ |
| **Mobile (<768px)** | Sidebar collapse karke use karo, navbar search hide hoti hai ⚠️ |

> **Tip:** Mobile pe sidebar ke `←` button se collapse karo — content full screen mil jaata hai.

---

## 🔐 Auth Flow

```
Landing Page (/)
    ↓ "Sign In" ya "Get Started"
Sign In / Sign Up (/sign-in, /sign-up)
    ↓ Google se login
Auto DB sync (/sync-user)
    ↓
Dashboard (/workspace) ✓
```

### Logout karna ho:
**Sidebar → Bottom-right → `→` (LogOut icon) click karo**  
Seedha Sign-In page pe aa jaoge.

---

## 🏠 Dashboard (Home)

Workspace pe aane ke baad **Dashboard** pehli screen hogi.

**Kya milega:**
- 📊 Recent activity aur updates
- 📌 Pinned apps aur spaces
- ⚡ Quick stats — tasks, notes count
- 🤖 AI suggestions

**Navigate karna:** Left sidebar se koi bhi section select karo.

---

## 📋 Task / Kanban Board

**Sidebar → "Task / Kanban"**

| Feature | Kaise use karein |
|---------|-----------------|
| **New card** | Column ke `+` button pe click |
| **Card move** | Drag & drop between columns |
| **Priority set** | Card pe click → Priority badge |
| **Assign** | Card mein team member assign karo |
| **Due date** | Card → Calendar icon |

**Columns:** `To Do` → `In Progress` → `Done`

---

## ✍️ Notes & Documents

**Sidebar → "Notes"**

Rich text editor — Notion jaisa block editor.

| Command | Result |
|---------|--------|
| `/h1` | Heading 1 |
| `/h2` | Heading 2 |
| `/todo` | Checkbox list |
| `/code` | Code block |
| `/quote` | Blockquote |

**AI Refine:** Text select karo → AI button se summary ya rewrite karo.

---

## 🎨 Whiteboard Canvas

**Sidebar → "Whiteboard"**

Miro jaisa infinite canvas — **Excalidraw** powered.

| Tool | Shortcut |
|------|----------|
| **Hand/Pan** | `H` ya Space hold |
| **Select** | `S` ya `V` |
| **Rectangle** | `R` |
| **Circle** | `O` |
| **Arrow** | `A` |
| **Text** | `T` |
| **Pencil/Draw** | `P` |
| **Zoom in/out** | `Ctrl +` / `Ctrl -` |
| **Fit screen** | `Ctrl Shift H` |
| **Undo** | `Ctrl Z` |

---

## 🤖 Spark AI Assistant

**Sidebar → "AI Assistant"**

AuraFlow ka built-in AI copilot.

**Kya kar sakta hai:**
- 📝 Notes aur documents draft karo
- 📋 Kanban boards ke liye tasks generate karo
- 🗓️ Meeting agendas banao
- 💡 Brainstorming ideas suggest karo
- 🔄 Existing content rewrite/summarize karo

**Example prompts:**
```
"Create a marketing launch roadmap for Q3"
"Write a product spec for a mobile app"
"Summarize this meeting notes"
"Give me 5 ideas for our landing page hero"
```

---

## 📅 Calendar

**Sidebar → "Calendar"**

Team aur personal schedule manage karo.

- **Event add:** Date pe click karo
- **View toggle:** Month / Week / Day
- **Drag events:** Timeline pe drag karke reschedule karo
- **AI sync:** Kanban tasks automatically calendar pe show hote hain

---

## 📁 Pages & Spaces

**Sidebar → "Pages / Spaces"**

Workspace hierarchy — nested pages aur spaces.

```
📁 My Workspace
├── 📁 Marketing
│   ├── 📄 Campaign Plan
│   └── 📄 Brand Guidelines  
├── 📁 Engineering
│   ├── 📄 Architecture Notes
│   └── 📋 Sprint Board
└── 📄 Personal Notes
```

**New page:** `+ New Page` button  
**Nest pages:** Parent page ke andar create karo  
**Pin to sidebar:** Page → `📌 Pin` option

---

## ⚙️ Settings

**Sidebar → "Settings"**

| Setting | Options |
|---------|---------|
| **Theme** | Light / Dark (sidebar ya navbar toggle) |
| **Profile** | Clerk se manage hota hai |
| **Workspace name** | Customize karo |
| **Notifications** | Bell icon → preferences |

---

## 🌙 Dark / Light Mode

**2 jagah se toggle kar sakte ho:**
1. **Sidebar bottom-left** → Moon/Sun icon
2. **Navbar top-right** → Toggle switch

Theme `localStorage` mein save hoti hai — next visit pe yaad rahega.

---

## ⌨️ Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl K` | Quick search |
| `Ctrl /` | Keyboard shortcuts help |
| `Ctrl S` | Save (notes mein) |
| `Ctrl Z` | Undo |
| `Ctrl Shift D` | Dashboard pe jao |

---

## 🚀 Responsive Tips

### Mobile use karna ho toh:
1. **Sidebar collapse karo** — `←` button press karo
2. **Full content area** milega
3. **Navigation:** Collapsed sidebar ke icons se navigate karo (hover pe tooltip aayega)

### Best experience ke liye:
- **Desktop browser** use karo (Chrome/Edge recommended)  
- **1280px+ width** pe sab features best dikhte hain
- **Tablet:** Portrait mode mein sidebar collapse karo

---

## 🔑 Environment Variables (Dev reference)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # Clerk frontend key
CLERK_SECRET_KEY=sk_test_...                     # Clerk server key  
DATABASE_URL=postgresql://...                     # Neon Postgres URL
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_...     # Realtime collab
LIVEBLOCKS_SECRET_KEY=sk_dev_...                 # Liveblocks server
NEXT_PUBLIC_DISABLE_CLERK=false                  # Auth enable/disable
```

---

## ⚠️ Known Limitations (Dev mode)

- Clerk development keys — production ke liye upgrade karo
- Neon free tier — 0.5GB storage limit
- Liveblocks dev plan — limited connections
- Mobile sidebar — full responsive drawer baaki hai

---

*AuraFlow v1.0 — Built with Next.js 16, Clerk Auth, Neon DB, Drizzle ORM, Liveblocks*
