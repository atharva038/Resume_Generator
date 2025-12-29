import {FileBox} from "lucide-react";

const TemplateManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-3">
          <FileBox className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-medium text-purple-400">Templates</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Template Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and customize resume templates
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
            <FileBox className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-white font-medium text-lg mb-2">Coming Soon</p>
          <p className="text-gray-400">
            Template management features are being developed
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Upload, manage, and monitor resume templates
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;
