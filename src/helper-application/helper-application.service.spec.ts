import { Test, TestingModule } from '@nestjs/testing';
import { HelperApplicationService } from './helper-application.service';

describe('HelperApplicationService', () => {
  let service: HelperApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperApplicationService],
    }).compile();

    service = module.get<HelperApplicationService>(HelperApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
