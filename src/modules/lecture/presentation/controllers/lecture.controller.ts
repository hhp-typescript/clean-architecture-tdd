import { Body, Controller, Get } from '@nestjs/common';
import { LectureFacade } from '../../application/lecture.facade';
import { GetAvailableLecturesDto } from '../dto';

@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureFacade: LectureFacade) {}

  @Get('available')
  async findAvailableLectures(@Body() dto: GetAvailableLecturesDto) {
    const parsedDates = dto.dates.map((date) => new Date(date));

    return this.lectureFacade.findAvailableLectures(parsedDates);
  }
}
