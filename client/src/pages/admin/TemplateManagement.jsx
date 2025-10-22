import {FileBox} from "lucide-react";

const TemplateManagement = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Template Management
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <FileBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Template management features coming soon
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Upload, manage, and monitor resume templates
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;
