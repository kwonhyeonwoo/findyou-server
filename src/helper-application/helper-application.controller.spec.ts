import { Test, TestingModule } from '@nestjs/testing';
import { HelperApplicationController } from './helper-application.controller';
import { HelperApplicationService } from './helper-application.service';

describe('HelperApplicationController', () => {
  let controller: HelperApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperApplicationController],
      providers: [HelperApplicationService],
    }).compile();

    controller = module.get<HelperApplicationController>(HelperApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
