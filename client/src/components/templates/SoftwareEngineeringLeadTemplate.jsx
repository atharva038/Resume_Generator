import { forwardRef, useRef, useEffect, useState } from "react";

const SoftwareEngineeringLeadTemplate = forwardRef(({ resumeData, onPageUsageChange }, ref) => {
  // Merge with default dummy data
  const defaultData = {
    name: "Sophia Williams",
    title: "Software Engineering Lead",
    summary: "Software engineering lead with ten years' experience implementing backend systems in C++; led re-architecture of key platform that serves 100,000 requests per month, increasing speed by 20 percent; awarded the prestigious 'Most Impactful' award, given to the top 5 percent of engineers based on total impact to firm; promoted two times in 18 months, six months ahead of schedule. Expert in distributed systems, microservices architecture, and cloud-native applications.",
    contact: {
      location: "Bay Area, California",
      phone: "+1-234-567-8901",
      email: "sophia.williams@resumeworded.com",
      linkedin: "linkedin.com/in/sophiawilliamseng"
    },
    experience: [
      {
        title: "Software Engineering Manager and Data Science Manager",
        company: "Resume Worded",
        location: "New York, NY",
        startDate: "November 2015",
        current: true,
        summary: "Launched Miami office with lead Director and recruited a new team of 10 employees; grew office revenue by 200% in first nine months (representing 20% of company revenue). Co-managed analytics and engineering teams. Led migration from monolithic architecture to microservices, reducing deployment failures by 85%.",
        bullets: [
          "Led the first major effort to A/B test the company's e-commerce sales page and optimize it for customer acquisition; resulted in a 7.5% increase in conversions",
          "Built Tableau dashboard using data from Amplitude and Segment to visualize core business KPIs (e.g. Monthly Recurring Revenue), saving 10 hours per week of manual reporting work",
          "Reduced signup drop-offs from 65% to 15% and increased user engagement by 40%, through a combination of hypothesis testing, segmentation analysis and machine learning algorithms",
          "Architected and led implementation of real-time data processing pipeline handling 2M events/day, reducing latency from 5 seconds to 200ms",
          "Mentored 15+ engineers through formal mentorship program, with 5 promotions to senior roles under guidance",
          "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes and increasing deployment frequency by 300%"
        ]
      },
      {
        title: "Business Analyst",
        company: "Growthsi",
        location: "San Francisco, CA",
        startDate: "June 2013",
        endDate: "October 2015",
        summary: "First hire on the analytics team of RW Ventures funded startup ($10mm Series A). Developed product strategies for lead Director and trained the team as it grew to 25 employees. Led redesign of mobile app and website. Built data infrastructure from ground up.",
        bullets: [
          "Spearheaded a major pricing restructure by redirecting focus on consumer willingness to pay instead of product cost; implemented a three-tiered pricing model which increased average sale 35% and margin 12%",
          "Designed training and peer-mentoring programs for the incoming class of 25 analysts in 2017; reduced onboarding time for new hires by 50%",
          "Developed and implemented data warehouse architecture that consolidated data from 15+ sources, improving reporting accuracy by 40%",
          "Created predictive models for customer lifetime value with 89% accuracy, informing marketing spend allocation",
          "Led agile transformation across 5 engineering teams, increasing velocity by 25% and reducing bug count by 30%"
        ]
      },
      {
        title: "Business Development Consultant",
        company: "Resume Worded's Exciting Company",
        location: "New York, NY",
        startDate: "August 2010",
        endDate: "January 2013",
        summary: "Liaised with C-level executives of My Exciting Company, a RW Ventures-backed ecommerce marketplace website with 100k members which helps designers sell their artwork and designs to businesses. Provided technical consulting on platform scalability and performance optimization.",
        bullets: [
          "Strengthened relationships with 6 strategic partners (including Expedia, Skyscanner and Airbnb) through follow-up meetings with C-suite executives",
          "Developed and executed customer referral program, leading to 50% increase in referral business and $2MM of incremental revenue",
          "Architected API gateway serving 10M requests/day with 99.99% uptime, reducing error rate from 2% to 0.1%",
          "Led performance optimization efforts that reduced page load times by 60% and improved Google Lighthouse scores by 40 points",
          "Implemented monitoring and alerting system that reduced mean time to detection (MTTD) from 30 minutes to 2 minutes"
        ]
      }
    ],
    education: [
      {
        institution: "Resume Worded University",
        location: "New York, NY",
        degree: "Bachelor of Engineering",
        field: "Computer Science"
      },
      {
        institution: "Carnegie Mellon University",
        location: "Pittsburgh, PA",
        degree: "Master of Science",
        field: "Software Engineering"
      }
    ],
    skills: [
      {
        category: "Programming Languages",
        items: "C++, Python, Java, JavaScript, Go, Rust, SQL, TypeScript"
      },
      {
        category: "Frameworks & Libraries",
        items: "React, Node.js, Django, Spring Boot, TensorFlow, PyTorch, Kubernetes, Docker"
      },
      {
        category: "Cloud & Infrastructure",
        items: "AWS (EC2, S3, Lambda, RDS, EKS), Google Cloud Platform, Azure, Terraform, Ansible"
      },
      {
        category: "Databases",
        items: "PostgreSQL, MongoDB, Redis, Cassandra, Elasticsearch, MySQL"
      },
      {
        category: "Data Engineering",
        items: "Apache Spark, Kafka, Airflow, Hadoop, Dataflow, BigQuery, Redshift"
      },
      {
        category: "DevOps & Tools",
        items: "Git, Jenkins, CircleCI, GitHub Actions, Prometheus, Grafana, Splunk, New Relic"
      }
    ]
  };

  const mergedData = { ...defaultData, ...resumeData };

  // Page overflow detection state
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056,
    overflowPercentage: 0,
    templateName: "SoftwareEngineeringLeadTemplate",
  });

  // Detect page overflow whenever resumeData changes
  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight;
      const maxHeight = 1056;
      const isOverflowing = currentHeight > maxHeight;
      const overflowPercentage = isOverflowing
        ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
        : 0;

      const usageInfo = {
        isOverflowing,
        currentHeight,
        maxHeight,
        overflowPercentage,
        percentage: Math.round((currentHeight / maxHeight) * 100),
        templateName: "SoftwareEngineeringLeadTemplate",
      };

      setPageOverflowInfo(usageInfo);

      if (isOverflowing) {
        console.log(
          `⚠️ SoftwareEngineeringLeadTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
        );
      }

      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]);

  // Theme colors for the template
  const selectedTheme = {
    primary: "#000000",
    secondary: "#000000",
    text: "#000000",
    textLight: "#666666",
    textMuted: "#999999",
    border: "#e0e0e0",
    bg: "#ffffff",
  };

  // Helper function to safely format skills (handles both array and string)
  const formatSkills = (items) => {
    if (Array.isArray(items)) {
      return items.join(", ");
    }
    if (typeof items === "string") {
      return items;
    }
    return "";
  };

  // Default section order
  const DEFAULT_SECTION_ORDER = ["experience", "projects", "education", "skills", "certifications", "customSections"];

  const sectionOrder =
    mergedData.sectionOrder && mergedData.sectionOrder.length > 0
      ? mergedData.sectionOrder.filter(
          (id) => !["summary", "contact", "score", "personal", "recommendations", "achievements"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles
  const getSectionTitle = (sectionId) => {
    const customTitles = mergedData.sectionTitles || {};
    const defaultTitles = {
      experience: "WORK EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      skills: "SKILLS & OTHER",
      certifications: "CERTIFICATIONS",
      achievements: "ACHIEVEMENTS",
    };
    return customTitles[sectionId] || defaultTitles[sectionId] || sectionId;
  };

  // Render section helper function
  const renderSection = (sectionId) => {
    const sectionStyle = {
      marginBottom: "20px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    };

    const sections = {
      experience: mergedData.experience && mergedData.experience.length > 0 && (
        <section key="experience" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "18px",
              color: selectedTheme.primary,
              marginBottom: "16px",
              marginTop: "8px",
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          
          {mergedData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "24px"}}>
              {/* Job title - bold */}
              <div className="font-bold" style={{
                fontSize: "14px",
                marginBottom: "6px"
              }}>
                {exp.title}
              </div>
              
              {/* Company and location */}
              <div style={{
                fontSize: "13px",
                marginBottom: "10px"
              }}>
                {exp.company}
                {exp.location && `, ${exp.location}`}
              </div>
              
              {/* Summary paragraph or description */}
              {(exp.summary || exp.description) && (
                <div style={{
                  fontSize: "11px",
                  marginBottom: "12px",
                  lineHeight: "1.4"
                }}>
                  {exp.summary || exp.description}
                </div>
              )}
              
              {/* Bullet points */}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{
                  paddingLeft: "20px"
                }}>
                  {exp.bullets.map((bullet, i) => (
                    <li 
                      key={i} 
                      style={{
                        fontSize: "11px", 
                        marginBottom: "8px", 
                        color: selectedTheme.text,
                        lineHeight: "1.4",
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Date aligned to right */}
              {exp.startDate && (
                <div style={{
                  fontSize: "12px",
                  textAlign: "right",
                  color: selectedTheme.textLight,
                  marginTop: "6px"
                }}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </div>
              )}
              
              {/* Separator line (thick) */}
              {index < mergedData.experience.length - 1 && (
                <div style={{
                  borderTop: `2px solid ${selectedTheme.border}`,
                  margin: "16px 0",
                  height: "1px"
                }} />
              )}
            </div>
          ))}
        </section>
      ),

      projects: mergedData.projects && mergedData.projects.length > 0 && (
        <section key="projects" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "18px",
              color: selectedTheme.primary,
              marginBottom: "16px",
              marginTop: "8px",
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          
          {mergedData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "20px"}}>
              {/* Project name - bold */}
              <div className="font-bold" style={{
                fontSize: "14px",
                marginBottom: "6px"
              }}>
                {project.name || "Project Name"}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: "10px",
                      fontSize: "12px",
                      color: selectedTheme.textLight,
                      textDecoration: "underline",
                    }}
                  >
                    View Project
                  </a>
                )}
              </div>
              
              {/* Technologies */}
              {project.technologies && (
                <div style={{
                  fontSize: "12px",
                  color: selectedTheme.textLight,
                  marginBottom: "8px",
                  fontStyle: "italic"
                }}>
                  Technologies: {formatSkills(project.technologies)}
                </div>
              )}
              
              {/* Description */}
              {project.description && (
                <div style={{
                  fontSize: "11px",
                  marginBottom: "10px",
                  lineHeight: "1.4"
                }}>
                  {project.description}
                </div>
              )}
              
              {/* Bullet points */}
              {project.bullets && project.bullets.length > 0 && (
                <ul style={{
                  paddingLeft: "20px"
                }}>
                  {project.bullets.map((bullet, i) => (
                    <li 
                      key={i} 
                      style={{
                        fontSize: "11px", 
                        marginBottom: "6px", 
                        color: selectedTheme.text,
                        lineHeight: "1.4",
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Separator line */}
              {index < mergedData.projects.length - 1 && (
                <div style={{
                  borderTop: `2px solid ${selectedTheme.border}`,
                  margin: "16px 0",
                  height: "1px"
                }} />
              )}
            </div>
          ))}
        </section>
      ),

      education: mergedData.education && mergedData.education.length > 0 && (
        <section key="education" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "18px",
              color: selectedTheme.primary,
              marginBottom: "16px",
              marginTop: "8px",
            }}
          >
            {getSectionTitle("education")}
          </h2>
          
          {mergedData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              {/* Institution and location */}
              <div className="font-bold" style={{
                fontSize: "14px",
                marginBottom: "6px"
              }}>
                {edu.institution}
                {edu.location && `, ${edu.location}`}
              </div>
              
              {/* Degree */}
              <div style={{
                fontSize: "12px",
                marginBottom: "4px"
              }}>
                {edu.degree}{edu.field && ` — ${edu.field}`}
              </div>
              
              {/* GPA */}
              {edu.gpa && (
                <div style={{
                  fontSize: "12px",
                  color: selectedTheme.textLight
                }}>
                  GPA: {edu.gpa}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      skills: mergedData.skills && mergedData.skills.length > 0 && (
        <section key="skills" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "18px",
              color: selectedTheme.primary,
              marginBottom: "16px",
              marginTop: "8px",
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          
          {/* Separator line */}
          <div style={{
            borderTop: `2px solid ${selectedTheme.border}`,
            marginBottom: "16px"
          }} />
          
          {/* Skills grouped by category */}
          <div style={{fontSize: "11px", lineHeight: "1.5"}}>
            {mergedData.skills.map((skillGroup, index) => (
              <div key={index} style={{marginBottom: "10px"}}>
                {/* Category title in bold */}
                <div style={{
                  fontWeight: "bold",
                  marginBottom: "4px"
                }}>
                  {skillGroup.category}:
                </div>
                
                {/* Skills comma separated */}
                <div>
                  {formatSkills(skillGroup.items)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),

      certifications: mergedData.certifications && mergedData.certifications.length > 0 && (
        <section key="certifications" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "18px",
              color: selectedTheme.primary,
              marginBottom: "16px",
              marginTop: "8px",
            }}
          >
            {getSectionTitle("certifications")}
          </h2>
          
          <div style={{fontSize: "11px", lineHeight: "1.5"}}>
            {mergedData.certifications.map((cert, index) => (
              <div key={index} style={{marginBottom: "8px"}}>
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && (
                  <span style={{color: selectedTheme.textLight}}>
                    {" — "}{cert.issuer}
                  </span>
                )}
                {cert.date && (
                  <span style={{color: selectedTheme.textLight}}>
                    {" ("}{cert.date}{")"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

      customSections: mergedData.customSections && mergedData.customSections.length > 0 && (
        <div key="customSections">
          {mergedData.customSections.map((section, sectionIndex) => {
            if (section.title && section.items && section.items.length > 0) {
              return (
                <section key={sectionIndex} style={sectionStyle}>
                  <h2
                    className="font-bold"
                    style={{
                      fontSize: "18px",
                      color: selectedTheme.primary,
                      marginBottom: "16px",
                      marginTop: "8px",
                    }}
                  >
                    {section.title.toUpperCase()}
                  </h2>
                  
                  <ul style={{paddingLeft: "20px"}}>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        style={{
                          fontSize: "11px",
                          marginBottom: "8px",
                          color: selectedTheme.text,
                          lineHeight: "1.4",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }
            return null;
          })}
        </div>
      ),
    };

    return sections[sectionId] || null;
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className="resume-preview font-resume"
      style={{
        minHeight: "11in",
        padding: "0.5in",
        fontSize: "12px",
        lineHeight: "1.4",
        color: selectedTheme.text,
        backgroundColor: selectedTheme.bg,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{marginBottom: "24px"}}>
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "8px",
            color: selectedTheme.primary,
            fontWeight: "bold",
          }}
        >
          {mergedData.name || "First Last"}
        </h1>
        
        {/* Job Title */}
        <div
          style={{
            fontSize: "18px",
            marginBottom: "16px",
            color: selectedTheme.primary,
            fontWeight: "bold",
          }}
        >
          {mergedData.title || "Software Engineering Lead"}
        </div>
        
        {/* Contact info in one line with dots */}
        <div
          style={{
            fontSize: "11px",
            color: selectedTheme.text,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          {mergedData.contact?.location && (
            <span style={{marginRight: "8px"}}>{mergedData.contact.location}</span>
          )}
          {mergedData.contact?.location && mergedData.contact?.phone && (
            <span style={{margin: "0 8px"}}>•</span>
          )}
          {mergedData.contact?.phone && (
            <span style={{marginRight: "8px"}}>{mergedData.contact.phone}</span>
          )}
          {mergedData.contact?.phone && mergedData.contact?.email && (
            <span style={{margin: "0 8px"}}>•</span>
          )}
          {mergedData.contact?.email && (
            <a
              href={`mailto:${mergedData.contact.email}`}
              style={{
                color: selectedTheme.text,
                textDecoration: "none",
                marginRight: "8px",
              }}
            >
              {mergedData.contact.email}
            </a>
          )}
        </div>
        
        {/* Summary paragraph */}
        {mergedData.summary && (
          <div style={{
            fontSize: "12px",
            color: selectedTheme.text,
            lineHeight: "1.5",
            marginBottom: "8px"
          }}>
            {mergedData.summary}
          </div>
        )}
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

SoftwareEngineeringLeadTemplate.displayName = "SoftwareEngineeringLeadTemplate";

export default SoftwareEngineeringLeadTemplate;