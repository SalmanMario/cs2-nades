import {Circle} from "react-konva";
import React, {useState} from "react";
import {Coords} from "@/types/coords";

export default function AnimatedCircle({coords, index, handleClickEndCoords, isHidden}: {coords: Coords, index: number, handleClickEndCoords: (coords: Coords) => void, isHidden: boolean}) {
    const [isHovered, setHovered] = useState(false);
    return (
        <Circle
            key={index}
            x={coords.x}
            y={coords.y}
            visible={!isHidden}
            scaleX={isHovered ? 1.25 : 1}
            scaleY={isHovered ? 1.25 : 1}
            radius={16}
            onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                    stage.container().style.cursor = "pointer";
                    setHovered(true)
                }
            }}
            onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                    stage.container().style.cursor = "default";
                    setHovered(false)
                }
            }}
            fill={coords.team_id === 1 ? "orange" : "blue"}
            stroke="black"
            strokeWidth={2}
            onClick={() => handleClickEndCoords(coords)}
        />
    )
}
