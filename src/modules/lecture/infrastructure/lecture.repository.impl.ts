import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LectureOrm } from './lecture.orm.entity';
import { ILectureRepository, Lecture } from '../domain';
import { LectureMapper } from './lecture.mapper';

@Injectable()
export class LectureRepositoryImpl implements ILectureRepository {
  constructor(
    @InjectRepository(LectureOrm)
    private readonly repo: Repository<LectureOrm>,
  ) {}

  async findLectureById(lectureId: number): Promise<Lecture> | undefined {
    const lecture = await this.repo.findOneBy({ id: lectureId });

    return LectureMapper.toDomain(lecture);
  }

  async findByIdWithLock(lectureId: number): Promise<Lecture | null> {
    const lecture = await this.repo.findOne({
      where: { id: lectureId },
      lock: { mode: 'pessimistic_write' }, // 비관적 락을 사용해 동시성 제어
    });

    return LectureMapper.toDomain(lecture);
  }

  async findAvailableLectures(dates: Date[]): Promise<Lecture[]> {
    const lectures = await this.repo
      .createQueryBuilder('lecture')
      .where('lecture.date IN (:...dates)', { dates })
      .andWhere('lecture.participants < lecture.capacity')
      .getMany();

    return lectures.map((lecture) => LectureMapper.toDomain(lecture));
  }

  async incrementParticipants(
    lecture: Lecture,
    manager: EntityManager,
  ): Promise<void> {
    const lectureOrm = LectureMapper.toEntity(lecture);

    lectureOrm.participants++;
    await manager.save(lectureOrm);
  }
}
