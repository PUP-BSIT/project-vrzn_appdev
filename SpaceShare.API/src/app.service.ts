import { Injectable } from '@nestjs/common';
import { TestModel } from 'model/TestModel';

@Injectable()
export class AppService {
  getHello(): TestModel {
    return {message: "testing world", state: "development"};
  }
}
