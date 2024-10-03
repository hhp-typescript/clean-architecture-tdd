import { Enrollment } from 'src/modules/enrollment/domain';

export class User {
  constructor(
    public id: string,
    public realName: string,
    public enrollments: Enrollment[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
