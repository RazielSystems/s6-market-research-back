import { Document } from 'mongoose';

export default interface IItem extends Document {
  id: string;
  ocid: string;
  s6_id: string;
}

export interface IQuery {
  page: number;
  pageSize: number;
  query: string;
}
