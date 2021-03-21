export interface ReturnBody<T> {
  statusCode: number;
  message: string;
  status: boolean;
  total?: number;
  page?: number;
  page_size?: number;
  data: T;
  token?: string;
}
