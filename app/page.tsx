"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { CloudUpload, Check, MediaImage } from "iconoir-react";
import ImageOverlay from "./face_musk/musk";
import ErrorModal from "./componets/modal";

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
  const [jsonData, setJsonData] = useState<BoxData | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false); // モーダル表示フラグ
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ

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
        setIsUploadSuccessful(true);
  
        // APIからのboxデータを取得
        const box = result.box;
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
        }

        const emojis = ['😄', '😊', '😂', '🤣', '😎', '😍', '🤩', '😜', '😏', '🤔', '😴', '😈', '👻', '🎃', '💩'];
        setRandomEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `APIエラー: ${response.statusText} (${response.status})`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("予期しないエラーが発生しました");
      }
      setIsUploadSuccessful(false);
      setShowErrorModal(true);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
    handleSendImage(file); // 画像を送信
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/jpg': [] },
    multiple: false // 一つのファイルのみ
  });

  // キャンセルボタンの処理
  const handleCancel = () => {
    setImagePreview(null); // プレビュー画像を削除
    setJsonData(null); // 顔の座標をリセット
    setIsUploadSuccessful(false); // アップロード成功フラグをリセット
    setIsMaskApplied(false); // マスク適用フラグをリセット
  };

  // マスクを適用する処理
  const handleApplyMask = () => {
    setIsMaskApplied(true); // マスク適用
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setShowErrorModal(false);
    setImagePreview(null); // プレビュー画像を削除
  };

  return (
    <div className="w-full max-w-1xl flex flex-col items-center isolate">
      <ErrorModal show={showErrorModal} message={errorMessage} onClose={handleCloseModal} />
      {isMaskApplied && jsonData ? (
        <div className= "rounded-xl  flex flex-col item-center ">
          <div className="m-4 mb-0 flex flex-col items-center justify-center">
            <div className="mb-10">
              <ImageOverlay
                dropImage={imagePreview!}
                emoji={randomEmoji} 
                boxData={jsonData}
              />
            </div>
            <button onClick={handleCancel} className="bg-blue-700 text-white text-xl font-bold p-5 px-8 rounded-lg ">
              戻る
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-dashed border-4 p-10 w-full h-4 sm:h-96 flex justify-center items-center text-center rounded-xl mb-8 
          ${isDragActive ? "border-blue-500 bg-black" : "border-white"}`}
        >
          <input {...getInputProps()} />
          {
            imagePreview ? (
              <Image src={imagePreview} width={600} height={400} alt="Uploaded" className="max-h-full max-w-full object-contain" />
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
      <div className="flex justify-center items-center ">
        <div className="flex justify-center items-center gap-10">
        {isUploadSuccessful && !isMaskApplied && (
            <>
              <button
                className="bg-red-800 text-white text-xl font-bold p-5 rounded-lg"
                onClick={handleCancel}> 削除する
              </button>
              <button
                className="bg-blue-800 text-white text-xl font-bold p-5 rounded-lg"
                onClick={handleApplyMask}>マスクする
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
        <div className="container px-5 sm:py-20 mx-auto max-w-7xl">
          <div
            className="p-6 sm:p-[4rem] pb-8 bg-[#818181] rounded-3xl neumorphism-container"
            style={{
              boxShadow: `
                inset -5px -5px 4px rgba(0, 0, 0, 0.2), 
                inset 5px 5px 4px rgba(0, 0, 0, 0.2), 
                0px 0px 60px rgba(0, 0, 0, 0.3)
              `,
            }}>
            <div className="absolute inset-0 bg-[#a6a6a6] mix-blend-color-burn pointer-events-none"/>
            <section className="relative">
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