#!/usr/bin/env bash
# credential helper — يقرأ رمز GitHub من .secrets/env دون طباعة أي سر
echo "username=x-access-token"
echo "password=$(sed -n 's/^GITHUB_TOKEN=//p' "$(dirname "$0")/../.secrets/env")"
