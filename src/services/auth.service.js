import { supabase } from '../config/supabase.js';

class AuthService {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Check if user profile has admin/editor role
    const profile = await this.getProfile(data.user.id);
    if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
      await this.signOut();
      throw new Error('Unauthorized access. Admin or Editor role required.');
    }
    
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    return data;
  }
}

export const authService = new AuthService();
