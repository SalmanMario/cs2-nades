import {createFileRoute, useNavigate} from '@tanstack/react-router'
import CardMap from "@/components/card/CardMap";
import React from "react";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import Footer from "@/components/footer/Footer";
import BackendSidebar from "@/components/sidebar/BackendSidebar";
import {useQueryApi} from "@/hooks/use-query";
import {MapsOverviewResponse} from "@/types/map";

export const Route = createFileRoute('/admin/_auth/dashboard/maps/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();

    const {data: overview, isLoading, error} = useQueryApi<MapsOverviewResponse>({
        queryKey: ["mapsOverview"],
        method: "GET",
        url: "/mapsOverview",
    });

    return (
        <div>
            <AdminNavbar/>
            <div className="flex min-h-screen">
                <BackendSidebar maps={overview?.maps}/>
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1900px] flex-1 px-6 py-10">
                        {isLoading && (
                            <div className="py-20 text-center text-zinc-400">
                                Loading maps...
                            </div>
                        )}
                        {error && (
                            <div className="py-20 text-center text-red-500">
                                Error: {error.message}
                            </div>
                        )}
                        {!isLoading && !error && (
                            <CardMap
                                maps={overview?.maps}
                                nadeCounts={overview?.nade_count}
                                onCardClick={(mapName) => navigate({
                                    to: "/admin/dashboard/maps/$mapName",
                                    params: {
                                        mapName
                                    }
                                })}
                            />
                        )}
                    </div>
                </main>
            </div>
            <Footer/>
        </div>
    )
}
