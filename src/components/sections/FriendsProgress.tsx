"use client";
import React, { useContext, useEffect, useState } from "react";
import { getFriends } from "@/appwrite/friendActions";
import { GlobalUserContext } from "../UserContext";
import { getStats } from "@/appwrite/userActions";
import FriendChartCard, {
  FriendChartSkeleton,
} from "../friends/FriendChartCard";

interface FriendStats {
  name: string;
  profession: string;
  accepted: number;
  rejected: number;
  progressing: number;
  pending: number;
}

const FriendsProgress = () => {
  const [friendsStats, setFriendsStats] = useState<FriendStats[] | undefined>();
  const [limit, setLimit] = useState(5);
  const [limitLoading, setLimitLoading] = useState(false);
  const [noMoreFriends, setNoMoreFriends] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const currentUser = useContext(GlobalUserContext);
  if (!currentUser) throw new Error("No user");

  useEffect(() => {
    const fetchFriendsStats = async () => {
      setFriendsStats(undefined);
      setLimitLoading(true);

      const friendsRes = await getFriends({
        friendsIdArr: currentUser.friends,
        limit,
      });

      if (friendsRes.total && friendsRes.total > friendsRes.friends.length) {
        setShowLoadMore(true);
      }

      const statsArray = await Promise.all(
        friendsRes.friends.map(async (friend) => {
          const stats = await getStats(friend.$id);
          return stats
            ? { name: friend.name, profession: friend.profession, ...stats }
            : null;
        })
      );

      const filteredStats = statsArray.filter(
        (item): item is FriendStats => item !== null
      );

      setFriendsStats(filteredStats);
      setNoMoreFriends(filteredStats.length < limit);
      setLimitLoading(false);
    };

    fetchFriendsStats();
  }, [limit]);

  return (
    <div className="flex flex-col gap-4">
      <h3>Friends&apos; Progress</h3>
      <div className="flex flex-col gap-3">
        {friendsStats ? (
          friendsStats.length > 0 ? (
            <>
              {friendsStats.map((item, index) => (
                <FriendChartCard stats={item} key={index} />
              ))}
              {showLoadMore && (
                <button
                  disabled={noMoreFriends}
                  onClick={() => {
                    setLimitLoading(true);
                    setLimit((prev) => prev + 5);
                  }}
                  className="text-green-600 text-sm self-center py-1 hover:text-green-700 transition-colors duration-150 disabled:text-gray-400"
                >
                  {limitLoading
                    ? "Loading…"
                    : noMoreFriends
                    ? "All friends loaded"
                    : "Load More"}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-8 gap-1">
              <span className="text-gray-400 text-sm">No friends added yet.</span>
            </div>
          )
        ) : (
          Array.from({ length: 2 }).map((_, index) => (
            <FriendChartSkeleton key={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsProgress;
