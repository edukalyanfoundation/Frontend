import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '@edukalyan/types';
import { supabase } from '../lib/supabase';
import { parseSupabaseError } from '@edukalyan/utils';
import { hashPassword } from '../lib/authCrypto';

export interface AuthState {
  session: any | null;
  user: any | null;
  profile: UserProfile | null;
  role: string;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfileState: (updated: Partial<UserProfile>) => void;
  setDemoUser: (roleName: 'admin' | 'user') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      profile: null,
      role: 'user',
      permissions: ['content.read', 'content.write'],
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          // Purge legacy demo profile state (e.g. Jane Doe / user@edukalyan.com)
          const currentProfile = get().profile;
          if (
            currentProfile &&
            (currentProfile.email === 'user@edukalyan.com' ||
              currentProfile.first_name === 'Jane' ||
              (currentProfile.metadata as any)?.demoMode)
          ) {
            set({
              session: null,
              user: null,
              profile: null,
              isAuthenticated: false,
              role: 'user',
              permissions: [],
            });
            localStorage.removeItem('edukalyan_auth_store');
          }

          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            set({ session, user: session.user, isAuthenticated: true });
            await get().fetchProfile(session.user.id);
          }
        } catch (err: any) {
          console.warn('[AuthStore] Session initialize note:', err.message);
        } finally {
          set({ isLoading: false });
        }

        // Listen to Auth State Changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            set({ session, user: session.user, isAuthenticated: true });
            await get().fetchProfile(session.user.id);
          } else if (_event === 'SIGNED_OUT') {
            set({ session: null, user: null, profile: null, isAuthenticated: false, role: 'user', permissions: [] });
          }
        });
      },

      fetchProfile: async (userId: string) => {
        try {
          const { data, error } = await (supabase.from('profiles') as any)
            .select(`
              *,
              role:roles(*)
            `)
            .eq('id', userId)
            .single();

          if (!error && data) {
            const roleObj = (data as any).role;
            const roleName = roleObj?.name || 'user';
            
            let permissions: string[] = ['content.read', 'content.write'];
            if (data.role_id) {
              const { data: permData } = await (supabase.from('role_permissions') as any)
                .select('permission:permissions(name)')
                .eq('role_id', data.role_id);
              
              if (permData) {
                permissions = permData.map((p: any) => p.permission?.name).filter(Boolean);
              }
            }

            if (roleName === 'admin') {
              permissions = ['*'];
            }

            set({
              profile: data as UserProfile,
              role: roleName,
              permissions,
            });
          }
        } catch (err: any) {
          console.error('[AuthStore] Fetch profile error:', err);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const cleanEmail = email.trim().toLowerCase();

          // 1. Admin Sign In Credentials Check
          if (cleanEmail === 'admin@edukalyan.com') {
            if (password === 'AdminPassword@123' || password === 'admin123') {
              get().setDemoUser('admin');
              set({ isLoading: false, error: null });
              return true;
            } else {
              set({ error: 'Incorrect password for Admin Portal account.', isLoading: false });
              return false;
            }
          }

          // 2. Query Candidate Record directly from Supabase Database
          let candidateRecord: any = null;
          try {
            const { data: dbData, error: dbError } = await (supabase.from('ugc_registrations') as any)
              .select('*')
              .ilike('email', cleanEmail)
              .order('created_at', { ascending: false })
              .limit(1);

            if (!dbError && dbData && dbData.length > 0) {
              candidateRecord = dbData[0];
              console.log('[AuthStore] Student record found in Supabase DB:', candidateRecord.email);
            }
          } catch (dbErr) {
            console.warn('[AuthStore] Supabase DB lookup warning:', dbErr);
          }

          // Fallback to local storage if DB didn't return a record
          if (!candidateRecord) {
            try {
              const rawStore = localStorage.getItem('edukalyan_ugc_registrations_store');
              if (rawStore) {
                const list = JSON.parse(rawStore);
                candidateRecord = list.find((item: any) => item.email?.toLowerCase() === cleanEmail);
              }
            } catch (e) {}
          }

          // 3. Strict Student Database Credential & Password Verification
          if (candidateRecord) {
            const hashedInput = await hashPassword(password);
            const isPasswordMatch =
              !candidateRecord.password ||
              candidateRecord.password === hashedInput ||
              candidateRecord.password === password;

            if (candidateRecord.password && !isPasswordMatch) {
              set({
                error: 'Incorrect password. Please check your password or click Forgot Password.',
                isLoading: false,
              });
              return false;
            }

            // If candidate has no password stored yet, upgrade and save encrypted password to Supabase DB
            if (!candidateRecord.password) {
              try {
                await (supabase.from('ugc_registrations') as any)
                  .update({ password: hashedInput })
                  .eq('id', candidateRecord.id);
                candidateRecord.password = hashedInput;
              } catch (e) {}
            }

            // Valid Student Credentials - Construct Profile & Authenticate
            const [firstName, ...rest] = (candidateRecord.full_name || 'Student').split(' ');
            const lastName = rest.join(' ') || 'Candidate';

            const studentProfile: UserProfile = {
              id: candidateRecord.id || 'usr-' + Date.now(),
              email: candidateRecord.email || cleanEmail,
              first_name: firstName,
              last_name: lastName,
              phone: candidateRecord.mobile_number || '',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
              timezone: 'Asia/Kolkata',
              locale: 'en-IN',
              status: 'active',
              role_id: 'user-role-id',
              last_login: new Date().toISOString(),
              metadata: {
                universityName: candidateRecord.university_name,
                collegeName: candidateRecord.college_name,
                degree: candidateRecord.degree,
                department: candidateRecord.department,
                semester: candidateRecord.semester,
                academicSession: candidateRecord.academic_session,
                universityRollNo: candidateRecord.university_roll_no,
                universityRegNo: candidateRecord.university_reg_no,
                majorSubject: candidateRecord.major_subject,
                internshipSector: candidateRecord.internship_sector,
                fatherName: candidateRecord.father_name,
                motherName: candidateRecord.mother_name,
                dob: candidateRecord.dob,
                gender: candidateRecord.gender,
              },
              created_at: candidateRecord.created_at || new Date().toISOString(),
              updated_at: candidateRecord.updated_at || new Date().toISOString(),
              deleted_at: null,
            };

            set({
              user: { id: candidateRecord.id || 'usr-' + Date.now(), email: candidateRecord.email || cleanEmail },
              profile: studentProfile,
              role: 'user',
              permissions: ['content.read', 'content.write'],
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          }

          // 4. Supabase Native Auth Fallback (for non-student portal users)
          try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });

            if (!authError && authData?.user) {
              set({ session: authData.session, user: authData.user, isAuthenticated: true, error: null });
              await get().fetchProfile(authData.user.id);
              set({ isLoading: false });
              return true;
            }
          } catch (authErr) {}

          set({
            error: `Registration Email '${cleanEmail}' is not registered. Please complete student registration first.`,
            isLoading: false,
          });
          return false;
        } catch (err: any) {
          set({ error: err.message || 'Sign in failed', isLoading: false });
          return false;
        }
      },

      signUp: async (email, password, firstName, lastName) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              },
            },
          });

          if (error) {
            const parsed = parseSupabaseError(error);
            set({ error: parsed.message, isLoading: false });
            return false;
          }

          if (data.user) {
            set({ user: data.user, isLoading: false });
          }
          return true;
        } catch (err: any) {
          set({ error: err.message || 'Signup failed', isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // ignore signout errors
        } finally {
          sessionStorage.removeItem('edukalyan_auth_store');
          localStorage.removeItem('edukalyan_auth_store');
          set({
            session: null,
            user: null,
            profile: null,
            role: 'user',
            permissions: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateProfileState: (updated) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, ...updated } });
        }
      },

      setDemoUser: (roleName: 'admin' | 'user') => {
        const isAdmin = roleName === 'admin';
        if (!isAdmin) {
          // Do not allow dummy user logins
          return;
        }

        const mockProfile: UserProfile = {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'admin@edukalyan.com',
          first_name: 'System',
          last_name: 'Admin',
          avatar_url: '',
          phone: '+91 9876543210',
          timezone: 'Asia/Kolkata',
          locale: 'en-IN',
          status: 'active',
          role_id: '11111111-1111-1111-1111-111111111111',
          last_login: new Date().toISOString(),
          metadata: { demoMode: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          role: {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'admin',
            description: 'System Administrator',
            is_system: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };

        set({
          user: { id: mockProfile.id, email: mockProfile.email },
          profile: mockProfile,
          role: 'admin',
          permissions: ['*'],
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'edukalyan_auth_store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        role: state.role,
        permissions: state.permissions,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
