# daisy-dual-range

Framework-agnostic dual range (two-thumb) slider styled to match DaisyUI, powered by noUiSlider.

## Install

```bash
npm i daisy-dual-range nouislider
```

## Import CSS

```ts
import "daisy-dual-range/style.css";
```

(Optional) Import noUiSlider CSS:

```ts
import "nouislider/dist/nouislider.css";
```

## Quick Start

```ts
import "daisy-dual-range/style.css";
import { createDaisyDualRange } from "daisy-dual-range";

const slider = createDaisyDualRange("#priceSlider", {
  min: 0,
  max: 1000,
  value: [100, 700],
  step: 10,
  color: "primary",
});

slider.on("update", ([min, max]) => {
  console.log(min, max);
});
```

## API

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
