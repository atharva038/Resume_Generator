import {useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {resumeAPI} from "@/api/api";
import logger from "@/utils/logger";
import {useNavigationBlocker} from "@/context/NavigationBlockerContext";

export const useEditorPersistence = ({
  resumeData,
  originalResumeData,
  setResumeData,
  setOriginalResumeData,
  user,
  saving,
}) => {
  const {blockNavigation, unblockNavigation} = useNavigationBlocker();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);

  useEffect(() => {
    if (!resumeData || !originalResumeData) return;

    const hasChanges =
      JSON.stringify(resumeData) !== JSON.stringify(originalResumeData);
    setHasUnsavedChanges(hasChanges);
  }, [resumeData, originalResumeData]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      blockNavigation((to) => {
        setShowUnsavedModal(true);
        setPendingNavigation(to);
        return false;
      });
    } else {
      unblockNavigation();
    }

    return () => {
      unblockNavigation();
    };
  }, [hasUnsavedChanges, blockNavigation, unblockNavigation]);

  useEffect(() => {
    if (!hasUnsavedChanges || !resumeData?._id || saving || autoSaving || !user) {
      return;
    }

    const autoSaveTimer = setTimeout(async () => {
      setAutoSaving(true);

      try {
        const response = await resumeAPI.update(resumeData._id, resumeData);
        const savedResume = response.data;

        setResumeData(savedResume);
        setOriginalResumeData(JSON.parse(JSON.stringify(savedResume)));
        setHasUnsavedChanges(false);

        toast.success("Auto-saved", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: "#10b981",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
      } catch (error) {
        logger.error("❌ Auto-save failed:", error);
      } finally {
        setAutoSaving(false);
      }
    }, 30000);

    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [
    hasUnsavedChanges,
    resumeData,
    saving,
    autoSaving,
    user,
    setResumeData,
    setOriginalResumeData,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = () => {
      if (!hasUnsavedChanges) return;

      const currentPath = window.location.pathname;
      setShowUnsavedModal(true);
      setPendingNavigation("back");

      window.history.pushState(
        {preventNav: true, originalPath: currentPath},
        "",
        currentPath
      );
    };

    if (!window.history.state?.preventNav) {
      window.history.pushState({preventNav: false}, "", window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  const markChangesSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const commitPendingNavigation = useCallback(
    (navigate) => {
      unblockNavigation();
      setHasUnsavedChanges(false);

      if (pendingNavigation === "back") {
        window.history.back();
      } else if (pendingNavigation) {
        navigate(pendingNavigation);
      }

      setShowUnsavedModal(false);
      setPendingNavigation(null);
    },
    [pendingNavigation, unblockNavigation]
  );

  const cancelPendingNavigation = useCallback(() => {
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  }, []);

  return {
    hasUnsavedChanges,
    autoSaving,
    showUnsavedModal,
    markChangesSaved,
    commitPendingNavigation,
    cancelPendingNavigation,
  };
};
