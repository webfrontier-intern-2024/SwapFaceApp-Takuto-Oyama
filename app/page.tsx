"use client";
import React, { useCallback, useState } from "react";
import Image from 'next/image';
//ライブラリ
import { useDropzone } from 'react-dropzone';
import { CloudUpload, Check, MediaImage } from "iconoir-react";
import { Player } from "@lottiefiles/react-lottie-player";
//pages
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
  const [imagePreview, setImagePreview] = useState<string | null>(null); // プレビュー画像
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false); // アップロード成功フラグ
  const [isMaskApplied, setIsMaskApplied] = useState(false);  // マスク適用フラグ
  const [randomEmoji, setRandomEmoji] = useState<string>(''); // ランダムな絵文字
  const [jsonData, setJsonData] = useState<BoxData | null>(null); // 顔の座標データ
  const [showErrorModal, setShowErrorModal] = useState(false); // モーダル表示フラグ
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ

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

  // APIへ画像を送信する処理
  const handleSendImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);  // APIに送信するためにroute.tsに定義されたフォームデータを追加

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
        if (response.status === 400) {
          setErrorMessage("顔の検出に失敗しました。");
        } else {
          setErrorMessage("APIエラー");
        }
        setIsUploadSuccessful(false);
        setShowErrorModal(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("アップロードに失敗しました。");
      } else {
        setErrorMessage("予期しないエラーが発生しました");
      }
      setIsUploadSuccessful(false);
      setShowErrorModal(true);
    }
  };

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
                <div className="flex flex-col items-center">
                  <Player
                          autoplay
                          loop
                          src="/lottie/upload.json" 
                          style={{ height: "300px", width: "300px" }}
                      />
                </div>
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
              <div className="flex flex-wrap m-4 -mt-8 justify-center">
                <div className="p-4  flex">
                  <CloudUpload height={50} width={40} color="#fff" />
                  <div className="flex-grow pl-6 w-full ">
                    <h2 className="text-white text-lg font-bold mb-2">
                      画像をドロップ
                    </h2>
                    <p className="leading-relaxed text-base">
                      PNG、JPEG、JPGのみ
                    </p>
                  </div>
                </div>
                <div className="p-4 flex">
                  <MediaImage height={50} width={40} color="#fff" />
                  <div className="flex-grow pl-6 w-full max-w-full">
                    <h2 className="text-white text-lg font-bold mb-2">
                      顔を検出
                    </h2>
                    <p className="leading-relaxed text-base">
                      人物の顔を検出します
                    </p>
                  </div>
                </div>
                <div className="p-4 flex ">
                  <Check height={50} width={40} color="#fff"/>
                  <div className="flex-grow pl-6 ">
                    <h2 className="text-white text-lg font-bold mb-2 ">
                      マスク完了
                    </h2>
                    <p className="leading-relaxed text-base">
                      顔に絵文字を貼ります
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