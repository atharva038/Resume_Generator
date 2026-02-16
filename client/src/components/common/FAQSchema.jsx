import {Helmet} from "react-helmet-async";
import PropTypes from "prop-types";

/**
 * FAQSchema Component
 * Adds Schema.org FAQPage structured data for SEO
 *
 * @param {Array} faqs - Array of FAQ objects with question and answer properties
 * @example
 * <FAQSchema faqs={[
 *   { question: "What is ATS?", answer: "ATS stands for..." },
 *   { question: "How does it work?", answer: "It works by..." }
 * ]} />
 */
const FAQSchema = ({faqs}) => {
  // Generate the FAQ schema object
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
};

FAQSchema.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FAQSchema;
