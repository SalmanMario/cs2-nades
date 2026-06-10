import {Image, Layer, Line, Stage} from "react-konva";
import React, {useEffect, useRef, useState} from "react";
import Konva from "konva";
import {MarkerMap} from "@/components/MarkerMap";
import {UtilityCoordinates} from "@/routes/maps/$mapName";
import AnimatedCircle from "@/components/AnimatedCircle";

const COORD_SPACE = 1024;

type ActiveCircle = {
    start: UtilityCoordinates;
    end: UtilityCoordinates;
};

export default function MapLayoutFrontend({mapImage, endCoordinates, startCoordinates, teamType}: {mapImage: string, endCoordinates: UtilityCoordinates[], startCoordinates: UtilityCoordinates[], teamType: number}) {
    const [activeCircles, setActiveCircles] = useState<ActiveCircle[]>([]);
    const [activeEndId, setActiveEndId] = useState<number | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({width: COORD_SPACE, height: COORD_SPACE});
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgAspectRef = useRef(1);
    function fitStage() {
        if (!containerRef.current) return;
        const { offsetWidth: maxW, offsetHeight: maxH } = containerRef.current;
        const imgAspect = imgAspectRef.current;

        let w = maxW;
        let h = maxW * imgAspect;

        if (h > maxH) {
            h = maxH;
            w = maxH / imgAspect;
        }
        const s = w / COORD_SPACE;

        setStageSize({ width: w, height: h });
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

    useEffect(() => {
        setActiveCircles([]);
        setActiveEndId(null);
    }, [endCoordinates, teamType]);

    function handleClickEndCoords(endCoor: UtilityCoordinates) {
        return () => {
            const matchingStarts = startCoordinates.filter(
                (s) => s.end_utility_id === endCoor.end_utility_id
            );
            setActiveEndId(endCoor.end_utility_id);
            setActiveCircles(matchingStarts.map((start: UtilityCoordinates) => ({ start, end: endCoor })));
        };
    }

    function handleOutsideClick(event: Konva.KonvaEventObject<MouseEvent>) {
        if (event.target.className === "Image") {
            setActiveCircles([]);
            setActiveEndId(null);
        }
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
        >
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleOutsideClick}
                scaleX={scale}
                scaleY={scale}
            >
                <Layer>
                    <Image
                        image={img ?? undefined}
                        width={COORD_SPACE}
                        height={COORD_SPACE * imgAspectRef.current}
                    />
                    {endCoordinates?.map((coords, index: number) => (
                        <AnimatedCircle coords={coords} index={index} handleClickEndCoords={handleClickEndCoords(coords)}
                                        isHidden={activeEndId !== null && coords.end_utility_id !== activeEndId}
                        />
                    ))}
                    {activeCircles.map((props, index) => (
                        <MarkerMap props={props} key={index}/>
                    ))}
                    {activeCircles.map((line, index) => (
                        <Line
                            key={`line-${index}`}
                            points={[line.start.x, line.start.y, line.end.x, line.end.y]}
                            stroke="purple"
                            strokeWidth={4}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}
