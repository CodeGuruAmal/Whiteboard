import React, { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setMenuClick } from "../../utils/controlSlice";
import { addToUndoStack, setShapes } from "../../utils/drawSlice";
import {
  PiDownloadSimpleFill,
  PiFolderBold,
  PiTrashBold,
} from "react-icons/pi";
const Menu = () => {
  const iconMapping = {
    open: <PiFolderBold />,
    save: <PiDownloadSimpleFill />,
    reset: <PiTrashBold />,
  };

  const [menuOption] = useState([
    { type: "open", label: "Open" },
    { type: "save", label: "Save" },
    { type: "reset", label: "Reset the canvas" },
  ]);

  const menuClick = useSelector((state) => state.control.menuClick);
  const dispatch = useDispatch();

  const toggleMenuClick = () => {
    dispatch(setMenuClick(!menuClick));
  };

  const handleReset = () => {
    dispatch(addToUndoStack());

    dispatch(setShapes([]));
    dispatch(setMenuClick(false))

  };

  return (
    <div className="absolute top-4 left-4 text-zinc-300 z-[51]">
      <button
        onClick={toggleMenuClick}
        className={`bg-[#232329] p-2 rounded-md hover:bg-[#694a8b] ${menuClick ? 'bg-[#694a8b]' : 'bg-[#232329]'}`}
      >
        <BiMenu />
      </button>

      <div
        className={`w-[11rem] p-[.37rem] absolute rounded-lg bg-[#232329] ${
          menuClick ? "flex" : "hidden"
        } flex-col mt-[.4rem] text-xs`}
      >
        {menuOption.map((m, index) => {
          return (
            <button
              key={index}
              onClick={m.type === "reset" ? handleReset : null}
              className="flex items-center transition-colors duration-100 hover:bg-[#694a8b] p-2 rounded-lg gap-2"
            >
              {iconMapping[m.type]} {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
