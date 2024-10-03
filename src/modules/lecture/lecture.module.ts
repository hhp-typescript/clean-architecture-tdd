import { Module } from '@nestjs/common';
import { LECTURE_REPOSITORY } from 'src/common/const';
import { LectureRepositoryImpl } from './infrastructure';
import { LectureOrm } from './infrastructure/lecture.orm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureFacade } from './application/lecture.facade';
import { LectureService } from './domain/lecture.service';

@Module({
  imports: [TypeOrmModule.forFeature([LectureOrm])],
  providers: [
    LectureFacade,
    LectureService,
    {
      provide: LECTURE_REPOSITORY,
      useClass: LectureRepositoryImpl,
    },
  ],
  exports: [
    LectureService,
    {
      provide: LECTURE_REPOSITORY,
      useClass: LectureRepositoryImpl,
    },
  ],
})
export class LectureModule {}
