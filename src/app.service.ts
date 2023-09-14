import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoVienPhi } from './SoVienPhi/SoVienPhi.entity';
import { readExcelFile } from './excel.util';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SoVienPhi)
    private readonly soVienPhiRepo: Repository<SoVienPhi>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAll() {
    return this.soVienPhiRepo.find();
  }

  async saveExcelData(filePath: string) {
    try {
      const data = await readExcelFile(filePath);

      const mappingData = data.map((i: any) => ({
        MaPhieu: i.col1,
        MaBN: `${i.col2}`,
        // bn: i.col3,
        // MaPhieu: i.col4,
        // MaPhieu: i.col5,
        // MaPhieu: i.col6,
        // MaPhieu: i.col7,
        // MaPhieu: i.col8,
        // MaPhieu: i.col9,
        // MaPhieu: i.col10,
        // MaPhieu: i.col11,
        // MaPhieu: i.col12,
      })) as SoVienPhi[];

      return await this.soVienPhiRepo.save(mappingData);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
