// Minimal HTTP MCP transport compatible with experimental_createMCPClient
// Implements the MCPTransport interface shape expected by the AI SDK.

type JSONRPCMessage = {
  jsonrpc: '2.0';
  id?: string | number | null;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
};

export type HttpTransportOptions = {
  url: string;
  headers?: Record<string, string>;
};

const LATEST_PROTOCOL_VERSION = '2025-06-18';

export class HttpMcpTransportLite {
  private url: URL;
  private headers?: Record<string, string>;
  private abortController?: AbortController;
  private inboundAbortController?: AbortController;
  private sessionId?: string;

  onclose?: () => void;
  onerror?: (error: unknown) => void;
  onmessage?: (message: JSONRPCMessage) => void;

  constructor(opts: HttpTransportOptions) {
    this.url = new URL(opts.url);
    this.headers = opts.headers;
  }

  async start(): Promise<void> {
    this.abortController = new AbortController();
    // Best-effort inbound SSE. If the server doesn’t support GET SSE, skip.
    this.inboundAbortController = new AbortController();

    try {
      const headers: Record<string, string> = {
        Accept: 'text/event-stream',
        'mcp-protocol-version': LATEST_PROTOCOL_VERSION,
        ...(this.headers || {}),
      };

      const resp = await fetch(this.url.href, {
        method: 'GET',
        headers,
        signal: this.inboundAbortController.signal,
      });

      const sid = resp.headers.get('mcp-session-id');
      if (sid) this.sessionId = sid;

      if (resp.status === 405) {
        // Server does not expose inbound SSE; not fatal for HTTP transport.
        return;
      }
      if (!resp.ok || !resp.body) {
        // Non-fatal: rely on POST responses to deliver messages.
        return;
      }

      this.processSse(resp.body).catch(err => this.onerror?.(err));
    } catch (err) {
      // Ignore AbortError; otherwise report but don’t fail start().
      if (!(err instanceof Error && err.name === 'AbortError')) {
        this.onerror?.(err);
      }
    }
  }

  async send(message: JSONRPCMessage): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'mcp-protocol-version': LATEST_PROTOCOL_VERSION,
      ...(this.headers || {}),
    };
    if (this.sessionId) headers['mcp-session-id'] = this.sessionId;

    try {
      const resp = await fetch(this.url.href, {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
        signal: this.abortController?.signal,
      });

      const sid = resp.headers.get('mcp-session-id');
      if (sid) this.sessionId = sid;

      if (resp.status === 202) {
        // Accepted; messages may arrive via inbound SSE.
        return;
      }

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        this.onerror?.(
          new Error(
            `MCP HTTP Transport Lite: POST failed ${resp.status} ${resp.statusText}: ${text}`,
          ),
        );
        return;
      }

      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await resp.json();
        const msgs: JSONRPCMessage[] = Array.isArray(data) ? data : [data];
        for (const m of msgs) this.onmessage?.(m);
        return;
      }

      if (contentType.includes('text/event-stream') && resp.body) {
        await this.processSse(resp.body);
        return;
      }
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        this.onerror?.(err);
      }
    }
  }

  async close(): Promise<void> {
    this.inboundAbortController?.abort();
    this.abortController?.abort();
    this.onclose?.();
  }

  private async processSse(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf('\n\n')) !== -1) {
          const rawEvent = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          const evt = this.parseSseEvent(rawEvent);
          if (!evt) continue;
          if (evt.event === 'message') {
            try {
              const msg = JSON.parse(evt.data) as JSONRPCMessage;
              this.onmessage?.(msg);
            } catch (e) {
              this.onerror?.(
                new Error('MCP HTTP Transport Lite: failed to parse message'),
              );
            }
          }
        }
      }
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        this.onerror?.(err);
      }
    } finally {
      reader.releaseLock();
    }
  }

  private parseSseEvent(block: string): { event: string; data: string } | null {
    const lines = block.split(/\r?\n/);
    let event = 'message';
    const dataParts: string[] = [];
    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataParts.push(line.slice(5).trim());
      }
    }
    if (dataParts.length === 0) return null;
    return { event, data: dataParts.join('\n') };
  }
}

