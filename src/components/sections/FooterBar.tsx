import React from "react";

const FooterBar = () => {
  return (
    <footer className="flex flex-row items-center justify-center py-3 border-t border-gray-100">
      <span className="max-sm:text-[10px] text-xs text-gray-400">
        ApplyWise &copy; {new Date().getFullYear()} &mdash; All rights reserved
      </span>
    </footer>
  );
};

export default FooterBar;
