export interface Journal {
  id?: number;
  text: string;
  time?: string;
  wave?: string;
  wave_direction?: string;
  wind_direction?: string;
  location?: string;
  image?: string;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}



export interface JournalComment {
  id?: number;
  journal_id: number;
  user_id: number;
  text: string;
  created_at?: Date;
}
