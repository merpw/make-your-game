# make-your-game

---

Authors: [@maximihajlov](https://github.com/maximihajlov), [@healingdrawing](https://github.com/healingdrawing)
, [@nattikim](https://github.com/nattikim)

Solved during studying in Gritlab coding school on Åland, February 2023

---

## [Task description and audit questions](https://github.com/01-edu/public/tree/master/subjects/make-your-game)

---

## How to run?

### Start http server in the out directory

Example:

```bash
npx serve out
```

## How to develop?

### Run http server as before

### Install dependencies

```bash
npm install
```

### Run development script

to automatically build TypeScript files into readable and debuggable JavaScript

```bash
npm run dev
```

### How to build?

#### Run `npm run build`

to build TypeScript to readable JavaScript

#### Run `npm run build:prod`

to build TypeScript to production-ready minified JavaScript using [webpack](https://webpack.js.org/)

### Code quality tools

#### Run `npm run lint` to check code quality using eslint

#### Run `npm run lint:fix` to fix auto-fixable issues using eslint

#### Run `npm run format` to format code using prettier

It's recommended to run `npm run lint:fix` and `npm run format` before committing
or use extensions for your editor to do it automatically.
