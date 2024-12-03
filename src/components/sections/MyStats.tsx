"use client";
import React, { useContext, useEffect, useState } from "react";
import { ChartComponent } from "../ChartComponent";
import { getStats } from "@/appwrite/userActions";
import { Skeleton } from "../ui/skeleton";
import { GlobalUserContext } from "../UserContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface Stats {
  pending: number;
  accepted: number;
  rejected: number;
  progressing: number;
}

const ChartSkeleton = () => (
  <div className="h-[380px] flex flex-col gap-6 p-6">
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-14" />
      </div>
      <Skeleton className="h-7 w-28 rounded-lg" />
    </div>
    <Skeleton className="h-52 w-52 rounded-full self-center" />
  </div>
);

const MyStats = () => {
  const [stats, setStats] = useState<Stats | undefined>();

  const currentUser = useContext(GlobalUserContext);
  if (!currentUser) throw new Error("No user");

  const applications = useSelector(
    (state: RootState) => state.applications.applications
  );

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getStats(currentUser.$id);
      if (result) {
        setStats(result);
      }
    };
    if (applications) fetchStats();
  }, [applications]);

  const isEmpty =
    stats &&
    stats.accepted === 0 &&
    stats.rejected === 0 &&
    stats.pending === 0 &&
    stats.progressing === 0;

  return (
    <div className="rounded-xl custom-shadow bg-white">
      {!stats ? (
        <ChartSkeleton />
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-14 px-6 gap-2">
          <span className="text-gray-600 text-center font-medium">No data yet.</span>
          <span className="text-gray-400 text-center text-sm">
            Add your first application below to see your stats.
          </span>
        </div>
      ) : (
        <ChartComponent
          pending={stats.pending}
          accepted={stats.accepted}
          rejected={stats.rejected}
          progressing={stats.progressing}
        />
      )}
    </div>
  );
};

export default MyStats;
