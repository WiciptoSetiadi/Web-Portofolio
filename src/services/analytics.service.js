import { supabase } from '../config/supabase.js';

class AnalyticsService {
  /**
   * Log a page view (Public)
   */
  async logPageView(path) {
    try {
      await supabase.from('page_views').insert([{
        page_path: path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent
        // country could be added if using Supabase edge functions or IP tracking
      }]);
    } catch (e) {
      // Fail silently for analytics
      console.error('Analytics error:', e);
    }
  }

  /**
   * Increment project view count
   */
  async incrementProjectView(projectId) {
    try {
      // Note: Ideally done via RPC to avoid race conditions, but this works for simple cases
      const { data } = await supabase
        .from('projects')
        .select('view_count')
        .eq('id', projectId)
        .single();
        
      if (data) {
        await supabase
          .from('projects')
          .update({ view_count: data.view_count + 1 })
          .eq('id', projectId);
      }
    } catch (e) {
      console.error('Project view increment error:', e);
    }
  }

  /**
   * Get dashboard summary stats (Admin)
   */
  async getDashboardStats() {
    // In a real production app with high traffic, use RPCs or materialized views.
    // For a personal portfolio, multiple parallel queries are fine.
    
    const queries = [
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('page_views').select('page_path, viewed_at').order('viewed_at', { ascending: false }).limit(50) // For simple chart
    ];
    
    const [views, projects, messages, recentViews] = await Promise.all(queries);
    
    return {
      totalViews: views.count || 0,
      totalProjects: projects.count || 0,
      unreadMessages: messages.count || 0,
      recentViewsData: recentViews.data || []
    };
  }
}

export const analyticsService = new AnalyticsService();
