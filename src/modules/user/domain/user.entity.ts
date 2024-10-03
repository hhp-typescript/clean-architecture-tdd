import { Enrollment } from 'src/modules/enrollment/domain';

export class User {
  constructor(
    public id: number,
    public realName: string,
    public enrollments: Enrollment[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
