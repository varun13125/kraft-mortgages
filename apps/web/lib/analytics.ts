export function track(event: string, props: Record<string, any> = {}) {
  console.log("analytics", event, props);
}
