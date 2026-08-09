import { PartialType } from '@nestjs/mapped-types';
import { CreateHelperPostDto } from './create-helper-post.dto';

export class UpdateHelperPostDto extends PartialType(CreateHelperPostDto) { }
