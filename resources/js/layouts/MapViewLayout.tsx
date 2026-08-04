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

                <div className="mx-auto max-w-[1920px] px-8 py-8">

                    <div className="grid grid-cols-[320px_minmax(0,1fr)_360px] gap-6">

                        {/* LEFT */}

                        <aside>
                            <div className="sticky top-24">
                                {sidebar}
                            </div>
                        </aside>

                        {/* CENTER */}

                        <section className="min-w-0">

                            {/* HEADER CARD */}

                            <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

                                <div className="flex items-center gap-5">

                                    {info?.map?.image && (
                                        <img
                                            src={info.map.image}
                                            className="h-20 w-20 object-contain"
                                        />
                                    )}

                                    <div>

                                        <h1 className="text-5xl font-bold text-white">
                                            {info?.map?.name}
                                        </h1>

                                        <p className="mt-2 text-zinc-400">
                                            Master every lineup on {info?.map?.name}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">

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

                        {/* RIGHT */}

                        <aside>

                            <div className="sticky top-24">

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
