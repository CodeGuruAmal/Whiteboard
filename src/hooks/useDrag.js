import { useDispatch, useSelector } from "react-redux";
import { addToUndoStack, setShapes } from "../utils/drawSlice";

export const useDrag = () => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.draw.shapes);

  const handleDragEnd = (e, index) => {
    console.log(e);
    
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === index) {
        const { x, y } = e.target.attrs;

        switch (shape.type) {
          case "rectangle":
            return {
              ...shape,
              x: x,
              y: y,
            };
          case "ellipse":
            return {
              ...shape,
              x: x - e.target.radiusX(),
              y: y - e.target.radiusY(),
            };
            case "arrow":
                return {
                 ...shape,
                  x: x - e.target.width() / 2,
                  y: y - e.target.height() / 2,
                };
          default:
            return shape; 
        }
      }
      return shape; 
    });

    
    dispatch(addToUndoStack());
    dispatch(setShapes(updatedShapes));
  };

  return {
    handleDragEnd,
  };
};
