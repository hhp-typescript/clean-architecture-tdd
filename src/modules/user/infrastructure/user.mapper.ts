import { EnrollmentMapper } from 'src/modules/enrollment/infrastructure';
import { User } from '../domain';
import { UserOrm } from './user.orm.entity';

export class UserMapper {
  static toDomain(userOrm: UserOrm): User {
    return new User(
      userOrm.id,
      userOrm.realName,
      userOrm.enrollments?.map((enrollment) =>
        EnrollmentMapper.toDomain(enrollment),
      ) ?? [],
      userOrm.createdAt,
      userOrm.updatedAt,
    );
  }

  static toEntity(user: User): UserOrm {
    const userOrm = new UserOrm();
    userOrm.id = user.id;
    userOrm.realName = user.realName;
    userOrm.enrollments = user.enrollments.map((enrollment) =>
      EnrollmentMapper.toEntity(enrollment),
    );
    userOrm.createdAt = user.createdAt;
    userOrm.updatedAt = user.updatedAt;
    return userOrm;
  }
}
