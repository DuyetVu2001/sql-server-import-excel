import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      synchronize: false,
      logging: true,
      entities: [SoVienPhi],
      extra: {
        trustServerCertificate: true,
        encrypt: false,
      },
    }),
    TypeOrmModule.forFeature([SoVienPhi]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
