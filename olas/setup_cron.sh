#!/bin/bash

# === CONFIGURATION ===
PYTHON_SCRIPT="/Users/saurav/projects/slpf4/olas/main.py"
LOG_FILE="//Users/saurav/projects/slpf4/olas/cron.log"
SCHEDULE="30 6 * * *"  
# ======================

# Find Python path
PYTHON_PATH=$(which python3)

# Check script existence
if [ ! -f "$PYTHON_SCRIPT" ]; then
  echo "Error: Python script not found at $PYTHON_SCRIPT"
  exit 1
fi

# Make the script executable and add shebang if missing
if ! head -1 "$PYTHON_SCRIPT" | grep -q "$PYTHON_PATH"; then
  echo "#!$PYTHON_PATH" | cat - "$PYTHON_SCRIPT" > temp && mv temp "$PYTHON_SCRIPT"
  chmod +x "$PYTHON_SCRIPT"
fi

# Add cron job
CRON_JOB="$SCHEDULE $PYTHON_PATH $PYTHON_SCRIPT >> $LOG_FILE 2>&1"

# Check if job already exists
(crontab -l 2>/dev/null | grep -v -F "$PYTHON_SCRIPT"; echo "$CRON_JOB") | crontab -

echo "Cron job set: $CRON_JOB"
