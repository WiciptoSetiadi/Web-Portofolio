import { supabase } from '../config/supabase.js';

/**
 * Generic CRUD Service for all Supabase tables
 */
export class CrudService {
  /**
   * @param {string} tableName 
   */
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Get all records, optionally filtered by status and ordered
   */
  async getAll(options = {}) {
    const { status, orderBy = 'sort_order', ascending = true, limit } = options;
    
    let query = supabase.from(this.tableName).select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Get a single record by ID or Slug
   */
  async getOne(key, value) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq(key, value)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data;
  }

  /**
   * Create a new record
   */
  async create(data) {
    const { data: created, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .select()
      .single();
      
    if (error) throw error;
    return created;
  }

  /**
   * Update an existing record
   */
  async update(id, data) {
    const { data: updated, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updated;
  }

  /**
   * Delete a record
   */
  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }

  /**
   * Update order of multiple items (drag & drop support)
   */
  async updateOrder(items) {
    // Supabase JS doesn't have bulk update yet, so we map updates
    const promises = items.map(item => 
      supabase
        .from(this.tableName)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
    );
    
    await Promise.all(promises);
    return true;
  }
}
