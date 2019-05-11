import React, { useRef, useEffect, useCallback, useState } from 'react';

import './ColorSlider.css';

type Global = {
  ctx: CanvasRenderingContext2D | null;
};

type IProps = {
  onChange?: (color: string) => void;
};

const ColorSlider: React.FC<IProps> = ({ onChange = () => {} }: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const global = useRef<Global>({ ctx: null });

  const [seletedHeight, setSeletedHeight] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState<Boolean>(false);

  const draw = useCallback(() => {
    let { ctx } = global.current;
    if (!ctx) {
      ctx = canvasRef.current!.getContext('2d');
    }
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;
    ctx!.clearRect(0, 0, width, height);
    const gradient = ctx!.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx!.beginPath();
    ctx!.rect(0, 0, width, height);
    ctx!.fillStyle = gradient;
    ctx!.fill();
    ctx!.closePath();

    if (typeof seletedHeight === 'number') {
      ctx!.beginPath();
      ctx!.strokeStyle = 'white';
      ctx!.lineWidth = 3;
      ctx!.rect(0, seletedHeight - 5, width, 10);
      ctx!.stroke();
      ctx!.closePath();
    }
  }, [seletedHeight]);

  const getColorAtPosition = (y: number) => {
    const imageData = global.current.ctx!.getImageData(10, y, 1, 1).data;
    return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`;
  };

  const handleMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = evt;
    setMouseDown(true);
    setSeletedHeight(nativeEvent.offsetY);
    draw();
    const color = getColorAtPosition(nativeEvent.offsetY);
    onChange(color);
  };

  const handleMouseMove = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = evt;
    if (mouseDown) {
      setSeletedHeight(nativeEvent.offsetY);
      draw();
      const color = getColorAtPosition(nativeEvent.offsetY);
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

  return (
    <canvas
      className="color-slider"
      ref={canvasRef}
      width="50"
      height="250"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    />
  );
};

export default ColorSlider;
