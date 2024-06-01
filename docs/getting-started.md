# Environment

## Getting started

This package enhance how you manage your environments on app.

## Usage

To use this package you need to install it. Assuming you have `pnpm` installed do:

```sh
pnpm add @x-spacy/environment
```

*Note:* you need to install it as prod dependency.

When installed the dependency you can get everything if it's exists line this:

```typescript
import { Environment } from '@x-spacy/environment';

const port = Environment.getInt('PORT');

console.log(port);
```

output:

```sh
3333
```

All environments called with `getInt` will be parsed to number. Another way to get a environment value is `getString`. But you will be need the variable on your `.env` file
or on docker environment. If the variable will was not found you will receive a `EnvironmentNotFoundException` in some cases it will crashes your app. If you want
a more safe and assume the risk you can use `getIntOrNull` and `getStringOrNull`.
