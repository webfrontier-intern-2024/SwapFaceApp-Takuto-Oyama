"use client";
import React, {useCallback} from "react";
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div
    {...getRootProps()}
    className={`border-dashed border-4 p-10 w-full max-w-lg h-80 flex justify-center items-center text-center 
    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-gray-100"}`}
    >
    <input {...getInputProps()} />
    {
      isDragActive ? (
        <p className="text-blue-500 font-bold">ファイルをここにドロップしてください...</p>
      ) : (
        <p className="text-gray-600 font-semibold">ファイルをドラッグ＆ドロップするか、クリックして選択してください</p>
      )
    }
  </div>
  )
}

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col m-4 items-center ">
      <MyDropzone/>
      <div className="h-screen w-screen flex justify-center items-center gap-5 ">
        <div className="h-screen w-screen flex justify-center items-center gap-5 ">
          <button className= "bg-blue-500 text-white text-xl font-extrabold p-5 rounded-lg border border-black">キャンセル</button>
          <button className= "bg-blue-500 text-white text-xl font-extrabold p-5 rounded-lg border border-black">画像を削除</button>
        </div>
      </div>
    </div>
  );
}
