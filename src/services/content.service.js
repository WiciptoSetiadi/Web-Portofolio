import { supabase } from '../config/supabase.js';
import { DEFAULT_SECTION_CONTENT } from '../data/defaults.js';

/**
 * Service for managing dynamic page content (CMS)
 */
class ContentService {
  constructor() {
    this.tableName = 'section_content';
    this.cache = null;
  }

  /**
   * Load all section content (Public facing) - Uses in-memory cache
   */
  async loadAll(forceRefresh = false) {
    if (this.cache && !forceRefresh) {
      return this.cache;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('section_key, title, subtitle, description, content, is_visible')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error loading content:', error);
      return DEFAULT_SECTION_CONTENT; // Fallback
    }

    // Transform array to keyed object mapping
    const contentMap = {};
    data.forEach(item => {
      contentMap[item.section_key] = {
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        ...item.content
      };
    });

    // Merge with defaults to ensure all keys exist
    this.cache = { ...DEFAULT_SECTION_CONTENT, ...contentMap };
    return this.cache;
  }

  /**
   * Get all sections for Admin panel
   */
  async getAdminSections() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Update a specific section
   */
  async updateSection(sectionKey, updateData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('section_key', sectionKey)
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate cache
    this.cache = null;
    return data;
  }

  /**
   * Toggle section visibility
   */
  async toggleVisibility(id, isVisible) {
    const { error } = await supabase
      .from(this.tableName)
      .update({ is_visible: isVisible })
      .eq('id', id);

    if (error) throw error;
    this.cache = null;
    return true;
  }
}

export const contentService = new ContentService();
