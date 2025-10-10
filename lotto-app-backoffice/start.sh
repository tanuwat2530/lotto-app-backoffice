#!/bin/bash

# Configuration Variables
# -----------------------------------------------------------------------------
# Name used to identify the running process (e.g., node, or the main JS file name)
# This assumes your 'yarn start' command runs a node process.
# We will search for a process running the 'start' script, which is safer.
BACKOFFICE_LOTTO_APP="lotto-app-backoffice"
# Directory where your React BACKOFFICE project resides
APP_DIR="/home/pranakorn_lotto/lotto-app-backoffice/lotto-app-backoffice"
# Full path for the application log file
LOG_FILE="/home/pranakorn_lotto/lotto-app-backoffice/lotto-app-backoffice/lotto-app-backoffice.log"
# The specific command to start your application (usually 'yarn start')
START_COMMAND="yarn start"

source ~/.bash_profile
# -----------------------------------------------------------------------------

echo "----------------------------------------------------"
echo "Starting React BACKOFFICE Deployment"
echo "Application Directory: ${APP_DIR}"
echo "Log File: ${LOG_FILE}"
echo "----------------------------------------------------"

# Navigate to the application directory
cd "${APP_DIR}" || { echo "Error: Cannot navigate to application directory ${APP_DIR}. Exiting."; exit 1; }

# --- Step 1: Install Dependencies ---
echo "1. Running 'yarn install' to ensure dependencies are up to date..."
yarn install

# Check if yarn install was successful
if [ $? -ne 0 ]; then
    echo "Error: 'yarn install' failed. Check project structure and network connection. Exiting."
    exit 1
fi
echo "Dependencies installed successfully."


# --- Step 1: Install Dependencies ---
echo "2. Running 'yarn build' to ensure dependencies are up to date..."
yarn build

# --- Step 2: Kill Existing BFF Process ---
echo "3. Checking for existing application processes..."

# Use lsof to find the PID listening on TCP port 4000.
# lsof -t -i :4000 returns only the PID(s).
PID_BY_PORT=$(sudo lsof -t -i :4000)

if [ -n "$PID_BY_PORT" ]; then
    echo "Found running process(es) on port 4000 (PID(s): $PID_BY_PORT). Killing gracefully..."
    
    # Terminate the process gently (SIGTERM)
    kill $PID_BY_PORT
    
    # Wait a few seconds for cleanup
    sleep 5
    
    # Check if the process is still running and force kill if necessary (SIGKILL)
    # Note: We re-run lsof to see if the process is truly gone.
    if sudo lsof -t -i :4000 > /dev/null; then
        echo "Process(es) did not shut down. Force killing (SIGKILL)..."
        kill -9 $PID_BY_PORT
    fi
    
    echo "Existing process(es) terminated."
else
    echo "No existing process found on port 4000. Continuing."
fi


# --- Step 3 & 4: Run Application in Background and Redirect Output ---
echo "4. Starting new application instance using '${START_COMMAND}' in the background."

# Clear previous log file content (optional: remove > if you prefer appending to logs)
> "${LOG_FILE}"

# Start the application:
# 1. 'nohup' prevents the process from being killed when the session disconnects.
# 2. '${START_COMMAND}' executes the application start command.
# 3. '>> "${LOG_FILE}" 2>&1' appends (or redirects after the > clear) stdout (1) and stderr (2) to the log file.
# 4. '&' runs the entire command in the background.
nohup $START_COMMAND >> "${LOG_FILE}" 2>&1 &

NEW_PID=$!
echo "New application started successfully."
echo "New PID: $NEW_PID"
echo "Console output redirected to: ${LOG_FILE}"
echo "----------------------------------------------------"

# Optional: Display the last few lines of the log file to confirm successful startup
echo "Log snippet (tail -n 10 ${LOG_FILE}):"
tail -n 10 "${LOG_FILE}"

exit 0