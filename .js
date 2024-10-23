// import React, { useState } from "react";
// import { Stage, Layer, Line, Circle } from "react-konva";

// const App = () => {
//   const [linePoints, setLinePoints] = useState([100, 100, 300, 300]); // Initial line coordinates
//   const [selected, setSelected] = useState(false); // Line selection state

//   // Update the position of the start point
//   const handleDragStart = (e) => {
//     const { x, y } = e.target.position();
//     const newPoints = [...linePoints];
//     newPoints[0] = x;
//     newPoints[1] = y;
//     setLinePoints(newPoints);
//   };

//   // Update the position of the end point
//   const handleDragEnd = (e) => {
//     const { x, y } = e.target.position();
//     const newPoints = [...linePoints];
//     newPoints[2] = x;
//     newPoints[3] = y;
//     setLinePoints(newPoints);
//   };

//   // Handle drag start and end events for the whole line (optional)
//   const handleLineDragMove = (e) => {
//     const { x, y } = e.target.position();
//     const deltaX = x - linePoints[0];
//     const deltaY = y - linePoints[1];

//     const newPoints = [
//       x,
//       y,
//       linePoints[2] + deltaX,
//       linePoints[3] + deltaY,
//     ];
//     setLinePoints(newPoints);
//   };

//   // Handle line selection
//   const handleLineClick = () => {
//     setSelected(!selected); // Toggle selection
//   };

//   return (
//     <Stage width={window.innerWidth} height={window.innerHeight}>
//       <Layer>
//         {/* Line connecting the two points */}
//         <Line
//           points={linePoints}
//           stroke={selected ? "blue" : "black"} // Highlight line when selected
//           strokeWidth={4}
//           draggable
//           onDragMove={handleLineDragMove}
//           onClick={handleLineClick}
//         />

//         {/* Render control points only when the line is selected */}
//         {selected && (
//           <>
//             {/* Start Point */}
//             <Circle
//               x={linePoints[0]}
//               y={linePoints[1]}
//               radius={8}
//               fill="red"
//               draggable
//               onDragMove={handleDragStart}
//             />

//             {/* End Point */}
//             <Circle
//               x={linePoints[2]}
//               y={linePoints[3]}
//               radius={8}
//               fill="blue"
//               draggable
//               onDragMove={handleDragEnd}
//             />
//           </>
//         )}
//       </Layer>
//     </Stage>
//   );
// };

// export default App;






































import React, { useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";

const App = () => {
  const [shapes, setShapes] = useState([]); // Track all shapes drawn
  const [selectedShapeId, setSelectedShapeId] = useState(null); // Track selected shape
  const [mode, setMode] = useState("draw"); // "draw" or "transform"
  const [undoStack, setUndoStack] = useState([]); // Undo stack
  const [redoStack, setRedoStack] = useState([]); // Redo stack

  // Draw line on mouse down
  const handleDrawLine = (event) => {
    if (mode === "draw") {
      const newLine = {
        id: shapes.length + 1,
        points: [
          event.evt.clientX,
          event.evt.clientY,
          event.evt.clientX + 100,
          event.evt.clientY + 100,
        ],
      };

      // Update shapes and add to undo stack
      setUndoStack([...undoStack, shapes]);
      setShapes([...shapes, newLine]);
      setRedoStack([]); // Clear redo stack on new action
    }
  };

  // Select line for transformation
  const handleLineClick = (line) => {
    if (mode === "transform") {
      setSelectedShapeId(line.id); // Set selected shape id
    }
  };

  // Undo last action
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousShapes = undoStack.pop();
      setRedoStack([...redoStack, shapes]); // Push current shapes to redo stack
      setShapes(previousShapes);
      setUndoStack([...undoStack]); // Update the undo stack
    }
  };

  // Redo last undone action
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextShapes = redoStack.pop();
      setUndoStack([...undoStack, shapes]); // Push current shapes to undo stack
      setShapes(nextShapes);
      setRedoStack([...redoStack]); // Update the redo stack
    }
  };

  // Update points of the selected shape
  const updateShapePoints = (newPoints) => {
    setUndoStack([...undoStack, shapes]); // Push current shapes to undo stack
    const updatedShapes = shapes.map((shape) =>
      shape.id === selectedShapeId ? { ...shape, points: newPoints } : shape
    );
    setShapes(updatedShapes);
    setRedoStack([]); // Clear redo stack on shape update
  };

  return (
    <div>
      <button onClick={() => setMode("draw")}>Draw Mode</button>
      <button onClick={() => setMode("transform")}>Transform Mode</button>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleDrawLine} // Handle drawing on mouse down
      >
        <Layer>
          {shapes.map((shape) => (
            <Line
              key={shape.id}
              points={shape.points}
              stroke="black"
              strokeWidth={4}
              draggable={mode === "transform"} // Make line draggable only in transform mode
              onClick={() => handleLineClick(shape)} // Select line on click
            />
          ))}

          {selectedShapeId && (
            <>
              {shapes.map((shape) => {
                if (shape.id === selectedShapeId) {
                  return (
                    <React.Fragment key={shape.id}>
                      {/* Start Point */}
                      <Circle
                        x={shape.points[0]}
                        y={shape.points[1]}
                        radius={8}
                        fill="red"
                        draggable
                        onDragMove={(e) => {
                          const newPoints = [...shape.points];
                          newPoints[0] = e.target.x();
                          newPoints[1] = e.target.y();
                          updateShapePoints(newPoints); // Update shape points
                        }}
                      />

                      {/* End Point */}
                      <Circle
                        x={shape.points[2]}
                        y={shape.points[3]}
                        radius={8}
                        fill="blue"
                        draggable
                        onDragMove={(e) => {
                          const newPoints = [...shape.points];
                          newPoints[2] = e.target.x();
                          newPoints[3] = e.target.y();
                          updateShapePoints(newPoints); // Update shape points
                        }}
                      />
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
