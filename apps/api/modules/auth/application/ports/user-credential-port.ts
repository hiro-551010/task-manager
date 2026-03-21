export type UserCredential = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserCredentialPort {
  findByEmail(email: string): Promise<UserCredential | null>;
  findById(id: string): Promise<UserCredential | null>;
}
