export interface UserProps {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string | null;
  active: boolean;
}