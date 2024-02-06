export async function consumeAudioStream(
  stream: ReadableStream<Uint8Array>,
  callback: (audioBlob: Blob) => void,
  signal: AbortSignal | undefined,
): Promise<void> {
  const reader = stream.getReader();
  const chunks = [];

  if (signal) {
    signal.addEventListener('abort', () => reader.cancel(), { once: true });
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        chunks.push(value);
      }
    }

    const audioBlob = new Blob(chunks, { type: 'audio/opus' }); // 오디오 형식에 맞게 MIME 타입 설정
    callback(audioBlob);
  } catch (error) {
    if (signal && signal.aborted) {
      console.error('Stream reading was aborted:', error);
    } else {
      console.error('Error consuming audio stream:', error);
    }
  } finally {
    reader.releaseLock();
  }
}
