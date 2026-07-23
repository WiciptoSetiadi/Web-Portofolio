import { SECTION_KEYS } from '../config/constants.js';

export const DEFAULT_SECTION_CONTENT = {
  [SECTION_KEYS.NAVBAR]: {
    logo_text: 'Portfolio',
    links: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'Experience', href: '#experience' },
      { label: 'Contact', href: '#contact' },
    ],
    cta_label: 'Hire Me',
    cta_href: '#contact',
  },
  [SECTION_KEYS.HERO]: {
    greeting: "Hi, I'm",
    name: 'Wicipto Setiadi',
    typing_texts: ['Full Stack Developer', 'Software Architect', 'UI/UX Designer'],
    bio_short: 'Passionate about building modern web applications with clean architecture and stunning designs.',
    cta_primary: { label: 'View Projects', href: '#projects' },
    cta_secondary: { label: 'Download CV', href: '#' },
    show_social_icons: true,
    show_avatar: true,
  },
  // Add other default structures if needed for fallback when DB is empty
};
