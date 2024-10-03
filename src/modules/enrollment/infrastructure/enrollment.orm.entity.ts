import { BaseEntity } from 'src/common/entity';
import { LectureOrm } from 'src/modules/lecture/infrastructure/lecture.orm.entity';
import { UserOrm } from 'src/modules/user/infrastructure';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('enrollments')
export class EnrollmentOrm extends BaseEntity {
  @ManyToOne(() => UserOrm, (user) => user.enrollments)
  @JoinColumn({ name: 'user_id' })
  user: UserOrm;

  @ManyToOne(() => LectureOrm, (lecture) => lecture.enrollments)
  @JoinColumn({ name: 'lecture_id' })
  lecture: LectureOrm;

  @Column({ type: 'timestamp' })
  applicationDate: Date;
}
