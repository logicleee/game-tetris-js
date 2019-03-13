#PATH := :$(PATH)
SHELL := /bin/bash

app_bundle := index.html tetris-game.css tetris-game.js

.PHONY: all

all: test clean app openIndex pushToWWW

app: $(app_bundle)

tetris-game.js: game.js
	cat $< | sed 's/^module.exports.*//' > $@

index.html: static/index.html
	cp -pv $< $(dir $@)

tetris-game.css: static/tetris-game.css
	cp -pv $< $(dir $@)

test:
	date
	npm test

openIndex:
	open index.html

pushToWWW:
	cp -pv index.html ~/www/logicleee.github.io/tetris/
	cp -pv tetris-game.css ~/www/logicleee.github.io/tetris/
	cp -pv tetris-game.js ~/www/logicleee.github.io/tetris/


clean:
	rm -f index.html
	rm -f tetris-game.css
	rm -f tetris-game.js
