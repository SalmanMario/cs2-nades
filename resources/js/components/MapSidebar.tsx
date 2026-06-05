import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarProvider
} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {useQueryApi} from "@/hooks/use-query";
import {UtilityType} from "@/types/utility";
import {BoxesIcon} from "lucide-react";
import {Route} from "@/routes";
import {use} from "react";
import {useNavigate} from "@tanstack/react-router";

export default function MapSidebar({onGrenadeTypeChange, onTeamTypeChange, grenadeType, teamType}: {
    onGrenadeTypeChange: (type: string) => void,
    onTeamTypeChange: (type: number) => void
    grenadeType: string,
    teamType: number,
}) {
    const navigate = useNavigate();

    const {data: utilities} = useQueryApi<{ data: UtilityType[] }>({
        queryKey: ['utilities'],
        method: 'GET',
        url: `/getNades`,
    })

    const {data: teams} = useQueryApi<{ data: Team[] }>({
        queryKey: ['teams'],
        method: 'GET',
        url: `/getTeams`,
    })

    const {data : maps} = useQueryApi<{data: MapResponse[]}>({
        queryKey: ['maps'],
        method: 'GET',
        url: `/getMaps`,
    })

    return (
        <div>
            <SidebarProvider>
                <Sidebar className="sidebar-custom">
                    <SidebarHeader className="text-2xl text-center font-bold mb-10">
                        Dust 2
                    </SidebarHeader>
                    <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xl mb-5">Nades</SidebarGroupLabel>
                        <div className="flex flex-col gap-8">
                            {utilities?.data.map((utility) => (
                                <Button key={utility.id} variant="default" intent="grey"
                                        className={[grenadeType === utility.name ? "bg-gray-200 text-black" : "", "mx-3 justify-start"]}
                                        onClick={() => onGrenadeTypeChange(utility.name)}>
                                    <img src={`/storage/${utility.image}`} alt={utility.name} className="w-7 h-7 mr-3"/>
                                        {utility.name}
                                </Button>
                            ))}
                            <Button variant="default" intent="grey"
                                    className={[grenadeType === "ANY" ? "bg-gray-200 text-black" : "", "mb-5 mx-3 justify-start"]}
                                    onClick={() => onGrenadeTypeChange("ANY")}>
                                <BoxesIcon className="mr-3"/>
                                {"ANY"}
                            </Button>
                        </div>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xl mb-5">Teams</SidebarGroupLabel>
                        <div className="flex flex-row justify-center gap-5">
                            {teams?.data.map((team) => (
                                <Button key={team.id} variant="default" intent="grey"
                                        className={teamType === Number(team.id) ? "bg-gray-200 text-black" : ""}
                                        onClick={() => onTeamTypeChange(Number(team.id))}>
                                    <img src={`/storage/${team.image}`} alt={team.name} className="w-7 h-7 mr-2"/>
                                    {team.name}
                                </Button>
                            ))}
                        </div>
                    </SidebarGroup>
                    <SidebarGroup className="mt-5 mb-10">
                        <SidebarGroupLabel className="text-xl mb-5">Maps</SidebarGroupLabel>
                        <div className="flex flex-col justify-center gap-5">
                            {maps?.data.map((map) => (
                                <Button key={map.id} variant="default" intent="grey" className="mx-3 justify-start"
                                        onClick={() => navigate({
                                            to: "/maps/$mapName",
                                            params:{
                                                mapName: map.name.toLowerCase()
                                            }
                                        })}>
                                    <img src={`/storage/${map.image}`} alt={map.name} className="w-7 h-7 mr-2"/>
                                    {map.name}
                                </Button>
                            ))}
                        </div>
                    </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
        </div>
    )
}
