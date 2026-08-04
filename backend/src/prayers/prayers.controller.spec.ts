import { Test, TestingModule } from '@nestjs/testing';
import { PrayersController } from './prayers.controller';

describe('PrayersController', () => {
  let controller: PrayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayersController],
    }).compile();

    controller = module.get<PrayersController>(PrayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
