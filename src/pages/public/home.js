import { HeroSection } from '../../components/public/HeroSection.js';
import { AboutSection } from '../../components/public/AboutSection.js';
import { ProjectsSection } from '../../components/public/ProjectsSection.js';
import { SkillsSection } from '../../components/public/SkillsSection.js';
import { ExperienceSection } from '../../components/public/ExperienceSection.js';
import { CertificatesSection } from '../../components/public/CertificatesSection.js';
import { ContactSection } from '../../components/public/ContactSection.js';
import { $ } from '../../utils/dom.js';

export class HomePage {
  constructor(content, settings) {
    this.content = content || {};
    this.settings = settings || {};
    this.heroSection = new HeroSection(this.content.hero, this.settings);
    this.aboutSection = new AboutSection(this.content.about, this.settings);
    this.projectsSection = new ProjectsSection(this.content.projects, this.settings);
    this.skillsSection = new SkillsSection(this.content.skills, this.settings);
    this.experienceSection = new ExperienceSection(this.content.experience, this.settings);
    this.certificatesSection = new CertificatesSection(this.content.certificates, this.settings);
    this.contactSection = new ContactSection(this.content.contact, this.settings);
  }

  render() {
    return `
      <div id="home-page-container">
        <!-- Hero Section Container -->
        <div id="hero-container"></div>
        <div id="about-container"></div>
        <div id="skills-container"></div>
        <div id="experience-container"></div>
        <div id="projects-container"></div>
        <div id="certificates-container"></div>
        <div id="contact-container"></div>
      </div>
    `;
  }

  mount(containerId) {
    const container = $(containerId);
    if (!container) return;
    
    container.innerHTML = this.render();
    
    // Mount child sections
    if (this.content.hero?.is_visible !== false) this.heroSection.mount('#hero-container');
    if (this.content.about?.is_visible !== false) this.aboutSection.mount('#about-container');
    if (this.content.skills?.is_visible !== false) this.skillsSection.mount('#skills-container');
    if (this.content.experience?.is_visible !== false) this.experienceSection.mount('#experience-container');
    if (this.content.certificates?.is_visible !== false) this.certificatesSection.mount('#certificates-container');
    if (this.content.projects?.is_visible !== false) this.projectsSection.mount('#projects-container');
    if (this.content.contact?.is_visible !== false) this.contactSection.mount('#contact-container');
  }
}
