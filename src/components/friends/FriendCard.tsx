"use client";
import {
  acceptFriend,
  addFriend,
  cancelFriend,
  cancelSentRequest,
  removeFriend,
} from "@/appwrite/friendActions";
import { GlobalUserContext } from "@/components/UserContext";
import { useToast } from "@/hooks/use-toast";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  removeSentRequest,
  sendRequest,
  removeFriend as removeFriendState,
  addFriend as addFriendState,
  removeRequest,
} from "@/features/friendsSlice";
import { UserContext } from "../sections/popups/FriendsPopup";

export const SkeletonFriendCard = () => (
  <div className="flex flex-row items-center justify-between">
    <div className="flex flex-row items-center gap-3">
      <Skeleton className="h-[46px] aspect-square rounded-full" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-7 w-16 rounded-lg" />
  </div>
);

const Button = ({
  text,
  loadingText,
  doneText,
  handleClick,
  done,
  primary = false,
}: {
  text: string;
  loadingText: string;
  doneText?: string;
  handleClick: (setLoading: Dispatch<SetStateAction<boolean>>) => void;
  done?: boolean;
  primary?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={() => handleClick(setLoading)}
      disabled={loading}
      className={
        loading || !primary || done
          ? "px-4 py-1.5 rounded-lg bg-white border border-gray-200 max-sm:text-xs text-sm text-gray-400 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-60"
          : "px-4 py-1.5 rounded-lg bg-green-600 font-medium max-sm:text-xs text-sm text-white hover:bg-green-700 transition-colors duration-150"
      }
    >
      {loading ? loadingText : done ? doneText : text}
    </button>
  );
};

const FriendCard = ({
  type,
}: {
  type: "req" | "friend" | "add" | "cancel";
}) => {
  const currentUser = useContext(GlobalUserContext);
  const user = useContext(UserContext);
  if (!currentUser || !user) throw new Error("No user");

  const sentReqs = useSelector(
    (state: RootState) => state.friends.sentRequests
  );
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const handleAddFriend = async (setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true);
    if (!sentReqs?.includes(user.$id)) {
      const res = await addFriend(user.$id, currentUser.$id);
      if (res?.status) {
        toast({ title: "Friend request sent." });
        dispatch(sendRequest(user.$id));
      } else {
        toast({ title: "Failed to send request." });
      }
    } else {
      const res = await cancelSentRequest(user.$id, currentUser.$id);
      if (res?.status) {
        toast({ title: "Friend request cancelled." });
        dispatch(removeSentRequest(user.$id));
      } else {
        toast({ title: "Failed to cancel request." });
      }
    }
    setLoading(false);
  };

  const handleRemoveFriend = async (setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true);
    const res = await removeFriend(user.$id, currentUser.$id);
    if (res?.status) {
      toast({ title: "Friend removed." });
      dispatch(removeFriendState(user.$id));
    } else {
      toast({ title: "Failed to remove friend." });
    }
    setLoading(false);
  };

  const handleAcceptFriend = async (setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true);
    const res = await acceptFriend(user.$id, currentUser.$id);
    if (res?.status) {
      toast({ title: "Friend request accepted." });
      dispatch(removeRequest(user.$id));
      dispatch(addFriendState(user));
    } else {
      toast({ title: "Failed to accept request." });
    }
    setLoading(false);
  };

  const handleCancelFriend = async (setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true);
    const res = await cancelFriend(user.$id, currentUser.$id);
    if (res?.status) {
      toast({ title: "Request declined." });
      dispatch(removeRequest(user.$id));
    } else {
      toast({ title: "Failed to decline request." });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-3">
        <div className="max-sm:h-[40px] h-[44px] aspect-square rounded-full flex justify-center items-center bg-blue-500 text-white font-medium flex-shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-medium max-sm:text-sm leading-snug">{user.name}</span>
          {user.profession && (
            <span className="text-xs text-gray-400 leading-snug">{user.profession}</span>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {type === "req" ? (
          <>
            <Button
              handleClick={handleCancelFriend}
              text="Decline"
              loadingText="…"
            />
            <Button
              handleClick={handleAcceptFriend}
              text="Accept"
              loadingText="…"
              primary
            />
          </>
        ) : type === "friend" ? (
          <Button
            handleClick={handleRemoveFriend}
            text="Remove"
            loadingText="…"
          />
        ) : (
          type === "add" && (
            <Button
              handleClick={handleAddFriend}
              text="Add"
              loadingText="…"
              doneText="Pending"
              done={sentReqs?.includes(user.$id)}
              primary
            />
          )
        )}
      </div>
    </div>
  );
};

export default FriendCard;
