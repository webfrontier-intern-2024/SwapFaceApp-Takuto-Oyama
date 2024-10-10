import React, { useEffect, useRef } from 'react';

interface ImageOverlayProps {
  dropImage: string; //Aの画像のパス
  boxData?: {
    probability: number;
    x_max: number;
    y_max: number;
    x_min: number;
    y_min: number;
  }; 
  emoji?: string; 
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ dropImage, emoji = '😄' , boxData}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // boxDataがundefinedまたはnullの場合のデフォルト値を設定
  const { x_max = 0, y_max = 0, x_min = 0, y_min = 0 } = boxData || {};

  const ex_x_max = x_max + 30;
  const ex_y_max = y_max + 30
  const ex_x_min = x_min - 30
  const ex_y_min = y_min - 30

  // 描画する幅と高さを計算
  const width = ex_x_max - ex_x_min;
  const height = ex_y_max - ex_y_min;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!boxData) {
        console.error('boxDataがundefinedです');
        return;
      }

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgA = new Image();

    imgA.onload = () => {
        // キャンバスのサイズを設定
        canvas.width = imgA.width;
        canvas.height = imgA.height;

        // Aの画像を描画
        ctx.drawImage(imgA, 0, 0);

        ctx.font = `${height}px serif`; 
        ctx.textAlign = 'center';        
        ctx.textBaseline = 'middle';     

        // 絵文字を指定した座標に描画
        ctx.fillText(emoji, x_min + width / 2, y_min + height / 2);
    }

    imgA.src = dropImage;
  }, [dropImage, emoji,  ex_x_min, ex_y_min, width, height]);

  return <canvas ref={canvasRef} className='max-w-[700px] max-h-[400px]'></canvas>;
};

export default ImageOverlay;