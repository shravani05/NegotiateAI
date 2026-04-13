import { useRef, useState } from 'react';

/**
 * Custom hook for consuming SSE streaming responses.
 * @returns {{ isLoading, error, stream }}
 *   stream(url, body, onChunk, onDone, onError) — starts the stream
 */
export function useStream() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  async function stream(url, body, onChunk, onDone, onError) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            setIsLoading(false);
            if (onDone) onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              if (onError) onError(parsed.error);
              setIsLoading(false);
              return;
            }
            if (parsed.text && onChunk) onChunk(parsed.text);
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      const msg = err.message || 'Stream failed';
      setError(msg);
      if (onError) onError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function abort() {
    if (abortRef.current) abortRef.current.abort();
  }

  return { isLoading, error, stream, abort };
}
