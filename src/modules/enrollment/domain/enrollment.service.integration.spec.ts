import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { EnrollmentOrm, EnrollmentRepositoryImpl } from '../infrastructure';
import { ENROLLMENT_REPOSITORY, LECTURE_REPOSITORY } from 'src/common/const';
import {
  LectureOrm,
  LectureRepositoryImpl,
} from 'src/modules/lecture/infrastructure';
import { ConflictException } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';

jest.setTimeout(30000);
describe('service Integration - Concurrency Tests', () => {
  let service: EnrollmentService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([LectureOrm, EnrollmentOrm]),
      ],
      providers: [
        EnrollmentService,
        { provide: ENROLLMENT_REPOSITORY, useClass: EnrollmentRepositoryImpl },
        { provide: LECTURE_REPOSITORY, useClass: LectureRepositoryImpl },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterAll(async () => {
    // 테스트 종료 후 cleanup
    await entityManager.query(
      'TRUNCATE TABLE enrollment RESTART IDENTITY CASCADE',
    );
    await entityManager.query(
      'TRUNCATE TABLE lecture RESTART IDENTITY CASCADE',
    );
  });
  // 40명 이상의 사용자가 동시에 신청할 때
  it('40명 이상의 신청이 동시에 발생하면 인원 초과가 되어야 한다', async () => {
    const numberOfUsers = 40;

    // 강의 생성 (최대 30명)
    const lecture = await entityManager.save(LectureOrm, {
      name: 'Concurrency Test Lecture',
      capacity: 30,
      participants: 0,
    });

    // 40명의 사용자가 동시에 신청을 보냄
    const promises = [];
    for (let i = 1; i <= numberOfUsers; i++) {
      promises.push(service.enrollWithTransaction(i, lecture));
    }

    // 모든 요청 병렬 처리
    const results = await Promise.allSettled(promises);

    // 성공한 요청은 30개여야 함
    const fulfilled = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter((result) => result.status === 'rejected');

    expect(fulfilled.length).toBe(30); // 최대 30명만 성공
    expect(rejected.length).toBeGreaterThan(0); // 30명 초과는 실패
    rejected.forEach((result) => {
      expect(result.reason).toBeInstanceOf(ConflictException);
      expect(result.reason.message).toBe('참가자 수가 초과되었습니다.');
    });
  });
});
