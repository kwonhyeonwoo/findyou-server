import { Test, TestingModule } from '@nestjs/testing';
import { ErrandApplicationController } from './errand-application.controller';
import { ErrandApplicationService } from './errand-application.service';

describe('ErrandApplicationController', () => {
  let controller: ErrandApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrandApplicationController],
      providers: [ErrandApplicationService],
    }).compile();

    controller = module.get<ErrandApplicationController>(ErrandApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
