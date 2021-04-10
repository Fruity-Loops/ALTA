export interface User {
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  id: number;
  email: string;
  location: string;
  organization: Number;
  user_name: string;
  availability: string;
}

export interface SKUser {
    id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    location: string;
}
