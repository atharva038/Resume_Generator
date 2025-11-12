// Revenue & Pricing Configuration - Update these values to reflect in the flowchart

export const REVENUE_CONFIG = {
  // Pricing Tiers
  pricingTiers: [
    {
      name: "Free Tier",
      price: "$0/month",
      color: "blue",
      features: [
        { included: true, text: "3 Resume Templates" },
        { included: true, text: "5 AI Enhancements/month" },
        { included: true, text: "Basic ATS Analyzer" },
        { included: true, text: "PDF Download" },
        { included: true, text: "Job Search (Limited)" },
        { included: false, text: "Premium Templates" },
        { included: false, text: "Unlimited AI Access" }
      ],
      goal: "User acquisition & product validation",
      highlighted: false
    },
    {
      name: "Pro Tier",
      price: "$9.99/month",
      color: "purple",
      features: [
        { included: true, text: "All 9 Premium Templates" },
        { included: true, text: "Unlimited AI Enhancements" },
        { included: true, text: "Advanced ATS Analysis" },
        { included: true, text: "Smart Job Matching" },
        { included: true, text: "Priority Support" },
        { included: true, text: "Cover Letter Generator (Coming Q1 2026)" },
        { included: true, text: "LinkedIn Optimization (Coming Q1 2026)" },
        { included: true, text: "Multiple Resumes (Unlimited)" }
      ],
      goal: "Primary Revenue Stream: Individual users",
      highlighted: true,
      badge: "Launching Q1 2026"
    },
    {
      name: "Enterprise",
      price: "Custom",
      color: "orange",
      features: [
        { included: true, text: "White-label Solution" },
        { included: true, text: "Custom Templates" },
        { included: true, text: "Bulk User Management" },
        { included: true, text: "API Access" },
        { included: true, text: "Analytics Dashboard" },
        { included: true, text: "Dedicated Support" },
        { included: true, text: "SSO Integration" }
      ],
      goal: "Target: Universities, Training Centers, HR Firms",
      highlighted: false
    }
  ],

  // Additional Revenue Streams
  additionalStreams: [
    {
      name: "Affiliate Partnerships",
      color: "blue",
      items: [
        "Job boards commission (10-15%)",
        "Course platform referrals",
        "Professional certification programs",
        "Career coaching services"
      ],
      estimatedRevenue: "$500-2K/month"
    },
    {
      name: "Premium Features (Add-ons)",
      color: "purple",
      items: [
        "Interview Preparation AI ($4.99)",
        "Salary Negotiation Guide ($2.99)",
        "Portfolio Website Builder ($7.99)",
        "1-on-1 Resume Review ($19.99)"
      ],
      estimatedRevenue: "$1-3K/month"
    },
    {
      name: "B2B Services",
      color: "green",
      items: [
        "Recruitment agency partnerships",
        "University career center licenses",
        "Corporate outplacement services",
        "Training institute partnerships"
      ],
      estimatedRevenue: "$5-15K/month"
    },
    {
      name: "Advertisement (Minimal)",
      color: "orange",
      items: [
        "Job posting promotions",
        "Sponsored templates (brand partnerships)",
        "Educational content sponsorship",
        "Non-intrusive banner ads (free tier)"
      ],
      estimatedRevenue: "$300-1K/month"
    }
  ],

  // Year 1 Projections (Realistic Conservative Goals - Nov 2025 to Nov 2026)
  yearOneProjection: {
    freeUsers: 1000,        // Target: 1K users in first year
    proUsers: 50,           // Target: 5% conversion (50 paying users)
    proConversionRate: 5,   // 5% conversion rate
    enterpriseClients: 2,   // Target: 2 universities/bootcamps
    totalRevenue: "$10-15K",
    breakdown: [
      { label: "Free Users (Target)", count: 1000, revenue: "$0 (acquisition focus)" },
      { label: "Pro Users (5% conversion)", count: 50, revenue: "$6,000/year" },
      { label: "Enterprise (2 clients)", count: 2, revenue: "$4,000/year" },
      { label: "Affiliate Revenue", count: null, revenue: "$2,000/year" },
      { label: "Year 1 Total Revenue", count: null, revenue: "$10-15K", highlight: true }
    ],
    note: "Conservative first-year projection. Focus on product validation & user feedback."
  },

  // Competitor Pricing (for comparison)
  competitorPricing: {
    average: "$29.99/month",
    yourPrice: "$9.99/month",
    savings: "70%"
  }
};
