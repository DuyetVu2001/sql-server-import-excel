import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'So_Vien_Phi' }) // Replace 'YourTableName' with the actual table name
export class SoVienPhi {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column({ length: 255, nullable: true })
  MaPhieu: string;

  @Column({ length: 20, nullable: true })
  MaChiDinh: string;

  @Column({ type: 'smalldatetime', nullable: true })
  Ngay: Date;

  @Column({ length: 20, nullable: true })
  MaBA: string;

  @Column({ length: 255, nullable: true })
  MaBN: string;

  @Column({ length: 50, nullable: true })
  Loai: string;

  @Column({ length: 20, nullable: true })
  MaNV: string;

  @Column({ length: 255, nullable: true })
  NguoiThu: string;

  @Column({ type: 'float', nullable: true })
  TongTien: number;

  @Column({ type: 'float', nullable: true })
  SoTienHuy: number;

  @Column({ type: 'bit', nullable: true })
  Huy: boolean;

  @Column({ type: 'datetime', nullable: true })
  HanBHYT: Date;

  @Column({ length: 50, nullable: true })
  SoBHYT: string;

  @Column({ length: 300, nullable: true })
  NoiDangKyKham: string;

  @Column({ type: 'float', nullable: true })
  TiGiaUSD: number;

  @Column({ type: 'float', nullable: true })
  VAT: number;

  @Column({ type: 'float', nullable: true })
  ConLai: number;

  @Column({ length: 50, nullable: true })
  MaSoThue: string;

  @Column({ length: 10, nullable: true })
  LoaiThanhToan: string;

  @Column({ type: 'float', nullable: true })
  TongTienThuoc: number;

  @Column({ type: 'float', nullable: true })
  TongTienBaoHiem: number;

  @Column({ type: 'float', nullable: true })
  BHChi: number;

  @Column({ type: 'float', nullable: true })
  BNTra: number;

  @Column({ type: 'float', nullable: true })
  TienTraLaiBN: number;

  @Column({ length: 20, nullable: true })
  MaUuDai: string;

  @Column({ length: 30, nullable: true })
  MaDotKham: string;

  @Column({ type: 'smallint', nullable: true })
  KetThuc: number;

  @Column({ type: 'smallint', nullable: true })
  uutien: number;

  @Column({ length: 500, nullable: true })
  Chandoan: string;
}
