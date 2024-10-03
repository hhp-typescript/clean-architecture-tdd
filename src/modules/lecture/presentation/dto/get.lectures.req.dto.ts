import { IsArray, IsDateString } from 'class-validator';

export class GetAvailableLecturesDto {
  @IsArray()
  @IsDateString({}, { each: true })
  dates: string[];
}
