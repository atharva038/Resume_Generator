import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowLeft, Edit3} from "lucide-react";
import {portfolioAPI} from "@/api/portfolio.api";
import PortfolioPublicView from "@/components/portfolio/PortfolioPublicView";

const PortfolioPreview = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getById(id);
      setPortfolio(response.data.portfolio);
      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error("Failed to load preview");
      console.error(error);
      navigate("/portfolio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading preview...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <div className="sticky top-0 z-20 border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            to={`/portfolio/${id}/edit`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to editor
          </Link>
          <Link
            to={`/portfolio/${id}/edit`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-semibold"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto bg-white shadow-sm">
        <PortfolioPublicView
          portfolio={portfolio}
          resume={null}
          projects={projects}
        />
      </div>
    </div>
  );
};

export default PortfolioPreview;
