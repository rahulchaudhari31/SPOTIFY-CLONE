import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { usePlayer, formatTime } from '../context/PlayerContext';

function cleanTitle(str) {
  if (!str) return str;
  return str
    .replace(/\|.*$/i, '')
    .replace(/\(.*?\)/gi, '')
    .replace(/\[.*?\]/gi, '')
    .replace(/\bfull\b.*$/i, '')
    .replace(/\bofficial\b.*$/i, '')
    .replace(/\baudio\b.*$/i, '')
    .replace(/\bvideo\b.*$/i, '')
    .replace(/\blyrics\b.*$/i, '')
    .replace(/\bvisualizer\b.*$/i, '')
    .replace(/\bft\.?\b.*$/i, '')
    .replace(/\bfeat\.?\b.*$/i, '')
    .trim();
}

function QueueRow({ song, globalIndex }) {
  const { playSong, currentIndex } = usePlayer();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: song.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`queueRow${isDragging ? ' dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button className="queueDragHandle" {...attributes} {...listeners} title="Drag to reorder">
        <i className="fas fa-grip-vertical"></i>
      </button>
      <img src={song.cover} alt={song.title} className="queueCover" />
      <div className="queueMeta" onClick={() => playSong(globalIndex)}>
        <span className="queueTitle" title={song.title}>
          {cleanTitle(song.title)}
        </span>
        <span className="queueArtist" title={song.artist}>
          {song.artist.length > 24 ? song.artist.slice(0, 24).trimEnd() + '…' : song.artist}
        </span>
      </div>
      {globalIndex === currentIndex && <i className="fas fa-volume-up queueNowIcon"></i>}
      <button
        className="queuePlayBtn"
        onClick={() => playSong(globalIndex)}
        title="Play now"
      >
        <i className="fas fa-play-circle"></i>
      </button>
    </div>
  );
}

function QueueDrawer({ open, onClose }) {
  const { songs, currentIndex, reorderSongs } = usePlayer();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const upcoming = useMemo(() => {
    if (!songs.length) return [];
    const list = songs.slice(currentIndex + 1);
    if (!list.length) return songs.map((s, i) => ({ ...s, _g: i }));
    return list.map((s, i) => ({ ...s, _g: currentIndex + 1 + i }));
  }, [songs, currentIndex]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const fromLocal = upcoming.findIndex((s) => s.id === active.id);
    const toLocal = upcoming.findIndex((s) => s.id === over.id);
    if (fromLocal < 0 || toLocal < 0) return;
    reorderSongs(upcoming[fromLocal]._g, upcoming[toLocal]._g);
  };

  return (
    <>
      <div className={`queueOverlay${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`queueDrawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="queueHeader">
          <h3>
            <i className="fas fa-list-ul"></i> Up Next
          </h3>
          <button className="queueClose" onClick={onClose} title="Close queue">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <p className="queueHint">
          Drag the handle to reorder · {upcoming.length} song{upcoming.length === 1 ? '' : 's'} queued
        </p>
        <div className="queueList">
          {upcoming.length === 0 ? (
            <p className="queueEmpty">Queue is empty — enjoy the silence.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={upcoming.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {upcoming.map((song) => (
                  <QueueRow key={song.id} song={song} globalIndex={song._g} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </aside>
    </>
  );
}

export default QueueDrawer;
