import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EnrollmentFacade } from '../application/enrollment.facade';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentFacade: EnrollmentFacade) {}

  @Get(':userId')
  async getAppliedLecture(@Param('userId') userId: number) {
    return await this.enrollmentFacade.findAppliedLecturesByUserId(userId);
  }

  @Post(':lectureId')
  async enroll(
    @Param('lectureId') lectureId: number,
    @Body('userId') userId: number,
  ) {
    return this.enrollmentFacade.enrollUserInLecture(userId, lectureId);
  }
}
