"use client";
import { getApplications } from "@/appwrite/applicationActions";
import { Add } from "iconsax-react";
import React, { createContext, useEffect, useState } from "react";
import ApplicationCard from "../applications/ApplicationCard";
import { Models } from "node-appwrite";
import ApplicationForm from "../applications/ApplicationForm";
import { Skeleton } from "../ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { setForm } from "@/features/applicationFormSlice";
import { setApplications } from "@/features/applicationsSlice";

export const ApplicationContext = createContext<Models.Document | undefined>(
  undefined
);

const SkeletonApplication = () => (
  <div className="flex flex-col gap-3 custom-shadow rounded-xl p-3 md:p-4">
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-3">
        <Skeleton className="h-[40px] w-[40px] rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-md" />
    </div>
    <Skeleton className="h-16 w-full rounded-lg" />
    <div className="flex flex-row items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-12" />
    </div>
  </div>
);

const RecentApplications = () => {
  const applications = useSelector(
    (state: RootState) => state.applications.applications
  );
  const formOpen = useSelector(
    (state: RootState) => state.applicationForm.formOpen
  );
  const dispatch = useDispatch<AppDispatch>();

  const [limit, setLimit] = useState(5);
  const [limitLoading, setLimitLoading] = useState(false);
  const [noMoreApplications, setNoMoreApplications] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);

  useEffect(() => {
    const prevApps = applications?.length;

    const fetchApplications = async () => {
      dispatch(setApplications(undefined));
      const res = await getApplications(limit);
      if (prevApps === res?.applications.length) setNoMoreApplications(true);
      if (res?.applications && res?.total > res?.applications?.length)
        setShowLoadMore(true);
      dispatch(setApplications(res?.applications));
      setLimitLoading(false);
    };

    fetchApplications();
  }, [limit]);

  return (
    <>
      {formOpen && <ApplicationForm />}

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="leading-none">Recent Applications</h2>
          <button
            onClick={() => dispatch(setForm(true))}
            className="flex flex-row items-center gap-1 px-4 group"
          >
            <Add
              color="green"
              size={16}
              className="group-hover:rotate-90 duration-500 ease-out"
            />
            <span className="add-button">Add New</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 md:gap-4">
          {applications ? (
            applications.length > 0 ? (
              <>
                {applications.map((item: Models.Document) => (
                  <ApplicationContext.Provider
                    key={item.$id}
                    value={item}
                  >
                    <ApplicationCard key={item.$id} />
                  </ApplicationContext.Provider>
                ))}
                {showLoadMore && (
                  <button
                    disabled={noMoreApplications}
                    onClick={() => {
                      setLimitLoading(true);
                      setLimit((prev) => prev + 5);
                    }}
                    className="self-center text-green-600 text-sm py-1 hover:text-green-700 transition-colors duration-150 disabled:text-gray-400"
                  >
                    {limitLoading
                      ? "Loading..."
                      : noMoreApplications
                      ? "Everything's loaded"
                      : "Load More"}
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-12 gap-2">
                <span className="text-gray-500 text-base">No applications yet.</span>
                <span className="text-gray-400 text-sm">Hit &quot;Add New&quot; to track your first one.</span>
              </div>
            )
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonApplication key={index} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RecentApplications;
