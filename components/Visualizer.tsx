
import React from 'react';

interface VisualizerProps {
  currentBeat: number;
  totalBeats: number;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ currentBeat, totalBeats, isPlaying }) => {
  const beats = Array.from({ length: totalBeats }, (_, i) => i);

  return (
    <div className="flex justify-center items-center space-x-2 h-10">
      {beats.map(beatIndex => {
        const isActive = isPlaying && currentBeat === beatIndex;
        return (
          <div
            key={beatIndex}
            className={`w-4 h-4 rounded-full transition-all duration-150 ${
              isActive ? 'bg-teal-400 scale-125' : 'bg-stone-200'
            }`}
          ></div>
        );
      })}
    </div>
  );
};

export default Visualizer;
