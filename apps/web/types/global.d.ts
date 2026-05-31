declare global {
  interface Window {
    widgetLib?: {
      scanWidgets: () => void;
    };
  }
}

export {};
