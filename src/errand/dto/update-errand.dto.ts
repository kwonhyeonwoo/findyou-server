import { PartialType } from '@nestjs/mapped-types';
import { CreateErrandDto } from './create-errand.dto';

export class UpdateErrandDto extends PartialType(CreateErrandDto) {}
