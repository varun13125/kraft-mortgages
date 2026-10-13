/**
 * Parse a JSON object/array from an LLM response. Current models often wrap JSON in
 * ```json fences or add a sentence before/after it, which made the pipeline's bare
 * JSON.parse() calls throw. Strips fences, then falls back to the outermost {...}/[...].
 */
export function parseLlmJson<T = any>(content: string): T {
  const text = (content ?? '').trim();
  const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(unfenced) as T;
  } catch {
    const start = unfenced.search(/[[{]/);
    const end = Math.max(unfenced.lastIndexOf('}'), unfenced.lastIndexOf(']'));
    if (start !== -1 && end > start) {
      return JSON.parse(unfenced.slice(start, end + 1)) as T;
    }
    throw new SyntaxError('LLM response did not contain valid JSON');
  }
}
