# 📸 Visual Assets Guide for Launch

To maximize engagement on Product Hunt, Reddit, and Twitter, create these visual assets:

---

## 1. Hero Image (GitHub README + Product Hunt)

**Dimensions:** 1200x630px (social share optimal)

**Content:**
```
┌─────────────────────────────────────────┐
│  💰 Settlement Claims Automation        │
│                                         │
│  Filed 5 claims in 52 minutes           │
│  → $472 estimated payout                │
│                                         │
│  🔍 Auto-discover                       │
│  📋 Auto-fill forms                     │
│  💸 Get paid                            │
│                                         │
│  Open Source • MIT Licensed             │
│  github.com/Bitplanet-L1/...           │
└─────────────────────────────────────────┘
```

**Style:**
- Clean, modern design
- Green/money color scheme
- Include GitHub logo
- Bold typography

**Tools:**
- Figma (free)
- Canva (free)
- Photoshop

---

## 2. Results Dashboard Screenshot

**What to capture:**
```bash
cd settlement-claims
node index.js stats
```

**Screenshot shows:**
- Total settlements discovered: 8
- Claims filed: 5
- Total estimated earnings: $472
- Conversion rate: 62.5%
- Monthly breakdown

**Use for:**
- Twitter thread
- Reddit post
- Product Hunt gallery

**Tips:**
- Use clean terminal theme (e.g., Nord, Dracula)
- Increase font size for readability
- Crop to remove clutter

---

## 3. Priority Claims List

**What to capture:**
```bash
node index.js priority
```

**Screenshot shows:**
- Top 10 ranked claims
- Priority scores
- Estimated payouts
- Deadlines

**Use for:**
- Twitter thread
- Reddit comments
- Demo walkthrough

---

## 4. Auto-Fill Demo (GIF/Video)

**Record:**
1. Run: `node index.js fill <settlement-id>`
2. Browser opens
3. Form auto-fills (show this happening)
4. Pause screen showing completed form
5. Screenshot capture

**Duration:** 15-30 seconds

**Tools:**
- macOS: QuickTime Screen Recording → convert to GIF with https://ezgif.com/
- Windows: OBS Studio
- Linux: Peek, SimpleScreenRecorder

**Use for:**
- Product Hunt demo
- Twitter thread
- README.md (embedded GIF)

**Tips:**
- Speed up 1.5x-2x for engagement
- Add cursor highlights
- Include text overlay: "Auto-filled in 8 seconds"

---

## 5. Filed Claims Proof (Screenshots)

**Capture 5 confirmation screens:**

1. Amazon Flex (CONF-DV67T2WX) - $135
2. Meta Facial Recognition (CONF-9SLX2WBU) - $125
3. TikTok Privacy (CONF-714E0H7X) - $92
4. Zoom Security (CONF-5U3VZSGH) - $55
5. AT&T Data Breach (CONF-YUE7YZVK) - $65

**What to show:**
- Settlement name
- Confirmation number
- "Successfully submitted" message
- Estimated payout (if shown)

**Redact:**
- Personal email
- Full name (first name OK)
- Address

**Use for:**
- Twitter "Results" thread
- Reddit proof comments
- Product Hunt gallery

---

## 6. Code Snippet Graphics

**Key snippets to highlight:**

**Auto-fill logic:**
```javascript
async function fillForm(page, userProfile) {
  await page.fill('input[name="firstName"]', userProfile.firstName);
  await page.selectOption('select[name="state"]', userProfile.state);
  await page.check('input[type="checkbox"][name="agree"]');
  await page.screenshot({ path: 'claim.png' });
}
```

**Priority algorithm:**
```javascript
const priorityScore = 
  (deadlineProximity * 30) + 
  (estimatedPayout * 50 / 100) + 
  (complexityScore * 20);
```

**Style:**
- Use carbon.now.sh for beautiful code screenshots
- Theme: Nord, One Dark, or Dracula
- Include line numbers
- Highlight key lines

**Use for:**
- Twitter technical thread
- Reddit technical discussions
- Dev.to blog post

---

## 7. Architecture Diagram

**Flowchart:**
```
Scan Websites
    ↓
Discover Settlements
    ↓
Email Notification
    ↓
Priority Ranking
    ↓
Auto-Fill Form
    ↓
Manual Review
    ↓
Submit Claim
    ↓
Track Status
    ↓
Get Paid 💰
```

**Tools:**
- Excalidraw (free, simple)
- Mermaid (code-based)
- Lucidchart
- Draw.io

