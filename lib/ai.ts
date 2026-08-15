export type AiChatRole = 'system' | 'user' | 'assistant';

export type AiChatMessage = {
  role: Exclude<AiChatRole, 'system'>;
  content: string;
};

export function renderAiResult(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.text === 'string') return record.text;
    if (typeof record.content === 'string') return record.content;

    const choices = Array.isArray(record.choices) ? record.choices : [];
    const first = choices[0];
    if (first && typeof first === 'object') {
      const choice = first as Record<string, unknown>;
      if (typeof choice.text === 'string') return choice.text;
      if (choice.message && typeof choice.message === 'object') {
        const message = choice.message as Record<string, unknown>;
        if (typeof message.content === 'string') return message.content;
      }
    }
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return 'The assistant returned a result that could not be displayed.';
  }
}
