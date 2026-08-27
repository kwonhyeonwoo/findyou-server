import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ErrandService } from './errand.service';
import { CreateErrandDto } from './dto/create-errand.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/common/user.decorator';
import { CustomCategory } from 'src/interfaces/custom-category.enum';
import { CustomStatus } from 'src/interfaces/custom-status.enum';

@Controller('errand')
export class ErrandController {
  constructor(private readonly errandService: ErrandService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/errand',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createErrandDto: CreateErrandDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser('userId') userId: string,
  ) {
    const imagePaths = files.map(file => `/uploads/errand/${file.filename}`);
    await this.errandService.create({ createErrandDto, imagePaths, userId });

    return {
      success: true,
      message: "심부름 등록 완료!"
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("my")
  async findMyErrands(@GetUser('userId') userId: string) {
    const errands = await this.errandService.findMyErrands(userId);

    return errands
  }


  @Get()
  findErrandLists(
    @Query('status') status?: CustomStatus,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('category') category?: CustomCategory,
  ) {
    return this.errandService.findErrandLists({ status, limit, keyword, category });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/progress')
  findErrandProgress(@Param('id') id: string) {
    return this.errandService.findErrandProgress(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findErrandDetail(@Param('id') id: string) {
    const errand = await this.errandService.findErrandDetail(id);
    return errand;
  }

  @Post(":id/complete")
  @UseGuards(AuthGuard('jwt'))
  async completeErrand(
    @Param("id") id: string,
    @GetUser('userId') userId: string,
  ) {
    await this.errandService.completeErrand(id, userId);
    return {
      success: true,
      message: "심부름 진행을 완료하였습니다."
    }
  }
}