import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";

const ConfirmDialog = ({
  trigger,
  triggerStyle,
  title,
  description,
  action,
  cancelAction,
  loading,
}: {
  loading: boolean;
  trigger: React.ReactNode;
  triggerStyle: string;
  title: string;
  description: string;
  action: () => void;
  cancelAction: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={triggerStyle}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelAction}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex flex-row items-center gap-2"
            disabled={loading}
            onClick={action}
          >
            Continue{" "}
            {loading && (
              <Loader
                size={20}
                color="white"
                className="animate-spin"
              />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmDialog;
