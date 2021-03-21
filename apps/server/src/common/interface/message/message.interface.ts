interface UsersBaseRaw {
  user_id: number;
  user_username: string;
  user_pin_yin: string;
  user_nickname: string | null;
  user_age: number | null;
  user_gender: number | null;
  user_avatar: string | null;
}

interface LinksBaseRaw {
  link_id: number;
  link_send_id: number;
  link_receive_id: number;
  link_unread_count: number;
  link_title: string;
  link_type: string;
  link_message: string;
  link_create_at: string;
  link_update_at: string;
}

export interface LinksListRaw extends UsersBaseRaw, LinksBaseRaw {}

interface UsersBaseBody {
  id: number;
  username: string;
  pin_yin: string;
  nickname: string | null;
  age: number | null;
  avatar: string | null;
  gender: string | null;
}

interface LinksBase {
  id: number;
  send_id: number;
  receive_id: number;
  unread_count: number;
  title: string;
  type: string;
  message: string;
  create_at: string;
  update_at: string;
}

export interface LinksList extends UsersBaseBody, LinksBase {}
