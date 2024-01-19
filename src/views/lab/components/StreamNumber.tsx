import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

function StreamNumbers() {
  const [numbers, setNumbers] = useState([]);
  const [streamActive, setStreamActive] = useState(false);
  let controller: AbortController | undefined;

  const startStreamUseFetch = () => {
    setStreamActive(true);
    controller = new AbortController();
    const { signal } = controller;

    fetch('http://localhost:2020/chat/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: '카페테리아 혜택좀 알려줘' }),
      signal,
    })
      .then((response: any) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return reader
          .read()
          .then(function processText({
            done,
            value,
          }: {
            done: boolean;
            value: any;
          }) {
            if (done) {
              console.log('Stream complete');
              return;
            }

            const text = decoder.decode(value, { stream: true });
            console.log('text = ', text);
            const lines = text.split('\n'); // 줄바꿈 문자를 기준으로 텍스트를 분할
            console.log('lines = ', lines);
            // setNumbers((prev: any) => [...prev, text]);
            return reader.read().then(processText);
          });
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
      });
  };

  const stopStream = () => {
    if (controller) {
      controller.abort(); // 스트리밍 요청 취소
    }
    setStreamActive(false);
  };

  return (
    <div>
      <h2>Streamed Numbers</h2>
      <Button onClick={!streamActive ? startStreamUseFetch : stopStream}>
        {!streamActive ? 'Start Streaming' : 'Stop Streaming'}
      </Button>
      <ul>
        {numbers.map((num, index) => (
          <span key={index}>{num}</span>
        ))}
      </ul>
    </div>
  );
}

export default StreamNumbers;
