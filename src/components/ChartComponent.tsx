"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector, Cell, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartData {
  status: string;
  count: number;
  fill: string;
}

export function ChartComponent({
  pending,
  accepted,
  rejected,
  progressing,
  friend,
}: {
  pending: number;
  accepted: number;
  rejected: number;
  progressing: number;
  friend?: boolean;
}) {
  const desktopData: ChartData[] = [
    { status: "Pending", count: pending, fill: "#facc15" },
    { status: "Accepted", count: accepted, fill: "#4ade80" },
    { status: "Rejected", count: rejected, fill: "#f87171" },
    { status: "Progressing", count: progressing, fill: "#fb923c" },
  ];

  const total = pending + accepted + rejected + progressing;
  const id = "pie-interactive";
  const [activeStatus, setActiveStatus] = React.useState(desktopData[0].status);

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.status === activeStatus),
    [activeStatus]
  );
  const statuses = React.useMemo(
    () => desktopData.map((item) => item.status),
    []
  );

  return (
    <Card data-chart={id} className="flex flex-col shadow-none border-none pb-6">
      <CardHeader className="flex max-sm:flex-col max-sm:gap-3 flex-row items-center space-y-0 pb-0 px-5 pt-4 mb-4">
        <div className="flex max-sm:flex-row max-sm:w-full max-sm:justify-between max-sm:items-center flex-col gap-1">
          <h2 className={`leading-none ${friend ? "text-base" : ""}`}>
            {friend ? "Stats" : "My Chart"}
          </h2>
          <span className="text-gray-400 text-xs">{total} total</span>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5 shadow-none"
            aria-label="Select status"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {statuses.map((key) => (
              <SelectItem key={key} value={key} className="rounded-lg">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: desktopData.find((d) => d.status === key)?.fill,
                    }}
                  />
                  {key}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <PieChart width={friend ? 200 : 300} height={friend ? 200 : 300}>
          <Tooltip />
          <Pie
            data={desktopData}
            dataKey="count"
            nameKey="status"
            innerRadius={friend ? 40 : 52}
            outerRadius={friend ? 62 : 100}
            strokeWidth={4}
            activeIndex={activeIndex}
            activeShape={({ outerRadius = 0, ...props }) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 8} />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 22}
                  innerRadius={outerRadius + 10}
                />
              </g>
            )}
          >
            {desktopData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className={`fill-foreground ${
                          friend ? "text-2xl" : "text-3xl"
                        } font-bold`}
                      >
                        {desktopData[activeIndex].count.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className={`fill-muted-foreground ${
                          friend ? "text-[10px]" : "text-[14px]"
                        }`}
                      >
                        {activeStatus}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </CardContent>
    </Card>
  );
}
