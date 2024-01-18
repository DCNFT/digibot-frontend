import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

function StreamNumbers() {
  const [numbers, setNumbers] = useState([]);
  const [streamActive, setStreamActive] = useState(false);
  let controller;

  const startStreamUseFetch = () => {
    setStreamActive(true);
    let controller;
    controller = new AbortController();
    const { signal } = controller;

    // fetch('http://localhost:2020/chat/prompt', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ query: 'hello' }),
    //   signal,
    // });

    fetch('http://localhost:2020/chat/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: '카페테리어에 대해서 알려줘' }),
      signal,
    })
      .then((response: any) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return reader.read().then(function processText({ done, value }) {
          if (done) {
            console.log('Stream complete');
            return;
          }

          const text = decoder.decode(value, { stream: true });
          setNumbers((prev) => [...prev, text]);
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

  const startStream = () => {
    setStreamActive(true);
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2020/chat/stream', {
          cancelToken: source.token,
          headers: { 'Content-Type': 'text/event-stream' },
          responseType: 'stream',
        });
        console.log(response);
        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        console.log('reader = ', reader);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          console.log(value);

          const text = decoder.decode(value);
          setNumbers((prev) => [...prev, text]);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();

    return () => {
      source.cancel('Stream stopped');
    };
  };

  const stopStream = () => {
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
