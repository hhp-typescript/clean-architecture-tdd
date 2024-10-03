import { BaseEntity } from 'src/common/entity';
import { EnrollmentOrm } from 'src/modules/enrollment/infrastructure';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserOrm extends BaseEntity {
  @Column({ name: 'real_name', type: 'varchar', length: 100 })
  realName: string;

  @OneToMany(() => EnrollmentOrm, (enrollment) => enrollment.user)
  enrollments: EnrollmentOrm[];
}
