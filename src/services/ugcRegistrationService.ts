import { supabase } from '@/lib/supabase';
import { Database } from '@edukalyan/types';
import { hashPassword } from '@/lib/authCrypto';

export type UgcRegistrationInsert = Database['public']['Tables']['ugc_registrations']['Insert'];
export type UgcRegistrationRow = Database['public']['Tables']['ugc_registrations']['Row'];

const STORAGE_KEY = 'edukalyan_ugc_registrations_store';

const getLocalRegistrations = (): UgcRegistrationRow[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalRegistration = (record: UgcRegistrationRow) => {
  try {
    const current = getLocalRegistrations();
    const updated = [record, ...current.filter((r) => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
};

export const ugcRegistrationService = {
  /**
   * Submit student UGC registration to Supabase database
   */
  async submitRegistration(data: Omit<UgcRegistrationInsert, 'id' | 'created_at' | 'updated_at'> & { password?: string }) {
    const generatedId = crypto.randomUUID();
    const hashedPassword = data.password ? await hashPassword(data.password) : null;

    const newRecord: UgcRegistrationRow = {
      id: generatedId,
      university_name: data.university_name,
      college_name: data.college_name,
      degree: data.degree,
      department: data.department,
      semester: data.semester,
      academic_session: data.academic_session,
      university_roll_no: data.university_roll_no,
      university_reg_no: data.university_reg_no,
      major_subject: data.major_subject,
      internship_sector: data.internship_sector,
      full_name: data.full_name,
      father_name: data.father_name,
      mother_name: data.mother_name,
      dob: data.dob,
      gender: data.gender,
      mobile_number: data.mobile_number,
      mobile_is_whatsapp: data.mobile_is_whatsapp ?? true,
      email: data.email ?? null,
      status: data.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      password: hashedPassword,
    };

    // Save in local storage backup
    saveLocalRegistration(newRecord);

    try {
      // Insert directly into Supabase ugc_registrations table with explicit ID
      const { data: insertedData, error } = await (supabase.from('ugc_registrations') as any)
        .insert([
          {
            id: generatedId,
            university_name: data.university_name,
            college_name: data.college_name,
            degree: data.degree,
            department: data.department,
            semester: data.semester,
            academic_session: data.academic_session,
            university_roll_no: data.university_roll_no,
            university_reg_no: data.university_reg_no,
            major_subject: data.major_subject,
            internship_sector: data.internship_sector,
            full_name: data.full_name,
            father_name: data.father_name,
            mother_name: data.mother_name,
            dob: data.dob,
            gender: data.gender,
            mobile_number: data.mobile_number,
            mobile_is_whatsapp: data.mobile_is_whatsapp ?? true,
            email: data.email ?? null,
            password: hashedPassword,
            status: data.status || 'pending',
          },
        ])
        .select();

      if (error) {
        console.error('[Supabase Registration Error]:', error.message, error.details, error.hint);
        throw new Error(error.message || 'Failed to save registration in Supabase database.');
      }

      console.log('[Supabase Success]: Registration inserted into DB (password encrypted):', insertedData);
      if (insertedData && insertedData[0]) {
        const resultRecord = { ...(insertedData[0] as UgcRegistrationRow), password: hashedPassword };
        saveLocalRegistration(resultRecord);
        return resultRecord;
      }
    } catch (err: any) {
      console.error('[Supabase Connection Error]:', err.message);
      // Re-throw if it's an explicit database error so user sees the error
      if (err.message && !err.message.includes('network')) {
        throw err;
      }
    }

    return newRecord;
  },

  /**
   * Get all student registrations (Admin portal service)
   */
  async getAllRegistrations(): Promise<UgcRegistrationRow[]> {
    try {
      const { data, error } = await (supabase.from('ugc_registrations') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        console.log('[Supabase DB] Fetched real student registrations count:', data.length);
        return data as UgcRegistrationRow[];
      }
      if (error) {
        console.error('[Supabase Fetch Error]:', error.message, error.details);
      }
    } catch (err) {
      console.warn('Failed to fetch registrations from Supabase DB:', err);
    }

    return getLocalRegistrations();
  },

  /**
   * Update student registration status (Admin function)
   */
  async updateStatus(id: string, status: string): Promise<boolean> {
    // 1. Update in Supabase DB
    try {
      const { error } = await (supabase.from('ugc_registrations') as any)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('[Supabase Update Status Error]:', error);
      }
    } catch (err) {
      console.warn('[Supabase Connection Error during status update]:', err);
    }

    // 2. Update local storage cache
    try {
      const localRecords = getLocalRegistrations();
      const updated = localRecords.map((r) => (r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    return true;
  },

  /**
   * Delete student registration permanently (Admin function)
   */
  async deleteRegistration(id: string): Promise<boolean> {
    // 1. Delete from Supabase DB
    try {
      const { error } = await (supabase.from('ugc_registrations') as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase Delete Error]:', error);
      }
    } catch (err) {
      console.warn('[Supabase Connection Error during delete]:', err);
    }

    // 2. Delete from local storage cache
    try {
      const localRecords = getLocalRegistrations();
      const filtered = localRecords.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {}

    return true;
  },
};
