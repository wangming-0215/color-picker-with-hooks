import React, { useRef, useEffect, useCallback, useState } from 'react';

import './ColorPalette.css';

type IProps = {
  hue?: string;
  onChange?: (color: string) => void;
};

type Global = {
  ctx: CanvasRenderingContext2D | null;
};

const ColorPalette: React.FC<IProps> = ({
  hue = 'rgba(255, 255, 255, 1)',
  onChange = () => {}
}: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const global = useRef<Global>({ ctx: null });

  const [mouseDown, setMouseDown] = useState<Boolean>(false);
  const [selectedPosition, setSelectedPoision] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const draw = useCallback(() => {
    let { ctx } = global.current;
    if (!ctx) {
      ctx = canvasRef.current!.getContext('2d');
    }
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;

    ctx!.fillStyle = hue;
    ctx!.fillRect(0, 0, width, height);

    const whiteGradient = ctx!.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx!.fillStyle = whiteGradient;
    ctx!.fillRect(0, 0, width, height);

    const blackGradient = ctx!.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx!.fillStyle = blackGradient;
    ctx!.fillRect(0, 0, width, height);

    if (selectedPosition) {
      ctx!.strokeStyle = 'white';
      ctx!.beginPath();
      ctx!.arc(selectedPosition.x, selectedPosition.y, 10, 0, 2 * Math.PI);
      ctx!.lineWidth = 5;
      ctx!.stroke();
      ctx!.closePath();
    }
  }, [hue, selectedPosition]);

  const getColorAtPosition = (x: number, y: number) => {
    const { ctx } = global.current;
    const imageData = ctx!.getImageData(x, y, 1, 1).data;
    return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`;
  };

  const handleMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = evt;
    setMouseDown(true);
    setSelectedPoision({ x: nativeEvent.offsetX, y: nativeEvent.offsetY });
    draw();
    const color = getColorAtPosition(nativeEvent.offsetX, nativeEvent.offsetY);
    onChange(color);
  };

  const handleMouseMove = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = evt;
    if (mouseDown) {
      setSelectedPoision({ x: nativeEvent.offsetX, y: nativeEvent.offsetY });
      draw();
      const color = getColorAtPosition(
        nativeEvent.offsetX,
        nativeEvent.offsetY
      );
      onChange(color);
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  useEffect(() => {
    global.current.ctx = canvasRef.current!.getContext('2d');
    draw();
  }, [draw]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    draw();
    if (selectedPosition) {
      const color = getColorAtPosition(selectedPosition.x, selectedPosition.y);
      onChange(color);
    }
  }, [hue, selectedPosition, draw, onChange]);

  return (
    <canvas
      ref={canvasRef}
      className="color-palette"
      width="250"
      height="250"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    />
  );
};

export default ColorPalette;
