export interface FriendsSearchingInterface {
  user_id: number;
  user_username: string;
  user_pin_yin: string;
  user_nickname: string | null;
  user_age: number | null;
  user_gender: number | null;
  user_avatar: string | null;
  frined_id: number | null;
  proposer_id: number | null;
  proposer_message: string | null;
  proposer_apply_status: string | null;
  proposer_target_id: number | null;
}

export interface FriendsSearchingBodyInterface {
  friend: {
    id: number | null;
  };
  user: {
    id: number;
    username: string;
    pin_yin: string;
    nickname: string | null;
    age: number | null;
    avatar: string | null;
    gender: string | null;
  };
  proposer: {
    id: number | null;
    message: string | null;
    apply_status: string | null;
    target_id: number | null;
  };
}
export interface FriendsApplyCountInterface {
  count: number;
}
