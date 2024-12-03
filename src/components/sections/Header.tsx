"use client";
import { getFriendRequests, getFriends } from "@/appwrite/friendActions";
import { logOutUser } from "@/appwrite/userActions";
import { useToast } from "@/hooks/use-toast";
import { Models } from "appwrite";
import { Logout, People, SearchFavorite } from "iconsax-react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GlobalUserContext } from "../UserContext";
import SearchPopup from "./popups/SearchPopup";
import FriendsPopup from "./popups/FriendsPopup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  setFriendRequests,
  setFriends,
  setSentReqs,
} from "@/features/friendsSlice";
import HeaderAccount from "@/components/popovers/HeaderAccount";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Header = () => {
  const currentUser = useContext(GlobalUserContext);
  if (!currentUser) {
    throw new Error("No user");
  }
  const friendRequests = useSelector(
    (state: RootState) => state.friends.friendRequests
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [popup, setPopup] = useState(false);
  const [searchPopup, setSearchPopup] = useState(false);
  const formOpen = useSelector(
    (state: RootState) => state.applicationForm.formOpen
  );

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friends = await getFriends({ friendsIdArr: currentUser.friends });
        dispatch(setFriends(friends.friends));
        const friendReqs = await getFriendRequests({
          friendReqIdArr: currentUser.friendRequests,
        });
        dispatch(setFriendRequests(friendReqs));
        dispatch(setSentReqs(currentUser.sentRequests));
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    if (popup || searchPopup || formOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [popup, searchPopup, formOpen]);

  const { toast } = useToast();

  useGSAP(() => {
    gsap.from(".gsap-overlay", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.from(".gsap-dialog", {
      scale: 0.97,
      y: 8,
      opacity: 0,
      ease: "power3.out",
      duration: 0.25,
    });
  }, [searchPopup, popup, formOpen]);

  const handleLogout = async () => {
    const res = await logOutUser();
    if (res?.status) {
      toast({ title: "Logged out" });
      router.push("/sign-in");
    } else {
      toast({ title: "Logging out failed" });
    }
  };

  return (
    <>
      {popup && createPortal(
        <FriendsPopup setPopup={setPopup} />,
        document.body
      )}
      {searchPopup && createPortal(
        <SearchPopup setPopup={setSearchPopup} />,
        document.body
      )}
      <header className="flex flex-row items-center justify-between p-2 sticky top-4 bg-white/60 backdrop-blur-2xl custom-shadow rounded-full z-[50]">
        <HeaderAccount />
        <div className="flex flex-row items-center gap-8">
          <button
            onClick={() => setSearchPopup(true)}
            className="header-icon-btn"
            aria-label="Search friends"
          >
            <SearchFavorite size={20} color="gray" />
          </button>
          <button
            onClick={() => setPopup(true)}
            className="relative header-icon-btn"
            aria-label="Friends"
          >
            {friendRequests && friendRequests.length > 0 && (
              <div className="w-4 h-4 flex justify-center items-center rounded-full bg-red-400 absolute -top-3 -right-3">
                <span className="text-[10px] text-white leading-none select-none">
                  {currentUser.friendRequests.length}
                </span>
              </div>
            )}
            <People size={20} color="gray" />
          </button>
          <button
            onClick={handleLogout}
            className="max-md:h-[40px] h-[50px] aspect-square flex justify-center items-center gap-4 bg-green-100 rounded-full border border-green-200 hover:bg-green-200 transition-colors duration-150"
            aria-label="Log out"
          >
            <Logout size={18} color="green" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
