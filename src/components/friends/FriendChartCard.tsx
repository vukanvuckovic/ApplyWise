import React from "react";
import { Skeleton } from "../ui/skeleton";
import { ChartComponent } from "../ChartComponent";

interface FriendStats {
  name: string;
  profession: string;
  accepted: number;
  progressing: number;
  pending: number;
  rejected: number;
}

export const FriendChartSkeleton = () => (
  <div className="flex flex-col gap-4 p-4 custom-shadow rounded-xl bg-white">
    <div className="flex flex-row items-center gap-2">
      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
    <Skeleton className="h-36 w-36 rounded-full self-center" />
  </div>
);

const FriendChartCard = ({ stats }: { stats: FriendStats }) => {
  const hasApplications =
    stats.accepted > 0 ||
    stats.rejected > 0 ||
    stats.pending > 0 ||
    stats.progressing > 0;

  return (
    <div className="flex flex-col gap-3 custom-shadow card-hover bg-white rounded-xl p-3">
      <div className="flex flex-row items-center gap-2">
        <div className="h-[34px] aspect-square rounded-full flex justify-center items-center bg-blue-500 text-white text-sm font-medium flex-shrink-0">
          {stats.name[0].toUpperCase()}
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="leading-none text-sm">{stats.name}</h4>
          <span className="leading-none text-xs text-gray-400">
            {stats.profession}
          </span>
        </div>
      </div>
      {hasApplications ? (
        <ChartComponent
          accepted={stats.accepted}
          rejected={stats.rejected}
          pending={stats.pending}
          progressing={stats.progressing}
          friend
        />
      ) : (
        <p className="text-gray-400 text-sm text-center py-4">
          No applications yet.
        </p>
      )}
    </div>
  );
};

export default FriendChartCard;
