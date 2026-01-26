import noUiSlider from "nouislider";
import type { API, Options } from "nouislider";

export type DaisyColor =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type RangeValue = [number, number];
export type RangeValueNullable = [number | null, number | null];

export type DaisyDualRangeEvents =
  | "update"
  | "set"
  | "change"
  | "slide"
  | "start"
  | "end";

export interface DaisyDualRangeOptions {
  min: number;
  max: number;
  value?: RangeValue;
  step?: number;
  color?: DaisyColor;
  disabled?: boolean;
  decimals?: number;
  tooltips?: boolean;
  noui?: Omit<Options, "start" | "range" | "step" | "connect" | "format" | "tooltips">;
}

export interface DaisyDualRangeInstance {
  el: HTMLElement;
  noUi: API;
  get(): RangeValue;
  set(value: RangeValueNullable): void;
  on(event: DaisyDualRangeEvents, cb: (value: RangeValue) => void): () => void;
  disable(): void;
  enable(): void;
  destroy(): void;
}

function resolveEl(target: string | HTMLElement): HTMLElement {
  if (typeof target === "string") {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) throw new Error(`[daisy-dual-range] Target not found: ${target}`);
    return el;
  }
  return target;
}

function applyAttrs(el: HTMLElement, color: DaisyColor, disabled: boolean) {
  el.setAttribute("data-ddr", "");
  el.setAttribute("data-ddr-color", color);
  if (disabled) {
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("data-ddr-disabled", "true");
  } else {
    el.removeAttribute("aria-disabled");
    el.removeAttribute("data-ddr-disabled");
  }
}

function clampPair([a, b]: RangeValue, min: number, max: number): RangeValue {
  const ca = Math.min(Math.max(a, min), max);
  const cb = Math.min(Math.max(b, min), max);
  return ca <= cb ? [ca, cb] : [cb, ca];
}

function formatFactory(decimals: number) {
  const pow = Math.pow(10, decimals);
  return {
    to: (val: number) => (Math.round(val * pow) / pow).toString(),
    from: (val: string) => Number(val),
  };
}

export function createDaisyDualRange(
  target: string | HTMLElement,
  opts: DaisyDualRangeOptions
): DaisyDualRangeInstance {
  const el = resolveEl(target);

  const min = opts.min;
  const max = opts.max;
  if (!(Number.isFinite(min) && Number.isFinite(max) && min < max)) {
    throw new Error("[daisy-dual-range] Invalid min/max range.");
  }

  const step = opts.step ?? 1;
  const color = opts.color ?? "primary";
  const disabled = opts.disabled ?? false;
  const decimals = opts.decimals ?? 0;

  const start: RangeValue = clampPair(opts.value ?? [min, max], min, max);

  applyAttrs(el, color, disabled);

  const nouiOptions: Options = {
    start,
    connect: true,
    step,
    range: { min, max },
    format: formatFactory(decimals),
    tooltips: opts.tooltips ?? false,
    ...opts.noui,
  };

  noUiSlider.create(el, nouiOptions);

  const api = (el as any).noUiSlider as API;
  if (!api) throw new Error("[daisy-dual-range] noUiSlider failed to initialize.");

  if (disabled) api.disable();

  return {
    el,
    noUi: api,

    get() {
      const v = api.get() as any;
      const arr = Array.isArray(v) ? v : [v, v];
      return [Number(arr[0]), Number(arr[1])] as RangeValue;
    },

    set(value) {
      api.set(value as any);
    },

    on(event, cb) {
      const handler = (values: (string | number)[]) => {
        cb([Number(values[0]), Number(values[1])] as RangeValue);
      };
      api.on(event, handler as any);
      return () => api.off(event);
    },

    disable() {
      applyAttrs(el, color, true);
      api.disable();
    },

    enable() {
      applyAttrs(el, color, false);
      api.enable();
    },

    destroy() {
      api.destroy();
      el.removeAttribute("data-ddr");
      el.removeAttribute("data-ddr-color");
      el.removeAttribute("data-ddr-disabled");
      el.removeAttribute("aria-disabled");
    },
  };
}
