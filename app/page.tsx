"use client"
import React from "react";
//ライブラリ
import { CloudUpload, Check, MediaImage } from "iconoir-react";
//pages
import MyDropzone from "../components/dropzone";

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
              <h1 className="sm:text-3xl text-2xl text-white font-bold text-center mb-20">
                顔マスク.js
              </h1>
              <div className="flex flex-wrap m-4 -mt-8 justify-center">
                <div className="p-4  flex">
                  <CloudUpload height={50} width={40} color="#fff" />
                  <div className="flex-grow pl-6 w-full ">
                    <h2 className="text-white text-lg font-medium mb-2">
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
                    <h2 className="text-white text-lg font-medium mb-2">
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
                    <h2 className="text-white text-lg font-medium mb-2 ">
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