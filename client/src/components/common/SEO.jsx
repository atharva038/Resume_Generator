import {Helmet} from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title = "SmartNShine - #1 ATS Resume Builder, Developer Portfolio Maker & AI Interview Platform",
  description = "Build 98%+ pass rate ATS resumes, generate stunning interactive developer portfolios from GitHub, check real-time ATS scores, and practice AI voice mock interviews. Free templates & instant export.",
  keywords = "ATS resume builder, free developer portfolio builder, portfolio maker, ATS score checker, Taleo resume checker, Workday resume format, software engineer portfolio, modern resume templates, AI bullet optimizer, free resume maker PDF, AI mock interview, GitHub portfolio generator",
  image = "https://www.smartnshine.app/social-preview.png",
  imageAlt = null,
  imageWidth = 1200,
  imageHeight = 630,
  url = "https://www.smartnshine.app/",
  type = "website",
  article = null,
  noindex = false,
  structuredData = null,
}) => {
  // Ensure title includes site name if not already present
  const fullTitle = title.includes("SmartNShine")
    ? title
    : `${title} | SmartNShine`;

  const finalImageAlt =
    imageAlt || `${fullTitle} - The AI Career Platform`;
  const isHttps = typeof image === "string" && image.startsWith("https://");

  // Normalize root domain URL with trailing slash for canonical consistency
  const normalizedUrl =
    url === "https://www.smartnshine.app"
      ? "https://www.smartnshine.app/"
      : url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={normalizedUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={normalizedUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {isHttps && <meta property="og:image:secure_url" content={image} />}
      {imageWidth && (
        <meta property="og:image:width" content={String(imageWidth)} />
      )}
      {imageHeight && (
        <meta property="og:image:height" content={String(imageHeight)} />
      )}
      <meta property="og:image:alt" content={finalImageAlt} />
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
      <meta name="twitter:url" content={normalizedUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      <meta name="twitter:site" content="@smartnshine" />
      <meta name="twitter:creator" content="@smartnshine" />

      {/* Optional Structured Data JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  imageWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imageHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  url: PropTypes.string,
  type: PropTypes.string,
  noindex: PropTypes.bool,
  structuredData: PropTypes.object,
  article: PropTypes.shape({
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    author: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SEO;
