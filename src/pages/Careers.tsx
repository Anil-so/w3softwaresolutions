import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Clock, Users, Mail, Briefcase, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { EmailAuthCard } from "@/components/careers/auth/EmailAuthCard";
import { OtpVerificationCard } from "@/components/careers/otp/OtpVerificationCard";
import { ApplicationWizard } from "@/components/careers/application/ApplicationWizard";
import { RegistrationPayment } from "@/components/careers/payment/RegistrationPayment";
import { PaymentSuccess } from "@/components/careers/payment/PaymentSuccess";
import { ApplicantDashboard } from "@/components/careers/dashboard/ApplicantDashboard";
import type { ApplicantFormData } from "@/components/careers/shared/types";

type JobOpening = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  skills: string[];
  openPositions: number;
  description: string;
  aboutRole: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  benefits: string[];
  interviewProcess: string[];
  jobId: string;
  postedDate: string;
  applicationDeadline: string;
  employmentType: string;
  workType: string;
};

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [applicationJob, setApplicationJob] = useState<JobOpening | null>(null);
  const [applicationStep, setApplicationStep] = useState<"auth" | "otp" | "application" | "payment" | "success" | "dashboard">("auth");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicationReference, setApplicationReference] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const applicationSectionRef = useRef<HTMLDivElement | null>(null);

  const jobOpenings: JobOpening[] = [
    {
      id: 1,
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Jaipur",
      type: "Hybrid",
      experience: "0–1 Years",
      salary: "₹4 LPA",
      skills: ["React", "Node.js", "MongoDB"],
      openPositions: 4,
      description: "Work on modern web platforms and client-facing products with a fast-moving development team.",
      aboutRole: "We are looking for a motivated full stack developer who can build and support scalable web applications while collaborating closely with designers and product teams.",
      responsibilities: ["Build responsive web features", "Work on REST APIs", "Collaborate with product and design teams"],
      requiredSkills: ["HTML, CSS, JavaScript", "React basics", "Node.js fundamentals"],
      preferredSkills: ["TypeScript", "MongoDB", "Git"],
      benefits: ["Flexible work", "Learning support", "Performance bonus"],
      interviewProcess: ["Resume review", "Technical discussion", "HR round"],
      jobId: "W3-ENG-101",
      postedDate: "22 Jul 2026",
      applicationDeadline: "31 Jul 2026",
      employmentType: "Full Time",
      workType: "Hybrid"
    },
    {
      id: 2,
      title: "Frontend React Developer",
      department: "Engineering",
      location: "Bangalore",
      type: "Remote",
      experience: "1–2 Years",
      salary: "₹5 LPA",
      skills: ["React", "Tailwind", "Redux"],
      openPositions: 3,
      description: "Create polished interfaces and interactive experiences for business applications.",
      aboutRole: "We are looking for a frontend developer who can turn product concepts into elegant and responsive user interfaces that deliver a seamless experience.",
      responsibilities: ["Develop UI components", "Improve performance", "Maintain design consistency"],
      requiredSkills: ["React", "JavaScript", "CSS"],
      preferredSkills: ["Next.js", "TypeScript"],
      benefits: ["Remote-first culture", "Paid leaves", "Career growth"],
      interviewProcess: ["Portfolio review", "Frontend task", "HR discussion"],
      jobId: "W3-ENG-102",
      postedDate: "25 Jul 2026",
      applicationDeadline: "05 Aug 2026",
      employmentType: "Full Time",
      workType: "Remote"
    },
    {
      id: 3,
      title: "Backend Node.js Developer",
      department: "Engineering",
      location: "Pune",
      type: "Office",
      experience: "2–3 Years",
      salary: "₹6 LPA",
      skills: ["Node.js", "Express", "MySQL"],
      openPositions: 2,
      description: "Build robust backend services and API integrations for client workflows.",
      aboutRole: "We are looking for a backend specialist who can develop clean APIs and scalable services for modern business platforms.",
      responsibilities: ["Develop backend modules", "Design database schema", "Write clean APIs"],
      requiredSkills: ["Node.js", "Express", "REST APIs"],
      preferredSkills: ["MongoDB", "AWS basics"],
      benefits: ["Health benefits", "Mentorship", "Training support"],
      interviewProcess: ["Code review", "Backend discussion", "Manager round"],
      jobId: "W3-ENG-103",
      postedDate: "28 Jul 2026",
      applicationDeadline: "10 Aug 2026",
      employmentType: "Full Time",
      workType: "Work From Office"
    },
    {
      id: 4,
      title: "UI/UX Designer",
      department: "Design",
      location: "Mumbai",
      type: "Hybrid",
      experience: "0–1 Years",
      salary: "₹4 LPA",
      skills: ["Figma", "Wireframing", "Prototyping"],
      openPositions: 2,
      description: "Help us craft intuitive user experiences for web and mobile projects.",
      aboutRole: "We are looking for a creative designer who can build simple, intuitive interfaces with a clear understanding of user behavior and modern design practices.",
      responsibilities: ["Create UI flows", "Design prototypes", "Work with product teams"],
      requiredSkills: ["Figma", "Design basics", "UI principles"],
      preferredSkills: ["Adobe XD", "User research"],
      benefits: ["Flexible hours", "Creative freedom", "Learning budget"],
      interviewProcess: ["Portfolio review", "Design task", "Discussion round"],
      jobId: "W3-DES-101",
      postedDate: "30 Jul 2026",
      applicationDeadline: "12 Aug 2026",
      employmentType: "Internship/Full Time",
      workType: "Hybrid"
    },
    {
      id: 5,
      title: "WordPress Developer",
      department: "Development",
      location: "Hyderabad",
      type: "Remote",
      experience: "1–2 Years",
      salary: "₹5 LPA",
      skills: ["WordPress", "PHP", "Elementor"],
      openPositions: 3,
      description: "Build and maintain high-quality WordPress websites for growing businesses.",
      aboutRole: "We are looking for a WordPress developer who can build, customize, and maintain modern websites that help businesses grow online.",
      responsibilities: ["Develop custom themes", "Manage plugins", "Fix website issues"],
      requiredSkills: ["WordPress", "PHP", "HTML/CSS"],
      preferredSkills: ["WooCommerce", "SEO basics"],
      benefits: ["Remote work", "Fast growth", "Team support"],
      interviewProcess: ["Technical check", "Portfolio review", "HR round"],
      jobId: "W3-DEV-101",
      postedDate: "02 Aug 2026",
      applicationDeadline: "15 Aug 2026",
      employmentType: "Full Time",
      workType: "Remote"
    },
    {
      id: 6,
      title: "Digital Marketing Executive",
      department: "Marketing",
      location: "Pune",
      type: "Hybrid",
      experience: "0–1 Years",
      salary: "₹4 LPA",
      skills: ["Social Ads", "Campaigns", "Analytics"],
      openPositions: 2,
      description: "Support digital growth campaigns and social media execution for clients.",
      aboutRole: "We are looking for a marketing executive who can help grow brand presence and support digital campaigns with strong creativity and analysis.",
      responsibilities: ["Run campaigns", "Monitor analytics", "Coordinate content"],
      requiredSkills: ["Marketing basics", "Social media", "Content writing"],
      preferredSkills: ["Google Ads", "Meta Ads"],
      benefits: ["Creative exposure", "Skill development", "Incentives"],
      interviewProcess: ["Discussion round", "Campaign review", "Manager round"],
      jobId: "W3-MKT-101",
      postedDate: "04 Aug 2026",
      applicationDeadline: "18 Aug 2026",
      employmentType: "Full Time",
      workType: "Hybrid"
    },
    {
      id: 7,
      title: "SEO Executive",
      department: "Marketing",
      location: "Mumbai",
      type: "Remote",
      experience: "1–2 Years",
      salary: "₹5 LPA",
      skills: ["SEO", "On-page", "Analytics"],
      openPositions: 2,
      description: "Drive search visibility through on-page, off-page, and technical SEO execution.",
      aboutRole: "We are looking for an SEO specialist who can improve website visibility and help clients grow through strong search performance.",
      responsibilities: ["Manage keyword research", "Improve page rankings", "Audit site performance"],
      requiredSkills: ["SEO basics", "Google Search Console", "Content analysis"],
      preferredSkills: ["Ahrefs", "Semrush"],
      benefits: ["Career growth", "Flexible setup", "Learning support"],
      interviewProcess: ["SEO task", "Interview round", "HR discussion"],
      jobId: "W3-MKT-102",
      postedDate: "06 Aug 2026",
      applicationDeadline: "20 Aug 2026",
      employmentType: "Full Time",
      workType: "Remote"
    },
    {
      id: 8,
      title: "Business Development Executive",
      department: "Sales",
      location: "Bangalore",
      type: "Office",
      experience: "1–2 Years",
      salary: "₹6 LPA",
      skills: ["Sales", "Client Handling", "Lead Generation"],
      openPositions: 2,
      description: "Support business outreach and strengthen client relationships for growth initiatives.",
      aboutRole: "We are looking for a business development executive who can build client relationships and support revenue growth with a confident, organized approach.",
      responsibilities: ["Generate leads", "Follow up with clients", "Coordinate proposals"],
      requiredSkills: ["Communication", "Sales basics", "CRM familiarity"],
      preferredSkills: ["B2B sales", "Negotiation"],
      benefits: ["Performance incentives", "Team exposure", "Sales growth"],
      interviewProcess: ["Sales discussion", "Role play", "Manager round"],
      jobId: "W3-SALES-101",
      postedDate: "08 Aug 2026",
      applicationDeadline: "22 Aug 2026",
      employmentType: "Full Time",
      workType: "Work From Office"
    },
    {
      id: 9,
      title: "Project Coordinator",
      department: "Operations",
      location: "Jaipur",
      type: "Hybrid",
      experience: "0–1 Years",
      salary: "₹4 LPA",
      skills: ["Coordination", "Scheduling", "Reporting"],
      openPositions: 3,
      description: "Coordinate project activities and keep deliveries moving smoothly across teams.",
      aboutRole: "We are looking for a project coordinator who can keep communication flowing and ensure timely execution across teams and stakeholders.",
      responsibilities: ["Track project updates", "Handle schedules", "Prepare status reports"],
      requiredSkills: ["Organization", "Communication", "MS Office"],
      preferredSkills: ["Jira", "Agile basics"],
      benefits: ["Structured learning", "Team exposure", "Work-life balance"],
      interviewProcess: ["Communication round", "Process discussion", "HR review"],
      jobId: "W3-OPS-101",
      postedDate: "10 Aug 2026",
      applicationDeadline: "24 Aug 2026",
      employmentType: "Full Time",
      workType: "Hybrid"
    },
    {
      id: 10,
      title: "QA Tester",
      department: "Quality",
      location: "Hyderabad",
      type: "Remote",
      experience: "1–2 Years",
      salary: "₹5 LPA",
      skills: ["Testing", "Bug Reporting", "Manual QA"],
      openPositions: 2,
      description: "Validate product quality and help ensure a smooth release process.",
      aboutRole: "We are looking for a QA tester who can ensure releases are stable, well-documented, and aligned with product quality expectations.",
      responsibilities: ["Execute test cases", "Log defects", "Support regression testing"],
      requiredSkills: ["Manual testing", "Bug tracking", "Attention to detail"],
      preferredSkills: ["Automation basics", "Jira"],
      benefits: ["Hands-on growth", "Stable role", "Skill upgrade"],
      interviewProcess: ["Test round", "QA discussion", "HR review"],
      jobId: "W3-QA-101",
      postedDate: "12 Aug 2026",
      applicationDeadline: "26 Aug 2026",
      employmentType: "Full Time",
      workType: "Remote"
    }
  ];

  const locations = ["Jaipur", "Bangalore", "Pune", "Mumbai", "Hyderabad"];
  const workTypes = ["Remote", "Work From Office", "Hybrid"];
  const eligibility = ["Freshers can apply", "0–3 Years Experience", "B.Tech", "BCA", "MCA", "B.Sc", "Any Graduate"];
  const salaryRanges = ["₹4 LPA", "₹5 LPA", "₹6 LPA", "₹7 LPA"];
  const benefits = ["Flexible work options", "Performance bonus", "Learning support", "Health benefits", "Paid leaves", "Recognition rewards"];
  const goodToHave = ["Docker", "AWS", "Firebase", "Redux", "GraphQL"];
  const documents = ["Resume", "Government ID (Optional)", "Portfolio (Optional)", "LinkedIn (Optional)", "GitHub (Optional)"];
  const faqItems = [
    { question: "Who can apply?", answer: "Freshers and candidates with 0–3 years experience." },
    { question: "Is Remote Available?", answer: "Yes, remote roles are available for select positions." },
    { question: "What is the salary?", answer: "The salary range is ₹4 LPA – ₹7 LPA depending on skills and experience." },
    { question: "Is there an application fee?", answer: "Yes, the application registration fee is ₹49." },
    { question: "Does payment guarantee a job?", answer: "No, payment only covers application processing and verification." }
  ];

  const handleApplyNow = (job: JobOpening) => {
    setApplicationJob(job);
    setSelectedJob(null);
    setApplicationStep("auth");
    setApplicantEmail("");
    setApplicationReference("");
    setFeedbackMessage("");
    setTimeout(() => {
      applicationSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleContinueAuth = () => {
    if (!applicantEmail.trim()) {
      setFeedbackMessage("Please enter your email address to continue.");
      return;
    }
    setFeedbackMessage("");
    setApplicationStep("otp");
  };

  const handleVerifyOtp = (otpValue: string) => {
    if (otpValue === "123456") {
      setFeedbackMessage("");
      setApplicationStep("application");
    } else {
      setFeedbackMessage("Use the demo verification code 123456 to continue.");
    }
  };

  const handleResendOtp = () => {
    setFeedbackMessage("A fresh verification code has been prepared. Use 123456.");
  };

  const handleApplicationSubmit = (data: ApplicantFormData) => {
    setFeedbackMessage("Your application details are ready for review.");
    setApplicationStep("payment");
    void data;
  };

  const handleMakePayment = () => {
    const newId = `W3-${Math.floor(1000 + Math.random() * 9000)}`;
    setApplicationReference(newId);
    setApplicationStep("success");
    setFeedbackMessage("");
  };

  const handleGoToDashboard = () => {
    setApplicationStep("dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
<<<<<<< HEAD
          <h1 className="mb-4 text-4xl font-bold text-foreground">Join Our Team</h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            We are expanding our team across India and welcome talented candidates who want to grow with W3 Software Solutions.
=======
          <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Be part of a dynamic team that's shaping the future of software development.
            We're always looking for talented individuals who share our passion for innovation.
>>>>>>> 4b3916bf9f528dd0584c8af32ea25d42586d12ac
          </p>
        </div>

        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Why Work With Us?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
<<<<<<< HEAD
                  <h3 className="mb-3 font-semibold">Our Culture</h3>
                  <p className="mb-4 text-muted-foreground">
                    We build with care, communicate clearly, and value people who enjoy solving real problems with modern tools.
=======
                  <h3 className="font-semibold mb-3">Our Culture</h3>
                  <p className="text-muted-foreground mb-4">
                    We foster a collaborative environment where creativity thrives and innovation
                    is encouraged. Our team values work-life balance, continuous learning, and
                    delivering exceptional results for our clients.
>>>>>>> 4b3916bf9f528dd0584c8af32ea25d42586d12ac
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 font-semibold">Benefits & Perks</h3>
                  <div className="grid gap-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="mr-3 h-2 w-2 rounded-full bg-primary"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Hiring Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {locations.map((location) => (
                  <Badge key={location} variant="secondary">{location}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {workTypes.map((type) => (
                  <Badge key={type} variant="outline">{type}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Eligibility & Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-semibold">Eligibility</h3>
                  <div className="flex flex-wrap gap-2">
                    {eligibility.map((item) => (
                      <Badge key={item} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 font-semibold">Salary Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {salaryRanges.map((range) => (
                      <Badge key={range} variant="secondary">{range}</Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Salary depends on skills, interview performance and experience.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="mb-8 text-3xl font-bold">Current Openings</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap items-center gap-4">
                        <Badge variant="secondary">{job.department}</Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{job.experience}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{job.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-semibold">{job.salary}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-sm text-muted-foreground">Open Positions</p>
                      <p className="font-semibold">{job.openPositions}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-semibold">{job.department}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => handleApplyNow(job)} className="w-full sm:w-auto">
                      <Mail className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedJob(job)} className="w-full sm:w-auto">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div ref={applicationSectionRef} className="mb-8">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-slate-900" />
                <CardTitle className="text-2xl font-semibold text-slate-900">Applicant journey</CardTitle>
              </div>
              <CardDescription className="max-w-2xl text-sm leading-7 text-slate-600">
                A premium, enterprise-grade application experience designed for modern hiring workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
                  <div className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-200">
                    {applicationJob ? `Applying for ${applicationJob.title}` : 'Select a role to begin'}
                  </div>
                  <h3 className="text-2xl font-semibold">Start your hiring journey</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    Complete email verification, share your details, pay the registration fee, and track your progress from a polished applicant dashboard.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {['Email verification', 'Application form', 'Payment & dashboard'].map((step) => (
                      <div key={step} className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-slate-200">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {applicationStep === "auth" && (
                    <EmailAuthCard
                      email={applicantEmail}
                      onEmailChange={setApplicantEmail}
                      onContinue={handleContinueAuth}
                      onBack={() => setApplicationStep("auth")}
                    />
                  )}
                  {applicationStep === "otp" && (
                    <OtpVerificationCard
                      email={applicantEmail}
                      onVerify={handleVerifyOtp}
                      onChangeEmail={() => setApplicationStep("auth")}
                      onResend={handleResendOtp}
                    />
                  )}
                  {applicationStep === "application" && (
                    <ApplicationWizard onSubmit={handleApplicationSubmit} initialData={{
                      fullName: '',
                      email: applicantEmail,
                      mobile: '',
                      dateOfBirth: '',
                      gender: '',
                      country: '',
                      state: '',
                      city: '',
                      postalCode: '',
                      address: '',
                      qualification: '',
                      college: '',
                      university: '',
                      percentage: '',
                      passingYear: '',
                      experience: '',
                      skills: '',
                      portfolio: '',
                      linkedIn: '',
                      declarationAccepted: false,
                    }} />
                  )}
                  {applicationStep === "payment" && (
                    <RegistrationPayment onPay={handleMakePayment} onBack={() => setApplicationStep("application")} />
                  )}
                  {applicationStep === "success" && (
                    <PaymentSuccess referenceNumber={applicationReference} onGoToDashboard={handleGoToDashboard} />
                  )}
                  {applicationStep === "dashboard" && <ApplicantDashboard />}

                  {feedbackMessage ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {feedbackMessage}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">{selectedJob.title}</DialogTitle>
                  <DialogDescription>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedJob.department}</Badge>
                      <Badge variant="outline">{selectedJob.workType}</Badge>
                      <Badge variant="outline">{selectedJob.employmentType}</Badge>
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                  <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Job ID</p>
                      <p className="font-semibold">{selectedJob.jobId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posted Date</p>
                      <p className="font-semibold">{selectedJob.postedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{selectedJob.applicationDeadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Positions</p>
                      <p className="font-semibold">{selectedJob.openPositions}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold">About the Role</h4>
                      <p className="text-sm leading-7 text-muted-foreground">{selectedJob.aboutRole}</p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Key Responsibilities</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {selectedJob.responsibilities.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <div className="mt-2 h-2 w-2 rounded-full bg-primary"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Good to Have</h4>
                      <div className="flex flex-wrap gap-2">
                        {goodToHave.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold">Eligibility</h4>
                      <div className="flex flex-wrap gap-2">
                        {eligibility.map((item) => (
                          <Badge key={item} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary">{benefit}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Hiring Process</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.interviewProcess.map((step, index) => (
                        <div key={step} className="rounded-lg border p-3 text-sm">
                          <span className="font-semibold">Step {index + 1}</span>
                          <div className="mt-1">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Office Locations</h4>
                    <div className="grid gap-3 md:grid-cols-3">
                      {['Jaipur', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad'].slice(0, 5).map((location) => (
                        <div key={location} className="rounded-lg border p-3 text-sm">
                          {location}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Remote Available • Hybrid Available</p>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Application Registration Fee: ₹49</p>
                    <p className="mt-2">This fee is charged only for application processing and verification. Payment does not guarantee interview selection or employment.</p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Documents Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {documents.map((item) => (
                        <Badge key={item} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">FAQ</h4>
                    <div className="space-y-3">
                      {faqItems.map((item) => (
                        <div key={item.question} className="rounded-lg border p-3">
                          <p className="font-semibold">{item.question}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-start">
                  <Button onClick={() => { setSelectedJob(null); if (selectedJob) handleApplyNow(selectedJob); }} className="w-full sm:w-auto">Apply Now</Button>
                  <Button variant="outline" onClick={() => setSelectedJob(null)} className="w-full sm:w-auto">Back to Careers</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Don't See the Right Position?</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <p className="mb-4 text-muted-foreground">
              We are always interested in meeting talented individuals. Send us your resume and tell us about your skills and interests.
=======
            <p className="text-muted-foreground mb-4">
              We're always interested in meeting talented individuals. Send us your resume and
              tell us about your skills and interests.
>>>>>>> 4b3916bf9f528dd0584c8af32ea25d42586d12ac
            </p>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Send Your Resume
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Careers;