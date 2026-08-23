import { useState } from 'react';
import SongInfo from './SongInfo';
import Controls from './Controls';
import VolumeControl from './VolumeControl';
import AudioVisualizer from './AudioVisualizer';
import QueueDrawer from './QueueDrawer';

function Player() {
  const [queueOpen, setQueueOpen] = useState(false);

  return (
    <>
      <div className="bottom">
        <AudioVisualizer />
        <div className="playerContent">
          <SongInfo />
          <Controls />
          <VolumeControl onOpenQueue={() => setQueueOpen(true)} />
        </div>
      </div>
      <QueueDrawer open={queueOpen} onClose={() => setQueueOpen(false)} />
    </>
  );
}

export default Player;
