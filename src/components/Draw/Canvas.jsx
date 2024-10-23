import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Shape, Stage, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addToUndoStack,
  setIsDrag,
  setIsDrawing,
  setShapes,
} from "../../utils/drawSlice";
import ShapeRenderer from "./ShapeRenderer";
import { setMenuClick, setToolSelected } from "../../utils/controlSlice";
import { useGlobal } from "../../context/GlobalContext";
import { useZoom } from "../../hooks/useZoom";
import ControlPanel from "../Controls/ControlPanel";
import { useDeleteShape } from "../../hooks/useDeleteShape";

const Canvas = () => {
  const dispatch = useDispatch();
  const toolSelected = useSelector((state) => state.control.toolSelected);
  const shapes = useSelector((state) => state.draw.shapes);
  const isDrawing = useSelector((state) => state.draw.isDrawing);

  const { strokeColor, strokeWidth, fillColor, selectedNode, setSelectedNode } =
    useGlobal();
  const transformerRef = useRef();

  const {
    stageScale,
    stagePosition,
    setStagePosition,
    transformPointerPosition,
    handleWheel,
  } = useZoom();

  const deleteShape = useDeleteShape();

  const handleStart = (e) => {

    

    if (toolSelected !== "mouse") {
      dispatch(addToUndoStack());
      dispatch(setIsDrawing(true));
      const pointer = e.target.getStage().getPointerPosition();
      const { x, y } = transformPointerPosition(pointer);

      if (toolSelected === "pencil" && toolSelected !== "hand") {
        // Handle pencil drawing
        dispatch(
          setShapes([
            ...shapes,
            {
              id: shapes.length,
              points: [{ x, y }],
              type: toolSelected,
              strokeColor: strokeColor,
              strokeWidth: strokeWidth,
              rotation: 0,
            },
          ])
        );
      } else if (toolSelected === "arrow" || toolSelected === "line") {
        dispatch(
          setShapes([
            ...shapes,
            {
              id: shapes.length,
              points: [x, y, x, y],
              type: toolSelected,
              strokeColor: strokeColor,
              fillColor: fillColor,
              strokeWidth: strokeWidth,
            },
          ])
        );
      } else {
        dispatch(
          setShapes([
            ...shapes,
            {
              id: shapes.length,
              x,
              y,
              width: 0,
              height: 0,
              type: toolSelected,
              strokeColor: strokeColor,
              fillColor: fillColor,
              strokeWidth: strokeWidth,
              rotation: 0,
            },
          ])
        );
      }
    }
  };

  const handleMove = (e) => {
    if (!isDrawing) return;

    const pointer = e.target.getStage().getPointerPosition();
    const { x, y } = transformPointerPosition(pointer);
    const lastShape = shapes[shapes.length - 1];

    if (
      toolSelected !== "pencil" &&
      (lastShape.width === 0 ||
        lastShape.height === 0 ||
        lastShape.type === "hand")
    ) {
      dispatch(setShapes(shapes.slice(0, -1)));
    }

    const updatedShapes = shapes.map((shape, index) => {
      if (index === shapes.length - 1) {
        if (toolSelected === "pencil") {
          return {
            ...shape,
            points: [...shape.points, { x, y }],
          };
        } else if (toolSelected === "line" || toolSelected === "arrow") {
          const updatedPoints = [...shape.points.slice(0, 2), x, y];
          return {
            ...shape,
            points: updatedPoints,
          };
        } else {
          return {
            ...shape,
            width: x - shape.x,
            height: y - shape.y,
          };
        }
      } else {
        return shape;
      }
    });

    // console.log(updatedShapes)
    dispatch(setShapes(updatedShapes));
  };

  const handleEnd = () => {
    dispatch(setIsDrawing(false));
    if (toolSelected !== "hand" && toolSelected !== "pencil") {
      dispatch(setToolSelected("mouse"));
    }
  };

  const handleShapeSelect = (node) => {
    console.log(shapes);
    console.log(node);

    setSelectedNode(node);

    // if (selectedNode instanceof Konva.Rect) {
    //   console.log('This is a rectangle');
    // } else if (selectedNode instanceof Konva.Ellipse) {
    //   console.log('This is a circle');
    // }

    //     const shapeName = node.constructor.name; // This will give you "Rect2"
    // console.log(`Shape constructor name: ${shapeName}`);
    if (toolSelected === "mouse" && toolSelected !== "pencil") {
      dispatch(setIsDrag(true));
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedNode(null);
      dispatch(setIsDrag(false));
    }
  };

  useEffect(() => {
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedNode]);

  const handleTransformEnd = (e) => {
    const node = e.target;

    const updatedShapes = shapes.map((shape) => {
      if (shape.id === selectedNode.index) {
        switch (shape.type) {
          case "rectangle":
            return {
              ...shape,
              x: node.x(),
              y: node.y(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
              rotation: node.rotation(),
            };

          case "ellipse":
            return {
              ...shape,
              x: node.x() - node.radiusX() * node.scaleX(),
              y: node.y() - node.radiusY() * node.scaleY(),
              width: node.radiusX() * 2 * node.scaleX(),
              height: node.radiusY() * 2 * node.scaleY(),
              rotation: node.rotation(),
            };

          default:
            return shape;
        }
      }

      return shape;
    });

    node.scaleX(1);
    node.scaleY(1);

    dispatch(addToUndoStack());
    dispatch(setShapes(updatedShapes));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      deleteShape(); // Delete the selected shape when Delete or Backspace is pressed
    }
  };

  // Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode]);

  const updateShapePoints = (newPoints) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === selectedNode.index ? { ...shape, points: newPoints } : shape
    );
    dispatch(setShapes(updatedShapes));
  };

  return (
    <>
      <ControlPanel />
      <Stage
        className={`overflow-hidden bg-[#121212] ${
          toolSelected === "mouse" && "cursor-move"
        } ${toolSelected === "hand" && "cursor-grab"} ${
          toolSelected !== "hand" &&
          toolSelected !== "mouse" &&
          "cursor-crosshair"
        }`}
        onClick={(e) => {
          dispatch(setMenuClick(false));
          handleCanvasClick(e);
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={toolSelected === "hand"}
        onWheel={handleWheel}
        onDragEnd={(e) => {
          if (toolSelected === "hand") {
            setStagePosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        <Layer>
          <ShapeRenderer onShapeSelect={handleShapeSelect} />
          <Transformer
            ref={transformerRef}
            onTransformEnd={(e) => handleTransformEnd(e)}
            visible={
              selectedNode?.attrs?.points?.length > 4 ||
              selectedNode?.constructor?.name === "Rect2" ||
              selectedNode?.constructor?.name === "Ellipse2"
            }
            borderStroke="#b1afea"
            borderStrokeWidth={1}
            anchorStroke="#b1afea"
            anchorFill="#b1afea"
            anchorSize={7}
            anchorCornerRadius={2}
            padding={4}
          />

          {(selectedNode?.constructor?.name === "Arrow2" ||
            selectedNode?.attrs?.points?.length === 4) && (
            <>
              {shapes.map((shape) => {
                if (shape.id === selectedNode.index) {
                  return (
                    <React.Fragment key={shape.id}>
                      <Circle
                        x={shape.points[0]}
                        y={shape.points[1]}
                        radius={5 * (stageScale < 1 ? 1 / stageScale : 1)}
                        fill="#938ffc"
                        stroke="#938ffc"
                        draggable
                        onDragMove={(e) => {
                          const newPoints = [...shape.points];
                          newPoints[0] = e.target.x();
                          newPoints[1] = e.target.y();
                          updateShapePoints(newPoints); // Update shape points
                        }}
                        onDragStart={() => dispatch(addToUndoStack())}
                      />

                      <Circle
                        x={shape.points[2]}
                        y={shape.points[3]}
                        radius={5 * (stageScale < 1 ? 1 / stageScale : 1)}
                        fill="#938ffc"
                        stroke="#938ffc"
                        draggable
                        onDragMove={(e) => {
                          const newPoints = [...shape.points];
                          newPoints[2] = e.target.x();
                          newPoints[3] = e.target.y();
                          updateShapePoints(newPoints); // Update shape points
                        }}
                        onDragStart={() => dispatch(addToUndoStack())}
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
    </>
  );
};

export default Canvas;

