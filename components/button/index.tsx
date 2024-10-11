"use client"
import React from "react";

interface handleCancel {
    onclick: () => void;
    text: string;
    className: string;
}

const Button: React.FC<handleCancel> = ({ onclick, text, className }) => {
    return (
        <button onClick={onclick} className= {`${className} text-white text-xl font-bold p-5 rounded-lg`}>
            {text}
        </button>
    );
};

export default Button;