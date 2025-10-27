#!/bin/node

# clean dist folder
rm -rf dist > /dev/null

# transpile source
babel src -d dist --extensions .ts

# copy type definitions
cp @types/index.d.ts dist/index.d.ts
cp @types/environment.d.ts dist/environment.d.ts