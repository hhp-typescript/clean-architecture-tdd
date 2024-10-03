import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENROLLMENT_REPOSITORY } from 'src/common/const';
import { EnrollmentOrm, EnrollmentRepositoryImpl } from './infrastructure';
import { EnrollmentFacade } from './application/enrollment.facade';
import { EnrollmentService } from './domain';
import { LectureModule } from '../lecture/lecture.module';

@Module({
  imports: [LectureModule, TypeOrmModule.forFeature([EnrollmentOrm])],
  providers: [
    EnrollmentFacade,
    EnrollmentService,
    { provide: ENROLLMENT_REPOSITORY, useClass: EnrollmentRepositoryImpl },
  ],
  exports: [],
})
export class EnrollmentModule {}
