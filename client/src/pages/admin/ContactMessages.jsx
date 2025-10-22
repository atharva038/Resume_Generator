import {useState, useEffect} from "react";
import {
  MessageSquare,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {getContactMessages} from "../../services/admin.api";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    category: "",
  });
  const [pagination, setPagination] = useState({total: 0, totalPages: 1});

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getContactMessages(filters);
      setMessages(response.data.data.messages);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Contact Messages
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Contact messages will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
