import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowLeft, Edit3, Monitor, Smartphone} from "lucide-react";
import {portfolioAPI} from "@/api/portfolio.api";
import PortfolioThemeRenderer from "@/components/portfolio/PortfolioThemeRenderer";

const PreviewIframe = ({children}) => {
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
        className="h-[780px] w-[390px] max-w-full rounded-[28px] border-8 border-zinc-900 bg-white shadow-2xl"
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
};

const PortfolioPreview = () => {
  const {id} = useParams();
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
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-zinc-700 p-1">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${
                  viewport === "desktop"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${
                  viewport === "mobile"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
            </div>
            <Link
              to={`/portfolio/${id}/edit`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-semibold"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto px-4 py-6">
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
            <div className="w-full max-w-6xl bg-white shadow-sm">
              <PortfolioThemeRenderer
                portfolio={portfolio}
                resume={resume}
                projects={projects}
                mode="preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
