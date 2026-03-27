import {useCallback, useState} from "react";
import toast from "react-hot-toast";
import {resumeAPI} from "@/api/api";
import {parseValidationErrors} from "@/utils/errorHandler";
import logger from "@/utils/logger";

export const useResumeSaveActions = ({
  user,
  navigate,
  resumeData,
  setResumeData,
  setOriginalResumeData,
  setUpgradeMessage,
  showUpgradeModalTrue,
}) => {
  const [saving, setSaving] = useState(false);

  const saveResume = useCallback(
    async ({
      dataToSave,
      showSuccessToast = true,
      showErrorToast = true,
      requireAuthRedirect = true,
      errorMessagePrefix = "Failed to save resume: ",
    } = {}) => {
      const targetResume = dataToSave || resumeData;

      if (!user) {
        if (requireAuthRedirect) {
          toast.error("Please login to save your resume", {
            duration: 3000,
          });
          navigate("/login");
        }
        return {ok: false};
      }

      if (!targetResume) {
        return {ok: false};
      }

      setSaving(true);

      try {
        const isUpdate = Boolean(targetResume._id);
        const response = isUpdate
          ? await resumeAPI.update(targetResume._id, targetResume)
          : await resumeAPI.save(targetResume);

        const savedResume = response.data;

        if (savedResume && savedResume._id) {
          setResumeData(savedResume);
          localStorage.setItem("currentResumeId", savedResume._id);
          setOriginalResumeData(JSON.parse(JSON.stringify(savedResume)));
        }

        if (showSuccessToast) {
          toast.success(
            isUpdate ? "Resume updated successfully!" : "Resume saved successfully!",
            {duration: 2500}
          );
        }

        return {ok: true, savedResume};
      } catch (err) {
        logger.error("Save error:", err);

        if (
          err.response?.status === 403 &&
          (err.response?.data?.upgradeRequired || err.response?.data?.quotaExceeded)
        ) {
          const errorData = err.response.data;
          setUpgradeMessage(
            errorData.message ||
              "Upgrade required to access this premium feature!"
          );
          showUpgradeModalTrue();
        } else if (showErrorToast) {
          toast.error(errorMessagePrefix + parseValidationErrors(err), {
            duration: 4000,
          });
        }

        return {ok: false, error: err};
      } finally {
        setSaving(false);
      }
    },
    [
      user,
      navigate,
      resumeData,
      setResumeData,
      setOriginalResumeData,
      setUpgradeMessage,
      showUpgradeModalTrue,
    ]
  );

  const handleSave = useCallback(async () => {
    const result = await saveResume();
    return result.ok;
  }, [saveResume]);

  return {
    saving,
    saveResume,
    handleSave,
  };
};
