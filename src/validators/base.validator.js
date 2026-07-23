export class BaseValidator {
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * Validate data against the schema
   * @param {Object} data 
   * @returns {Object} { isValid: boolean, errors: Object, sanitizedData: Object }
   */
  validate(data) {
    const errors = {};
    const sanitizedData = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(this.schema)) {
      let value = data[field];

      // Handle required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors[field] = 'This field is required';
        isValid = false;
        continue;
      }

      // Skip validation if optional and empty
      if (!rules.required && (value === undefined || value === null || value === '')) {
        if (value !== undefined) {
          sanitizedData[field] = value;
        }
        continue;
      }

      // Type checking and sanitization
      if (rules.type) {
        if (rules.type === 'string') {
          value = String(value).trim();
        } else if (rules.type === 'number') {
          value = Number(value);
          if (isNaN(value)) {
            errors[field] = 'Must be a valid number';
            isValid = false;
            continue;
          }
        } else if (rules.type === 'boolean') {
          value = Boolean(value);
        } else if (rules.type === 'array') {
          if (!Array.isArray(value)) {
            errors[field] = 'Must be an array';
            isValid = false;
            continue;
          }
        }
      }

      // Min/Max Length for strings
      if (rules.type === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors[field] = `Must be at least ${rules.minLength} characters`;
          isValid = false;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[field] = `Must be less than ${rules.maxLength} characters`;
          isValid = false;
        }
      }

      // Min/Max for numbers
      if (rules.type === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors[field] = `Minimum value is ${rules.min}`;
          isValid = false;
        }
        if (rules.max !== undefined && value > rules.max) {
          errors[field] = `Maximum value is ${rules.max}`;
          isValid = false;
        }
      }

      // Custom regex pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || 'Invalid format';
        isValid = false;
      }

      if (isValid || Object.keys(errors).length === 0 || !errors[field]) {
        sanitizedData[field] = value;
      }
    }

    return { isValid, errors, sanitizedData };
  }
}
