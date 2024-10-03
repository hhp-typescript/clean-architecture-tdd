import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrm } from './infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrm])],
  exports: [],
})
export class UserModule {}
