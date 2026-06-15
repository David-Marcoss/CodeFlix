import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum CastMemberTypeEnum {
  ACTOR = 'actor',
  DIRECTOR = 'director',
}

export interface CastMemberModelProps {
  cast_member_id: string;
  name: string;
  type: CastMemberTypeEnum;
  created_at?: Date;
}

@Table({ tableName: 'cast_members', timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  declare cast_member_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(CastMemberTypeEnum)),
    allowNull: false,
  })
  declare type: CastMemberTypeEnum;

  @Column({ type: DataType.DATE, allowNull: false })
  declare created_at: Date;
}
