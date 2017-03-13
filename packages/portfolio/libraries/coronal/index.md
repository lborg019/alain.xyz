```bash
# Base Library
npm i coronal -S

# WebGL Renderer
npm i coronal-webgl -S

# React Bindings
npm i react-coronal -S
```

☀️ A modern 3D rendering library for quickly building games and apps. 

## Features

- Ⓜ️️ Modern ES2017 Codebase
- 🌊 TypeScript/Flow Definitions
- 🌳 Tree Shaking and Dead Code Elimination
- 🌋 Vulkan-like low level APIs
- ⚛ React Bindings

## Usage

```js
import { plane, cube } from 'coronal';
import renderer from 'coronal-webgl';

const app = renderer(
  scene(
    plane({scale: 4}),
    cube({y: 0.5,}),
  )
);

document.getElementById('app').appendElement(app.canvas);
```