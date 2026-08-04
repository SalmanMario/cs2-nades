import {Pie, PieChart} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {UtilityStatsResponse} from "@/types/utility";

const chartConfig = {
    utilities: {
        label: "Utilities",
    },
    All: {
        label: "All",
        color: "#dadada",
    },
    Any: {
        label: "Any",
        color: "#639fd2",
    },
    T: {
        label: "T",
        color: "oklch(0.616 0.126 70.926)",
    },
    CT: {
        label: "CT",
        color: "oklch(0.495 0.211 263.741)",
    },
} satisfies ChartConfig

export function UtilityChart({utility}: { utility: UtilityStatsResponse }) {
    const chartData = [
        {browser: "All", utilities: utility?.total_utilities, fill: "var(--color-All)"},
        {browser: "Any", utilities: utility?.total_utilities_any, fill: "var(--color-Any)"},
        {browser: "T", utilities: utility?.total_utilities_t, fill: "var(--color-T)"},
        {browser: "CT", utilities: utility?.total_utilities_ct, fill: "var(--color-CT)"},
    ]
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl">Number of all Utilities created</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[450px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="utilities" hideLabel/>}
                        />
                        <Pie data={chartData} dataKey="utilities" label={({
                                                                              cx,
                                                                              cy,
                                                                              midAngle,
                                                                              innerRadius,
                                                                              outerRadius,
                                                                              value,
                                                                              index
                                                                          }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            const entry = chartData[index];

                            return (
                                <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
                                    <tspan x={x} dy="-0.5em" fontSize={22} fontWeight="bold">
                                        {chartConfig[entry.browser as keyof typeof chartConfig]?.label}
                                    </tspan>
                                    <tspan x={x} dy="1.4em" fontSize={16}>
                                        {value}
                                    </tspan>
                                </text>
                            );
                        }} labelLine={false}>
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing total utilities
                </div>
            </CardFooter>
        </Card>
    )
}
