import React, { useContext, useEffect, useState } from "react";
import FriendCard, {
  SkeletonFriendCard,
} from "@/components/friends/FriendCard";
import { CloseCircle } from "iconsax-react";
import { GlobalUserContext } from "@/components/UserContext";
import { Models } from "node-appwrite";
import { UserContext } from "./FriendsPopup";
import { getUsers } from "@/appwrite/userActions";

const SearchPopup = ({ setPopup }: { setPopup: (open: boolean) => void }) => {
  const currentUser = useContext(GlobalUserContext);
  if (!currentUser) throw new Error("No current user");

  const [search, setSearch] = useState("");
  const [usersLimit, setUsersLimit] = useState(10);
  const [users, setUsers] = useState<Models.Document[] | undefined>();
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setNoMoreUsers(false);
      const prevCount = users?.length;
      const newUsers = await getUsers(usersLimit, search);
      if (prevCount === newUsers?.length) setNoMoreUsers(true);
      setUsers(newUsers);
      setLoadingUsers(false);
    };
    fetchUsers();
  }, [usersLimit]);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLimit(10);
      setNoMoreUsers(false);
      const results = await getUsers(10, search);
      setUsers(results);
    };
    fetchUsers();
  }, [search]);

  const visibleUsers = users?.filter(
    (item) => !item.friends.includes(currentUser.$id)
  );

  return (
    <div
      onClick={() => setPopup(false)}
      className="gsap-overlay h-[100dvh] w-[100dvw] bg-black/50 fixed top-0 left-0 flex flex-col justify-center items-center z-[70]"
    >
      <div
        className="gsap-dialog flex flex-col gap-5 bg-white rounded-2xl w-full max-w-[480px] h-fit max-h-[80dvh] p-6 pb-0 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between flex-shrink-0">
          <h2 className="leading-none">Add Friends</h2>
          <button
            onClick={() => setPopup(false)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close"
          >
            <CloseCircle size={20} color="#9ca3af" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name"
          className="input-field flex-shrink-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        <div className="flex flex-col gap-3 pb-6 overflow-y-auto scrollbar-none">
          {users ? (
            visibleUsers && visibleUsers.length > 0 ? (
              <>
                {visibleUsers.map((item) => (
                  <UserContext.Provider value={item} key={item.$id}>
                    <FriendCard type="add" />
                  </UserContext.Provider>
                ))}
                {!noMoreUsers && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoadingUsers(true);
                      setUsersLimit((prev) => prev + 10);
                    }}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors duration-150 py-1"
                  >
                    {loadingUsers ? "Loading…" : "Load More"}
                  </button>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm self-center py-4">
                No users found.
              </span>
            )
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonFriendCard key={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
