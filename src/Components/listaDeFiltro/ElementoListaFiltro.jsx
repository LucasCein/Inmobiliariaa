import React from "react";
import "../../App.css";

const ElementoListaFiltro = ({ text }) => {
  return (
    <div className="filtro d-flex justify-content-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="100px"
        y="0px"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <path
          fill="#f44336"
          d="M36.021,8.444l3.536,3.536L11.98,39.557l-3.536-3.536L36.021,8.444z"
        ></path>
        <path
          fill="#f44336"
          d="M39.555,36.023l-3.536,3.535L8.445,11.976l3.536-3.535L39.555,36.023z"
        ></path>
      </svg>
      <a>{text}</a>
    </div>
  );
};

export default ElementoListaFiltro;
