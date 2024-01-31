import { Button } from '@/components/ui/button';
import StreamNumbers from './components/StreamNumber';
import AudioPlayer from '@/views/test'

const Lab = () => {
  return (
    <div className="flex flex-col h-screen p-4">
      <StreamNumbers />
      <AudioPlayer />
    </div>
  );
};

export default Lab;
