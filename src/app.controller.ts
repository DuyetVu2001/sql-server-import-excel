import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from './file.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('get-all')
  getAll() {
    return this.appService.getAll();
  }

  @Post('excel')
  @UseInterceptors(new FileInterceptor('fileT'))
  async uploadExcel(@UploadedFile() file) {
    return this.appService.saveExcelData(file.path);
  }
}
