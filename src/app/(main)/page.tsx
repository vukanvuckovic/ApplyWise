"use client";
import BackToTop from "@/components/BackToTop";
import ApplicationForm from "@/components/applications/ApplicationForm";
import FooterBar from "@/components/sections/FooterBar";
import FriendsProgress from "@/components/sections/FriendsProgress";
import Header from "@/components/sections/Header";
import MyStats from "@/components/sections/MyStats";
import RecentApplications from "@/components/sections/RecentApplications";
import UploadFiles from "@/components/sections/UploadFiles";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "../store";

const AppContent = () => {
  const formOpen = useSelector((state: RootState) => state.applicationForm.formOpen);

  return (
    <>
      {formOpen && <ApplicationForm />}
      <div className="flex flex-col gap-6 md:gap-8 min-h-[100dvh] w-full max-w-[1140px] 2xl:max-w-[1440px] mx-auto px-4 md:px-8 pt-4">
        <div className="animate-fade-up stagger-1">
          <Header />
        </div>
        <BackToTop />
        <div className="flex-1 flex flex-col max-md:gap-24 md:flex-row gap-4">
          <div className="md:w-3/5 flex flex-col gap-16 md:gap-8 animate-fade-up stagger-2">
            <MyStats />
            <RecentApplications />
          </div>
          <div className="md:w-2/5 flex flex-col max-md:gap-16 gap-4 animate-fade-up stagger-3">
            <UploadFiles />
            <FriendsProgress />
          </div>
        </div>
        <div className="animate-fade-up stagger-4">
          <FooterBar />
        </div>
      </div>
    </>
  );
};

const Home = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default Home;
