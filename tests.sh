#!/bin/sh

set -e

if [ "$1" = "" ]; then
	target="tests/test_*"
fi

node_modules/.bin/istanbul cover -- node_modules/.bin/_mocha $target "$@"

if [ "$1" = "" ]; then
	node_modules/.bin/jshint tests lib
fi