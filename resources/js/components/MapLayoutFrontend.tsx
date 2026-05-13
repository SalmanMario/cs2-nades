import {Circle, Image, Layer, Line, Stage} from "react-konva";
import React, {useEffect, useRef, useState} from "react";
import {MarkerMap} from "@/components/MarkerMap";

const COORD_SPACE = 1024;

export default function MapLayoutFrontend({mapImage, endCoordinates, startCoordinates}) {
    const [activeCircles, setActiveCircles] = useState([]);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({width: COORD_SPACE, height: COORD_SPACE});
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgAspectRef = useRef(1); // naturalHeight / naturalWidth
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

    function handleClickEndCoords(endCoor) {
        return () => {
            const matchingStarts = startCoordinates.filter(
                (s) => s.end_utility_id === endCoor.end_utility_id
            );
            setActiveCircles(matchingStarts.map((start) => ({ start, end: endCoor })));
        };
    }

    function handleOutsideClick(event: React.MouseEvent<MouseEvent>) {
        if (event.target.className === "Image") {
            setActiveCircles([]);
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
                        className="Image"
                        image={img ?? undefined}
                        width={COORD_SPACE}
                        height={COORD_SPACE * imgAspectRef.current}
                    />
                    {endCoordinates?.map((coor, index) => (
                        <Circle
                            key={index}
                            x={coor.x}
                            y={coor.y}
                            radius={16}
                            fill={coor.team_id === 1 ? "orange" : "blue"}
                            stroke="black"
                            strokeWidth={2}
                            onClick={handleClickEndCoords(coor)}
                        />
                    ))}
                    {activeCircles.map((line, index) => (
                        <MarkerMap props={line} key={index}/>
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
