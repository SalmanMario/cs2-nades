import AlertMarketPositionComponent from "@/components/AlertMarketPositionComponent";
import {Image, Layer, Stage} from "react-konva";
import React, {useState, useEffect, useRef} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

export default function MapLayoutBackend({mapImage} : {mapImage: string}) {
    const [alertPosition, setAlertPosition] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({ width: 1024, height: 1024 });
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
                setStageSize({ width, height: width * aspectRatioRef.current });
            }
        };
    }, [mapImage]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            const width = entries[0].contentRect.width;
            setStageSize({ width, height: width * aspectRatioRef.current });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const getCoords = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) {
            setAlertPosition({x: Math.round(pos.x), y: Math.round(pos.y)});
        }
    }

    return (
        <div>
            {alertPosition && (
                <AlertMarketPositionComponent position={alertPosition}/>
            )}
            <div ref={containerRef} className="w-full">
                <Stage width={stageSize.width} height={stageSize.height} onClick={getCoords}>
                    <Layer>
                        <Image
                            image={img ?? undefined}
                            width={stageSize.width}
                            height={stageSize.height}
                        />
                    </Layer>
                </Stage>
            </div>
        </div>
    )

}
