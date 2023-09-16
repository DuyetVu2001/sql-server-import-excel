import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoVienPhi } from './SoVienPhi/SoVienPhi.entity';
import { readExcelFile } from './excel.util';

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

type ErrorData = {
  name: string;
  description: string;
};

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

  async saveExcelDataV2(filePath: string) {
    try {
      const data = await readExcelFile(filePath);
      let isShowErrorLink = false;
      const errorData: ErrorData[] = [];

      console.log('----------da------------------', data?.length);

      //  {
      //     col1: 'VP2308010074',
      //     col2: 23019082,
      //     col3: 'LƯƠNG PHƯƠNG HOA',
      //     col4: 'Nữ',
      //     col5: 1992-09-17T00:00:00.000Z,
      //     col6: 'Trung Văn - Nam Từ Liêm',
      //     col7: '0295367891',
      //     col8: 'IgM (Dengue)',
      //     col9: 1, so luong
      //     col10: 150000, don gia
      //     col11: 150000,  thanh tien
      //     col12: 2023-01-08T00:00:00.000Z
      //   },
      let count = 0;
      if (data?.length > 0) {
        console.log('-----------vao---------------');
        for (let i = 0; i < data?.length; i++) {
          count++;
          let mappingData = data[i];
          let queryService = await this.soVienPhiRepo.query(`
                        SELECT TOP 1 *
                          FROM DM_DichVu
                               WHERE TenDichVu 
                               COLLATE SQL_Latin1_General_CP1_CI_AI = N'${mappingData?.col8}'
                               and ThuPhi = ${mappingData?.col10}
                      `);
          console.log('-----------queryService------1---------', queryService);
          if (!queryService || queryService?.length == 0) {
            // không thấy dịch vụ thì chạy vòng tiếp theo
            //   await this.saveFileErr([], 'null')

            errorData.push({
              name: mappingData?.col1,
              description: 'không thấy dịch vụ',
            });

            isShowErrorLink = true;
            continue;
          }
          console.log('-----------vao---------------', mappingData);
          // tạo thông tin bệnh nhân
          const isoDateStr = (mappingData?.col5).toString(); // Dữ liệu có định dạng ISO 8601
          console.log('-----------isoDateStr---------------', isoDateStr);
          const dateNew = new Date(isoDateStr);
          const day = dateNew.getUTCDate().toString().padStart(2, '0'); // Lấy ngày và định dạng lại thành '01'
          const month = (dateNew.getUTCMonth() + 1).toString().padStart(2, '0'); // Lấy tháng và định dạng lại thành '05'
          const yearPart = dateNew.getUTCFullYear(); // Lấy năm
          const formattedDate = `${day}/${month}/${yearPart}`; // Tạo chuỗi định dạng 'dd/MM/yyyy'
          console.log(formattedDate); // In ra '01/05/2016'
          console.log('-----------formattedDate---------------', formattedDate);
          const date = new Date(mappingData?.col5); // Chuyển chuỗi thành đối tượng Date
          const year = date.getFullYear(); // Lấy năm từ đối tượng Date
          try {
            let queryUser = await this.soVienPhiRepo.query(`
                                Set DateFormat dmy Insert into [NghiepVuY].[dbo].BangTiepNhan
                                (MaBN,HoTen,Hotenme,
                          Noilamviec,Email,SoNha,ThonPho,XaPhuong,
                          HuyenQuan,TinhThanh,NgaySinh,NamSinh,GioiTinh,
                          DoiTuong,SoBHYT,HanBH,DienThoai)
                          Values
                          (N'BSGD.${mappingData?.col2}',N'${mappingData?.col3}',N'',
                          N'',N'',N'',
                          N'${mappingData?.col6}',
                          N'1010000',
                          N'10100',
                          N'101',
                          '${formattedDate}',
                          N'${year}',
                          N'0',
                          N'2',
                          N'',
                          null,
                          N'${mappingData?.col7}'
                          )
                            `);
            console.log(
              '----------------queryUser-----------------',
              queryUser,
            );
          } catch (e) {
            console.log(e?.message);
            // tạo lỗi thì chạy vòng lặp tiếp theo

            errorData.push({
              name: mappingData?.col1,
              description: e?.message,
            });

            isShowErrorLink = true;

            continue;
          }

          // xử lý dịch vụ

          console.log(
            '----------queryService------------------',
            queryService?.length,
          );
          console.log(
            '----------TenDichVu------------------',
            queryService?.TenDichVu,
          );
          //insert So_VienPhi
          let outputDateStr;
          if (mappingData?.col12) {
            const inputDateStr =
              'Sun Jan 08 2023 07:00:00 GMT+0700 (Indochina Time)';
            const inputDate = new Date(inputDateStr);

            const year = inputDate.getUTCFullYear();
            const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
            const day = String(inputDate.getUTCDate()).padStart(2, '0');
            const hours = String(inputDate.getUTCHours()).padStart(2, '0');
            const minutes = String(inputDate.getUTCMinutes()).padStart(2, '0');
            const seconds = String(inputDate.getUTCSeconds()).padStart(2, '0');
            const milliseconds = String(
              inputDate.getUTCMilliseconds(),
            ).padStart(3, '0');

            outputDateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
            console.log(
              '-----------outputDateStr----------------',
              outputDateStr,
            ); // In ra '2023-01-08 00:00:00.000'
          }

          try {
            let query = await this.soVienPhiRepo.query(`
                         declare @p27 varchar(30)
                            set @p27='${mappingData?.col1}'
                        exec usp_So_VienPhi_INSERT @TENPHIEU=N'VP',
                        @NGAY='${outputDateStr}',
                        @MABN=N'BSGD.${mappingData?.col2}',
                        @LOAI=N'2',
                        @MaNV=N'thungan9',
                        @NGUOITHU=N'Hoàng Bình Minh',
                        @TONGTIEN=N'${mappingData?.col11}',
                        @HUY=N'0',
                        @HANBHYT='1900-01-01 00:00:00',
                        @SOBHYT=N'',
                        @NOIDANGKYKHAM=N'',
                        @CONLAI=N'${mappingData?.col11}',
                        @LOAITHANHTOAN=N'TT',
                        @CHANDOAN=N'',
                        @MADVS=N'${queryService[0]?.MADV}',
                        @TENDICHVUS=N'${mappingData?.col8}',
                        @SOLUONGS=N'${mappingData?.col9}',
                        @DONGIAS=N'${mappingData?.col10}',
                        @GIABAOHIEMS=N'0',
                        @GIAMIENGIAMS=N'0',
                        @GIATREEMS=N'0',
                        @THANHTIENS=N'${mappingData?.col11}',
                        @MAKHOAS=N'${queryService[0]?.MaKhoa}',
                        @TENBSS=N'',
                        @TENBSCDS=N'',
                        @PHONGS=N'',
                        @MAPHIEU_OUT=@p27 output
                        select @p27
                    `);
            console.log('----------query------------------', query);
          } catch (e) {
            console.log(e?.message);
            // không tạo phiếu thì chạy vòng tiếp theo

            errorData.push({
              name: mappingData?.col1,
              description: e?.message,
            });

            isShowErrorLink = true;

            continue;
          }
        }
      }

      if (isShowErrorLink) {
        await this.saveFileErr(errorData, 'null');

        return {
          errorLink: '/output.xlsx',
        };
      }

      console.log('---------------count-------------------------', count);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async saveFileErr(data: ErrorData[], err: any) {
    // Đường dẫn đến file mẫu trong thư mục public
    const templatePath = path.join('public/output.xlsx');

    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();

    // Đọc file mẫu và sau đó thực hiện xử lý dữ liệu và lưu vào workbook
    workbook.xlsx
      .readFile(templatePath)
      .then(() => {
        const worksheet = workbook.getWorksheet(1); // Lấy worksheet đầu tiên

        // Lấy dữ liệu lỗi từ nơi nào đó (ví dụ: mảng errors chứa nhiều dòng lỗi)
        const errors = [
          { name: 'dịch vụ', description: err },
          { name: 'mã lỗi', description: err },
          // Thêm dữ liệu lỗi khác nếu cần
        ];

        // Thêm từng dòng lỗi vào worksheet
        data.forEach((error, index) => {
          worksheet.addRow([index + 1, error.name, error.description]);
        });

        // Ghi workbook ra file
        const outputFilePath = path.join('public/output.xlsx');
        return workbook.xlsx.writeFile(outputFilePath);
      })
      .then(() => {
        console.log('File đã được tạo và lưu.');
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
