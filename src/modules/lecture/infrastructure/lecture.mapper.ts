import { EnrollmentMapper } from 'src/modules/enrollment/infrastructure';
import { Lecture } from '../domain';
import { LectureOrm } from './lecture.orm.entity';

export class LectureMapper {
  static toDomain(lectureOrm: LectureOrm): Lecture {
    return new Lecture(
      lectureOrm.id,
      lectureOrm.title,
      lectureOrm.lecturerName,
      lectureOrm.capacity,
      lectureOrm.participants,
      lectureOrm.date,
      lectureOrm.enrollments?.map((enrollment) =>
        EnrollmentMapper.toDomain(enrollment),
      ) ?? [],
      lectureOrm.createdAt,
      lectureOrm.updatedAt,
    );
  }

  static toEntity(lecture: Lecture): LectureOrm {
    const lectureOrm = new LectureOrm();
    lectureOrm.id = lecture.id;
    lectureOrm.title = lecture.title;
    lectureOrm.lecturerName = lecture.lecturerName;
    lectureOrm.capacity = lecture.capacity;
    lectureOrm.date = lecture.date;
    lectureOrm.enrollments = lecture.enrollments.map((enrollment) =>
      EnrollmentMapper.toEntity(enrollment),
    );
    lectureOrm.participants = lecture.participants;
    lectureOrm.createdAt = lecture.createdAt;
    lectureOrm.updatedAt = lecture.updatedAt;
    return lectureOrm;
  }
}
