#!/usr/bin/env bash
#
# Detect and set version based on latest commit message.

if [[ "$TRAVIS_PULL_REQUEST" != false ]];then
  echo "Won't version pull-requests!";
  exit 0
fi

if [[ "$TRAVIS_BRANCH" = "release" ]]; then
    npm run release -- --pre-release
elif [[ "$TRAVIS_BRANCH" = "canary" ]]; then
    npm run release
fi
