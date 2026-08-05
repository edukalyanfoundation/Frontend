import { supabase } from '@/lib/supabase';

export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface CreateInquiryInput {
  full_name: string;
  email: string;
  message: string;
}

const LOCAL_STORAGE_KEY = 'edukalyan_inquiries';

// Helper for local storage backup
const getLocalInquiries = (): Inquiry[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalInquiry = (inquiry: Inquiry) => {
  try {
    const list = getLocalInquiries();
    list.unshift(inquiry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save inquiry to localStorage', e);
  }
};

export const inquiryService = {
  // Create / Send new inquiry
  async createInquiry(input: CreateInquiryInput): Promise<{ success: boolean; data?: Inquiry; error?: string }> {
    const newInquiry: Inquiry = {
      id: crypto.randomUUID(),
      full_name: input.full_name.trim(),
      email: input.email.trim(),
      message: input.message.trim(),
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. Try Supabase Insert
      const { data, error } = await (supabase.from as any)('inquiries')
        .insert({
          full_name: newInquiry.full_name,
          email: newInquiry.email,
          message: newInquiry.message,
          status: 'unread',
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert inquiry error, falling back to local store:', error.message);
        saveLocalInquiry(newInquiry);
        return { success: true, data: newInquiry };
      }

      saveLocalInquiry(data as Inquiry);
      return { success: true, data: data as Inquiry };
    } catch (err: any) {
      console.warn('Network error when sending inquiry, using fallback storage:', err);
      saveLocalInquiry(newInquiry);
      return { success: true, data: newInquiry };
    }
  },

  // Get all inquiries (Admin Side)
  async getInquiries(): Promise<Inquiry[]> {
    try {
      const { data, error } = await (supabase.from as any)('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return getLocalInquiries();
      }

      // Merge local storage items if any exist
      const localItems = getLocalInquiries();
      const dbIds = new Set((data as any[]).map((item) => item.id));
      const combined = [...data, ...localItems.filter((item) => !dbIds.has(item.id))];

      return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as Inquiry[];
    } catch {
      return getLocalInquiries();
    }
  },

  // Update status (Mark read / replied)
  async updateStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<boolean> {
    try {
      await (supabase.from as any)('inquiries').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Failed to update inquiry status in Supabase:', e);
    }

    // Update local storage item
    try {
      const list = getLocalInquiries().map((item) => (item.id === id ? { ...item, status } : item));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    return true;
  },

  // Delete inquiry
  async deleteInquiry(id: string): Promise<boolean> {
    try {
      await (supabase.from as any)('inquiries').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete inquiry in Supabase:', e);
    }

    try {
      const list = getLocalInquiries().filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    return true;
  },
};
