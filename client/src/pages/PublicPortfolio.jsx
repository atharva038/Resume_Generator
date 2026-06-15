import {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {portfolioAPI} from "@/api/portfolio.api";
import PortfolioThemeRenderer from "@/components/portfolio/PortfolioThemeRenderer";

const PublicPortfolio = () => {
  const {slug} = useParams();
  const pageRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPublic(slug);
      setData(response.data);
      portfolioAPI.trackView(slug).catch(() => {});
    } catch (err) {
      setError(err.response?.data?.error || "Portfolio not found");
    } finally {
      setLoading(false);
    }
  };

  const trackContactClick = () => {
    portfolioAPI.trackContactClick(slug).catch(() => {});
  };

  const trackProjectClick = () => {
    portfolioAPI.trackProjectClick(slug).catch(() => {});
  };

  const resumeDownloadUrl = portfolioAPI.getResumeDownloadUrl(slug);

  const downloadPublicResume = useCallback(
    async (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();

      console.info("[Portfolio] Resume download requested", {
        slug,
        url: resumeDownloadUrl,
      });

      try {
        const response = await portfolioAPI.downloadResume(slug);
        const blob = response.data;
        const contentDisposition =
          response.headers?.["content-disposition"] || "";
        const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
        const filename =
          filenameMatch?.[1] || `${slug || "portfolio"}-resume.pdf`;

        console.info("[Portfolio] Resume download response received", {
          slug,
          status: response.status,
          contentType: blob?.type,
          size: blob?.size,
          filename,
        });

        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(objectUrl);

        console.info("[Portfolio] Resume download started", {slug, filename});
      } catch (err) {
        console.error("[Portfolio] Resume download failed", {
          slug,
          url: resumeDownloadUrl,
          status: err.response?.status,
          message: err.response?.data?.error || err.message,
        });
      }
    },
    [resumeDownloadUrl, slug]
  );

  useEffect(() => {
    const pageNode = pageRef.current;
    if (!pageNode) return;

    const handleResumeClick = (event) => {
      const trigger = event.target.closest("a, button");
      const label = trigger?.textContent?.trim().toLowerCase() || "";

      if (!trigger || !/^(view\s+)?resume$/.test(label)) return;

      downloadPublicResume(event);
    };

    pageNode.addEventListener("click", handleResumeClick, true);

    return () => {
      pageNode.removeEventListener("click", handleResumeClick, true);
    };
  }, [downloadPublicResume]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading portfolio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black text-gray-950">
            Portfolio unavailable
          </h1>
          <p className="text-gray-600 mt-3">
            {error || "This portfolio is not published yet."}
          </p>
        </div>
      </div>
    );
  }

  const {portfolio, resume, projects} = data;
  const pageTitle =
    portfolio.seo?.title || `${resume?.name || portfolio.title} Portfolio`;
  const description =
    portfolio.seo?.description ||
    portfolio.tagline ||
    portfolio.about ||
    "Professional portfolio";
  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const keywords = Array.isArray(portfolio.seo?.keywords)
    ? portfolio.seo.keywords.filter(Boolean).join(", ")
    : "";
  const ogImage =
    portfolio.seo?.ogImage ||
    portfolio.heroImage ||
    portfolio.profileImage ||
    "";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {portfolio.settings?.allowIndexing === false && (
          <meta name="robots" content="noindex,nofollow" />
        )}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta
          name="twitter:card"
          content={ogImage ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Helmet>
      <div ref={pageRef}>
        <PortfolioThemeRenderer
          portfolio={portfolio}
          resume={resume}
          projects={projects}
          mode="public"
          onContactClick={trackContactClick}
          onProjectClick={trackProjectClick}
          onResumeClick={downloadPublicResume}
          resumeDownloadUrl={resumeDownloadUrl}
        />
      </div>
    </>
  );
};

export default PublicPortfolio;
