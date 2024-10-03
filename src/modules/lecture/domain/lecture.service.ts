import { Inject, Injectable } from '@nestjs/common';
import { LECTURE_REPOSITORY } from 'src/common/const';
import { ILectureRepository } from './lecture.repository';
import { Lecture } from './lecture.entity';

@Injectable()
export class LectureService {
  constructor(
    @Inject(LECTURE_REPOSITORY)
    private readonly lectureRepo: ILectureRepository,
  ) {}

  async findLectureById(lectureId: number): Promise<Lecture> {
    const lecture = await this.lectureRepo.findLectureById(lectureId);

    if (!lecture) throw new Error('해당 강의가 존재하지 않습니다');

    return lecture;
  }

  async findAvailableLectures(dates: Date[]): Promise<Lecture[]> {
    const lectures = await this.lectureRepo.findAvailableLectures(dates);

    //TODO 수정하기
    if (lectures.length === 0) throw new Error('신청 가능한 특강이 없습니다.');

    return lectures;
  }

  // 참가자 수 및 강의 존재 여부 확인
  async checkLectureCapacityWithLock(lectureId: number): Promise<Lecture> {
    const lecture = await this.lectureRepo.findByIdWithLock(lectureId);

    if (!lecture) {
      throw new Error('강의를 찾을 수 없습니다.');
    }

    if (lecture.participants >= lecture.capacity) {
      throw new Error('참가자 수가 초과되었습니다.');
    }
    return lecture;
  }
}
