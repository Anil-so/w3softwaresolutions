import { Linkedin, Instagram } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Vikash Khadoliya",
    role: "CEO/Co-Founder & Full-Stack Developer",
    image: "/assets/vikash.jpg",
    description: "Co-founder and full-stack developer with deep expertise in React, Node.js, and cloud solutions. Leads the team in delivering innovative and scalable digital products.",
    social: {
      linkedin: "https://www.linkedin.com/in/vikash-khadoliya-584660292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      instagram: "https://www.instagram.com/the___.vikash?igsh=MTk1OWdvOG9vazJsMA%3D%3D&utm_source=qr"
    }
  },
  {
    id: 2,
    name: "Abhay Ghorela",
    role: "CEO/Co-Founder & Full-Stack Developer",
    image: "/assets/abhay.jpg",
    description: "Co-founder with expertise in frontend and backend development. Skilled in building interactive web interfaces using modern technologies.",
    social: {
      linkedin: "#",
      instagram: "#"
    }
  },
  {
    id: 3,
    name: "Aditya Kumawat",
    role: "Frontend and WordPress Developer",
    image: "/assets/aditya.jpg",
    description: "Expert in WordPress development and frontend technologies.",
    social: {
      linkedin: "#",
      instagram: "#"
    }
  },

];

const Team = () => {
  return (
    <section id="team" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Talented professionals dedicated to delivering exceptional digital solutions
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group h-full bg-card/60 backdrop-blur-md rounded-3xl border border-primary/10 hover:border-primary/30 shadow-md hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center p-8 gap-6 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Member Photo */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 object-cover object-top rounded-full border-4 border-background group-hover:border-primary/50 shadow-lg group-hover:scale-105 transition-all duration-500 relative z-10"
                />
                {/* Social Links */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 z-20">
                  <a
                    href={member.social.linkedin}
                    className="p-2.5 bg-background rounded-full hover:bg-primary hover:text-white text-primary shadow-lg hover:shadow-primary/50 transition-all duration-300 border border-border"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.social.instagram}
                    className="p-2.5 bg-background rounded-full hover:bg-primary hover:text-white text-primary shadow-lg hover:shadow-primary/50 transition-all duration-300 border border-border"
                    aria-label={`${member.name} Instagram`}
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Member Info */}
              <div className="w-full flex flex-col items-center text-center mt-2">
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary/90 font-semibold text-sm uppercase tracking-wider mb-4 px-3 py-1 bg-primary/10 rounded-full">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-primary/10 rounded-lg p-8 border border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join Our Team
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our growing team.
            </p>
            <a
              href="mailto:careers@w3softwaresolutions.com"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors font-medium"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;