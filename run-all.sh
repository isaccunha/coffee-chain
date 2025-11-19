#!/bin/bash

echo "Launching services in separate terminals..."
echo "NOTE: You may be asked for your sudo password in the new terminals."

# Start DB
# Uses sudo because docker socket usually requires it
gnome-terminal --tab --title="DB Server" -- bash -c "echo 'Starting Database...'; sudo docker-compose -f auth-ms/docker-compose.yml up; exec bash"

# Start Auth Server
# Cleans dist folder with sudo first to avoid permission errors from previous root runs
gnome-terminal --tab --title="Auth Server" -- bash -c "cd auth-ms && echo 'Cleaning build artifacts...' && sudo rm -rf dist && echo 'Starting Auth Server...' && npm run start:dev; exec bash"

# Start Frontend
# Runs as normal user
gnome-terminal --tab --title="Frontend Server" -- bash -c "cd frontend && echo 'Starting Frontend...' && npm run dev; exec bash"

echo "Done. Check the opened terminals."
