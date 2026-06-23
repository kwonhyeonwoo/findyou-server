import { PartialType } from '@nestjs/mapped-types';
import { CreateErrandApplicationDto } from './create-errand-application.dto';

export class UpdateErrandApplicationDto extends PartialType(CreateErrandApplicationDto) {}
