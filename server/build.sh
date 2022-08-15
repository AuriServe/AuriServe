#!/bin/bash

cd build

if [ ! -f "sqlite3.node" ]; then
	echo "Building better_sqlite3.node"
	git clone https://github.com/JoshuaWise/better-sqlite3
	cd better-sqlite3
	npm update
	npm install
	npm run build-release
	cd ../
	cp better-sqlite3/build/Release/better_sqlite3.node sqlite3.node
fi

cd ../

eslint src/**/*.ts & tsc --project tsconfig.json &&
nexe --build --make="-j$(nproc 2> /dev/null || echo 1)" --name AuriServe --output build/AuriServe;
npm run clean
