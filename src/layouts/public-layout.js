import { Navbar } from '../components/public/Navbar.js';
import { Footer } from '../components/public/Footer.js';
import { HomePage } from '../pages/public/home.js';
import { $ } from '../utils/dom.js';

export class PublicLayout {
  constructor(content, settings) {
    this.content = content;
    this.settings = settings;
    this.navbar = new Navbar(content.navbar || {}, settings);
    this.footer = new Footer(content.footer || {}, settings);
    this.homePage = new HomePage(content, settings);
  }

  mount() {
    // Mount layout components
    this.navbar.mount('#navbar-container');
    this.footer.mount('#footer-container');

    // Clear the loading state
    $('#app').innerHTML = '';

    // Mount the active page (Single Page App approach for the public portfolio)
    this.homePage.mount('#app');
  }
}
