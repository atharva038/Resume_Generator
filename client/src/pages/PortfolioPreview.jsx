import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "@/components/common/SEO";
import { ArrowLeft, Edit3, Monitor, Smartphone, Globe2 } from "lucide-react";
import { portfolioAPI } from "@/api/portfolio.api";
import PortfolioThemeRenderer from "@/components/portfolio/PortfolioThemeRenderer";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";

const PreviewIframe = ({ children }) => {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  const hydrateFrame = () => {
    const iframe = iframeRef.current;
    const frameDocument = iframe?.contentDocument;

    if (!frameDocument) return;

    frameDocument.head.innerHTML = "";
    document
      .querySelectorAll('link[rel="stylesheet"], style')
      .forEach((node) => {
        frameDocument.head.appendChild(node.cloneNode(true));
      });

    const baseStyle = frameDocument.createElement("style");
    baseStyle.textContent = `
      html, body, #preview-root {
        margin: 0;
        min-height: 100%;
        width: 100%;
        overflow-x: hidden;
        background: #ffffff;
      }
      * {
        box-sizing: border-box;
      }
    `;
    frameDocument.head.appendChild(baseStyle);
    setMountNode(frameDocument.getElementById("preview-root"));
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Mobile portfolio preview"
        onLoad={hydrateFrame}
        srcDoc="<!doctype html><html><head></head><body><div id='preview-root'></div></body></html>"
        className="h-[780px] w-[390px] max-w-full rounded-[32px] border-[10px] border-zinc-900 bg-white shadow-2xl transition-all"
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
};

export default function PortfolioPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [resume, setResume] = useState(null);
  const [projects, setProjects] = useState([]);
  const [viewport, setViewport] = useState("desktop");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getById(id);
      setPortfolio(response.data.portfolio);
      setResume(response.data.resume);
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
      <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-3 border-gray-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-emerald-500 rounded-full animate-spin"></div>
            <Globe2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold tracking-wide uppercase">
            Loading Live Preview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <SEO
        title={`Preview: ${portfolio?.title || "Portfolio"} | SmartNShine`}
        description="Live preview of your interactive developer portfolio website."
      />

      {/* Top Header */}
      <PortfolioHeader
        onGoBack={() => navigate(`/portfolio/${id}/edit`)}
        badgeText="Live Preview"
        actionButton={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200/80 dark:border-white/[0.08] p-1">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewport === "desktop"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewport === "mobile"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <Link
              to={`/portfolio/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Portfolio</span>
            </Link>
          </div>
        }
      />

      {/* Main Preview Frame */}
      <main className="flex-1 overflow-x-auto px-4 py-8">
        <div className="mx-auto flex justify-center">
          {viewport === "mobile" ? (
            <PreviewIframe>
              <PortfolioThemeRenderer
                portfolio={portfolio}
                resume={resume}
                projects={projects}
                mode="preview"
              />
            </PreviewIframe>
          ) : (
            <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 dark:border-white/[0.08] bg-white">
              <PortfolioThemeRenderer
                portfolio={portfolio}
                resume={resume}
                projects={projects}
                mode="preview"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
