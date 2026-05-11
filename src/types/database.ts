export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      feature_flags: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_enabled: boolean;
          display_order: number;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          is_enabled?: boolean;
          display_order?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_enabled?: boolean;
          display_order?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
