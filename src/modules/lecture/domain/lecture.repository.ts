import { EntityManager } from 'typeorm';
import { Lecture } from './lecture.entity';

export interface ILectureRepository {
  findLectureById(lectureId: number): Promise<Lecture | undefined>;
  findByIdWithLock(lectureId: number): Promise<Lecture | undefined>;
  findAvailableLectures(dates: Date[]): Promise<Lecture[]>;
  incrementParticipants(
    lecture: Lecture,
    manager: EntityManager,
  ): Promise<void>;
}
