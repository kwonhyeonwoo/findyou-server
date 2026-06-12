import { Test, TestingModule } from '@nestjs/testing';
import { ErrandService } from './errand.service';

describe('ErrandService', () => {
  let service: ErrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrandService],
    }).compile();

    service = module.get<ErrandService>(ErrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
