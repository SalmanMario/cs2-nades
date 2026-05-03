import dust2NoCallouts from "../../../database/seeders/images/maps-callouts-img/dust2_no_callouts.png";
import React, {useState, useEffect} from "react";
import {Sidebar, SidebarGroup, SidebarHeader, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import AlertMarketPositionComponent from "@/components/AlertMarketPositionComponent";
import "../../css/app.css"
import {Image, Layer, Stage} from "react-konva";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

export default function MapLayout() {
    const [alertPosition, setAlertPosition] = useState<{ x: number; y: number } | null>(null);
    const [toggleCallouts, setToggleCallouts] = useState(false);
    const [toggleSmoke, setToggleSmoke] = useState(true);
    const [toggleHEGrenade, setToggleHEGrenade] = useState(true);
    const [toggleIncendiary, setToggleIncendiary] = useState(true);
    const [toggleFlashbang, setToggleFlashbang] = useState(true);
    const [heIcon, setHeIcon] = useState<HTMLImageElement | null>(null);
    const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
    const [mapImageCallouts, setMapImageCallouts] = useState<HTMLImageElement | null>(null);

    // useEffect(() => {
    //     const img = new window.Image();
    //     img.src = dust2Callouts;
    //     img.onload = () => setMapImage(img);
    // }, []);

    useEffect(() => {
        const img = new window.Image();
        img.src = dust2NoCallouts;
        img.onload = () => setMapImageCallouts(img);
    }, []);

    // useEffect(() => {
    //     const img = new window.Image();
    //     img.src = he_grenade;
    //     img.onload = () => setHeIcon(img);
    // }, []);

    const getCoords = (e : KonvaEventObject<MouseEvent>) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) {
            setAlertPosition({x: pos.x, y: pos.y});
        }
    }

    return (
        <div>
            <SidebarProvider>
                <Sidebar className="sidebar-custom">
                    <SidebarHeader className="text-2xl text-center font-bold mb-10">
                        Dust 2
                    </SidebarHeader>
                    <SidebarGroup>
                        <Button className="mb-5" type="button" variant="outline" intent="info"
                                onClick={() => setToggleCallouts(prev => !prev)}>
                            {toggleCallouts ? "Hide Callouts" : "Show Callouts"}
                        </Button>
                        <Button className="mb-5" type="button" variant="outline" intent="danger"
                                onClick={() => setToggleSmoke(prev => !prev)}>
                            {toggleSmoke ? "Hide Smoke" : "Show Smoke"}
                        </Button>
                        <Button className="mb-5" type="button" variant="outline" intent="danger"
                                onClick={() => setToggleFlashbang(prev => !prev)}>
                            {toggleFlashbang ? "Hide Flashbang" : "Show Flashbang"}
                        </Button>
                        <Button className="mb-5" type="button" variant="outline" intent="danger"
                                onClick={() => setToggleIncendiary(prev => !prev)}>
                            {toggleIncendiary ? "Hide Incendiary" : "Show Incendiary"}
                        </Button>
                        <Button className="mb-5" type="button" variant="outline" intent="danger"
                                onClick={() => setToggleHEGrenade(prev => !prev)}>
                            {toggleHEGrenade ? "Hide HE Grenade" : "Show HE Grenade"}
                        </Button>
                    </SidebarGroup>
                </Sidebar>
                {alertPosition && (
                    <AlertMarketPositionComponent position={alertPosition}/>
                )}
                <div className="mx-auto">
                    <Stage width={1024} height={1024} onClick={getCoords}>
                        <Layer>
                            {(toggleCallouts ? mapImageCallouts : mapImage) && (
                                <Image
                                    image={toggleCallouts ? mapImageCallouts! : mapImage!}
                                    width={1024}
                                    height={1024}
                                />
                            )}

                            <Image
                                image={heIcon!}
                                x={260.5}
                                y={233}
                                width={50}
                                height={50}
                                offsetX={25}
                                offsetY={25}
                                visible={toggleHEGrenade}
                            />
                        </Layer>
                    </Stage>
                </div>
            </SidebarProvider>
        </div>
    )
}
