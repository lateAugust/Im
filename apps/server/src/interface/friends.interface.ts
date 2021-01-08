export interface FriendsSearchingInterface {
  user_id: number;
  user_username: string;
  user_age: number | null;
  user_gender: number | null;
  user_avatar: string | null;
  frined_id: number | null;
  proposer_id: number | null;
  proposer_message: string | null;
}

export interface FriendsSearchingListInterface {
  friend: {
    id: number | null;
  };
  user: {
    id: number;
    username: number;
    age: number | null;
    avatar: string | null;
    gender: string | null;
  };
  proposer: {
    id: number | null;
    message: string | null;
  };
}
