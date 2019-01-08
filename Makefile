#PATH := :$(PATH)
SHELL := /bin/bash

app_bundle := index.html tetris-game.js
.PHONY: all

all: clean app

app: $(app_bundle)

tetris-game.js: game.js
	cat $< | sed 's/^module.exports.*//' > $@

index.html: static/index.html
	cp -pv $< $(dir $@)

clean:
	rm -f index.html
	rm -f tetris-game.js
