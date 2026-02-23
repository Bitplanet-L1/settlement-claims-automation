# Settlement Claims Tool - Quick Start

**Get started in 5 minutes:**

## 1. Setup (One-Time)

```bash
cd settlement-claims

# Install Playwright browsers
npm run setup

# Edit your personal info
nano templates/user-profile.json
```

Update with YOUR real information:
- Name, email, phone
- Address, city, state, zip
- This will auto-fill claim forms

## 2. First Scan

```bash
npm run scan
```

This will:
- ✅ Search TopClassActions.com
- ✅ Search ClassAction.org  
- ✅ Save results to memory/settlement-claims.json
- ✅ Show you what was found

## 3. Check What You Found

```bash
npm run priority
```

Shows top 10 claims ranked by:
- Deadline proximity (expiring soon = higher priority)
- Estimated payout amount

## 4. File Your First Claim

```bash
node index.js fill <settlement-id>
```

Copy the `ID` from the priority list, then:

```bash
# Example:
node index.js fill https-topclassactions-com-data-breach-2024
```

The browser will open and auto-fill the form. Then:
1. ✅ Review all fields (make sure they're correct)
2. ✅ Upload any required documents (receipts, proof of purchase)
3. ✅ Click "Submit" manually
4. ✅ Screenshots saved in `screenshots/` folder

## 5. Track Your Claims

```bash
npm run stats
```

Shows:
- Total settlements discovered
- How many you've filed
- Total earnings
- Conversion rate

## 6. Automate Daily Scans

### Option A: Manual (Recommended to start)

Run once a week:
```bash
npm run scan
npm run priority
```

### Option B: Cron (Automated)

```bash
# Edit crontab
crontab -e

# Add this line (scan daily at 9 AM):
0 9 * * * cd /path/to/settlement-claims && npm run scan
```

Or use the automation script:
```bash
./automate.sh
```

## Tips for Success

### 🎯 Focus on These Settlements:
- **Data breaches** - Usually no proof needed, just affected date range
- **Consumer products** - Often don't require receipts
- **Financial services** - Bank/credit card you've used
- **Tech/software** - Apps or services you've subscribed to

### 💰 Maximize ROI:
- File claims >$50 first (better time investment)
- Batch 3-5 claims in one session
- Keep common docs ready (utility bills, bank statements)
- Skip claims requiring receipts you don't have

### 📧 Optional: Email Alerts

Get notified when new settlements appear:

```bash
# Set up Gmail app password: https://myaccount.google.com/apppasswords
export EMAIL_USER="youremail@gmail.com"
export EMAIL_PASS="your-app-password"
export NOTIFY_EMAIL="youremail@gmail.com"

# Or save to .env file
cp .env.example .env
nano .env
```

## Expected Results

**Month 1:**
- Discover: 15-25 settlements
- File: 5-7 claims
- Earnings: $250-400 (payouts take 2-6 months)

**Months 2-3:**
- Start receiving checks
- Optimize to 8-10 claims/month
- Steady $400-650/month

**Time Investment:**
- Setup: 30 min (one-time)
- Weekly: 1-2 hours filing claims
- Mostly automated discovery

## Common Questions

**Q: Is this legal?**  
A: Yes! Settlement claims are legitimate compensation for affected consumers. Only file if you're actually eligible.

**Q: Do I need receipts?**  
A: Depends on the settlement. Data breach claims often don't. Product claims sometimes do. The tool shows requirements.

**Q: How long until I get paid?**  
A: 2-6 months typically. Some settlements take longer. Track everything.

**Q: What if auto-fill misses fields?**  
A: Screenshots are saved. Manually complete missing fields before submitting.

## Next Steps

1. ✅ Run your first scan
2. ✅ File 1-2 test claims
3. ✅ Set up weekly reminders
4. ✅ Track payouts in `settlement-claims.json`
5. ✅ Scale to 8-10 claims/month

**Ready? Start now:**

```bash
npm run scan
npm run priority
```

---

**Revenue Target:** $325-650/month passive income  
**Time:** 1-2 hours/week after setup  
**ROI:** ~$150-200/hour invested
