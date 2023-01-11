export enum NovaUserRole {
  user = 'USER',
  superAdmin = 'ADMIN',
}

export type User = {
  email: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  family_name: string;
  given_name: string;
  groups: string[];
  markings: string[];
  sub: string;
};
