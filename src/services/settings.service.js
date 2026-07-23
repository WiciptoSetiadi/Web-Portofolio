import { supabase } from '../config/supabase.js';

class SettingsService {
  /**
   * Get unified settings
   */
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || this.getDefaultSettings();
  }

  /**
   * Update unified settings
   */
  async updateSettings(id, data) {
    if (!id) {
      // If no ID, insert new row for authenticated user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { data: newSettings, error } = await supabase
        .from('settings')
        .insert([{ ...data, user_id: user.user.id }])
        .select()
        .single();
        
      if (error) throw error;
      return newSettings;
    }

    const { data: updated, error } = await supabase
      .from('settings')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }
  
  /**
   * Update user password via Auth API
   * @param {string} newPassword 
   */
  async updatePassword(newPassword) {
    if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
    }
    
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });
    
    if (error) throw error;
    return data;
  }

  getDefaultSettings() {
    return {
      site_title: 'My Portfolio',
      primary_color: '#3b82f6',
      secondary_color: '#1d4ed8',
      dark_mode_default: false,
      full_name: 'Admin User',
      email: '',
      // other defaults can remain empty
    };
  }
}

export const settingsService = new SettingsService();
