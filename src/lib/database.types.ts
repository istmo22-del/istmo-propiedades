import type {
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
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      transaction_type: TransactionType;
      property_category: PropertyCategory;
      property_status: PropertyStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
