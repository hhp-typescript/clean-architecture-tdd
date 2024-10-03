import { Enrollment } from 'src/modules/enrollment/domain';
import { EnrollmentOrm } from 'src/modules/enrollment/infrastructure';
import { LectureMapper } from 'src/modules/lecture/infrastructure';
import { UserMapper } from 'src/modules/user/infrastructure';

export class EnrollmentMapper {
  static toDomain(enrollmentOrm: EnrollmentOrm): Enrollment {
    return new Enrollment(
      enrollmentOrm.id,
      UserMapper.toDomain(enrollmentOrm.user),
      LectureMapper.toDomain(enrollmentOrm.lecture),
      enrollmentOrm.applicationDate,
      enrollmentOrm.createdAt,
      enrollmentOrm.updatedAt,
    );
  }

  static toEntity(enrollment: Enrollment): EnrollmentOrm {
    const enrollmentOrm = new EnrollmentOrm();
    enrollmentOrm.id = enrollment.id;
    enrollmentOrm.user = UserMapper.toEntity(enrollment.user);
    enrollmentOrm.lecture = LectureMapper.toEntity(enrollment.lecture);
    enrollmentOrm.applicationDate = enrollment.applicationDate;
    enrollmentOrm.createdAt = enrollment.createdAt;
    enrollmentOrm.updatedAt = enrollment.updatedAt;
    return enrollmentOrm;
  }
}
