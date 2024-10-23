import React from "react";

import { BiMinus, BiPlus, BiRedo, BiUndo } from "react-icons/bi";
import { setRedo, setUndo } from "../../utils/drawSlice";
import { useDispatch, useSelector } from "react-redux";
import { useZoom } from "../../hooks/useZoom";
import { useGlobal } from "../../context/GlobalContext";

const ControlPanel = () => {
    const dispatch = useDispatch();
  const undoStack = useSelector((state) => state.draw.undoStack);
  const redoStack = useSelector((state) => state.draw.redoStack);

  const { stageScale, zoomStage, zoomPercentage } = useZoom();
  // console.log(zoomPercentage)

  const { setSelectedNode } = useGlobal();


  const handleUndo = () => dispatch(setUndo());
  const handleRedo = () => dispatch(setRedo());

  return (
    <div className="flex items-center justify-center gap-3 absolute bottom-4 left-4 text-zinc-300 z-50">
      <div className="bg-[#232329] p-1 rounded-md flex items-center overflow-hidden">
        <button
          onClick={() =>
            zoomStage(1.02, {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            })
          }
          className="hover:bg-[#694a8b] p-2 rounded-md"
        >
          <BiPlus />
        </button>
        <span className="px-5 text-xs">{zoomPercentage}%</span>
        <button
          onClick={() =>
            zoomStage(1 / 1.02, {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            })
          }
          className="hover:bg-[#694a8b] p-2 rounded-md"
        >
          <BiMinus />
        </button>
      </div>

      <div className="bg-[#232329] p-1 rounded-md flex gap-1 items-center overflow-hidden">
        <button
          onClick={() => {
            handleUndo();
            setSelectedNode(null);
          }}
          disabled={undoStack.length === 0}
          className={`bg-[#232329] p-2 rounded-md ${
            undoStack.length > 0 ? "hover:bg-[#694a8b]" : "opacity-50"
          }`}
        >
          <BiUndo />
        </button>
        <button
          onClick={() => {
            handleRedo();
            setSelectedNode(null);
          }}
          disabled={redoStack.length === 0}
          className={`bg-[#232329] p-2 rounded-md ${
            redoStack.length > 0 ? "hover:bg-[#694a8b]" : "opacity-50"
          }`}
        >
          <BiRedo />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
