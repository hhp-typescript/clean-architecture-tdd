import { ConflictException, Inject } from '@nestjs/common';
import { ENROLLMENT_REPOSITORY, LECTURE_REPOSITORY } from 'src/common/const';
import { IEnrollmentRepository } from './enrollment.repository';
import { Enrollment } from './enrollment.entity';
import { EntityManager } from 'typeorm';
import { ILectureRepository, Lecture } from 'src/modules/lecture/domain';

export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
    @Inject(LECTURE_REPOSITORY)
    private readonly lectureRepo: ILectureRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async findAppliedLecturesByUserId(userId: number): Promise<Enrollment[]> {
    const enrollments =
      await this.enrollmentRepo.findAppliedLecturesByUserId(userId);

    if (enrollments.length === 0) throw new Error('신청된 특강이 없습니다.');

    return enrollments;
  }

  async checkIfAlreadyEnrolled(
    userId: number,
    lectureId: number,
  ): Promise<boolean> {
    const enrollment = await this.enrollmentRepo.findOneByUserAndLecture(
      userId,
      lectureId,
    );
    return !!enrollment;
  }

  async enrollWithTransaction(
    userId: number,
    lecture: Lecture,
  ): Promise<string> {
    return await this.entityManager.transaction(
      async (manager: EntityManager) => {
        try {
          // 1. 수강 신청 등록과 참가자 수 증가를 병렬로 처리
          await Promise.all([
            this.enrollmentRepo.save(userId, lecture.id, manager), // 수강 신청 등록
            this.lectureRepo.incrementParticipants(lecture, manager), // 참가자 수 증가
          ]);
        } catch (error) {
          if (error.code === '23505') {
            // PostgreSQL의 유니크 키 충돌 오류 코드
            throw new ConflictException('이미 해당 특강에 신청하셨습니다.');
          }
          throw error;
        }

        return '수강 신청이 완료되었습니다.';
      },
    );
  }
}
