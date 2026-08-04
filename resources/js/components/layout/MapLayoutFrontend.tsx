import {Image, Layer, Line, Stage} from "react-konva";
import React, {useEffect, useRef, useState} from "react";
import Konva from "konva";
import {MarkerMap} from "@/components/marker/MarkerMap";
import {UtilityCoordinates} from "@/routes/maps/$mapName";
import AnimatedCircle from "@/components/animated/AnimatedCircle";
import {Legend} from "recharts";

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

        const imgAspect = imgAspectRef.current;
        const { offsetWidth } = containerRef.current;

        const w = offsetWidth;
        const h = w * imgAspect;

        setStageSize({
            width: w,
            height: h,
        });

        setScale(w / COORD_SPACE);
    }

    useEffect(() => {
        if (!mapImage) return;
        const image = new window.Image();
        image.src = mapImage;
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
        <div className="relative">

            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />

            {/* Legend */}
            <div
                className=" absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-6 py-3 backdrop-blur-xl"
            >
                <Legend color="bg-blue-500" text="Landing" />
                <Legend color="bg-orange-400" text="Throw" />
            </div>

            {/* Map */}

            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-3xl border border-zinc-800 bg-[#111318]"
                style={{ aspectRatio: `1 / ${imgAspectRef.current}` }}
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

                        {endCoordinates?.map((coords, index) => (
                            <AnimatedCircle
                                key={coords.end_utility_id}
                                coords={coords}
                                index={index}
                                handleClickEndCoords={handleClickEndCoords(coords)}
                                isHidden={
                                    activeEndId !== null &&
                                    coords.end_utility_id !== activeEndId
                                }
                            />
                        ))}

                        {activeCircles.map((props, index) => (
                            <MarkerMap
                                props={props}
                                key={index}
                            />
                        ))}

                        {activeCircles.map((line, index) => (
                            <Line
                                key={index}
                                points={[
                                    line.start.x,
                                    line.start.y,
                                    line.end.x,
                                    line.end.y,
                                ]}
                                stroke="#f97316"
                                strokeWidth={5}
                                shadowColor="#f97316"
                                shadowBlur={15}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}
