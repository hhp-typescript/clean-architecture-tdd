import { ConflictException, Injectable } from '@nestjs/common';
import { Enrollment, EnrollmentService } from '../domain';
import { LectureService } from 'src/modules/lecture/domain';

@Injectable()
export class EnrollmentFacade {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly lectureService: LectureService,
  ) {}

  // userId로 해당 유저의 특강 신청목록 가져오기
  async findAppliedLecturesByUserId(userId: number): Promise<Enrollment[]> {
    return await this.enrollmentService.findAppliedLecturesByUserId(userId);
  }

  async enrollUserInLecture(
    userId: number,
    lectureId: number,
  ): Promise<string> {
    // 강의 수용 가능 여부 확인
    const lecture =
      await this.lectureService.checkLectureCapacityWithLock(lectureId);

    // 이미 신청했는지 확인
    const isEnrolled = await this.enrollmentService.checkIfAlreadyEnrolled(
      userId,
      lectureId,
    );
    if (isEnrolled) {
      throw new ConflictException('이미 해당 특강에 신청하셨습니다.');
    }

    // 트랜잭션을 이용한 수강 신청과 참가자 수 증가
    return await this.enrollmentService.enrollWithTransaction(userId, lecture);
  }
}
