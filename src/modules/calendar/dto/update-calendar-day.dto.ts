import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCalendarDayDto {
  @IsOptional()
  @IsBoolean()
  isHoliday?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  holidayName?: string | null;

  @IsOptional()
  @IsBoolean()
  isWorkday?: boolean;
}
