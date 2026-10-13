type Lead = { id: string; score: number; email?: string; phone?: string };
type Message = { channel: 'email'|'sms'; to: string; subject?: string; body: string };

export interface Transport {
  name: string;
  send(msg: Message): Promise<void>;
}

// Development/no-provider transport. Recipient is masked so lead emails/phones
// are not written to production logs (PIPEDA). Nothing is actually delivered.
function maskRecipient(to: string): string {
  if (!to) return '-';
  if (to.includes('@')) { const [u, d] = to.split('@'); return `${u.slice(0, 1)}***@${d}`; }
  const digits = to.replace(/\D/g, '');
  return digits.length >= 4 ? `***${digits.slice(-4)}` : '***';
}

export function consoleTransport(): Transport {
  return { name: 'console', async send(msg) { console.log('SEND (not delivered - console transport)', { ...msg, to: maskRecipient(msg.to) }); } };
}

export async function runNurtureSequence(lead: Lead, transport: Transport = consoleTransport()) {
  if (lead.score >= 90) {
    await transport.send({ channel: 'sms', to: lead.phone || '', body: 'Kraft: Hot rates update — reply YES to book now.' });
    await transport.send({ channel: 'email', to: lead.email || '', subject: 'Your rate comparison', body: 'Here are today\'s top 3 options…' });
  } else if (lead.score >= 70) {
    await transport.send({ channel: 'email', to: lead.email || '', subject: 'Welcome — tools to explore', body: 'Access calculators & set a rate alert.' });
  } else {
    await transport.send({ channel: 'email', to: lead.email || '', subject: 'Learning series', body: 'Start with our First‑Time Buyer guide.' });
  }
}
