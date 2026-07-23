import { $ } from '../../utils/dom.js';
import { supabase } from '../../config/supabase.js';

export class ContactSection {
  constructor(content, settings = {}) {
    this.content = content || {};
    this.settings = settings;
  }

  render() {
    const { title, subtitle, form_title, fields, submit_label, info_title, show_info_card } = this.content;
    const { email, location, github, linkedin, instagram } = this.settings;
    const f = fields || {};

    const renderSocialIcon = (url, platform) => url ? `
      <a href="${url}" target="_blank" class="p-2 bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 transition-colors">
          <i data-lucide="${platform.toLowerCase()}" class="w-5 h-5"></i>
      </a>
    ` : '';

    return `
      <section id="contact" class="py-24 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 relative overflow-hidden">
        
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary-50 dark:bg-primary-900/10 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-primary-50 dark:bg-primary-900/10 blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="heading-lg">${title || 'Get In Touch'}</h2>
            ${subtitle ? `<p class="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">${subtitle}</p>` : ''}
          </div>

          <div class="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
            
            ${show_info_card ? `
              <div class="w-full lg:w-1/3" data-aos="fade-right">
                <div class="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 h-full border border-gray-100 dark:border-slate-700">
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">${info_title || 'Contact Info'}</h3>
                  
                  <div class="space-y-6">
                    <div class="flex items-start gap-4">
                      <div class="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-lg text-primary-600 dark:text-primary-400">
                        <i data-lucide="mail" class="w-6 h-6"></i>
                      </div>
                      <div>
                        <p class="text-sm text-slate-500 mb-1">Email</p>
                        <a href="mailto:${email || 'hello@example.com'}" class="text-gray-900 dark:text-white hover:text-primary-600 font-medium transition-colors">${email || 'hello@example.com'}</a>
                      </div>
                    </div>
                    
                    <div class="flex items-start gap-4">
                      <div class="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-lg text-primary-600 dark:text-primary-400">
                        <i data-lucide="map-pin" class="w-6 h-6"></i>
                      </div>
                      <div>
                        <p class="text-sm text-slate-500 mb-1">Location</p>
                        <p class="text-gray-900 dark:text-white font-medium">${location || 'Jakarta, Indonesia'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <hr class="my-8 border-gray-200 dark:border-slate-700">
                  
                  <p class="text-slate-600 dark:text-slate-400 mb-4">Or connect on social media:</p>
                  <div class="flex gap-4">
                     ${renderSocialIcon(github, 'github')}
                     ${renderSocialIcon(linkedin, 'linkedin')}
                     ${renderSocialIcon(instagram, 'instagram')}
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="w-full ${show_info_card ? 'lg:w-2/3' : 'max-w-2xl mx-auto'}" data-aos="fade-left">
              <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">${form_title || 'Send Message'}</h3>
                
                <form id="contact-form" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">${f.name_label || 'Name'}</label>
                      <input type="text" id="name" name="name" required placeholder="${f.name_placeholder || 'John Doe'}" class="input-field">
                    </div>
                    <div>
                      <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">${f.email_label || 'Email'}</label>
                      <input type="email" id="email" name="email" required placeholder="${f.email_placeholder || 'john@example.com'}" class="input-field">
                    </div>
                  </div>
                  
                  <div>
                    <label for="subject" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">${f.subject_label || 'Subject'}</label>
                    <input type="text" id="subject" name="subject" required placeholder="${f.subject_placeholder || 'Project Inquiry'}" class="input-field">
                  </div>
                  
                  <div>
                    <label for="message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">${f.message_label || 'Message'}</label>
                    <textarea id="message" name="message" rows="5" required placeholder="${f.message_placeholder || 'Tell me about your project...'}" class="input-field resize-none"></textarea>
                  </div>
                  
                  <div id="form-status" class="hidden rounded-lg p-4 text-sm font-medium"></div>

                  <button type="submit" id="submit-btn" class="btn btn-primary w-full group">
                    <span id="btn-text">${submit_label || 'Send Message'}</span>
                    <i data-lucide="send" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" id="btn-icon"></i>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    `;
  }

  mount(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = this.render();
    if (window.lucide) window.lucide.createIcons({ root: container });

    const form = $('#contact-form', container);
    const statusDiv = $('#form-status', container);
    const submitBtn = $('#submit-btn', container);
    const btnText = $('#btn-text', container);
    const btnIcon = $('#btn-icon', container);

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable form
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.classList.add('hidden');
        statusDiv.classList.add('hidden');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
          const { error } = await supabase.from('contact_messages').insert([
            {
              sender_name: data.name,
              sender_email: data.email,
              subject: data.subject,
              message: data.message
            }
          ]);

          if (error) throw error;

          // Send email notification via EmailJS
          if (window.emailjs) {
            window.emailjs.init("HgV0dWfoMWyogfVyn");
            await window.emailjs.send(
              "service_qwh0jba",
              "template_zp92kxm",
              {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message
              }
            );
          }

          // Success
          statusDiv.className = 'rounded-lg p-4 text-sm font-medium bg-green-50 text-green-700 border border-green-200 mb-6';
          statusDiv.textContent = this.content.success_message || 'Message sent successfully!';
          statusDiv.classList.remove('hidden');
          form.reset();

        } catch (err) {
          console.error('Submit error:', err);
          statusDiv.className = 'rounded-lg p-4 text-sm font-medium bg-red-50 text-red-700 border border-red-200 mb-6';
          statusDiv.textContent = 'Failed to send message. Please try again later.';
          statusDiv.classList.remove('hidden');
        } finally {
          submitBtn.disabled = false;
          btnText.textContent = this.content.submit_label || 'Send Message';
          btnIcon.classList.remove('hidden');
        }
      });
    }

    // Attempt to load profile data for the info card (if applicable)
    if (this.content.show_info_card) {
      // Data is now loaded synchronously from settings
    }
  }
}
