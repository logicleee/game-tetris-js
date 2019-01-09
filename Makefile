#PATH := :$(PATH)
SHELL := /bin/bash

app_bundle := index.html tetris-game.js
.PHONY: all

all: test clean app openIndex

app: $(app_bundle)

tetris-game.js: game.js
	cat $< | sed 's/^module.exports.*//' > $@

index.html: static/index.html
	cp -pv $< $(dir $@)

test:
	date
	npm test

openIndex:
	open index.html

clean:
	rm -f index.html
	rm -f tetris-game.js
