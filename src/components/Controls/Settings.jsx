import React, { useState } from "react";
import { PiMinusLight, PiMinusBold } from "react-icons/pi";
import { FaMinus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGlobal } from "../../context/GlobalContext";

const Settings = () => {
  const toolSelected = useSelector((state) => state.control.toolSelected);
  const {
    handleFillColor,
    handleStrokeColor,
    handleStrokeWidth,
    strokeColor,
    strokeStyle,
    fillColor,
    strokeWidth,
    selectedNode,
  } = useGlobal();

  const [stroke] = useState([
    { id: 1, color: "#e4e4e7", bgColor: "bg-zinc-200" },
    { id: 2, color: "#dc2626", bgColor: "bg-red-600" },
    { id: 3, color: "#facc15", bgColor: "bg-yellow-400" },
    { id: 4, color: "#16a34a", bgColor: "bg-green-500" },
    { id: 5, color: "#3b82f6", bgColor: "bg-blue-500" },
    { id: 6, color: "#01010", bgColor: "bg-zinc-950" },
  ]);
  const [fill] = useState([
    {
      id: 0,
      color: "#e4e4e700",
      bgColor: "bg-[url('../../../public/img/png.jpg')]",
    },
    { id: 1, color: "#e4e4e7", bgColor: "bg-zinc-200" },
    { id: 2, color: "#dc2626", bgColor: "bg-red-600" },
    { id: 3, color: "#facc15", bgColor: "bg-yellow-400" },
    { id: 4, color: "#16a34a", bgColor: "bg-green-500" },
    { id: 5, color: "#3b82f6", bgColor: "bg-blue-500" },
    { id: 6, color: "#01010", bgColor: "bg-zinc-950" },
  ]);

  // console.log(Boolean(selectedNode))

  return (
    <div
      className={`${
        toolSelected === "hand" || toolSelected === "mouse"
          ? "hidden"
          : "flex"
      } p-3 text-zinc-300 text-xs tracking-wider scroll-pl-12 rounded-lg bg-[#232329] flex-col gap-3 absolute z-50 top-16 left-4`}
    >
      <div>
        <h4>Stroke</h4>
        <div className="option flex items-center gap-3 mt-2">
          {stroke.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => handleStrokeColor(item.color)}
                className={`hover:outline ${
                  strokeColor === item.color ? "outline" : ""
                } outline-1 outline-offset-[3px] outline-zinc-400 p-[.6rem] ${
                  item.bgColor
                } rounded`}
              ></button>
            );
          })}
        </div>
      </div>

      <div>
        <h4>Background</h4>
        <div className="option flex items-center gap-3 mt-2">
          {fill.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => handleFillColor(item.color)}
                className={`hover:outline ${
                  fillColor === item.color ? "outline" : ""
                } outline-1 outline-offset-[3px] outline-zinc-400 p-[.6rem] ${
                  item.bgColor
                } rounded`}
              ></button>
            );
          })}
        </div>
      </div>

      <div>
        <h4>Stroke width</h4>
        <div className="option flex items-center gap-3 mt-2 text-white">
          <button
            onClick={() => handleStrokeWidth(1)}
            className={`${
              strokeWidth === 1 ? "bg-[#694a8b]" : "bg-zinc-700"
            }  p-[.4rem] bg- rounded`}
          >
            <PiMinusLight />
          </button>
          <button
            onClick={() => handleStrokeWidth(3)}
            className={`${
              strokeWidth === 3 ? "bg-[#694a8b]" : "bg-zinc-700"
            }  p-[.4rem] bg- rounded`}
          >
            <PiMinusBold />
          </button>
          <button
            onClick={() => handleStrokeWidth(5)}
            className={`${
              strokeWidth === 5 ? "bg-[#694a8b]" : "bg-zinc-700"
            } p-[.4rem] bg- rounded`}
          >
            <FaMinus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
