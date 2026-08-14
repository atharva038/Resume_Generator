import mongoose from "mongoose";

const otherLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, trim: true, default: "" },
  startDate: { type: String, trim: true, default: "" },
  endDate: { type: String, trim: true, default: "" },
  isCurrent: { type: Boolean, default: false },
  gpa: { type: String, trim: true, default: "" },
  percentage: { type: String, trim: true, default: "" },
  relevantCoursework: { type: [String], default: [] },
  description: { type: String, trim: true, default: "" },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      "Programming Languages",
      "Frameworks",
      "Libraries",
      "Databases",
      "Cloud",
      "DevOps",
      "Tools",
      "AI/ML",
      "Other",
    ],
    default: "Other",
  },
  proficiency: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert", ""],
    default: "",
  },
  yearsOfExperience: {
    type: String,
    trim: true,
    default: "",
  },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  employmentType: {
    type: String,
    enum: [
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
      "Freelance",
      "Self-employed",
      "",
    ],
    default: "Full-time",
  },
  location: { type: String, trim: true, default: "" },
  startDate: { type: String, trim: true, default: "" },
  endDate: { type: String, trim: true, default: "" },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String, trim: true, default: "" },
  responsibilities: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
});

const projectImageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, default: "" },
    caption: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortDescription: { type: String, trim: true, default: "" },
  detailedDescription: { type: String, trim: true, default: "" },
  problemSolved: { type: String, trim: true, default: "" },
  solution: { type: String, trim: true, default: "" },
  role: { type: String, trim: true, default: "" },
  teamSize: { type: String, trim: true, default: "" },
  startDate: { type: String, trim: true, default: "" },
  endDate: { type: String, trim: true, default: "" },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Maintained", "Archived", ""],
    default: "Completed",
  },
  technologies: { type: [String], default: [] },
  features: { type: [String], default: [] },
  challenges: { type: [String], default: [] },
  results: { type: [String], default: [] },
  metrics: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  githubUrl: { type: String, trim: true, default: "" },
  liveUrl: { type: String, trim: true, default: "" },
  demoUrl: { type: String, trim: true, default: "" },
  images: { type: [projectImageSchema], default: [] },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  organization: { type: String, trim: true, default: "" },
  date: { type: String, trim: true, default: "" },
  category: {
    type: String,
    enum: [
      "Hackathon",
      "Competition",
      "Award",
      "Ranking",
      "Scholarship",
      "Major Accomplishment",
      "Other",
      "",
    ],
    default: "Other",
  },
  evidenceUrl: { type: String, trim: true, default: "" },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issuingOrganization: { type: String, required: true, trim: true },
  issueDate: { type: String, trim: true, default: "" },
  expiryDate: { type: String, trim: true, default: "" },
  credentialId: { type: String, trim: true, default: "" },
  credentialUrl: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
});

const leadershipSchema = new mongoose.Schema({
  organization: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: String, trim: true, default: "" },
  endDate: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
  achievements: { type: [String], default: [] },
});

const openSourceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const hackathonSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    project: { type: String, trim: true, default: "" },
    award: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    publisher: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const volunteerSchema = new mongoose.Schema(
  {
    organization: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    startDate: { type: String, trim: true, default: "" },
    endDate: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const languageSchema = new mongoose.Schema(
  {
    language: { type: String, trim: true, default: "" },
    proficiency: {
      type: String,
      enum: ["Native", "Fluent", "Professional", "Intermediate", "Basic", ""],
      default: "Fluent",
    },
  },
  { _id: false }
);

const careerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    personalInfo: {
      fullName: { type: String, trim: true, default: "" },
      preferredName: { type: String, trim: true, default: "" },
      headline: { type: String, trim: true, default: "" },
      bio: { type: String, trim: true, default: "" },
      careerObjective: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      phone: { type: String, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      github: { type: String, trim: true, default: "" },
      portfolio: { type: String, trim: true, default: "" },
      otherLinks: { type: [otherLinkSchema], default: [] },
    },
    education: { type: [educationSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    leadership: { type: [leadershipSchema], default: [] },
    additionalInfo: {
      openSource: { type: [openSourceSchema], default: [] },
      hackathons: { type: [hackathonSchema], default: [] },
      publications: { type: [publicationSchema], default: [] },
      volunteerWork: { type: [volunteerSchema], default: [] },
      languages: { type: [languageSchema], default: [] },
      hobbies: { type: [String], default: [] },
      other: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

const CareerProfile = mongoose.model("CareerProfile", careerProfileSchema);

export default CareerProfile;
