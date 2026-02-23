# Quick Usage Example

## First Time Setup (2 minutes)

```bash
# 1. Install dependencies
cd settlement-claims
npm run setup

# 2. Configure your info
nano templates/user-profile.json
```

Update with YOUR information:
```json
{
  "firstName": "Siddharth",
  "lastName": "Patel",
  "email": "your-email@example.com",
  "phone": "555-123-4567",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "MH",
  "zip": "400001"
}
```

## Daily Workflow (5-10 minutes)

### Scan for New Settlements
```bash
npm run scan
```

Output:
```
🔍 Scanning settlement sources...

[TopClassActions] Found 8 settlements
[ClassAction] Found 6 settlements

✅ Total found: 14 settlements
```

### Check Priority Claims
```bash
npm run priority
```

Output:
```
🎯 Priority Claims (Top 10)

1. Data Breach Settlement - TechCorp 2024
   Priority Score: 80
   Amount: $150
   Deadline: March 15, 2024 (12 days)
   ID: https-topclassactions-com-techcorp-breach-2024
   
2. Payment Processing Fees Settlement
   Priority Score: 60
   Amount: $75
   Deadline: April 1, 2024 (28 days)
   ID: https-classaction-org-payment-fees-settle
```

### File a Claim (10-15 minutes)
```bash
node index.js fill https-topclassactions-com-techcorp-breach-2024
```

Browser opens → form auto-fills → you review → manually submit

### Track Progress
```bash
npm run stats
```

Output:
```
📊 Settlement Claims Statistics

═══════════════════════════════════════
Total Discovered:     47
Total Filed:          12
Total Earned:         $650.00
Conversion Rate:      25.5%
```

## Weekly Routine

**Monday (5 min):**
```bash
npm run scan
npm run priority
```

**Wednesday (45-60 min):**
- File 2-3 high-priority claims
- Review screenshots
- Upload any required documents
- Submit forms

**Expected ROI:**
- Time: 1 hour/week = 4 hours/month
- Claims: 8-10/month
- Revenue: $400-650/month
- Hourly rate: $100-160/hour

## Automation

**Set it and (mostly) forget it:**

```bash
# Add to crontab (runs daily at 9 AM)
crontab -e

# Add this line:
0 9 * * * cd /path/to/settlement-claims && npm run scan
```

You'll get scanned settlements automatically. Review weekly and file priority claims.

---

**Ready to start?**

```bash
npm run scan
```
