import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, Setting2, Trash } from "iconsax-react";
import { deleteApplication } from "@/appwrite/applicationActions";
import { deleteApplication as deleteApplicationState } from "@/features/applicationsSlice";
import { useToast } from "@/hooks/use-toast";
import { ApplicationContext } from "../sections/RecentApplications";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { setEditForm } from "@/features/applicationFormSlice";
import ConfirmDialog from "../ConfirmDialog";

const OptionsPopover = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const application = useContext(ApplicationContext);
  if (!application) throw new Error("No application");

  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteApplication = async () => {
    setDeleteLoading(true);
    const res = await deleteApplication({ applicationId: application.$id });
    if (res?.status) {
      toast({ title: "Application deleted." });
      dispatch(deleteApplicationState(application));
    } else {
      toast({ title: "Failed to delete application." });
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-100 z-30">
          <Setting2 color="#9ca3af" size={18} />
        </PopoverTrigger>
        <PopoverContent className="p-1 w-fit z-30">
          <ul className="flex flex-col gap-1">
            <li>
              <button
                onClick={() =>
                  dispatch(setEditForm({ open: true, application }))
                }
                className="options-menu-item"
              >
                <Edit size={14} color="green" />
                <span className="text-green-600 text-sm">Edit</span>
              </button>
            </li>
            <li>
              <ConfirmDialog
                loading={deleteLoading}
                trigger={
                  <>
                    <Trash size={14} color="red" />
                    <span className="text-red-500 text-sm">Delete</span>
                  </>
                }
                triggerStyle="options-menu-item"
                title="Are you sure?"
                description="This action cannot be undone. This will permanently delete this application and all its notes."
                action={handleDeleteApplication}
                cancelAction={() => setPopoverOpen(false)}
              />
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default OptionsPopover;
