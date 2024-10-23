import { useDispatch, useSelector } from "react-redux";
import { setStagePosition, setStageScale } from "../utils/controlSlice";

export const useZoom = () => {
  const stageScale = useSelector((state) => state.control.stageScale);
  const stagePosition = useSelector((state) => state.control.stagePosition);
  const dispatch = useDispatch();
  // console.log(stageScale)

  const transformPointerPosition = (pointer) => ({
    x: (pointer.x - stagePosition.x) / stageScale,
    y: (pointer.y - stagePosition.y) / stageScale,
  });

  const zoomStage = (scaleFactor, pointer) => {
    const oldScale = stageScale;

    const newScale = oldScale * scaleFactor;
    const clampedScale = Math.max(0.1, Math.min(30, newScale));

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    dispatch(setStageScale(clampedScale));
    dispatch(setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }));
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const direction = e.evt.deltaY < 0 ? scaleBy : 1 / scaleBy;
    const pointer = e.target.getStage().getPointerPosition();
    zoomStage(direction, pointer);
  };

  const zoomPercentage = Math.round(stageScale * 100);
  // console.log(stageScale * 100)

  return {
    stageScale,
    stagePosition,
    zoomPercentage,
    transformPointerPosition,
    zoomStage,
    setStagePosition,
    handleWheel
    
  };
};

