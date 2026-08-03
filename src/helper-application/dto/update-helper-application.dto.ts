import { PartialType } from '@nestjs/mapped-types';
import { CreateHelperApplicationDto } from './create-helper-application.dto';

export class UpdateHelperApplicationDto extends PartialType(CreateHelperApplicationDto) {}
