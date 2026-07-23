import { BaseValidator } from './base.validator.js';

// --- Schemas ---

const projectSchema = {
  title: { type: 'string', required: true, maxLength: 100 },
  slug: { type: 'string', required: true, pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens' },
  category: { type: 'string', required: false },
  short_description: { type: 'string', required: true, maxLength: 250 },
  description: { type: 'string', required: false },
  image_url: { type: 'string', required: false }, // Could add URL regex
  live_url: { type: 'string', required: false },
  github_url: { type: 'string', required: false },
  tech_stack: { type: 'array', required: false },
  tags: { type: 'array', required: false },
  status: { type: 'string', required: true },
  is_featured: { type: 'boolean', required: false }
};

const skillSchema = {
  name: { type: 'string', required: true, maxLength: 50 },
  category: { type: 'string', required: false },
  icon_name: { type: 'string', required: false },
  proficiency: { type: 'number', required: false, min: 0, max: 100 },
  status: { type: 'string', required: true }
};

const contactMessageSchema = {
  sender_name: { type: 'string', required: true, maxLength: 100 },
  sender_email: { type: 'string', required: true, pattern: /^\S+@\S+\.\S+$/, message: 'Valid email required' },
  subject: { type: 'string', required: false, maxLength: 150 },
  message: { type: 'string', required: true, maxLength: 2000 }
};

// ... More schemas can be added as needed

// --- Validator Instances ---

export const projectValidator = new BaseValidator(projectSchema);
export const skillValidator = new BaseValidator(skillSchema);
export const contactValidator = new BaseValidator(contactMessageSchema);
