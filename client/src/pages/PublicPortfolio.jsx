import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {portfolioAPI} from "@/api/portfolio.api";
import PortfolioThemeRenderer from "@/components/portfolio/PortfolioThemeRenderer";

const PublicPortfolio = () => {
  const {slug} = useParams();
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

  const trackResumeClick = () => {
    portfolioAPI.trackResumeDownload(slug).catch(() => {});
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({behavior: "smooth", block: "start"});
  };

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

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {portfolio.settings?.allowIndexing === false && (
          <meta name="robots" content="noindex,nofollow" />
        )}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
      </Helmet>
      <PortfolioThemeRenderer
        portfolio={portfolio}
        resume={resume}
        projects={projects}
        mode="public"
        onContactClick={trackContactClick}
        onProjectClick={trackProjectClick}
        onResumeClick={trackResumeClick}
      />
    </>
  );
};

export default PublicPortfolio;
