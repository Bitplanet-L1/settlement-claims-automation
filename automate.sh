#!/bin/bash

##
# Settlement Claims Automation Script
# Run this daily via cron for fully automated settlement discovery
##

# Set working directory
cd "$(dirname "$0")"

# Load environment (if using .env file)
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Log file
LOG_FILE="../logs/settlement-claims-$(date +%Y-%m-%d).log"
mkdir -p ../logs

echo "======================================" >> "$LOG_FILE"
echo "Settlement Claims Scan: $(date)" >> "$LOG_FILE"
echo "======================================" >> "$LOG_FILE"

# Run scan
node index.js scan >> "$LOG_FILE" 2>&1

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ Scan completed successfully" >> "$LOG_FILE"
else
  echo "❌ Scan failed" >> "$LOG_FILE"
fi

echo "" >> "$LOG_FILE"

# Optional: Send summary to stdout for cron email
node index.js stats
