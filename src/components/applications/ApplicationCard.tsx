import { Trash } from "iconsax-react";
import React, { useContext, useState } from "react";
import { deleteNote } from "@/appwrite/noteActions";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { updateApplication } from "@/appwrite/applicationActions";
import { formatDate } from "@/lib/utils";
import NotePopover from "../popovers/NotePopover";
import OptionsPopover from "../popovers/OptionsPopover";
import { Models } from "node-appwrite";
import { ApplicationContext } from "../sections/RecentApplications";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { setApplications } from "@/features/applicationsSlice";

const NOTE_COLORS: Record<string, string> = {
  yellow: "#facc15",
  green: "#4ade80",
  blue: "#3b82f6",
  orange: "#fb923c",
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "#facc15",
  Accepted: "#4ade80",
  Rejected: "#f87171",
  Progressing: "#fb923c",
};

const NoteComponent = ({
  note,
  setNotes,
}: {
  note: Models.Document;
  setNotes: React.Dispatch<React.SetStateAction<Models.Document[]>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    const status = await deleteNote({ noteId: note.$id });
    if (status) {
      setNotes((prev) => prev.filter((item) => item.$id !== note.$id));
      toast({ title: "Note removed." });
    } else {
      toast({ title: "Failed to remove note." });
    }
    setLoading(false);
  };

  return (
    <div
      style={{ backgroundColor: NOTE_COLORS[note.color] }}
      className="flex flex-col gap-2 rounded-lg py-2.5 px-3 relative"
    >
      <button
        disabled={loading}
        onClick={handleDelete}
        className="p-1.5 flex justify-center items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-lg absolute -top-2 -right-2 hover:bg-white/25 transition-colors duration-150"
        aria-label="Delete note"
      >
        {loading ? (
          <span className="text-white text-[10px] leading-none px-1">…</span>
        ) : (
          <Trash color="white" size={11} />
        )}
      </button>
      <h4 className="text-white leading-snug">{note.title}</h4>
      <span className="text-white/90 max-sm:text-xs text-sm leading-relaxed">{note.description}</span>
    </div>
  );
};

const ApplicationCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector(
    (state: RootState) => state.applications.applications
  );

  const application = useContext(ApplicationContext);
  if (!application) throw new Error("No application");

  const [notes, setNotes] = useState<Models.Document[]>(application.notes);
  const [status, setStatus] = useState(application.status);
  const { toast } = useToast();

  const handleStatusChange = async (val: string) => {
    try {
      const res = await updateApplication({
        applicationId: application.$id,
        formData: { status: val },
      });
      if (res?.status) {
        setStatus(val);
        toast({ title: "Status updated." });
        dispatch(
          setApplications(
            applications?.map((item: Models.Document) =>
              item.$id !== application.$id
                ? item
                : { ...item, status: res.application.status }
            )
          )
        );
      }
    } catch {
      toast({ title: "Failed to update status." });
    }
  };

  return (
    <div className="flex flex-col max-sm:gap-4 gap-3 custom-shadow card-hover rounded-xl p-3 md:p-4 bg-white">
      <div className="flex max-sm:flex-col max-sm:gap-2 flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3 max-sm:self-start">
          <div className="h-[40px] aspect-square rounded-full bg-blue-600 flex justify-center items-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {application.businessName[0].toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="leading-none">{application.businessName}</h4>
            <span className="text-gray-400 max-sm:text-xs text-sm leading-none">
              {application.position}
            </span>
          </div>
        </div>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-fit max-sm:self-end h-7 rounded-lg px-3 gap-2 shadow-none border-gray-200">
            <div className="flex flex-row justify-center items-center gap-2">
              <div
                style={{ backgroundColor: STATUS_COLORS[status] }}
                className="w-2 h-2 rounded-full flex-shrink-0"
              />
              <span className="text-gray-500 text-sm">{status}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(STATUS_COLORS).map((key) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-row items-center gap-2">
                  <div
                    style={{ backgroundColor: STATUS_COLORS[key] }}
                    className="w-2 h-2 rounded-full"
                  />
                  <span>{key}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {application.description && (
        <p className="text-sm font-light text-gray-600 whitespace-pre-wrap leading-relaxed">
          {application.description}
        </p>
      )}

      {notes.length > 0 && (
        <div className="flex flex-col gap-2">
          {notes.map((note: Models.Document) => (
            <NoteComponent note={note} setNotes={setNotes} key={note.$id} />
          ))}
        </div>
      )}

      <div className="flex flex-row items-center justify-between pt-1 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          Applied {formatDate(application.$createdAt)}
        </span>
        <div className="flex flex-row items-center gap-3">
          <NotePopover setNotes={setNotes} applicationId={application.$id} />
          <OptionsPopover />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
