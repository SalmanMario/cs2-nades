import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Clock,
    CrosshairIcon,
    LightbulbIcon,
    MinusIcon,
    Pencil,
    PlusIcon,
    RotateCwIcon,
    Footprints,
    ArrowLeft,
    Keyboard
} from "lucide-react";
import {firstToUpperCase, formatDate} from "@/hooks/helper";
import FrontendNavbarComponent from "@/components/navbar/FrontendNavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import {SimilarUtilityResponse, SingleUtilityResponse} from "@/types/utility";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export const Route = createFileRoute('/maps/$mapName/$utilityId/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName, utilityId} = Route.useParams();
    const [showVideo, setShowVideo] = useState(true);
    const [scale, setScale] = useState(1);
    const [position] = useState({x: 0, y: 0});
    const [crosshairGap, setCrosshairGap] = useState(7);
    const [lineThickness, setlineThickness] = useState(5);
    const [showCrosshair, setShowCrosshair] = useState(false);
    const navigate = useNavigate();
    const lineWidth = 680;
    const lineHeight = 400;

    const {data: utility, isLoading} = useQueryApi<SingleUtilityResponse>({
        queryKey: ['utility', utilityId],
        method: 'GET',
        url: `/getUtility/${mapName}/${utilityId}`,
    })

    const {data: getSimilarUtilities} = useQueryApi<SimilarUtilityResponse[]>({
        queryKey: ['getSimilarUtilitiesByCoords', String(utility?.mapId), utilityId],
        method: 'POST',
        url: `/getSimilarUtilitiesByCoords/${utility?.mapId}`,
        body: {
            coords: utility?.coords,
            utilityId: utilityId
        },
        enabled: !!utility,
    })

    if (isLoading) return <div>Loading...</div>;

    const handleZoomIn = () => {
        setScale(scale + 0.5)
    }

    const handleZoomOut = () => {
        if (scale > 1) {
            setScale(scale - 0.5)
        }
    }

    const resetZoom = () => {
        setScale(1)
    }

    const handleCrosshair = () => {
        setShowCrosshair(!showCrosshair);
    }

    const handleGoBack = () => {
        navigate({
            to: "/maps/$mapName",
            params: {
                mapName
            }
        }).then()
    }

    const goToUtility = ($utilityId: string) => {
        navigate({
            to: "/maps/$mapName/$utilityId",
            params:{
                mapName: mapName,
                utilityId: $utilityId
            }
        }).then()
    }

    const toggleVideo = () => setShowVideo(!showVideo);
    return (
        <div className="flex flex-col min-h-screen">
            <FrontendNavbarComponent/>
            <div className="mx-10 flex-1">
                <div className="flex items-center mb-6">
                    <span onClick={handleGoBack} className="cursor-pointer flex items-center gap-2 me-3">
                        <ArrowLeft/>
                        <span className="text-3xl">{firstToUpperCase(mapName)} {utility.type}: </span>
                    </span>
                    <h1 className="text-3xl">{utility.title}</h1>
                </div>
                <div className="grid grid-cols-12 gap-5 items-start">
                    <div className="col-span-9">
                        <div className="aspect-video w-full">
                            {showVideo ? (
                                <video className="h-full w-full" src={utility.video?.path} controls/>
                            ) : (
                                <div className="overflow-hidden flex items-center justify-center cursor-grab">
                                    <Carousel>
                                        <CarouselContent>
                                            {Object.entries(utility.image).map(([key, value]: [string, any]) => (
                                                <CarouselItem
                                                    className="relative flex items-center justify-center overflow-hidden"
                                                    key={key}>
                                                    <img
                                                        src={value?.path}
                                                        alt={value.title}
                                                        style={{
                                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                                            transformOrigin: 'center center',
                                                            transition: 'transform 0.2s ease',
                                                        }}
                                                    />

                                                    {showCrosshair && (
                                                        <>
                                                            {/*Horizontal*/}
                                                            <div className="absolute bg-white" style={{
                                                                width: lineWidth,
                                                                height: lineThickness,
                                                                top: `calc(50% - ${lineThickness / 2}px)`,
                                                                left: `calc(50% - ${crosshairGap + lineWidth}px)`,
                                                            }}/>
                                                            <div className="absolute bg-white" style={{
                                                                width: lineWidth,
                                                                height: lineThickness,
                                                                top: `calc(50% - ${lineThickness / 2}px)`,
                                                                left: `calc(50% + ${crosshairGap}px)`
                                                            }}/>
                                                            {/*Vertical*/}
                                                            <div className="absolute bg-white" style={{
                                                                height: lineHeight,
                                                                width: lineThickness,
                                                                left: `calc(50% - ${lineThickness / 2}px)`,
                                                                top: `calc(50% - ${crosshairGap + lineHeight}px)`
                                                            }}/>
                                                            <div className="absolute bg-white" style={{
                                                                height: lineHeight,
                                                                width: lineThickness,
                                                                left: `calc(50% - ${lineThickness / 2}px)`,
                                                                top: `calc(50% + ${crosshairGap}px)`
                                                            }}/>
                                                        </>
                                                    )}
                                                    <div
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                                                        <Button variant="default" intent="white"
                                                                onClick={handleZoomIn}>
                                                            <PlusIcon fontSize="small"/>
                                                        </Button>
                                                        <Button variant="default" intent="white"
                                                                onClick={handleZoomOut}>
                                                            <MinusIcon fontSize="small"/>
                                                        </Button>
                                                        <Button variant="default" intent="white"
                                                                onClick={resetZoom}>
                                                            <RotateCwIcon fontSize="small"/>
                                                        </Button>
                                                        <Button variant="default" intent="white"
                                                                onClick={handleCrosshair}>
                                                            <CrosshairIcon fontSize="small"/>
                                                        </Button>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        {showCrosshair && (
                                            <div
                                                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 px-4 py-2 rounded-lg">
                                                <span className="text-white text-sm">Gap</span>
                                                <input
                                                    type="range" min={0} max={60} value={crosshairGap}
                                                    onChange={(e) => setCrosshairGap(Number(e.target.value))}
                                                    className="w-32"
                                                />
                                                <span className="text-white text-sm w-6">{crosshairGap}</span>
                                            </div>
                                        )}

                                        {showCrosshair && (
                                            <div
                                                className="absolute bottom-15 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 px-4 py-2 rounded-lg">
                                                <span className="text-white text-sm">Line Thickness</span>
                                                <input
                                                    type="range" min={1} step={2} max={15} value={lineThickness}
                                                    onChange={(e) => setlineThickness(Number(e.target.value))}
                                                    className="w-32"
                                                />
                                                <span className="text-white text-sm w-6">{lineThickness}</span>
                                            </div>
                                        )}
                                    </Carousel>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-3">
                        <Button variant="outline" intent="success" onClick={toggleVideo} className="mb-6">
                            {showVideo ? "Show Lineup" : "Show Video"}
                        </Button>

                        <div className="my-4">
                            <p className="mb-2">Team:</p>
                            <span className="flex items-center gap-2 ms-3">
                         <img src={utility.team_image} className="w-8 h-8"/>
                                {utility.team_type === "T" ? "Terrorist" : "Counter-Terrorist"}
                    </span>
                        </div>
                        <div className="my-4">
                            <p className="mb-2">Technique:</p>
                            <div className="flex items-center gap-2 ms-3">
                                <LightbulbIcon/>
                                <span>{utility.technique}</span>
                            </div>
                        </div>
                        <div className="my-4">
                            <p className="mb-2">Movement:</p>
                            <div className="flex items-center gap-2 ms-3">
                                <Footprints/>
                                <span>{utility.movement}</span>
                            </div>
                        </div>
                        {utility?.key && <div className="my-4">
                            <p className="mb-2">Key:</p>
                            <div className="flex items-center gap-2 ms-3">
                                <Keyboard />
                                <span>{utility.key}</span>
                            </div>
                        </div>}
                        <div className="my-4">
                            <p className="mb-2">Created at:</p>
                            <div className="flex items-center gap-2 ms-3">
                                <Clock/>
                                <span>{formatDate(utility.created_at)}</span>
                            </div>
                        </div>
                        <div className="my-4">
                            <p className="mb-2">Updated at:</p>
                            <div className="flex items-center gap-2 ms-3">
                                <Pencil/>
                                <span>{formatDate(utility.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-10">
                <h1 className="text-3xl mb-6">Explore Utilities</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {getSimilarUtilities && (
                        getSimilarUtilities.map((utility) => (
                            <Card
                                key={utility.id}
                                className={`relative mx-auto w-full max-w-lg border-2 pt-0 px-0 cursor-pointer ${
                                    utility.team === 'CT' ? 'border-blue-500' : 'border-orange-500'
                                }`}
                                onClick={() => goToUtility(String(utility.id))}
                            >
                                <CardHeader>
                                    <CardTitle>{utility.grenade_name}</CardTitle>
                                </CardHeader>
                                <div className="absolute inset-0 z-30 aspect-video "/>
                                <img
                                    src={utility.attachments[0]?.path}
                                    className="relative z-20 aspect-video w-full object-cover"
                                />
                                <CardFooter className="flex items-center px-2 py-4 justify-between">
                                    <span className="flex items-center gap-2">
                                        <img className={'w-10'}
                                             src={utility?.map_image}
                                             alt={'test'}
                                        />
                                        <p>{utility?.map_name}</p>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <p>{utility.utility_name}</p>
                                         <img className={'w-10'}
                                              src={utility?.team_image}
                                              alt={'test'}
                                         />
                                    </span>
                                </CardFooter>
                            </Card>
                        )))}
                </div>
            </div>
            <FooterComponent/>
        </div>
    )
}

