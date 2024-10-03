import { Injectable } from '@nestjs/common';
import { Lecture, LectureService } from '../domain';

@Injectable()
export class LectureFacade {
  constructor(private readonly lectureService: LectureService) {}

  // 날짜별로 현재 신청 가능한 특강 목록을 조회하는 메소드
  async findAvailableLectures(dates: Date[]): Promise<Lecture[]> {
    return this.lectureService.findAvailableLectures(dates);
  }
}
