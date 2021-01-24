export interface User {
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  id: number;
  email: string;
  location: string;
}

export interface SKUser {
    id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    location: string;
}
