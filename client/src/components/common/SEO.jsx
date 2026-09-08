import {Helmet} from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title = "SmartNShine - AI-Powered ATS Resume Builder",
  description = "Build ATS-optimized resumes with AI assistance. Professional templates, job matching, and career tools. Get hired faster with SmartNShine.",
  keywords = "ATS resume builder, AI resume maker, professional resume templates, job application, resume optimizer, ATS optimization, career tools, developer portfolio",
  image = "https://www.smartnshine.app/social-preview.png",
  imageAlt = null,
  imageWidth = 1200,
  imageHeight = 630,
  url = "https://www.smartnshine.app",
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
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
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
      <meta name="twitter:url" content={url} />
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
