export interface BearTokenBaseValue {
  sub: number;
  username: string;
}
export interface BearTokenValue extends BearTokenBaseValue {
  iat: number;
  exp: number;
}
