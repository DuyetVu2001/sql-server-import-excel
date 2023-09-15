import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Render,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from './file.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('upload')
  @Render('index')
  uploadPage(@Req() req) {
    return {};
  }

  @Get('get-all')
  getAll() {
    return this.appService.getAll();
  }

  @Post('excel/upload')
  @UseInterceptors(new FileInterceptor('fileExcel'))
  async uploadExcel(@UploadedFile() file) {
    return this.appService.saveExcelData(file.path);
  }
}
