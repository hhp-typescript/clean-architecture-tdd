import { Lecture } from 'src/modules/lecture/domain';
import { User } from 'src/modules/user/domain';

export class Enrollment {
  constructor(
    public id: number,
    public user: User,
    public lecture: Lecture,
    public applicationDate: Date,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
