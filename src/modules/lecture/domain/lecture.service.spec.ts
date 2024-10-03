import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';
import { ILectureRepository } from '../domain/lecture.repository';
import { Lecture } from '../domain/lecture.entity';
import { LECTURE_REPOSITORY } from 'src/common/const';

describe('LectureService', () => {
  let service: LectureService;
  let lectureRepo: jest.Mocked<ILectureRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LectureService,
        {
          provide: LECTURE_REPOSITORY,
          useValue: {
            findLectureById: jest.fn(),
            findAvailableLectures: jest.fn(),
            findByIdWithLock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LectureService>(LectureService);
    lectureRepo = module.get(LECTURE_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트가 끝난 후 모킹된 상태를 초기화
  });

  describe('특강 ID로 조회', () => {
    it('존재하지 않는 특강을 조회 시 에러를 발생시킨다', async () => {
      // when
      lectureRepo.findLectureById.mockResolvedValue(null); // 모킹

      // given & then
      await expect(service.findLectureById(1)).rejects.toThrow(
        '해당 강의가 존재하지 않습니다',
      );
    });

    it('특정 ID의 특강을 정상적으로 조회한다', async () => {
      // given
      const mockLecture: Lecture = {
        id: 1,
        title: 'NestJS 특강',
        lecturerName: '이혜빈',
        capacity: 30,
        participants: 10,
        date: new Date(),
        enrollments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      lectureRepo.findLectureById.mockResolvedValue(mockLecture);

      // when
      const lecture = await service.findLectureById(1);

      // then
      expect(lecture).toEqual(mockLecture);
    });
  });

  describe('특정 날짜에 신청 가능한 특강 조회', () => {
    it('신청 가능한 특강이 없는 경우 에러를 발생시킨다', async () => {
      // when
      lectureRepo.findAvailableLectures.mockResolvedValue([]);

      // given & then
      await expect(service.findAvailableLectures([new Date()])).rejects.toThrow(
        '신청 가능한 특강이 없습니다.',
      );
    });

    it('신청 가능한 특강을 정상적으로 조회한다', async () => {
      const mockLecture: Lecture = {
        id: 1,
        title: 'NestJS 특강',
        lecturerName: 'John Doe',
        capacity: 30,
        participants: 10,
        date: new Date(),
        enrollments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // when
      lectureRepo.findAvailableLectures.mockResolvedValue([mockLecture]);

      // given
      const lectures = await service.findAvailableLectures([new Date()]);

      //then
      expect(lectures).toHaveLength(1);
      expect(lectures[0]).toEqual(mockLecture);
    });
  });
});
