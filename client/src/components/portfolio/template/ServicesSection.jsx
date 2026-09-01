import { motion } from "framer-motion";
import { 
  SectionHeading,
  ServiceCard,
  getIconByName
} from "./PortfolioTemplateComponents";
import { services } from "@/data/techPortfolioData";

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="What I Do" 
          subtitle="Services & Expertise"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const IconComponent = getIconByName(service.icon);
            return (
              <ServiceCard
                key={idx}
                title={service.title}
                description={service.description}
                icon={IconComponent}
                color={service.color}
                delay={idx * 0.1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
