import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './test.entity';
import { SoVienPhi } from './SoVienPhi/SoVienPhi.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      password: 'Password789',
      username: 'sa',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      entities: [Photo, SoVienPhi],
      extra: {
        trustServerCertificate: true,
        encrypt: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
