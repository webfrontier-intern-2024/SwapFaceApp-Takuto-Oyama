"use client";
import React, {useCallback, useState} from "react";
import {useDropzone} from 'react-dropzone';
import Image from 'next/image';

function MyDropzone() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);

  const handleSendImage = async () => {
    if (!uploadedImage) return;

    const formData = new FormData();
    formData.append('file', uploadedImage);

    try {
      setIsUploading(true);

      const apiUrl = "/api/upload";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("APIリザルト", result);
        setIsUploadSuccessful(true);
      } else {
        console.error("APIエラー", response.statusText);
      }
    } catch (error) {
      console.error("API通信エラー", error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
    setUploadedImage(file);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {'image/png': [], 'image/jpeg': [], 'image/jpg': []},
    multiple: false //一つのファイルのみ
  });

  // キャンセルボタンの処理
  const handleCancel = () => {
    setUploadedImage(null);
    setImagePreview(null); // プレビュー用URLを削除
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div
        {...getRootProps()}
        className={`border-dashed border-4 p-10 w-full h-96 flex justify-center items-center text-center rounded-xl 
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-orange-300"}`}
      >
        <input {...getInputProps()} />
        {
          imagePreview ? (
            <Image src={imagePreview} width={300} height={300} alt="Uploaded" className="max-h-full max-w-full object-contain" />
          ) : (
            isDragActive ? (
              <p className="text-blue-500 font-bold">ファイルをここにドロップしてください...</p>
            ) : (
              <p className="text-gray-600 font-semibold">ファイルをドラッグ＆ドロップするか、クリックして選択してください</p>
            )
          )
        }
      </div>
      <div className="mt-10 flex justify-center items-center ">
        <div className=" flex justify-center items-center gap-10 ">
        {uploadedImage && (
            <>
              <button
                className="bg-blue-500 text-white text-xl font-extrabold p-5 rounded-lg"
                onClick={handleCancel}
              >
                {isUploadSuccessful ? "戻る" : "キャンセル"}
              </button>
              {!isUploadSuccessful && (
                <button
                  className="bg-blue-500 text-white text-xl font-extrabold p-5 rounded-lg"
                  onClick={handleSendImage}
                  disabled={isUploading}
                >
                  {isUploading ? "送信中..." : "画像を送信"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col m-4 items-center justify-center">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-20 mx-auto">
          <h1 className="sm:text-3xl text-2xl font-black title-font text-center text-gray-900 mb-20">画像マスクくん</h1>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0">
            <div className="p-4 md:w-1/3 max-w-[306px] flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[#FF9501] text-white mb-4 flex-shrink-0">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow pl-6">
                <h2 className="text-gray-900 text-lg title-font font-bold mb-2">画像をドロップ</h2>
                <p className="leading-relaxed text-base">画像ファイルを枠の中にドロップorファイルから参照する</p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[#FF9501] text-white mb-4 flex-shrink-0">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <div className="flex-grow pl-6">
                <h2 className="text-gray-900 text-lg title-font font-bold mb-2">ボタンをクリック</h2>
                <p className="leading-relaxed text-base">アップロードボタンをクリック</p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full  bg-[#FF9501] text-white mb-4 flex-shrink-0">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-grow pl-6">
                <h2 className="text-gray-900 text-lg title-font font-bold mb-2">成功</h2>
                <p className="leading-relaxed text-base">顔がマスクされた画像に変換されるよ！</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MyDropzone/>
    </div>
  );
}
