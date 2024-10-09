"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { CloudUpload, Check, MediaImage } from "iconoir-react";
import ImageOverlay from "./face_musk/musk";

interface BoxData {
  probability: number;
  x_max: number;
  y_max: number;
  x_min: number;
  y_min: number;
}

function MyDropzone() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [isMaskApplied, setIsMaskApplied] = useState(false); 
  const [randomEmoji, setRandomEmoji] = useState<string>(''); 
  const [jsonData, setJsonData] = useState<BoxData | null>(null); // JSONデータ

  // APIへ画像を送信する処理
  const handleSendImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = "/api/upload";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("APIリザルト", result);
        setIsUploadSuccessful(true);
  
        // APIからのboxデータを取得
        const box = result.box;
        console.log("取得したboxデータ:", box);
  
        if (box) {
          // boxデータをImageOverlayが期待する形式に変換
          const boxData: BoxData = {
            x_max: box.x_max,
            y_max: box.y_max,
            x_min: box.x_min,
            y_min: box.y_min,
            probability: box.probability || 1,
          };
  
          setJsonData(boxData);
        } else {
          console.error("boxデータが取得できませんでした");
        }
  
        // ランダムな絵文字を生成
        const emojis = ['😄', '😊', '😂', '🤣', '😎', '😍', '🤩', '😜', '😏', '🤔', '😴', '😈', '👻', '🎃', '💩'];
        setRandomEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      } else {
        console.error("APIエラー", response.statusText);
      }
    } catch (error) {
      console.error("API通信エラー", error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
    handleSendImage(file); // ドロップ時にAPIに送信
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/jpg': [] },
    multiple: false // 一つのファイルのみ
  });

  // キャンセルボタンの処理
  const handleCancel = () => {
    setImagePreview(null); // プレビュー用URLを削除
    setJsonData(null); // 顔の座標をリセット
    setIsUploadSuccessful(false); // アップロード成功フラグをリセット
    setIsMaskApplied(false); // マスク適用フラグをリセット
  };

  // マスクを適用する処理
  const handleApplyMask = () => {
    setIsMaskApplied(true); // マスク適用をトリガー
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center isolate">
      {isMaskApplied && jsonData ? (
        <div className= "rounded-xl  flex flex-col item-center ">
          <div className="m-4 flex flex-col items-center justify-center">
            <div className="m-5">
              <ImageOverlay
                imgAUrl={imagePreview!}
                emoji={randomEmoji} 
                boxData={jsonData}
              />
            </div>
            <button onClick={handleCancel} className="bg-blue-700 text-white text-xl font-bold p-5 rounded-lg">
              戻る
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-dashed border-4 p-10 w-full h-96 flex justify-center items-center text-center rounded-xl 
          ${isDragActive ? "border-blue-500 bg-black" : "border-white"}`}
        >
          <input {...getInputProps()} />
          {
            imagePreview ? (
              <Image src={imagePreview} width={300} height={300} alt="Uploaded" className="max-h-full max-w-full object-contain" />
            ) : (
              isDragActive ? (
                <p className="text-blue-500 font-bold">ファイルをここにドロップしてください...</p>
              ) : (
                <p className="text-gray-300 font-semibold">ファイルをドラッグ＆ドロップするか、クリックして選択してください</p>
              )
            )
          }
        </div>
      )}
      <div className="mt-10 flex justify-center items-center ">
        <div className=" flex justify-center items-center gap-10 ">
        {isUploadSuccessful && !isMaskApplied && (
            <>
              <button
                className="bg-blue-700 text-white text-xl font-bold p-5 rounded-lg"
                onClick={handleCancel}> キャンセル
              </button>
                <button
                  className="bg-blue-700 text-white text-xl font-bold p-5 rounded-lg"
                  onClick={handleApplyMask} >
                  マスクする
                </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex  items-center min-h-screen justify-center">
      <section className="text-white body-font">
        <div className="container px-5 py-20 mx-auto max-w-7xl">
          <div
            className="p-[4rem] bg-[#818181] rounded-3xl neumorphism-container"
            style={{
              boxShadow: `
                inset -5px -5px 4px rgba(0, 0, 0, 0.2), 
                inset 5px 5px 4px rgba(0, 0, 0, 0.2), 
                0px 0px 60px rgba(0, 0, 0, 0.3)
              `,
            }}>
            <div className="absolute inset-0 bg-[#a6a6a6] mix-blend-color-burn pointer-events-none"/>
            <section className="relative mb-10">
              <h1 className="sm:text-3xl text-2xl text-white font-black text-center mb-20">
                顔マスク.js
              </h1>
              <div className="flex flex-wrap m-4 -mt-8">
                <div className="p-4 md:w-1/3 flex">
                  <CloudUpload height={50} width={40} color="#fff" />
                  <div className="flex-grow pl-6 w-full max-w-full">
                    <h2 className="text-white text-lg font-bold mb-2">
                      画像をドロップ
                    </h2>
                    <p className="leading-relaxed text-base">
                      PNG、JPEG、JPGのみ
                    </p>
                  </div>
                </div>
                <div className="p-4 md:w-1/3 flex">
                  <MediaImage height={50} width={40} color="#fff" />
                  <div className="flex-grow pl-6 w-full max-w-full">
                    <h2 className="text-white text-lg font-bold mb-2">
                      顔を検出
                    </h2>
                    <p className="leading-relaxed text-base">
                      顔の座標を検出します
                    </p>
                  </div>
                </div>
                <div className="p-4 md:w-1/3 flex ">
                  <Check height={50} width={40} color="#fff"/>
                  <div className="flex-grow pl-6 w-full max-w-full">
                    <h2 className="text-white text-lg font-bold mb-2 ">
                      マスク完了
                    </h2>
                    <p className="leading-relaxed text-base">
                      顔にスタンプを貼ります
                    </p>
                  </div>
                </div>
              </div>
            </section>
          <MyDropzone />
          </div>
        </div>
      </section>
    </div>
  );
}