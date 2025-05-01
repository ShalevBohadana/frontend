import { motion } from "framer-motion";
import { styles } from "../styles";
import { pineapple, pineappleHover } from "../assets";
import { projects } from "../constants";
import { fadeIn, textVariant, staggerContainer } from "../utils/motion";

const CertificateCard = ({ name, description, image, demo, index }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.75)}
      className="bg-jetLight rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />

      <div className="p-4 flex flex-col justify-between h-[calc(100%-192px)]">
        <div>
          <h3 className="text-xl font-bold text-timberWolf mb-2">{name}</h3>
          <p className="text-silver text-sm leading-relaxed">{description}</p>
        </div>

        <button
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-night text-timberWolf rounded-md hover:bg-battleGray transition"
          onClick={() => window.open(demo, "_blank")}
          onMouseOver={(e) => (e.currentTarget.querySelector("img").src = pineappleHover)}
          onMouseOut={(e) => (e.currentTarget.querySelector("img").src = pineapple)}
        >
          <img src={pineapple} alt="pineapple" className="w-6 h-6 btn-icon" />
          View Certificate
        </button>
      </div>
    </motion.div>
  );
};

const Certificates = () => {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} !mt-0`}></p>
        <h2 className={`${styles.sectionHeadTextLight} !mt-0`}>Projects Showcase</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-taupe text-[18px] max-w-3xl leading-[30px]"
      >
        <span className="font-semibold"></span> Explore my hands-on DevOps projects where I automate, deploy, and monitor scalable cloud-native applications using Terraform, Docker, Kubernetes, Jenkins, and AWS
      
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {projects.map((project, index) => (
          <CertificateCard key={project.id} index={index} {...project} />
        ))}
      </motion.div>
    </section>
  );
};

export default Certificates;
