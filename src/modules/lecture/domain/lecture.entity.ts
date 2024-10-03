import { Enrollment } from 'src/modules/enrollment/domain';

export class Lecture {
  constructor(
    public id: number,
    public title: string,
    public lecturerName: string,
    public capacity: number,
    public participants: number,
    public date: Date,
    public enrollments: Enrollment[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
