import {useState, useEffect} from "react";
import {Activity, Clock} from "lucide-react";
import {getAdminLogs} from "@/api/admin.api";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAdminLogs();
      setLogs(response.data.data.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-3">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">
            Activity Tracking
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Activity Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track admin actions and system activity
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 animate-pulse"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No activity logs yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/[0.07] rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {log.adminId?.name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="font-medium text-white">{log.description}</p>
                    <p className="text-sm text-gray-400">
                      by {log.adminId?.name || "Unknown Admin"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
