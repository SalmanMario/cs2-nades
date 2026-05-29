import {createFileRoute} from '@tanstack/react-router'
import {useQueryApi} from "@/hooks/use-query";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Clock, Pencil} from "lucide-react";
import {formatDate} from "@/hooks/helper";
import FrontendNavbarComponent from "@/components/navbar/FrontendNavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import {SingleUtilityResponse} from "@/types/utility";

export const Route = createFileRoute('/maps/$mapName/$utilityId/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {mapName, utilityId} = Route.useParams();
    const [showVideo, setShowVideo] = useState(true);

    const {data: utility, isLoading} = useQueryApi<SingleUtilityResponse>({
        queryKey: ['utility', utilityId],
        method: 'GET',
        url: `/getUtility/${mapName}/${utilityId}`,
    })
    if (isLoading) return <div>Loading...</div>;

    const toggleVideo = () => setShowVideo(!showVideo);
    return (
        <div className="flex flex-col min-h-screen">
            <FrontendNavbarComponent/>
            <div className="m-10 flex-1">
                <h1 className="text-3xl mb-6">{mapName} {utility.type}: {utility.title}</h1>
                <div className="grid grid-cols-3 gap-5 items-start">
                    <div className="col-span-2">
                        <div className="relative">
                            {showVideo ? (
                                <video className="h-100 w-full" src={"/" + utility.video.path} controls/>
                            ) : (
                                <h1>TODO IMG</h1>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
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
                            <p className="ms-3">{utility.technique}</p>
                        </div>
                        <div className="my-4">
                            <p className="mb-2">Movement:</p>
                            <p className="ms-3">{utility.movement}</p>
                        </div>
                        {utility?.key && <div className="my-4">
                            <p className="mb-2">Key:</p>
                            <p className="ms-3">{utility.key}</p>
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
                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="border-orange-500 border h-50"></div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="border-orange-500 border h-50"></div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="border-orange-500 border h-50"></div>
                    </div>
                </div>
            </div>
            <FooterComponent/>
        </div>
    )
}

