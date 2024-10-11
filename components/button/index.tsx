import React from "react";

interface handleCancel {
    onclick: () => void;
    className: string;
    text: string;
}

const Button: React.FC<handleCancel> = ({ onclick, text }) => {
    return (
        <button onClick={onclick} className= "${className} text-white text-xl font-bold p-5 rounded-lg ">
            {text}
        </button>
    );
};

export default Button;