import React, {useState} from "react";
import {useQueryApi} from "@/hooks/use-query";
import FrontendHeader from "@/components/layout/FrontendHeader";
import HomeSidebar from "@/components/sidebar/HomeSidebar";
import {LayoutResponse} from "@/types/map";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";

export default function FrontendLayout({children}: any) {
    const [showSearchDialog, setShowSearchDialog] = useState(false);

    const {data: info} = useQueryApi<LayoutResponse>({
        queryKey: ['layoutOverview'],
        url: "/layoutOverview",
        method: "GET"
    })

    return (
        <div>
            <FrontendNavbar/>
            <div className="mx-auto w-full max-w-[1900px] flex-1 px-6 py-10">
                <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
                    <aside className="hidden lg:block">
                        <div className="sticky">
                            <HomeSidebar maps={info?.maps} nadeTypes={info?.utilities}/>
                        </div>
                    </aside>

                    <main>
                        <FrontendHeader info={info} setShowSearchDialog={setShowSearchDialog}
                                        showSearchDialog={showSearchDialog}/>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
