"use client"
import React from "react";
//ライブラリ
import { Player } from "@lottiefiles/react-lottie-player";

interface ModalProps {
  message: string;
  show: boolean; 
  onClose: () => void;
}

const ErrorModal: React.FC<ModalProps> = ({show,  message, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-black p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                <h2 className="text-xl font-black text-red-600 mb-4">エラーが発生しました</h2>
                {/* Lottieアニメーション */}
                <div className="mb-4">
                    <Player
                        autoplay
                        loop
                        src="/lottie/error.json" 
                        style={{ height: "150px", width: "150px" }}
                    />
                </div>
                <p className="mb-4 text-gray-200">{message}</p>
                <button
                onClick={onClose}
                className="bg-red-700 text-white px-4 py-2 rounded font-bold hover:bg-red-600">
                閉じる
                </button>
            </div>
        </div>
  );
}
export default ErrorModal;