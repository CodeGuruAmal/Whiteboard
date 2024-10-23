import React, { useState } from "react";
import {
  PiSquareBold,
  PiCircleBold,
  PiMinusBold,
  PiTextTBold,
} from "react-icons/pi";
import { LuMousePointer, LuPencil, LuImage } from "react-icons/lu";
import { HiArrowNarrowRight } from "react-icons/hi";
import { FaRegHandPaper } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setToolSelected } from "../../utils/controlSlice";
import { useGlobal } from "../../context/GlobalContext";
const Tools = () => {
  const dispatch = useDispatch();
  const toolSelected = useSelector((state) => state.control.toolSelected);
  const { selectedNode, setSelectedNode } =
    useGlobal();

  const iconMapping = {
    hand: <FaRegHandPaper />,
    mouse: <LuMousePointer />,
    rectangle: <PiSquareBold />,
    ellipse: <PiCircleBold />,
    arrow: <HiArrowNarrowRight />,
    line: <PiMinusBold />,
    pencil: <LuPencil />,
    // text: <PiTextTBold />,
    // image: <LuImage />,
  };

  const [tool] = useState([
    { type: "hand" },
    { type: "mouse" },
    { type: "rectangle" },
    { type: "ellipse" },
    { type: "arrow" },
    { type: "line" },
    { type: "pencil" },
    // { type: "text" },
    // { type: "image" },
  ]);

  const handleToolClick = (type) => {
    dispatch(setToolSelected(type));
  };

  return (
    <>
      <div className="flex justify-center items-center bg-[#232329] text-zinc-300 rounded-md absolute z-50 top-4 left-1/2 -translate-x-1/2">
        <div className="py-2 px-3 text-sm flex gap-2">
          {tool.map((t, index) => {
            return (
              <button
                onClick={() => {
                  handleToolClick(t.type);
                  setSelectedNode(null);
                }}
                key={index}
                className={`p-2 hover:bg-[#694a8b] ${
                  toolSelected === t.type ? "bg-[#694a8b]" : "bg-[#232329]"
                } transition-colors duration-100 rounded-lg `}
              >
                {iconMapping[t.type]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Tools;
