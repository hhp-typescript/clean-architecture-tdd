import { EntityManager } from 'typeorm';
import { Enrollment } from './enrollment.entity';

export interface IEnrollmentRepository {
  findAppliedLecturesByUserId(userId: number): Promise<Enrollment[]>;
  findOneByUserAndLecture(
    userId: number,
    lectureId: number,
  ): Promise<Enrollment>;
  save(
    userId: number,
    lectureId: number,
    manager: EntityManager,
  ): Promise<void>;
}
