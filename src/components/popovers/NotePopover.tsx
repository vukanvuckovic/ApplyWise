import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NoteAdd, Setting2 } from "iconsax-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createNote } from "@/appwrite/noteActions";
import { useToast } from "@/hooks/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { Models } from "node-appwrite";

const NotePopover = ({
  applicationId,
  setNotes,
}: {
  applicationId: string;
  setNotes: React.Dispatch<React.SetStateAction<Models.Document[]>>;
}) => {
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    color: "green",
    application: applicationId,
  });
  const [loading, setLoading] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const { toast } = useToast();

  return (
    <Popover
      open={noteOpen}
      onOpenChange={setNoteOpen}
    >
      <PopoverTrigger className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-100 z-30">
        <NoteAdd
          color="#9ca3af"
          size={18}
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <h3>Add Note</h3>
        <form
          className="flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const noteRes = await createNote(noteData);
            if (noteRes?.status) {
              toast({
                title: "Note added.",
              });
              setNotes((prev) => [...prev, { ...noteRes.note }]);
              setNoteData({
                title: "",
                description: "",
                color: "green",
                application: applicationId,
              });
            } else {
              toast({
                title: "Failed to add note.",
              });
            }
            setLoading(false);
            setNoteOpen(false);
          }}
        >
          <input
            required
            className="input-field text-sm"
            type="text"
            placeholder="Title"
            value={noteData.title}
            onChange={(e) =>
              setNoteData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            required
            className="input-field text-sm resize-none"
            rows={3}
            placeholder="Description"
            value={noteData.description}
            onChange={(e) =>
              setNoteData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <div onPointerDown={(e) => e.stopPropagation()}>
            <Select
              open={selectOpen}
              onOpenChange={setSelectOpen}
              defaultValue={noteData.color}
              value={noteData.color}
              onValueChange={(val) =>
                setNoteData((prev) => ({ ...prev, color: val }))
              }
            >
              <SelectTrigger className="input-field shadow-none">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="text-gray-500"
                  value="green"
                >
                  Green
                </SelectItem>
                <SelectItem
                  className="text-gray-500"
                  value="blue"
                >
                  Blue
                </SelectItem>
                <SelectItem
                  className="text-gray-500"
                  value="yellow"
                >
                  Yellow
                </SelectItem>
                <SelectItem
                  className="text-gray-500"
                  value="orange"
                >
                  Orange
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row items-center gap-2">
            <PopoverClose className="flex-1 px-4 py-1.5 rounded-lg border border-gray-200 text-gray-400 text-sm hover:bg-gray-50 transition-colors duration-150">
              Cancel
            </PopoverClose>
            <button
              disabled={loading}
              type="submit"
              className={`flex-1 px-4 py-1.5 rounded-lg ${
                loading
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-sm text-white font-medium transition-colors duration-150`}
            >
              {loading ? "Saving..." : "Done"}
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default NotePopover;
