export const THINKRR_SCRIPT_URL = "https://d2cqc7yqzf8c8f.cloudfront.net/web-widget.js";
// Public embed identifier for Julia — Kraft Website (Thinkrr inbound agent 21437).
export const DEFAULT_ENGLISH_WIDGET_KEY = "bfa887fb-4f7d-4d50-a92a-63ab7cc4fab0";

// ---------------------------------------------------------------------------------------------
// Thinkrr widget lifecycle (BUG-029). Behaviour of web-widget.js, checked 2026-10-13:
// - window.widgetLib exposes only scanWidgets(). There is no stop/destroy/disconnect API.
// - scanWidgets() renders into [data-widget-key] elements only for keys it has not seen before in
//   this page load, so a fresh element for an already-used key would stay empty.
// - Removing the element does NOT end a call. A call only stops when the widget's own
//   .wcw-widget-container toggle is clicked while the call is live.
// So each key gets one mount node for the whole page: it is moved into the modal when used and
// parked in a hidden host when closed, and closing clicks the widget's toggle to end a live call.
// ---------------------------------------------------------------------------------------------
const widgetMounts = new Map<string, HTMLDivElement>();
let parkingHost: HTMLDivElement | null = null;

export function getWidgetMount(key: string): HTMLDivElement {
  let node = widgetMounts.get(key);
  if (!node) {
    node = document.createElement("div");
    node.setAttribute("data-widget-key", key);
    node.className = "w-full flex justify-center";
    widgetMounts.set(key, node);
  }
  return node;
}

export function parkWidgetMount(node: HTMLDivElement) {
  if (!parkingHost) {
    parkingHost = document.createElement("div");
    parkingHost.setAttribute("aria-hidden", "true");
    parkingHost.style.display = "none";
    document.body.appendChild(parkingHost);
  }
  parkingHost.appendChild(node);
}

/** Ends a live (or still-connecting) Thinkrr call by clicking the widget's own toggle. */
export function stopThinkrrCall(node: HTMLElement) {
  const toggle = node.querySelector<HTMLElement>(".wcw-widget-container");
  const idleIcon = node.querySelector(".wcw-quiet") as (Element & ElementCSSInlineStyle) | null;
  if (!toggle || !idleIcon) return; // widget never rendered, so no call
  let attempts = 0;
  const tick = () => {
    // The idle icon is hidden only while a call is connecting or live; the widget shows it again
    // when the call ends. A click while connecting is ignored by the widget, so keep retrying
    // (for up to ~20 s) until the call is live and can be stopped.
    if (idleIcon.style.display !== "none" || attempts++ >= 20) return;
    toggle.click();
    window.setTimeout(tick, 1000);
  };
  tick();
}

/** Stops any Thinkrr call and moves every widget mount out of the modal. */
export function endAllThinkrrSessions() {
  widgetMounts.forEach((node) => {
    stopThinkrrCall(node);
    parkWidgetMount(node);
  });
}
