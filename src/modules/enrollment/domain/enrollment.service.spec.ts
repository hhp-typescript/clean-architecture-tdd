import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { IEnrollmentRepository } from './enrollment.repository';
import { ILectureRepository, Lecture } from 'src/modules/lecture/domain';
import { ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ENROLLMENT_REPOSITORY, LECTURE_REPOSITORY } from 'src/common/const';
import { Enrollment } from './enrollment.entity';

jest.mock('../infrastructure');
jest.mock('src/modules/lecture/infrastructure');

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let enrollmentRepo: jest.Mocked<IEnrollmentRepository>;
  let lectureRepo: jest.Mocked<ILectureRepository>;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: ENROLLMENT_REPOSITORY,
          useClass:
            jest.requireMock('../infrastructure').EnrollmentRepositoryImpl,
        },
        {
          provide: LECTURE_REPOSITORY,
          useClass: jest.requireMock('src/modules/lecture/infrastructure')
            .LectureRepositoryImpl,
        },
        {
          provide: EntityManager,
          useValue: { transaction: jest.fn() }, // entityManager는 수동으로 모킹
        },
        {
          provide: EntityManager,
          useValue: {
            // 트랜잭션 모킹: IsolationLevel 없이 콜백 함수만 받도록 설정
            transaction: jest
              .fn()
              .mockImplementation(
                async (
                  runInTransaction: (manager: EntityManager) => Promise<any>,
                ) => {
                  return runInTransaction(entityManager); // 트랜잭션 내 로직 실행
                },
              ),
          },
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    enrollmentRepo = module.get(ENROLLMENT_REPOSITORY);
    lectureRepo = module.get(LECTURE_REPOSITORY);
    entityManager = module.get(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAppliedLecturesByUserId', () => {
    it('신청된 특강이 없을 경우 에러를 발생시킨다', async () => {
      enrollmentRepo.findAppliedLecturesByUserId.mockResolvedValue([]);

      await expect(service.findAppliedLecturesByUserId(1)).rejects.toThrowError(
        '신청된 특강이 없습니다.',
      );
    });

    it('신청된 특강을 정상적으로 반환한다', async () => {
      const mockEnrollments: Enrollment[] = [
        {
          id: 1,
          user: {
            id: 1,
            realName: 'John',
            enrollments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          lecture: {
            id: 1,
            title: 'Test Lecture',
            lecturerName: 'Doe',
            capacity: 30,
            participants: 10,
            date: new Date(),
            enrollments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          applicationDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      enrollmentRepo.findAppliedLecturesByUserId.mockResolvedValue(
        mockEnrollments,
      );

      const result = await service.findAppliedLecturesByUserId(1);
      expect(result).toEqual(mockEnrollments);
    });
  });

  describe('checkIfAlreadyEnrolled', () => {
    it('유저가 이미 신청한 경우 true를 반환한다', async () => {
      enrollmentRepo.findOneByUserAndLecture.mockResolvedValue({
        id: 1,
        user: {
          id: 1,
          realName: 'John',
          enrollments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        lecture: {
          id: 1,
          title: 'Test Lecture',
          lecturerName: 'Doe',
          capacity: 30,
          participants: 10,
          date: new Date(),
          enrollments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        applicationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.checkIfAlreadyEnrolled(1, 1);
      expect(result).toBe(true);
    });

    it('유저가 신청하지 않은 경우 false를 반환한다', async () => {
      enrollmentRepo.findOneByUserAndLecture.mockResolvedValue(null);

      const result = await service.checkIfAlreadyEnrolled(1, 1);
      expect(result).toBe(false);
    });
  });

  describe('enrollWithTransaction', () => {
    it('트랜잭션 내에서 수강 신청과 참가자 수 증가가 정상적으로 처리된다', async () => {
      const mockLecture: Lecture = {
        id: 1,
        title: 'Test Lecture',
        lecturerName: 'John Doe',
        capacity: 30,
        participants: 10,
        date: new Date(),
        enrollments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (entityManager.transaction as jest.Mock).mockImplementationOnce(
        async (cb: (manager: EntityManager) => Promise<any>) => {
          return cb(entityManager); // 트랜잭션 내 콜백 함수 실행
        },
      );

      await service.enrollWithTransaction(1, mockLecture);

      // 수강 신청이 정상적으로 저장되는지 확인
      expect(enrollmentRepo.save).toHaveBeenCalledWith(
        1,
        mockLecture.id,
        expect.anything(), // EntityManager 대신 anyhing() 사용
      );
      // 참가자 수가 증가하는지 확인
      expect(lectureRepo.incrementParticipants).toHaveBeenCalledWith(
        mockLecture,
        expect.anything(), // EntityManager 대신 anyhing() 사용
      );
    });

    it('이미 신청된 특강일 경우 ConflictException을 발생시킨다', async () => {
      const mockLecture: Lecture = {
        id: 1,
        title: 'Test Lecture',
        lecturerName: 'John Doe',
        capacity: 30,
        participants: 10,
        date: new Date(),
        enrollments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 트랜잭션에서 save 메소드가 유니크 키 충돌을 일으키도록 모킹
      enrollmentRepo.save.mockRejectedValue({ code: '23505' });

      // 유니크 키 충돌로 인해 ConflictException이 발생하는지 확인
      await expect(
        service.enrollWithTransaction(1, mockLecture),
      ).rejects.toThrow(ConflictException);
    });
  });
});
