import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment, IEnrollmentRepository } from '../domain';
import { EntityManager, Repository } from 'typeorm';
import { EnrollmentOrm } from './enrollment.orm.entity';
import { EnrollmentMapper } from './enrollment.mapper';

export class EnrollmentRepositoryImpl implements IEnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentOrm)
    private readonly repo: Repository<EnrollmentOrm>,
  ) {}

  async findAppliedLecturesByUserId(userId: number): Promise<Enrollment[]> {
    const enrollments = await this.repo
      .createQueryBuilder('enrollment')
      .innerJoinAndSelect('enrollment.lecture', 'lecture')
      .where('enrollment.user_id = :userId', { userId })
      .getMany();

    return enrollments.map((enrollment) =>
      EnrollmentMapper.toDomain(enrollment),
    );
  }

  async findOneByUserAndLecture(
    userId: number,
    lectureId: number,
  ): Promise<Enrollment> {
    const enrollment = await this.repo.findOne({
      where: { user: { id: userId }, lecture: { id: lectureId } },
    });

    return EnrollmentMapper.toDomain(enrollment);
  }

  async save(
    userId: number,
    lectureId: number,
    manager: EntityManager,
  ): Promise<void> {
    const enrollment = manager.create(EnrollmentOrm, {
      user: { id: userId },
      lecture: { id: lectureId },
      applicationDate: new Date(),
    });
    await manager.save(enrollment);
  }
}
