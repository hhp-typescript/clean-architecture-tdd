import { BaseEntity } from 'src/common/entity';
import { EnrollmentOrm } from 'src/modules/enrollment/infrastructure';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('lectures')
export class LectureOrm extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'lecturer_name', type: 'varchar', length: 255 })
  lecturerName: string;

  @Column({ default: 30 })
  capacity: number;

  @Column({ default: 0 })
  participants: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @OneToMany(() => EnrollmentOrm, (enrollment) => enrollment.lecture)
  enrollments: EnrollmentOrm[];
}
