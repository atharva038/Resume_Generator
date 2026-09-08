import {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {portfolioAPI} from "@/api/portfolio.api";
import PortfolioThemeRenderer from "@/components/portfolio/PortfolioThemeRenderer";
import {resolveImageUrl} from "@/utils/imageUrlResolver";

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
  const rawOgImage = resolveImageUrl(
    portfolio.seo?.ogImage ||
    portfolio.profileImage ||
    portfolio.heroImage ||
    portfolio.profile?.profileImage ||
    resume?.photo ||
    ""
  );

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.smartnshine.app";

  const ogImage = useMemo(() => {
    if (!rawOgImage) return `${origin}/social-preview.png?v=4`;
    if (rawOgImage.startsWith("http://") || rawOgImage.startsWith("https://")) {
      return rawOgImage;
    }
    return `${origin}${rawOgImage.startsWith("/") ? "" : "/"}${rawOgImage}`;
  }, [rawOgImage, origin]);

  const rawFavicon = portfolio.seo?.favicon || portfolio.favicon || "";
  const favicon = useMemo(() => {
    if (!rawFavicon) return "";
    if (rawFavicon.startsWith("http://") || rawFavicon.startsWith("https://")) {
      return rawFavicon;
    }
    return `${origin}${rawFavicon.startsWith("/") ? "" : "/"}${rawFavicon}`;
  }, [rawFavicon, origin]);

  // Dynamically update browser tab favicon in DOM
  useEffect(() => {
    if (favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = favicon;
    }
  }, [favicon]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {favicon && <link rel="icon" href={favicon} />}
        {favicon && <link rel="shortcut icon" href={favicon} />}
        {favicon && <link rel="apple-touch-icon" href={favicon} />}
        {portfolio.settings?.allowIndexing === false ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : (
          <meta name="robots" content="index,follow,max-image-preview:large" />
        )}
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="SmartNShine" />
        <meta property="og:url" content={canonicalUrl || `${origin}/u/${portfolio.slug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${pageTitle} Preview`} />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl || `${origin}/u/${portfolio.slug}`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={`${pageTitle} Preview`} />
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
