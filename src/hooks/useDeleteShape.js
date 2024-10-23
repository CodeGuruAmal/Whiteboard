import { useDispatch, useSelector } from "react-redux";
import { addToUndoStack, setShapes } from "../utils/drawSlice";
import { useGlobal } from "../context/GlobalContext";

export const useDeleteShape = () => {
  const dispatch = useDispatch();
  const { selectedNode, setSelectedNode } = useGlobal();
  const shapes = useSelector((state) => state.draw.shapes);

  const deleteShape = () => {
    if (selectedNode) {
      // Add current state to undo stack before deleting
      dispatch(addToUndoStack());
      
      // Filter out the selected shape from the shapes array
      const updatedShapes = shapes.filter((shape) => shape.id !== selectedNode.index);
      
      // Update shapes in the state
      dispatch(setShapes(updatedShapes));
      
      // Deselect the shape after deletion
      setSelectedNode(null);
    }
  };

  return deleteShape;
};
