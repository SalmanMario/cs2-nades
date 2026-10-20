import React from "react";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";
import Footer from "@/components/footer/Footer";
import StatCard from "@/components/card/StatCard";

type Props = {
    children: React.ReactNode;
    info: any;
    sidebar: React.ReactNode;
    rightPanel?: React.ReactNode;
};

export default function MapViewLayout({children, info, sidebar, rightPanel}: Props) {
    return (
        <div className="min-h-screen bg-[#0d0f14] flex flex-col">

            <FrontendNavbar />

            <div className="flex-1">

                <div className="mx-auto max-w-[1920px] px-4 py-6 md:px-8 md:py-8">

                    {/* phones: map first, then the selected lineup, then the filters */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_360px]">

                        {/* LEFT */}

                        <aside className="order-3 lg:order-1">
                            <div className="lg:sticky lg:top-24">
                                {sidebar}
                            </div>
                        </aside>

                        {/* CENTER */}

                        <section className="order-1 min-w-0 lg:order-2">

                            {/* HEADER CARD */}

                            <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 md:p-8">

                                <div className="flex items-center gap-5">

                                    {info?.map?.image && (
                                        <img
                                            src={info.map.image}
                                            className="h-14 w-14 object-contain md:h-20 md:w-20"
                                        />
                                    )}

                                    <div>

                                        <h1 className="text-3xl font-bold text-white md:text-5xl">
                                            {info?.map?.name}
                                        </h1>

                                        <p className="mt-2 text-zinc-400">
                                            Master every lineup on {info?.map?.name}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-3 md:gap-4 2xl:grid-cols-5">

                                    <StatCard
                                        label="Total"
                                        value={info?.utilityCoordinates?.length}
                                    />

                                    {info?.utilities?.nades?.map((nade: any) => (
                                        <StatCard
                                            key={nade.id}
                                            label={nade.name}
                                            value={nade.count}
                                            image={nade.image}
                                        />
                                    ))}

                                </div>

                            </div>

                            {/* MAP CARD */}

                            <div className="overflow-hidden
                                rounded-3xl
                                border
                                border-zinc-800
                                bg-zinc-900">
                                {children}
                            </div>
                        </section>

                        {/* RIGHT (below the map until xl) */}

                        <aside className="order-2 lg:order-3 lg:col-span-2 xl:col-span-1">

                            <div className="xl:sticky xl:top-24">

                                {rightPanel}

                            </div>

                        </aside>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}
