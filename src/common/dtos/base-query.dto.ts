import { IsNotEmpty, Max, Min } from 'class-validator';

export class QueryBaseDto {
  @IsNotEmpty()
  public page = 1;

  @IsNotEmpty()
  @Max(50)
  @Min(0)
  public itemPerPage = 25;
}
