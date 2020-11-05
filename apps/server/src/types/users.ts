export interface Users {
  username: string;
  password: string;
}

export interface UsersRegister extends Users {
  confirm_password: string;
}
