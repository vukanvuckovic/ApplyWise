import {
  createApplication,
  updateApplication,
} from "@/appwrite/applicationActions";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "@/features/applicationFormSlice";
import {
  addApplication,
  exchangeApplications,
} from "@/features/applicationsSlice";
import { X } from "lucide-react";

interface FormErrors {
  businessName?: string;
  position?: string;
}

const ApplicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useDispatch<AppDispatch>();
  const application = useSelector(
    (state: RootState) => state.applicationForm.application
  );

  const [formData, setFormData] = useState(
    application
      ? {
          businessName: application.businessName,
          position: application.position,
          description: application.description,
        }
      : {
          businessName: "",
          position: "",
          description: "",
        }
  );

  const { toast } = useToast();

  const handleInput = ({ field, value }: { field: string; value: string }) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }
    if (!formData.position.trim()) {
      newErrors.position = "Position is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplicationCreation = async () => {
    if (!validate()) return;
    setLoading(true);
    const applicationRes = await createApplication(formData);
    if (applicationRes?.status) {
      toast({ title: "Application added." });
      dispatch(addApplication(applicationRes.application));
    } else {
      toast({ title: "Something went wrong. Try again." });
    }
    dispatch(setForm(false));
    setLoading(false);
  };

  const handleApplicationEdit = async () => {
    if (!validate()) return;
    setLoading(true);
    if (!application) throw new Error("No application to edit");
    const res = await updateApplication({
      formData,
      applicationId: application.$id,
    });
    if (res?.status) {
      toast({ title: "Application updated." });
      dispatch(exchangeApplications(res.application));
    } else {
      toast({ title: "Something went wrong. Try again." });
    }
    dispatch(setForm(false));
    setLoading(false);
  };

  const modal = (
    <div className="gsap-overlay flex flex-row justify-center items-end md:items-center py-0 md:py-10 px-0 md:px-4 h-[100dvh] w-[100dvw] fixed top-0 left-0 bg-black/40 z-[150]">
      <div className="gsap-dialog flex flex-col gap-5 py-6 px-6 w-full max-w-[700px] bg-white rounded-t-2xl md:rounded-2xl max-h-[92dvh] overflow-hidden">
        <div className="flex flex-row items-center justify-between flex-shrink-0">
          <h2 className="leading-none">
            {application ? "Edit Application" : "New Application"}
          </h2>
          <button
            onClick={() => dispatch(setForm(false))}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close"
          >
            <X size={18} color="#9ca3af" />
          </button>
        </div>
        <form
          className="flex flex-col flex-1 gap-4 overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            if (application) {
              handleApplicationEdit();
            } else {
              handleApplicationCreation();
            }
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="custom-label" htmlFor="businessName">
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                name="businessName"
                type="text"
                placeholder="e.g. Acme Corp"
                className={`input-field ${errors.businessName ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                value={formData.businessName}
                onChange={(e) =>
                  handleInput({ field: "businessName", value: e.currentTarget.value })
                }
              />
              {errors.businessName && (
                <span className="text-xs text-red-500 ml-1">{errors.businessName}</span>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="custom-label" htmlFor="position">
                Position <span className="text-red-400">*</span>
              </label>
              <input
                name="position"
                type="text"
                placeholder="e.g. Frontend Engineer"
                className={`input-field ${errors.position ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                value={formData.position}
                onChange={(e) =>
                  handleInput({ field: "position", value: e.currentTarget.value })
                }
              />
              {errors.position && (
                <span className="text-xs text-red-500 ml-1">{errors.position}</span>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 min-h-[120px]">
            <label className="custom-label" htmlFor="description">
              Notes / Details
            </label>
            <textarea
              name="description"
              placeholder="Add any relevant notes about this role…"
              className="input-field flex-1 resize-none min-h-[120px]"
              value={formData.description}
              onChange={(e) =>
                handleInput({ field: "description", value: e.target.value })
              }
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => dispatch(setForm(false))}
              className="border border-gray-200 px-5 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className={`text-white px-5 py-2 ${
                loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-sm rounded-lg font-medium transition-colors duration-150`}
            >
              {loading ? "Saving…" : application ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ApplicationForm;
