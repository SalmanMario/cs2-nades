import AlertMarketPositionComponent from "@/components/AlertMarketPositionComponent";
import {Image, Layer, Stage, Circle, Line} from "react-konva";
import React, {useState, useEffect, useRef} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

type MapLayoutBackendProps = {
    mapImage: string,
    editingStartingCoords: boolean,
    editingEndCoords: boolean,
    startCoordinates?: { x: number, y: number },
    endCoordinates?: { x: number, y: number },
    onStartCoordsChange?: (coords: { x: number, y: number }) => void,
    onEndCoordsChange?: (coords: { x: number, y: number }) => void,
}

const COORD_SPACE = 1024;
export default function MapLayoutBackend({
                                             mapImage,
                                             editingStartingCoords,
                                             editingEndCoords,
                                             startCoordinates,
                                             endCoordinates,
                                             onStartCoordsChange,
                                             onEndCoordsChange
                                         }: MapLayoutBackendProps) {
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({width: 1024, height: 1024});
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgAspectRef = useRef(1); // naturalHeight / naturalWidth

    function fitStage() {
        if (!containerRef.current) return;
        const {offsetWidth: maxW, offsetHeight: maxH} = containerRef.current;
        const imgAspect = imgAspectRef.current;

        let w = maxW;
        let h = maxW * imgAspect;

        if (h > maxH) {
            h = maxH;
            w = maxH / imgAspect;
        }
        const s = w / COORD_SPACE;

        setStageSize({width: w, height: h});
        setScale(s);
    }

    useEffect(() => {
        if (!mapImage) return;
        const image = new window.Image();
        image.src = `/storage/${mapImage}`;
        image.onload = () => {
            setImg(image);
            imgAspectRef.current = image.naturalHeight / image.naturalWidth;
            fitStage();
        };
    }, [mapImage]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(() => fitStage());
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const getCoords = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;
        if (!editingStartingCoords && !editingEndCoords) return;

        const x = pos.x / scale;
        const y = pos.y / scale;

        if (editingStartingCoords) {
            onStartCoordsChange?.({ x, y });
        }

        if (editingEndCoords) {
            onEndCoordsChange?.({ x, y });
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
            <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
                <Stage width={stageSize.width}
                       height={stageSize.height}
                       onClick={getCoords}
                       scaleX={scale}
                       scaleY={scale}
                >
                    <Layer>
                        <Image
                            image={img ?? undefined}
                            width={COORD_SPACE}
                            height={COORD_SPACE * imgAspectRef.current}
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
