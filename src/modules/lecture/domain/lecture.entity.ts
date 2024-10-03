import { Enrollment } from 'src/modules/enrollment/domain';

export class Lecture {
  constructor(
    public id: string,
    public title: string,
    public capacity: number,
    public date: Date,
    public enrollments: Enrollment[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
