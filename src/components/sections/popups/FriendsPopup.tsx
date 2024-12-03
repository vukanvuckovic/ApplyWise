import { CloseCircle } from "iconsax-react";
import { Models } from "node-appwrite";
import React, { createContext, useState } from "react";
import { useSelector } from "react-redux";
import FriendCard, {
  SkeletonFriendCard,
} from "@/components/friends/FriendCard";
import { RootState } from "@/app/store";

export const UserContext = createContext<Models.Document | undefined>(undefined);

const FriendsPopup = ({ setPopup }: { setPopup: (open: boolean) => void }) => {
  const [friendsLimit, setFriendsLimit] = useState(10);
  const [friendRequestsLimit, setFriendRequestsLimit] = useState(3);

  const friends = useSelector((state: RootState) => state.friends.friends);
  const friendRequests = useSelector(
    (state: RootState) => state.friends.friendRequests
  );

  return (
    <div
      onClick={() => setPopup(false)}
      className="gsap-overlay h-[100dvh] w-[100dvw] bg-black/50 fixed top-0 left-0 flex flex-col justify-center items-center z-[70]"
    >
      <div
        className="gsap-dialog flex flex-col gap-6 bg-white rounded-2xl w-full max-w-[480px] h-fit max-h-[80dvh] p-6 pb-0 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between flex-shrink-0">
          <h2 className="leading-none">Friends</h2>
          <button
            onClick={() => setPopup(false)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close"
          >
            <CloseCircle size={20} color="#9ca3af" />
          </button>
        </div>
        <div className="flex flex-col gap-6 pb-6 overflow-y-auto scrollbar-none">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <h3>Friend Requests</h3>
              <button
                disabled={
                  !friendRequests ||
                  friendRequestsLimit >= friendRequests.length
                }
                onClick={() =>
                  setFriendRequestsLimit(
                    friendRequests ? friendRequests.length : 3
                  )
                }
                className="text-blue-500 text-sm disabled:text-blue-300 transition-colors duration-100"
              >
                See All
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {friendRequests ? (
                friendRequests.length > 0 ? (
                  friendRequests
                    .slice(0, friendRequestsLimit)
                    .map((item: Models.Document) => (
                      <UserContext.Provider value={item} key={item.$id}>
                        <FriendCard type="req" />
                      </UserContext.Provider>
                    ))
                ) : (
                  <span className="text-gray-400 text-sm self-center py-2">
                    No pending requests.
                  </span>
                )
              ) : (
                Array.from({ length: 2 }).map((_, index) => (
                  <SkeletonFriendCard key={index} />
                ))
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <h3>Friends</h3>
              <button
                disabled={!friends || friendsLimit >= friends.length}
                onClick={() =>
                  setFriendsLimit(friends ? friends.length : 10)
                }
                className="text-blue-500 text-sm disabled:text-blue-300 transition-colors duration-100"
              >
                See All
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {friends ? (
                friends.length > 0 ? (
                  friends
                    .slice(0, friendsLimit)
                    .map((item: Models.Document) => (
                      <UserContext.Provider value={item} key={item.$id}>
                        <FriendCard type="friend" />
                      </UserContext.Provider>
                    ))
                ) : (
                  <span className="text-gray-400 text-sm self-center py-2">
                    No friends yet.
                  </span>
                )
              ) : (
                Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonFriendCard key={index} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPopup;
