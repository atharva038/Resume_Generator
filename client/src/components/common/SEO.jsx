import {Helmet} from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title = "SmartNShine - AI-Powered ATS Resume Builder",
  description = "Build ATS-optimized resumes with AI assistance. Professional templates, job matching, and AI interview preparation. Get hired faster with SmartNShine.",
  keywords = "ATS resume builder, AI resume maker, professional resume templates, job application, resume optimizer, ATS optimization, career tools, interview preparation",
  image = "https://www.smartnshine.app/Logo_Main.png",
  url = "https://www.smartnshine.app",
  type = "website",
  article = null,
}) => {
  // Ensure title includes site name if not already present
  const fullTitle = title.includes("SmartNShine")
    ? title
    : `${title} | SmartNShine`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SmartNShine" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific tags */}
      {article && (
        <>
          <meta
            property="article:published_time"
            content={article.publishedTime}
          />
          <meta
            property="article:modified_time"
            content={article.modifiedTime}
          />
          <meta property="article:author" content={article.author} />
          {article.tags &&
            article.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@smartnshine" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  article: PropTypes.shape({
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    author: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SEO;
