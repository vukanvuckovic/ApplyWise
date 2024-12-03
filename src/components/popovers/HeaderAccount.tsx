import React, { useContext, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { GlobalUserContext } from "../UserContext";
import { updateUser } from "@/appwrite/userActions";
import { useToast } from "@/hooks/use-toast";

const HeaderAccount = () => {
  const currentUserContext = useContext(GlobalUserContext);
  if (!currentUserContext) throw new Error("No user");

  const [currentUser, setCurrentUser] = useState(currentUserContext);
  const [userInfo, setUserInfo] = useState({
    name: currentUser.name,
    profession: currentUser.profession,
  });
  const [infoEditOpen, setInfoEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  return (
    <Popover open={infoEditOpen} onOpenChange={setInfoEditOpen}>
      <PopoverTrigger className="flex flex-row items-center h-full gap-3 group">
        <div className="h-[40px] md:h-[50px] aspect-square rounded-full bg-[linear-gradient(135deg,#86efac,#16a34a)] flex justify-center items-center text-white font-semibold text-lg flex-shrink-0">
          {currentUser.name[0].toUpperCase()}
        </div>
        <div className="max-sm:hidden flex flex-col gap-0.5 text-left">
          <span className="font-medium text-base leading-none">{currentUser.name}</span>
          {currentUser.profession && (
            <span className="text-xs text-gray-400 leading-none">{currentUser.profession}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 z-[60] w-[260px]">
        <h3>Edit Profile</h3>
        <form
          className="flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!userInfo.name.trim()) return;
            setLoading(true);
            const res = await updateUser(userInfo, currentUser.$id);
            if (res?.status) {
              toast({ title: "Profile updated." });
              setCurrentUser(res.dbUser);
              setInfoEditOpen(false);
            } else {
              toast({ title: "Failed to update profile." });
            }
            setLoading(false);
          }}
        >
          <div className="flex flex-col gap-1">
            <label className="custom-label">Name</label>
            <input
              required
              className="input-field"
              type="text"
              placeholder="Your name"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="custom-label">Profession</label>
            <input
              className="input-field"
              type="text"
              placeholder="Your profession"
              value={userInfo.profession}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, profession: e.target.value }))
              }
            />
          </div>
          <button
            disabled={loading}
            className="h-9 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderAccount;
