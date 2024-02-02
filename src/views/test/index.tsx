import React, { useEffect } from 'react';

const AudioPlayer = () => {
  useEffect(() => {
    if (!window.MediaSource) {
      console.error('Your browser does not support MediaSource API');
      return;
    }

    const mediaSource = new MediaSource();
    const audio = document.querySelector('audio');
    audio.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      const queue = [];

      sourceBuffer.addEventListener('updateend', () => {
        if (queue.length > 0 && !sourceBuffer.updating) {
          sourceBuffer.appendBuffer(queue.shift());
        }
      });

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/chat/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tts_request: `
                        카페테리아는 회사가 제공하는 복지 후생 항목 중 일정 금액 한도 내에서 근로자가 필요에 맞춰 선택할 수 있는 제도입니다.
                        근속 연수에 따라 연간 지급액이 다르며, 7년 이상 근속자부터 120만원까지 받을 수 있습니다.
                    `,
        }),
      })
        .then((response) => {
          const reader = response.body.getReader();
          const pump = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                mediaSource.endOfStream();
                return;
              }
              if (!sourceBuffer.updating) {
                sourceBuffer.appendBuffer(value);
              } else {
                queue.push(value);
              }
              pump();
            });
          };
          pump();
        })
        .catch((error) => console.error('Stream Error:', error));
    });
  }, []);

  return <audio controls />;
};

export default AudioPlayer;
