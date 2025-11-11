#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /$APP_PATH/tmp/pids/server.pid

# run passed commands
exec "$@"
