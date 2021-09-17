#!/usr/bin/env bash
#
# Deploy @mat-datetimepicker/core and @mat-datetimepicker/moment.

if [[ "$TRAVIS_PULL_REQUEST" != false ]];then
  echo "Won't publish from pull-requests!";
  exit 0
fi

ADDITIONAL_OPTS="";
if [[ "$TRAVIS_BRANCH" = "canary" ]]; then
    ADDITIONAL_OPTS="$ADDITIONAL_OPTS --tag=beta"
fi

npm publish dist/core --follow-tags $ADDITIONAL_OPTS
npm publish dist/moment --follow-tags $ADDITIONAL_OPTS
