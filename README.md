# daisy-dual-range

[![npm](https://img.shields.io/npm/v/daisy-dual-range)](https://www.npmjs.com/package/daisy-dual-range)
[![demo](https://img.shields.io/badge/demo-live-brightgreen)](https://danilo-znamerovszkij.github.io/daisy-dual-range)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-blue)](https://danilo-znamerovszkij.github.io/daisy-dual-range)

Framework-agnostic dual range (two-thumb) slider styled to match DaisyUI, powered by noUiSlider.

## Install

```bash
npm i daisy-dual-range nouislider
```

## Import CSS

**Both CSS files are required:**

```ts
// Required: noUiSlider base styles
import "nouislider/dist/nouislider.css";

// Required: daisy-dual-range DaisyUI styling
import "daisy-dual-range/style.css";
```

**Note:** The `noUiSlider` CSS is essential for the slider to render. It provides the base structure for the slider track, handles, and interactive elements. The `daisy-dual-range` CSS only provides the DaisyUI-themed styling on top of the base noUiSlider styles.

## Quick Start

```ts
import "nouislider/dist/nouislider.css";
import "daisy-dual-range/style.css";
import { createDaisyDualRange } from "daisy-dual-range";

document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.getElementById("priceSlider");

  const slider = createDaisyDualRange(sliderEl, {
    min: 0,
    max: 1000,
    value: [100, 700],
    step: 10,
    color: "primary",
  });

  slider.on("update", ([min, max]) => {
    console.log(min, max);
  });
});
```

**HTML Requirements:** For proper DaisyUI theming, ensure your HTML element has a `data-theme` attribute:

```html
<html lang="en" data-theme="light">
```

## API

`daisy-dual-range` is a wrapper around [noUiSlider](https://github.com/leongersen/noUiSlider) that provides DaisyUI-styled dual range sliders. The returned instance exposes the underlying noUiSlider instance via the `noUi` property for advanced usage.

### `createDaisyDualRange(target, options)`

**target**: `HTMLElement | string`

**options**:
- `min`: `number`
- `max`: `number`
- `value?`: `[number, number]` (default `[min, max]`)
- `step?`: `number` (default `1`)
- `color?`: `"primary" | "secondary" | "accent" | "neutral" | "info" | "success" | "warning" | "error"`
- `disabled?`: `boolean`
- `decimals?`: `number`
- `tooltips?`: `boolean`
- `noui?`: `object` (escape hatch for extra noUiSlider options)

**Returned instance**:
- `get()`: `[number, number]`
- `set([minOrNull, maxOrNull])`
- `on(event, cb)` => `unsubscribe`
- `disable()`, `enable()`, `destroy()`
- `el`, `noUi`

## License

MIT
