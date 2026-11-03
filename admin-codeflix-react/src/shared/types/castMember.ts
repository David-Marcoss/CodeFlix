import type { Meta } from "./meta";

export interface CastMemberList {
  data: CastMember[];
  meta: Meta;
}

export type CastMemberType = "director" | "actor";

export interface CastMember {
  cast_member_id: string;
  name: string;
  type: CastMemberType;
  created_at: string;
}

export interface GetCastMemberById {
  data: CastMember;
}

export interface CreateCastMember extends Omit<
  CastMember,
  "cast_member_id" | "created_at"
> {}

export interface UpdateCastMember extends Partial<CreateCastMember> {
  cast_member_id: string;
}
