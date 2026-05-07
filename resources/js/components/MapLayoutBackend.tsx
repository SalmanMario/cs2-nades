import AlertMarketPositionComponent from "@/components/AlertMarketPositionComponent";
import {Image, Layer, Stage, Circle, Line} from "react-konva";
import React, {useState, useEffect, useRef} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

type MapLayoutBackendProps = {
    mapImage: string,
    editingStartingCoords: boolean,
    editingEndCoords: boolean,
    onStartCoordsChange?: (coords: {x: number, y: number}) => void,
    onEndCoordsChange?: (coords: {x: number, y: number}) => void,
}

export default function MapLayoutBackend({mapImage, editingStartingCoords, editingEndCoords, onStartCoordsChange, onEndCoordsChange} : MapLayoutBackendProps) {
    const [startCoordinates, setStartCoordinates] = useState<{ x: number; y: number } | null>(null);
    const [endCoordinates, setEndCoordinates] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({width: 1024, height: 1024});
    const containerRef = useRef<HTMLDivElement>(null);
    const aspectRatioRef = useRef(1);

    useEffect(() => {
        if (!mapImage) return;
        const image = new window.Image();
        image.src = `/storage/${mapImage}`;
        image.onload = () => {
            setImg(image);
            aspectRatioRef.current = image.naturalHeight / image.naturalWidth;
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setStageSize({width, height: width * aspectRatioRef.current});
            }
        };
    }, [mapImage]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            const width = entries[0].contentRect.width;
            setStageSize({width, height: width * aspectRatioRef.current});
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const getCoords = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!editingStartingCoords && !editingEndCoords) return;

        if (editingStartingCoords && pos) {
            setStartCoordinates({x: pos!.x, y: pos!.y});
            onStartCoordsChange?.({x: pos!.x, y: pos!.y})
        }

        if (editingEndCoords && pos) {
            setEndCoordinates({x: pos!.x, y: pos!.y});
            onEndCoordsChange?.({x: pos!.x, y: pos!.y})
        }
    }

    return (
        <div>
            {editingStartingCoords && startCoordinates && (
                <AlertMarketPositionComponent position={startCoordinates!}/>
            )}
            {editingEndCoords && endCoordinates && (
                <AlertMarketPositionComponent position={endCoordinates!}/>
            )}
            <div ref={containerRef} className="w-full">
                <Stage width={stageSize.width} height={stageSize.height} onClick={getCoords}>
                    <Layer>
                        <Image
                            image={img ?? undefined}
                            width={stageSize.width}
                            height={stageSize.height}
                        />
                        {startCoordinates && (
                            <Circle
                                x={startCoordinates.x}
                                y={startCoordinates.y}
                                radius={16}
                                fill="white"
                                stroke="black"
                                strokeWidth={2}
                            />
                        )}
                        {endCoordinates && (
                            <Circle
                                x={endCoordinates.x}
                                y={endCoordinates.y}
                                radius={16}
                                fill="green"
                                stroke="black"
                                strokeWidth={2}
                            />
                        )}
                        {startCoordinates && endCoordinates && (
                            <Line
                                points={[startCoordinates.x, startCoordinates.y, endCoordinates.x, endCoordinates.y]}
                                stroke="purple"
                                strokeWidth={4}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    )

}
