#!/usr/bin/env bash
gunicorn --workers $(nproc --all) --bind 0.0.0.0:${PORT:-5000} app
