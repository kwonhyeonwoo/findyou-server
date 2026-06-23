import { Test, TestingModule } from '@nestjs/testing';
import { ErrandApplicationService } from './errand-application.service';

describe('ErrandApplicationService', () => {
  let service: ErrandApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrandApplicationService],
    }).compile();

    service = module.get<ErrandApplicationService>(ErrandApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
