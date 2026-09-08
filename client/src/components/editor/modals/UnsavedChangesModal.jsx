import { AlertTriangle } from "lucide-react";

export default function UnsavedChangesModal({
  isOpen,
  saving,
  onSaveAndNavigate,
  onDiscardAndNavigate,
  onCancelNavigation,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onCancelNavigation}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full p-6 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle border border-gray-200 dark:border-zinc-800">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Unsaved Changes
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              You have unsaved changes to your resume. What would you like to do?
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={onSaveAndNavigate}
              disabled={saving}
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-blue-500/20"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={onDiscardAndNavigate}
              disabled={saving}
              className="w-full px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Discard Changes
            </button>

            <button
              onClick={onCancelNavigation}
              disabled={saving}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
