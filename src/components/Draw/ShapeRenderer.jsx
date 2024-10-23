import React, { useRef } from "react";
import { Arrow, Ellipse, Line, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { useDrag } from "../../hooks/useDrag";

const ShapeRenderer = ({ onShapeSelect }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.draw.shapes);
  const toolSelected = useSelector((state) => state.control.toolSelected);
  const isDrag = useSelector((state) => state.draw.isDrag);
  const shapeRefs = useRef([]);
  const { handleDragEnd } = useDrag();

  const handleShapeSelect = (index) => {
    if (toolSelected === "mouse") {
      onShapeSelect(shapeRefs.current[index]);
    }
  };

  // console.log(shapes)
  return (
    <>
      {shapes.map((item, index) => {
        let shapeNode = null;
        switch (item.type) {
          case "rectangle":
            shapeNode = (
              <Rect
                key={index}
                ref={(node) => (shapeRefs.current[item.id] = node)}
                x={item.x}
                y={item.y}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}
                width={item.width}
                height={item.height}
                lineJoin="round"
                onClick={() => handleShapeSelect(item.id)}
                onTap={() => handleShapeSelect(item.id)}
                draggable={isDrag}
                rotation={item.rotation}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
            );
            break;

          case "ellipse":
            shapeNode = (
              <Ellipse
                key={index}
                ref={(node) => (shapeRefs.current[item.id] = node)}
                x={item.x + item.width / 2}
                y={item.y + item.height / 2}
                radiusX={Math.abs(item.width) / 2}
                radiusY={Math.abs(item.height) / 2}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}
                onClick={() => handleShapeSelect(item.id)}
                onTap={() => handleShapeSelect(item.id)}
                draggable={isDrag}
                rotation={item.rotation}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
            );
            break;

          case "arrow":
            shapeNode = (
              <Arrow
                key={index}
                ref={(node) => (shapeRefs.current[item.id] = node)}
                points={item.points}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={
                  item.fillColor === "#e4e4e700" ? "#e4e4e7" : item.fillColor
                }
                hitStrokeWidth={30}
                pointerLength={10}
                pointerWidth={8}
                lineCap="round"
                tension={0.5}
                lineJoin="round"
                onClick={() => handleShapeSelect(item.id)}
                onTap={() => handleShapeSelect(item.id)}
                draggable={isDrag}
                rotation={item.rotation}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
            );
            break;

          case "line":
            shapeNode = (
              <Line
                key={index}
                ref={(node) => (shapeRefs.current[item.id] = node)}
                points={item.points}
                strokeWidth={item.strokeWidth}
                hitStrokeWidth={30}
                stroke={item.strokeColor}
                lineCap="round"
                tension={0.5}
                lineJoin="round"
                onClick={() => handleShapeSelect(item.id)}
                onTap={() => handleShapeSelect(item.id)}
                draggable={isDrag}
                rotation={item.rotation}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
            );
            break;

          case "pencil":
            shapeNode = (
              <Line
                key={index}
                ref={(node) => (shapeRefs.current[item.id] = node)}
                points={
                  item.points
                    ? item.points.flatMap((point) => [point.x, point.y])
                    : []
                }
                stroke={item.strokeColor}
                hitStrokeWidth={30}
                strokeWidth={item.strokeWidth}
                lineCap="round"
                tension={0.4}
                lineJoin="round"
                onClick={() => handleShapeSelect(item.id)}
                onTap={() => handleShapeSelect(item.id)}
                draggable={isDrag}
                rotation={item.rotation}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
            );
            break;

          default:
            return null;
        }
        return shapeNode;
      })}
    </>
  );
};

export default ShapeRenderer;
