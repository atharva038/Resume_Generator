import { forwardRef, useRef, useEffect, useState } from "react";

const MarketingDirectorTemplate = forwardRef(({ resumeData, onPageUsageChange }, ref) => {
  // Merge with default dummy data
  const defaultData = {
    name: "Marcus Rodriguez",
    contact: {
      location: "Bay Area, California",
      phone: "+1-234-567-8901",
      email: "marcus.rodriguez@resumeworded.com",
      linkedin: "linkedin.com/in/marcusrodriguez"
    },
    experience: [
      {
        title: "Marketing Director",
        company: "Resume Worded",
        location: "New York, NY",
        bullets: [
          "Increased media reach and frequency while reducing spending down to 5% by creating and negotiating annual media plans.",
          "Achieved revenue of over $1.3 million by providing research data, market and account analysis to salesforce that transformed key account relationships.",
          "Reduced cost per account by 53% by implementing an acquisition strategy that maintained new account volume and developing efficient direct-response acquisition programs across multiple digital channels.",
          "Led rebranding initiative for company's flagship product, resulting in 45% increase in brand recognition and 30% growth in qualified leads.",
          "Managed $2.5M annual marketing budget, optimizing allocation across channels to achieve 22% ROI improvement.",
          "Built and mentored high-performing team of 12 marketing professionals, reducing turnover by 40% through improved training and career development programs."
        ]
      },
      {
        title: "Marketing Manager",
        company: "GROWTHSI",
        location: "New York, NY",
        bullets: [
          "Improved marketing performance by 60% by driving initiatives such as marketing performance reports and developing new scoring techniques.",
          "Increased annual revenue by 63% by planning, organizing, and implementing direct and digital marketing strategies.",
          "Developed and executed multi-channel marketing campaigns that generated 15,000+ qualified leads annually.",
          "Implemented marketing automation system that increased lead conversion rate by 35% and reduced manual work by 20 hours/week.",
          "Collaborated with product team to launch 3 new product lines, achieving 125% of revenue targets in first year."
        ]
      },
      {
        title: "Product Development Manager",
        company: "RESUME WORDED",
        location: "San Diego, CA",
        startDate: "Nov 2011",
        endDate: "Dec 2014",
        bullets: [
          "Negotiated cost, product placement, and production for 210 companies, obtaining an average of $1.5 to $2 million in yearly revenue.",
          "Managed over 20 projects, including a national catalog of over 1000 applications for basic mobile devices with 99.9% accuracy.",
          "Led cross-functional teams of 8-10 members to deliver products 15% ahead of schedule.",
          "Implemented agile development processes that reduced time-to-market by 25% and increased team productivity by 30%.",
          "Conducted market research and competitive analysis that informed product roadmap and feature prioritization."
        ],
        nestedPositions: [
          {
            title: "Junior Project Manager",
            startDate: "May 2010",
            endDate: "Oct 2011",
            bullets: [
              "Assisted in generating over $350,000 in sales within 6 months of employment by tracking all requirements to ensure smooth delivery.",
              "Improved production process with 87% greater efficiency saving $57,000 in administrative expenses ranging from overtime pay, legal fees, and penalties for seeking extensions for overseas filings.",
              "Coordinated with 15+ vendors and suppliers to ensure timely delivery of materials and components.",
              "Created project tracking dashboards that provided real-time visibility into project status and resource allocation."
            ]
          },
          {
            title: "Business Analyst",
            startDate: "May 2008",
            endDate: "Oct 2011",
            bullets: [
              "Achieved savings of 20%-35% per inventory purchase by revising purchase ordering algorithm to minimize overstock and reviewed purchase orders.",
              "Coordinated vendor selection process for projects impacting more than 250 branch locations worldwide.",
              "Developed business intelligence reports that identified $500K+ in cost saving opportunities.",
              "Implemented inventory management system that reduced stockouts by 65% and improved inventory turnover by 40%."
            ]
          }
        ]
      }
    ],
    education: [
      {
        institution: "Resume Worded University",
        location: "San Francisco, CA",
        degree: "Master of Business Administration Candidate",
        field: "Business Analytics",
        graduationDate: "May 2010"
      },
      {
        institution: "Stanford University",
        location: "Stanford, CA",
        degree: "Bachelor of Science",
        field: "Marketing & Communications",
        graduationDate: "May 2006"
      }
    ],
    skills: [
      {
        category: "Marketing Platforms",
        items: [
          "Marketing Automation (HubSpot, Marketo, Pardot)",
          "Search Engine Optimization (SEO)",
          "Search Engine Marketing (SEM)",
          "CRM (Salesforce, HubSpot CRM)",
          "Facebook Ads Manager",
          "YouTube Ads",
          "Print Media Planning",
          "Programmatic Advertising"
        ]
      },
      {
        category: "Digital Marketing",
        items: [
          "Influencer Marketing",
          "Brand Management",
          "Brand Partnerships",
          "Content Marketing",
          "Social Media Strategy",
          "Email Marketing",
          "Conversion Rate Optimization",
          "Marketing Analytics"
        ]
      },
      {
        category: "Technical & Tools",
        items: [
          "Google Analytics",
          "Google Ads",
          "Tableau",
          "Adobe Creative Suite",
          "WordPress",
          "SQL",
          "HTML/CSS",
          "Microsoft Office Suite"
        ]
      },
      {
        category: "Strategic",
        items: "Market Research, Competitive Analysis, Pricing Strategy, Go-to-Market Planning, Budget Management, Team Leadership, Stakeholder Management"
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
    templateName: "MarketingDirectorTemplate",
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
        templateName: "MarketingDirectorTemplate",
      };

      setPageOverflowInfo(usageInfo);

      if (isOverflowing) {
        console.log(
          `⚠️ MarketingDirectorTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
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
  const DEFAULT_SECTION_ORDER = ["experience", "projects", "education", "skills", "certifications", "achievements", "customSections"];

  const sectionOrder =
    mergedData.sectionOrder && mergedData.sectionOrder.length > 0
      ? mergedData.sectionOrder.filter(
          (id) => !["summary", "contact", "score", "personal", "recommendations"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles
  const getSectionTitle = (sectionId) => {
    const customTitles = mergedData.sectionTitles || {};
    const defaultTitles = {
      experience: "PROFESSIONAL EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      skills: "SKILLS",
      certifications: "CERTIFICATIONS",
      achievements: "ACHIEVEMENTS",
    };
    return (
      customTitles[sectionId] ||
      defaultTitles[sectionId] ||
      sectionId
    ).toUpperCase();
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
            <div key={index} style={{marginBottom: "20px"}}>
              {/* Company and location */}
              <div className="font-bold" style={{
                fontSize: "14px",
                marginBottom: "6px"
              }}>
                {exp.company}
                {exp.location && `, ${exp.location}`}
              </div>
              
              {/* Job title */}
              <div className="font-bold" style={{
                fontSize: "13px",
                marginBottom: "10px"
              }}>
                {exp.title}
                {exp.startDate && !exp.endDate && !exp.current && ` (${exp.startDate})`}
                {exp.startDate && exp.endDate && ` (${exp.startDate} – ${exp.endDate})`}
                {exp.startDate && exp.current && ` (${exp.startDate} – Present)`}
              </div>
              
              {/* Description */}
              {(exp.description || exp.summary) && (
                <div style={{
                  fontSize: "11px",
                  marginBottom: "10px",
                  lineHeight: "1.4"
                }}>
                  {exp.description || exp.summary}
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
              
              {/* Nested positions (like in the template) */}
              {exp.nestedPositions && exp.nestedPositions.map((nested, nestedIndex) => (
                <div key={nestedIndex} style={{marginTop: "12px", marginLeft: "20px"}}>
                  <div className="font-bold" style={{
                    fontSize: "13px",
                    marginBottom: "6px"
                  }}>
                    {nested.title} ({nested.startDate} – {nested.endDate})
                  </div>
                  
                  {nested.bullets && nested.bullets.length > 0 && (
                    <ul style={{paddingLeft: "20px"}}>
                      {nested.bullets.map((bullet, i) => (
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
                </div>
              ))}
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
            <div key={index} style={{marginBottom: "18px"}}>
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
              
              {project.technologies && (
                <div style={{
                  fontSize: "12px",
                  color: selectedTheme.textLight,
                  marginBottom: "6px",
                  fontStyle: "italic"
                }}>
                  Technologies: {formatSkills(project.technologies)}
                </div>
              )}
              
              {project.description && (
                <div style={{
                  fontSize: "11px",
                  marginBottom: "8px",
                  lineHeight: "1.4"
                }}>
                  {project.description}
                </div>
              )}
              
              {project.bullets && project.bullets.length > 0 && (
                <ul style={{paddingLeft: "20px"}}>
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
                {edu.degree}
                {edu.field && `; ${edu.field}`}
              </div>
              
              {/* GPA */}
              {edu.gpa && (
                <div style={{
                  fontSize: "12px",
                  color: selectedTheme.textLight,
                  marginBottom: "4px"
                }}>
                  GPA: {edu.gpa}
                </div>
              )}
              
              {/* Date aligned to right */}
              <div style={{
                fontSize: "12px",
                textAlign: "right",
                color: selectedTheme.textLight
              }}>
                {edu.graduationDate || edu.endDate}
              </div>
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
          
          {/* Skills grouped by category */}
          <div style={{fontSize: "11px", lineHeight: "1.4"}}>
            {mergedData.skills.map((skillGroup, index) => (
              <div key={index} style={{marginBottom: "10px"}}>
                <div style={{fontWeight: "bold", marginBottom: "4px"}}>
                  {skillGroup.category}:
                </div>
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
          
          <div style={{fontSize: "11px", lineHeight: "1.4"}}>
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

      achievements: mergedData.achievements && mergedData.achievements.length > 0 && (
        <section key="achievements" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "18px",
              color: selectedTheme.primary,
              marginBottom: "16px",
              marginTop: "8px",
            }}
          >
            {getSectionTitle("achievements")}
          </h2>
          
          <ul style={{paddingLeft: "20px"}}>
            {mergedData.achievements.map((achievement, index) => (
              <li
                key={index}
                style={{
                  fontSize: "11px",
                  marginBottom: "6px",
                  color: selectedTheme.text,
                  lineHeight: "1.4",
                }}
              >
                {achievement}
              </li>
            ))}
          </ul>
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
                          marginBottom: "6px",
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
      {/* Header - Name in ALL CAPS */}
      <header style={{marginBottom: "20px"}}>
        <h1
          className="uppercase"
          style={{
            fontSize: "28px",
            marginBottom: "16px",
            color: selectedTheme.primary,
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          {mergedData.name ? mergedData.name.toUpperCase() : "FIRST LAST"}
        </h1>
        
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
          {mergedData.contact?.email && mergedData.contact?.linkedin && (
            <span style={{margin: "0 8px"}}>•</span>
          )}
          {mergedData.contact?.linkedin && (
            <a
              href={mergedData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: selectedTheme.text,
                textDecoration: "none",
              }}
            >
              linkedin.com/in/{mergedData.contact.linkedin.split('/').pop()}
            </a>
          )}
        </div>
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

MarketingDirectorTemplate.displayName = "MarketingDirectorTemplate";

export default MarketingDirectorTemplate;