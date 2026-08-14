import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Clock, Users, Mail, Briefcase, UserCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { CandidateOtpModal } from "@/components/careers/auth/CandidateOtpModal";
import { ApplicationWizard } from "@/components/careers/application/ApplicationWizard";
import { RegistrationPayment } from "@/components/careers/payment/RegistrationPayment";
import { PaymentSuccess } from "@/components/careers/payment/PaymentSuccess";
import { ApplicantDashboard } from "@/components/careers/dashboard/ApplicantDashboard";
import type { ApplicantFormData } from "@/components/careers/shared/types";
import {
  supabase,
  sendEmailOtp,
  verifyEmailOtp,
} from "@/lib/supabase";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

  // Modal / Flow states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationStep, setApplicationStep] = useState<"application" | "payment" | "success" | "dashboard">("application");

  // User & Application data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicationReference, setApplicationReference] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [applicantMobile, setApplicantMobile] = useState("");
  const [currentApplicantId, setCurrentApplicantId] = useState<string | null>(null);

  useEffect(() => {
    async function syncApplicantFromUser(user: any) {
      if (!user?.email) return;
      const cleanEmail = user.email.trim().toLowerCase();
      setIsAuthenticated(true);
      setApplicantEmail(cleanEmail);

      let { data: applicant, error } = await supabase
        .from('applicants')
        .select('id, application_number, payment_status, application_status, mobile, user_id, full_name')
        .or(`user_id.eq.${user.id},email.eq.${cleanEmail}`)
        .maybeSingle();

      if (error && (error.message?.includes('user_id') || error.code === 'PGRST204')) {
        const fallback = await supabase
          .from('applicants')
          .select('id, application_number, payment_status, application_status, mobile, full_name')
          .eq('email', cleanEmail)
          .maybeSingle();
        applicant = fallback.data;
      }

      if (applicant) {
        if (!applicant.user_id) {
          await supabase
            .from('applicants')
            .update({ user_id: user.id })
            .eq('id', applicant.id);
        }
        if (applicant.full_name) setApplicantName(applicant.full_name);
        if (applicant.mobile) setApplicantMobile(applicant.mobile);
        setCurrentApplicantId(applicant.id);
        setApplicationReference(applicant.application_number || '');

        if (applicant.payment_status === 'verified') {
          setApplicationStep('dashboard');
        } else if (applicant.application_status === 'submitted') {
          setApplicationStep('payment');
        } else {
          setApplicationStep('application');
        }
      } else {
        const newPayload: any = {
          user_id: user.id,
          email: cleanEmail,
          full_name: '',
          email_verified: true,
          payment_status: 'pending',
          application_status: 'draft',
        };

        let { data: newApplicant } = await supabase
          .from('applicants')
          .upsert([newPayload], { onConflict: 'email' })
          .select('id, application_number')
          .maybeSingle();

        if (newApplicant) {
          setCurrentApplicantId(newApplicant.id);
          setApplicationReference(newApplicant.application_number || '');
        }
        setApplicationStep('application');
      }
    }

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncApplicantFromUser(session.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    }
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setApplicantEmail((session.user.email || '').toLowerCase());
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    { question: "Is there an application processing fee?", answer: "Yes, the application processing and candidate verification fee is ₹49." },
    { question: "Does payment guarantee a job?", answer: "No, payment only covers application processing and candidate verification." }
  ];

  const handleApplyNow = (job: JobOpening) => {
    setApplicationJob(job);
    setSelectedJob(null);
    setFeedbackMessage("");

    if (isAuthenticated) {
      setIsApplicationModalOpen(true);
    } else {
      setIsOtpModalOpen(true);
    }
  };

  const handleOpenTrackApplication = () => {
    if (isAuthenticated) {
      setIsApplicationModalOpen(true);
    } else {
      setIsOtpModalOpen(true);
    }
  };

  const handleSendOtp = async (email: string) => {
    setIsLoading(true);
    setFeedbackMessage("");
    try {
      await sendEmailOtp(email);
      setApplicantEmail(email);
    } catch (err: any) {
      console.error("Send OTP error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    setFeedbackMessage("");
    try {
      const data = await verifyEmailOtp(email, otp);
      const user = data?.user || data?.session?.user;

      if (!user) {
        throw new Error("Invalid verification code. Please check your email and try again.");
      }

      const userEmail = (user.email || email).trim().toLowerCase();
      setIsAuthenticated(true);
      setApplicantEmail(userEmail);

      let { data: applicant } = await supabase
        .from("applicants")
        .select("id, application_number, payment_status, application_status, mobile, user_id, full_name")
        .or(`user_id.eq.${user.id},email.eq.${userEmail}`)
        .maybeSingle();

      if (applicant) {
        if (!applicant.user_id) {
          await supabase.from("applicants").update({ user_id: user.id }).eq("id", applicant.id);
        }
        if (applicant.full_name) setApplicantName(applicant.full_name);
        if (applicant.mobile) setApplicantMobile(applicant.mobile);
        setCurrentApplicantId(applicant.id);
        setApplicationReference(applicant.application_number || "");

        if (applicant.payment_status === "verified") {
          setApplicationStep("dashboard");
        } else if (applicant.application_status === "submitted") {
          setApplicationStep("payment");
        } else {
          setApplicationStep("application");
        }
      } else {
        const newPayload: any = {
          user_id: user.id,
          email: userEmail,
          full_name: "",
          email_verified: true,
          payment_status: "pending",
          application_status: "draft",
        };

        const { data: newApplicant } = await supabase
          .from("applicants")
          .upsert([newPayload], { onConflict: "email" })
          .select("id, application_number")
          .maybeSingle();

        if (newApplicant) {
          setCurrentApplicantId(newApplicant.id);
          setApplicationReference(newApplicant.application_number || "");
        }
        setApplicationStep("application");
      }

      setIsApplicationModalOpen(true);
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationSubmit = async (data: ApplicantFormData) => {
    setIsLoading(true);
    setFeedbackMessage("");
    if (data.mobile) {
      setApplicantMobile(data.mobile);
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setFeedbackMessage("Your session has expired. Please verify your email again.");
        setIsApplicationModalOpen(false);
        setIsOtpModalOpen(true);
        return;
      }
      const userId = session.user.id;
      const userEmail = (session.user.email || applicantEmail).trim().toLowerCase();

      const payload: any = {
        user_id: userId,
        full_name: data.fullName,
        email: userEmail,
        mobile: data.mobile,
        dob: data.dateOfBirth || null,
        gender: data.gender,
        country: data.country,
        state: data.state,
        city: data.city,
        postal_code: data.postalCode,
        address: data.address,
        qualification: data.qualification,
        college: data.college,
        university: data.university,
        percentage: data.percentage,
        passing_year: data.passingYear,
        experience: data.experience,
        skills: data.skills,
        portfolio: data.portfolio,
        linkedin: data.linkedIn,
        resume_path: data.resumePath || null,
        email_verified: true,
        profile_completion_percent: 85,
        application_status: "submitted",
      };

      let { data: updatedApplicant, error } = await supabase
        .from("applicants")
        .upsert([payload], { onConflict: "email" })
        .select("id, application_number")
        .single();

      if (error && (error.message?.includes("user_id") || error.code === "PGRST204")) {
        delete payload.user_id;
        const retryRes = await supabase
          .from("applicants")
          .upsert([payload], { onConflict: "email" })
          .select("id, application_number")
          .single();

        updatedApplicant = retryRes.data;
        error = retryRes.error;
      }

      if (error) {
        console.error("Application submit DB error:", error);
        throw error;
      }

      if (updatedApplicant) {
        setCurrentApplicantId(updatedApplicant.id);
        setApplicationReference(updatedApplicant.application_number || "");
      }

      setFeedbackMessage("Application details saved! Please proceed to complete candidate verification payment.");
      setApplicationStep("payment");
    } catch (err: any) {
      console.error("Application submit error:", err);
      setFeedbackMessage(err.message || "Failed to save application details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePayment = async () => {
    setIsLoading(true);
    setFeedbackMessage("");
    setPaymentError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setFeedbackMessage("Your session has expired. Please verify your email again.");
        setIsApplicationModalOpen(false);
        setIsOtpModalOpen(true);
        return;
      }

      const { data: orderData, error: orderError } = await supabase.functions.invoke("create-razorpay-order", {
        body: { applicant_id: currentApplicantId },
      });

      if (orderError) {
        let errDesc = orderError.message || "Failed to create payment order.";
        try {
          if (orderError.context) {
            const res = orderError.context as Response;
            if (typeof res.json === 'function') {
              const cloned = res.clone ? res.clone() : res;
              const parsed = await cloned.json();
              if (parsed?.error) errDesc = parsed.error;
              if (parsed?.already_paid) {
                setApplicationStep("dashboard");
                setFeedbackMessage("Your payment has already been verified.");
                return;
              }
            }
          }
        } catch (_) {
          try {
            if (orderError.context && typeof (orderError.context as Response).text === 'function') {
              const text = await (orderError.context as Response).text();
              if (text) errDesc = text;
            }
          } catch (__) {}
        }
        throw new Error(errDesc);
      }

      if (!orderData?.order_id || !orderData?.key_id) {
        if (orderData?.already_paid) {
          setApplicationStep("dashboard");
          setFeedbackMessage("Your payment has already been verified.");
          return;
        }
        throw new Error(orderData?.error || "Invalid response received from Razorpay order service.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout SDK failed to load. Please check your internet connection.");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "W3 Software Solutions",
        description: "Application Processing Fee",
        order_id: orderData.order_id,
        prefill: {
          email: session.user.email,
          contact: applicantMobile || undefined,
        },
        theme: {
          color: "#0f172a",
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          setIsLoading(true);
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (verifyError) {
              let vErrDesc = verifyError.message || "Payment signature verification failed on server.";
              try {
                if (verifyError.context) {
                  const parsedV = await verifyError.context.json();
                  if (parsedV.error) vErrDesc = parsedV.error;
                }
              } catch (_) {}
              throw new Error(vErrDesc);
            }

            if (!verifyData?.success) {
              throw new Error(verifyData?.error || "Payment verification failed on server.");
            }

            setPaymentError("");
            setFeedbackMessage("");
            setApplicationStep("success");
          } catch (vErr: any) {
            console.error("Payment verification error:", vErr);
            const msg = vErr.message || "Payment verification failed on server.";
            setPaymentError(msg);
            setFeedbackMessage(msg);
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            const msg = "Payment was not completed. Your application has not been marked as paid.";
            setPaymentError(msg);
          },
        },
      };

      const razorpayWindow = new (window as any).Razorpay(options);
      razorpayWindow.on("payment.failed", (failRes: any) => {
        console.error("Razorpay payment failed:", failRes);
        const description = failRes?.error?.description || failRes?.error?.reason || "Payment was declined or failed.";
        const msg = `Payment was not completed. Your application has not been marked as paid. (${description})`;
        setPaymentError(msg);
        setFeedbackMessage(msg);
        setIsLoading(false);
      });

      razorpayWindow.open();
    } catch (err: any) {
      console.error("Make payment error:", err);
      const msg = err.message || "Failed to launch Razorpay checkout.";
      setPaymentError(msg);
      setFeedbackMessage(msg);
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    setApplicationStep("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setApplicantEmail("");
    setApplicantName("");
    setApplicationReference("");
    setIsApplicationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header Navigation & Candidate Action Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Join Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Be part of a dynamic team that's shaping the future of software development.
              We're always looking for talented individuals who share our passion for innovation.
            </p>
          </div>

          {/* Track Application / Candidate Dashboard Button */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
                <UserCircle className="h-5 w-5 text-slate-700" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">{applicantName || applicantEmail}</p>
                  <p className="text-slate-500 capitalize">{applicationStep === 'dashboard' ? 'Applicant Portal' : 'Application in Progress'}</p>
                </div>
                <Button size="sm" onClick={handleOpenTrackApplication} className="ml-2 rounded-xl text-xs min-h-[36px]">
                  Candidate Dashboard
                </Button>
                <Button size="icon" variant="ghost" onClick={handleLogout} className="rounded-xl h-8 w-8 text-slate-500 hover:text-slate-900" title="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={handleOpenTrackApplication} className="rounded-2xl min-h-[44px]">
                Track Application
              </Button>
            )}
          </div>
        </div>

        {/* Why Work With Us */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Why Work With Us?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3">Our Culture</h3>
                <p className="text-muted-foreground mb-4">
                  We foster a collaborative environment where creativity thrives and innovation
                  is encouraged. Our team values work-life balance, continuous learning, and
                  delivering exceptional results for our clients.
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

        {/* Hiring Locations */}
        <div className="my-8">
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

        {/* Eligibility & Salary */}
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

        {/* Current Job Openings */}
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
                    <Button onClick={() => handleApplyNow(job)} className="w-full sm:w-auto min-h-[44px]">
                      <Mail className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedJob(job)} className="w-full sm:w-auto min-h-[44px]">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Send Resume Card */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Don't See the Right Position?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We're always interested in meeting talented individuals. Verify your email to submit your application.
            </p>
            <Button onClick={() => handleApplyNow(jobOpenings[0])} className="min-h-[44px]">
              <Mail className="mr-2 h-4 w-4" />
              Send Your Resume
            </Button>
          </CardContent>
        </Card>

        {/* CANDIDATE EMAIL OTP AUTHENTICATION MODAL */}
        <CandidateOtpModal
          open={isOtpModalOpen}
          onOpenChange={setIsOtpModalOpen}
          initialEmail={applicantEmail}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          isLoading={isLoading}
        />

        {/* APPLICATION WIZARD / PAYMENT / DASHBOARD DIALOG MODAL */}
        <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto border-slate-200 bg-slate-50 p-4 sm:p-8 rounded-3xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-semibold text-slate-900">
                {applicationStep === 'application' && (applicationJob ? `Applying for ${applicationJob.title}` : 'Candidate Application')}
                {applicationStep === 'payment' && 'Candidate Verification Payment'}
                {applicationStep === 'success' && 'Application Verified'}
                {applicationStep === 'dashboard' && 'Candidate Dashboard'}
              </DialogTitle>
              <DialogDescription>
                W3 Software Solutions • Corporate Candidate Portal
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {applicationStep === "application" && (
                <ApplicationWizard onSubmit={handleApplicationSubmit} initialData={{
                  fullName: applicantName,
                  email: applicantEmail,
                  mobile: applicantMobile,
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
                <RegistrationPayment
                  onPay={handleMakePayment}
                  onBack={() => {
                    setPaymentError("");
                    setApplicationStep("application");
                  }}
                  isLoading={isLoading}
                  errorMessage={paymentError}
                />
              )}

              {applicationStep === "success" && (
                <PaymentSuccess referenceNumber={applicationReference} onGoToDashboard={handleGoToDashboard} />
              )}

              {applicationStep === "dashboard" && (
                <ApplicantDashboard onLogout={handleLogout} />
              )}

              {feedbackMessage ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                  {feedbackMessage}
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        {/* JOB DETAILS DIALOG */}
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
                    <p className="font-semibold text-foreground">Application Processing Fee: ₹49</p>
                    <p className="mt-2">This fee is charged only for application processing and candidate verification. Payment does not guarantee interview selection or employment.</p>
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
                  <Button onClick={() => { setSelectedJob(null); if (selectedJob) handleApplyNow(selectedJob); }} className="w-full sm:w-auto min-h-[44px]">Apply Now</Button>
                  <Button variant="outline" onClick={() => setSelectedJob(null)} className="w-full sm:w-auto min-h-[44px]">Back to Careers</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Careers;