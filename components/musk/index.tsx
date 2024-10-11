"use client";
import React, { useEffect, useRef } from 'react';

//型定義（JSにコンパイルした際には削除される）
interface ImageOverlayProps {
  dropImage: string; 
  boxData?: {
    probability: number;
    x_max: number;
    y_max: number;
    x_min: number;
    y_min: number;
  }; 
  emoji?: string; 
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ dropImage, boxData}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // boxDataがundefinedまたはnullの場合のデフォルト値を設定
  const { x_max = 0, y_max = 0, x_min = 0, y_min = 0 } = boxData || {};

  // 描画する幅と高さを計算
  const width = x_max - x_min;
  const height = y_max - y_min;

  // ランダム絵文字生成ロジック
  const getRandomEmoji = () => {
    const emojis = ['😄', '😊', '😂', '🤣', '😎', '😍', '🤩', '😜', '😏', '🤔', '😴', '😈', '👻', '🎃'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!boxData) {
        console.error('boxDataがundefinedです');
        return;
      }

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImage = new Image();

    bgImage.onload = () => {
        // キャンバスのサイズを設定
        canvas.width = bgImage.width;
        canvas.height = bgImage.height;

        // アップロードされた画像を描画
        ctx.drawImage(bgImage, 0, 0);

        ctx.font = `${height}px serif`; 
        ctx.textAlign = 'center';        
        ctx.textBaseline = 'middle';     

        // 絵文字を座標の中央に描画
        ctx.fillText(getRandomEmoji(), x_min + width / 2, y_min + height / 2);
    }

    bgImage.src = dropImage;
  }, 
  [dropImage, width, height, boxData, x_min, y_min]);
  return <canvas ref={canvasRef} className='max-w-[700px] max-h-[400px]'></canvas>;
};

export default ImageOverlay;