import SongInfo from './SongInfo';
import Controls from './Controls';
import VolumeControl from './VolumeControl';

function Player() {
  return (
    <div className="bottom">
      <div className="playerContent">
        <SongInfo />
        <Controls />
        <VolumeControl />
      </div>
    </div>
  );
}

export default Player;
