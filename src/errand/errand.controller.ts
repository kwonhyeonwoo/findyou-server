import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Query } from '@nestjs/common';
import { ErrandService } from './errand.service';
import { CreateErrandDto } from './dto/create-errand.dto';
import { UpdateErrandDto } from './dto/update-errand.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/common/user.decorator';

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
          // 3. 파일 이름 중복을 막기 위해 고유한 랜덤 이름 생성 (예: uuid나 타임스탬프)
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
    @GetUser('userId') userId: any,
  ) {
    const imagePaths = files.map(file => `/uploads/errand/${file.filename}`);
    const newErrand = await this.errandService.create({ createErrandDto, imagePaths, userId });
    if (!newErrand) {
      return {
        success: false,
        message: "게시글 업로드 실패!"
      }
    };

    return {
      success: true,
      message: "심부름 등록 완료!"
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("my")
  async getMyErrands(@GetUser('userId') userId: any) {
    console.log('userid', userId)
    return this.errandService.getMyErrands(userId);
  }

  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
  ) {
    return this.errandService.findAll({ limit, keyword, category });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.errandService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateErrandDto: UpdateErrandDto) {
    return this.errandService.update(+id, updateErrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.errandService.remove(+id);
  }
}
