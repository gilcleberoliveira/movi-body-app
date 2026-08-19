export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          name: string;
          email: string | null;
          avatar_initial: string;
          xp: number;
          level: number;
          streak_current: number;
          streak_longest: number;
          shields_available: number;
          checkins_this_week: number;
          day_in_season: number;
          season_current: number;
          created_at: string;
        },
        {
          id: string;
          name?: string;
          email?: string | null;
          avatar_initial?: string;
          xp?: number;
          level?: number;
          streak_current?: number;
          streak_longest?: number;
          shields_available?: number;
          checkins_this_week?: number;
          day_in_season?: number;
          season_current?: number;
          created_at?: string;
        }
      >;
      checkins: Table<
        {
          id: string;
          user_id: string;
          sport_id: string;
          season: number;
          day_in_season: number;
          proof_id: string | null;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          sport_id: string;
          season: number;
          day_in_season: number;
          proof_id?: string | null;
          created_at?: string;
        }
      >;
      proofs: Table<
        {
          id: string;
          user_id: string;
          kind: "photo" | "video" | "audio";
          storage_path: string;
          caption: string | null;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          kind: "photo" | "video" | "audio";
          storage_path: string;
          caption?: string | null;
          created_at?: string;
        }
      >;
      protocol_progress: Table<
        {
          id: string;
          user_id: string;
          step_id: number;
          response_text: string | null;
          proof_id: string | null;
          completed_at: string;
        },
        {
          id?: string;
          user_id: string;
          step_id: number;
          response_text?: string | null;
          proof_id?: string | null;
          completed_at?: string;
        }
      >;
      journal_entries: Table<
        { id: string; user_id: string; body: string; created_at: string },
        { id?: string; user_id: string; body: string; created_at?: string }
      >;
      transformations: Table<
        { id: string; user_id: string; body: string; created_at: string },
        { id?: string; user_id: string; body: string; created_at?: string }
      >;
      daily_interactions: Table<
        {
          id: string;
          user_id: string;
          day: number;
          liked: boolean;
          saved: boolean;
          shared: boolean;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          day: number;
          liked?: boolean;
          saved?: boolean;
          shared?: boolean;
          updated_at?: string;
        }
      >;
      milestone_progress: Table<
        {
          id: string;
          user_id: string;
          milestone_id: number;
          response_text: string | null;
          proof_id: string | null;
          completed_at: string;
        },
        {
          id?: string;
          user_id: string;
          milestone_id: number;
          response_text?: string | null;
          proof_id?: string | null;
          completed_at?: string;
        }
      >;
      mission_log: Table<
        {
          id: string;
          user_id: string;
          mission_id: number;
          status: "completed" | "abandoned";
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          mission_id: number;
          status: "completed" | "abandoned";
          created_at?: string;
        }
      >;
      chat_messages: Table<
        {
          id: string;
          user_id: string;
          name: string;
          initial: string;
          kind: "text" | "media";
          body: string | null;
          storage_path: string | null;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          name: string;
          initial: string;
          kind: "text" | "media";
          body?: string | null;
          storage_path?: string | null;
          created_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
