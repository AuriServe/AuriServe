#!/bin/bash

cd build

if [ ! -f "better-sqlite3/build/Release/better_sqlite3.node" ]; then
	echo "Building better_sqlite3.node"
	git clone https://github.com/JoshuaWise/better-sqlite3
	cd better-sqlite3
	npm run build-release -- --target=v10.20.1 --build_v8_with_gn=false
	cd ../
fi

cp better-sqlite3/build/Release/better_sqlite3.node native
cd ../

eslint src/**/*.ts & tsc --project tsconfig.json &&
nexe --target linux-x64-10.20.1 --name AuriServe --output build/AuriServe;
npm run clean
