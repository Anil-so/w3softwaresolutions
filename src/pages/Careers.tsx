import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      description: "We're looking for an experienced full stack developer to join our team and help build amazing web applications.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Strong knowledge of TypeScript",
        "Experience with cloud platforms (AWS, Azure, or GCP)",
        "Database design and optimization skills",
        "Excellent problem-solving abilities"
      ]
    },
    {
      id: 2,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Join our design team to create beautiful and intuitive user interfaces for our clients' projects.",
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency in Figma and Adobe Creative Suite",
        "Strong portfolio demonstrating design skills",
        "Understanding of modern design principles",
        "Experience with responsive design"
      ]
    },
    {
      id: 3,
      title: "Mobile App Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Help us build cutting-edge mobile applications for iOS and Android platforms.",
      requirements: [
        "4+ years of mobile development experience",
        "Expertise in React Native or Flutter",
        "Knowledge of native iOS/Android development",
        "App store deployment experience",
        "Understanding of mobile UI/UX principles"
      ]
    },
    {
      id: 4,
      title: "Project Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Lead and coordinate software development projects from conception to delivery.",
      requirements: [
        "3+ years of project management experience",
        "Experience with Agile/Scrum methodologies",
        "Strong communication and leadership skills",
        "PMP or similar certification preferred",
        "Technical background in software development"
      ]
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Health, dental, and vision insurance",
    "Flexible working hours",
    "Remote work opportunities",
    "Professional development budget",
    "Modern equipment and tools",
    "Team building activities",
    "Performance bonuses"
  ];

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
          <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Be part of a dynamic team that's shaping the future of software development.
            We're always looking for talented individuals who share our passion for innovation.
          </p>
        </div>

        {/* Company Culture */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Why Work With Us?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Our Culture</h3>
                  <p className="text-muted-foreground mb-4">
                    We foster a collaborative environment where creativity thrives and innovation
                    is encouraged. Our team values work-life balance, continuous learning, and
                    delivering exceptional results for our clients.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Benefits & Perks</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Openings */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Current Openings</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
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
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full sm:w-auto">
                    <Mail className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Don't See the Right Position?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We're always interested in meeting talented individuals. Send us your resume and
              tell us about your skills and interests.
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