import {Circle, Image, Layer, Line, Stage} from "react-konva";
import React, {useEffect, useRef, useState} from "react";
import {MarkerMap} from "@/components/MarkerMap";

export default function MapLayoutFrontend({mapImage, endCoordinates, startCoordinates}) {
    const [activeCircles, setActiveCircles] = useState([]);
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

    function handleClickEndCoords(endCoor) {
        return () => {
            const matchingStarts = startCoordinates.filter(
                (s) => s.end_utility_id === endCoor.end_utility_id
            );

            const circles = matchingStarts.map((start) => ({
                start,
                end: endCoor,
            }));

            setActiveCircles(circles);
        };
    }

    function handleOutsideClick(event: React.MouseEvent<MouseEvent>) {
        const clickedOutside = event.target.className === "Image"
        if (clickedOutside) {
            setActiveCircles([]);
        }
    }

    return (
        <div ref={containerRef} className="w-full">
            <Stage width={stageSize.width} height={stageSize.height} onClick={handleOutsideClick}>
                <Layer>
                    <Image
                        className="Image"
                        image={img ?? undefined}
                        width={stageSize.width}
                        height={stageSize.height}
                    />
                    {endCoordinates && endCoordinates.map((coor, index) => (
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
                        // <Circle
                        //     key={`start-${index}`}
                        //     x={Number(line.start.x)}
                        //     y={Number(line.start.y)}
                        //     radius={16}
                        //     fill="white"
                        //     stroke="black"
                        //     strokeWidth={2}
                        // />
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
    )
}
