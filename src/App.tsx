import React, { useState } from 'react';

import ColorPalette from './components/ColorPalette';
import ColorSlider from './components/ColorSlider';
import './App.css';

const App: React.FC = () => {
  const [hue, setHue] = useState<string>('');
  const [color, setColor] = useState<string>('');

  return (
    <div className="color-picker">
      <div className="color-wrapper">
        <ColorPalette hue={hue} onChange={setColor} />
        <ColorSlider onChange={setHue} />
      </div>
      <div className="input-wrapper">
        <span className="text">{color}</span>
        <div
          className="color-div"
          style={{ backgroundColor: color || 'white' }}
        />
      </div>
    </div>
  );
};

export default App;
