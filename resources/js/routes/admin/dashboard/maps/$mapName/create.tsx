import {createFileRoute} from '@tanstack/react-router'
import AdminLayout from "@/layouts/AdminLayout";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useQueryApi} from "@/hooks/use-query";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MapLayoutBackend from "@/components/MapLayoutBackend";

export const Route = createFileRoute('/admin/dashboard/maps/$mapName/create')({
    component: RouteComponent,
})

type Nade = {
    id: string,
    name: string,
    image: string,
}

type Map = {
    id: string,
    name: string,
    image: string,
    map_no_callouts: string,
    map_callouts: string,
}

type Teams= {
    id: string,
    name: string,
    image: string,
}

function RouteComponent() {
    const {mapName} = Route.useParams()

    const {data: nades} = useQueryApi<{ data: Nade[] }>({
        queryKey: ['nades'],
        method: 'GET',
        url: '/getNades',
    })

    const {data: map} = useQueryApi<{data: Map}>({
        queryKey: ['map'],
        method: 'GET',
        url: `/getMap/${mapName}` ,
    })

    const {data: teams} = useQueryApi<{data: Teams[]}>({
        queryKey: ['teams'],
        method: 'GET',
        url: '/getTeams',
    })

    return(
        <AdminLayout>
            <Label htmlFor="name" className="">Name</Label>
            <Input name="name" id="name"/>

            <Label htmlFor="nade" className="">Nade Type</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a nade"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Nades</SelectLabel>
                        {nades?.data?.map((nade: Nade) => (
                            <SelectItem key={nade.id} value={nade.id}>{nade.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label htmlFor="nade" className="">Team</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a team"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Team</SelectLabel>
                        {teams?.data?.map((team: Teams) => (
                            <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label htmlFor="technique" className="">Technique</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a technique"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Technique</SelectLabel>
                        <SelectItem value="left-click">Left Click</SelectItem>
                        <SelectItem value="right-click">Right Click</SelectItem>
                        <SelectItem value="left-right-click">Left + Right Click</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label htmlFor="movement" className="">Movement</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a movement"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Movement</SelectLabel>
                        <SelectItem value="stationary">Stationary</SelectItem>
                        <SelectItem value="walking">Walking</SelectItem>
                        <SelectItem value="jumping">Jumping</SelectItem>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="crouching">Crouching</SelectItem>
                        <SelectItem value="crouched-walking">Crouched Walking</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label htmlFor="title-from" className="">From</Label>
            <Input name="title-from" type="text" id="title-from"/>

            <Label htmlFor="title-to" className="">To</Label>
            <Input name="title-to" type="text" id="title-to"/>

            <Label htmlFor="start-coords" className="">Start Coords</Label>
            <Input name="start-coords" type="number" id="start-coords"/>

            <Label htmlFor="existing-start-coords" className="">Existing Start Coords</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an existing coords"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Existing Start Coords</SelectLabel>
                        <SelectItem value="existing-start-coords">Existing Coords</SelectItem>
                        <SelectItem value="walking">812 Window</SelectItem>
                        <SelectItem value="jumping">105 Ticket</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label htmlFor="existing-end-coords" className="">Existing End Coords</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an existing end coords"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Existing End Coords</SelectLabel>
                        <SelectItem value="existing-end-coords">Existing Coords</SelectItem>
                        <SelectItem value="walking">812 Window</SelectItem>
                        <SelectItem value="jumping">105 Ticket</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Label htmlFor="end-coords" className="">End Coords</Label>
            <Input name="end-coords" type="number" id="end-coords"/>

            <Label htmlFor="image-lineup" className="">Image Lineup</Label>
            <Input name="image-lineup" type="file" id="image-lineup" accept="image/*" multiple/>

            <Label htmlFor="video-lineup" className="">Video Lineup</Label>
            <Input name="video-lineup" type="file" id="video-lineup" accept="video/*" multiple/>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Get maps coordinates</AccordionTrigger>
                    <AccordionContent>
                        <MapLayoutBackend mapImage={map?.data?.map_no_callouts}/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </AdminLayout>
    )
}
