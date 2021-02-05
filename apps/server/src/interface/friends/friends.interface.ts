// 注意看Raw和Body的分界线

// Raw
interface UsersBaseRaw {
  user_id: number;
  user_username: string;
  user_pin_yin: string;
  user_nickname: string | null;
  user_age: number | null;
  user_gender: number | null;
  user_avatar: string | null;
}
interface FriendsBaseRaw {
  frined_id: number | null;
}

interface FriendsRaw {
  fruebd_agree_id: number;
  friend_relation_id: number;
  friend_contact_id: number;
  friend_apply_id: number;
  friend_update_at: string;
  friend_create_at: string;
}

interface LinksBaseRaw {
  lin_id: number;
}

interface FriendsDetailUsersRaw extends UsersBaseBody {
  user_mobile: string | null;
  user_email: string | null;
  user_address: string | null;
  user_create_at: string;
}

interface ProposerBaseRaw {
  proposer_id: number | null;
  proposer_message: string | null;
  proposer_apply_status: string | null;
  proposer_target_id: number | null;
}
export interface FriendsSearchingInterface extends UsersBaseRaw, FriendsBaseRaw, ProposerBaseRaw {}

export interface FriendsListInterface extends UsersBaseRaw, FriendsBaseRaw, FriendsRaw {}

export interface FriendsListDetailRawInterface extends UsersBaseRaw, FriendsBaseRaw, FriendsRaw {
  mobile: string | null;
  address: string | null;
  email: string | null;
  create_at: string | null;
}

export interface FriendsListDetailRawInterFace extends FriendsDetailUsersRaw, FriendsRaw, LinksBaseRaw {}

// body

interface UsersBaseBody {
  id: number;
  username: string;
  pin_yin: string;
  nickname: string | null;
  age: number | null;
  avatar: string | null;
  gender: string | null;
}

interface FriendsBaseBody<T> {
  id: T;
}

interface LinksBaseBody {
  id: number;
}

interface FriendsBody extends FriendsBaseBody<number> {
  agree_id: number;
  relation_id: number;
  contact_id: number;
  apply_id: number;
  update_at: string;
  create_at: string;
}

interface ProposerBaseBody {
  id: number | null;
  message: string | null;
  apply_status: string | null;
  target_id: number | null;
}
export interface FriendsSearchingBodyInterface {
  friend: FriendsBaseBody<number | null>;
  user: UsersBaseBody;
  proposer: ProposerBaseBody;
}

export interface FriendsListBodyInterface {
  friend: FriendsBody;
  user: UsersBaseBody;
}

interface FriendsDetailUsers extends UsersBaseBody {
  mobile: string | null;
  email: string | null;
  address: string | null;
  create_at: string;
}
export interface FriendsListDetailInterFace {
  friend: FriendsBody;
  user: FriendsDetailUsers;
  link: LinksBaseBody;
}
export interface FriendsApplyCountInterface {
  count: number;
}
