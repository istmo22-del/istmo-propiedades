import type {
  Post,
  PostInsert,
  PostStatus,
  PostUpdate,
  Property,
  PropertyCategory,
  PropertyInsert,
  PropertyStatus,
  PropertyUpdate,
  TransactionType,
} from "@/lib/types";

/**
 * Tipos de la base de datos (formato compatible con supabase-js).
 * Si cambias el esquema SQL, actualiza también este archivo.
 */
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: Property;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: PostUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      transaction_type: TransactionType;
      property_category: PropertyCategory;
      property_status: PropertyStatus;
      post_status: PostStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
