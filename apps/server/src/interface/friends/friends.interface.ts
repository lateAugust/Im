export interface FriendsSearchingInterface {
  user_id: number;
  user_username: string;
  user_nickname: string | null;
  user_age: number | null;
  user_gender: number | null;
  user_avatar: string | null;
  frined_id: number | null;
  proposer_id: number | null;
  proposer_message: string | null;
}

export interface FriendsSearchingDetailRawInterface {
  user_id: number;
  user_username: string;
  user_age: number | null;
  user_gender: number | null;
  user_nickname: string | null;
  user_mobile: string | null;
  user_avatar: string | null;
  user_address: string | null;
  user_email: string | null;
  proposer_id: number | null;
  proposer_message: string | null;
}

export interface FriendsSearchingListInterface {
  friend: {
    id: number | null;
  };
  user: {
    id: number;
    username: string;
    nickname: string | null;
    age: number | null;
    avatar: string | null;
    gender: string | null;
  };
  proposer: {
    id: number | null;
    message: string | null;
  };
}

export interface FriendsSearchingDetailInterface {
  user: {
    id: number;
    username: string;
    nickname: string | null;
    age: number | null;
    avatar: string | null;
    gender: string | null;
    mobile: string | null;
    email: string | null;
    address: string | null;
  };
  proposer: {
    id: number | null;
    message: string | null;
  };
}

export interface FriendsApplyCountInterface {
  count: number;
}