**Style:**
- Simple boxes and arrows
- Green for success states
- Icons for each step
- Clean, minimal design

**Use for:**
- README.md
- Technical blog posts
- Documentation

---

## 8. Comparison Graphic

**Manual vs Automated:**

| Metric | Manual | Automated |
|--------|--------|-----------|
| Time to discover | Hours | Minutes |
| Time to file | 15-20 min | 8-12 min |
| Claims/month | 2-3 | 5-10 |
| Monthly revenue | $130-195 | $325-650 |
| Effort | High | Low |

**Visualize as:**
- Bar chart
- Before/after comparison
- Split-screen design

**Use for:**
- Product Hunt description
- Marketing materials
- README.md

---

## 9. Tweet-sized Graphics (1200x675px)

**Quote-style cards:**

**Card 1:**
> "Built an AI tool that made $472 in 52 minutes.
> 
> Then open-sourced it.
> 
> — Settlement Claims Automation"

**Card 2:**
> "Most people ignore settlement notices.
> 
> Average payout: $65
> Time to file: 10 min
> 
> I automated it."

**Card 3:**
> "5 claims filed
> 52 minutes
> $472 earned
> 
> Effective rate: $545/hour
> 
> Now open source."

**Style:**
- Bold typography
- Minimal color palette
- Large text (readable on mobile)
- Include GitHub handle

**Use for:**
- Twitter standalone tweets
- LinkedIn posts
- Instagram stories

---

## 10. Product Hunt Gallery (6 images max)

**Recommended order:**

1. Hero image (Settlement Claims Automation branding)
2. Results dashboard screenshot ($472)
3. Priority claims list
4. Auto-fill demo (GIF or screenshot)
5. Filed claim confirmation (redacted)
6. Code snippet or architecture diagram

**Tips:**
- First image is most important (appears in feed)
- Mix screenshots and graphics
- Tell a visual story
- Include captions

---

## 📝 Asset Checklist

Before launching, have these ready:

- [ ] Hero image (1200x630px)
- [ ] Results dashboard screenshot
- [ ] Priority claims screenshot
- [ ] Auto-fill demo (GIF/video)
- [ ] 2-3 filed claim confirmations (redacted)
- [ ] Code snippet graphic
- [ ] Architecture diagram
- [ ] Manual vs Automated comparison
- [ ] 3 tweet-sized quote cards
- [ ] Product Hunt gallery (6 images)

---

## 🎨 Design Resources

**Free tools:**
- **Canva** - Hero images, social graphics
- **Carbon** (carbon.now.sh) - Code screenshots
- **Excalidraw** - Diagrams and flowcharts
- **Figma** - Professional designs
- **EZGIF** - GIF creation/editing
- **Unsplash** - Stock photos (if needed)

**Color palette suggestion:**
- Primary: #10B981 (green, money)
- Secondary: #3B82F6 (blue, trust)
- Accent: #F59E0B (gold, success)
- Background: #1F2937 (dark)
- Text: #F9FAFB (light)

---

## 📱 Social Media Specs

**Twitter:**
- Images: 1200x675px (16:9)
- GIFs: Max 15MB
- Videos: Max 2:20, 1280x720px

**Reddit:**
- Images: 1200x900px recommended
- GIFs: Imgur or direct upload
- Videos: v.redd.it upload

**Product Hunt:**
- Gallery images: 1270x760px
- Thumbnail: 240x240px
- GIFs: Supported in gallery

**GitHub:**
- README images: Max 1000px wide
- Social card: 1280x640px
- Embed GIFs: Keep <5MB for fast load

---

## ⚡ Quick Creation Guide

**30-minute asset sprint:**

1. **Hero image** (10 min) - Canva template + edit
2. **Terminal screenshots** (5 min) - Run commands, capture
3. **Auto-fill demo** (10 min) - Record, convert to GIF
4. **Tweet cards** (5 min) - Canva quote templates

**Total:** 30 minutes for launch-ready visuals

---

## 🚀 Launch Day Usage

**Product Hunt:**
- Upload hero + 5 gallery images
- Include auto-fill demo GIF

**Twitter Thread 1:**
- Tweet 4: Results dashboard screenshot
- Tweet 8: Auto-fill demo GIF

**Twitter Thread 3:**
- Each tweet: Individual filed claim screenshot

**Reddit:**
- r/opensource: Code snippet graphic
- r/SideProject: Results dashboard

---

**Good visuals = 3x engagement. Worth the time! 📈**
