export enum UserRole {
  STUDENT = 'STUDENT',
  PRODI = 'PRODI',
  OPERATOR = 'OPERATOR'
}

export enum AchievementStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION = 'REVISION'
}

export enum AchievementType {
  PRESTASI = 'Prestasi dan Penghargaan',
  ORGANISASI = 'Keikutsertaan dalam Organisasi',
  KEAGAMAAN = 'Kompetensi Keagamaan',
  SERTIFIKAT = 'Sertifikat Keahlian',
  MAGANG = 'Kerja Praktek/Magang',
  KARAKTER = 'Pendidikan Karakter'
}

export enum SkpiPrintingStatus {
  IDLE = 'BELUM DIPROSES',
  PROSES_PENERBITAN = 'PROSES PENERBITAN',
  SKPI_TERBIT = 'SKPI TELAH TERBIT'
}

export type SkpiDepartment = 'Ekonomi Syariah' | 'Perbankan Syariah' | 'Akuntansi Syari\'ah';

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string; 
  date: string; 
  organizer: string; 
  driveLink?: string;
  status: AchievementStatus;
  prodiNote?: string;
  createdAt: number;
}

export interface SkpiMasterData {
  kementerian: string;
  kementerianEn: string;
  perguruanTinggi: string;
  perguruanTinggiEn: string;
  fakultas: string;
  fakultasEn: string;
  skPendirian: string;
  skPendirianEn: string;
  akreditasiProdi: string;
  akreditasiProdiEn: string;
  kualifikasiKKNI: string;
  kualifikasiKKNIEn: string;
  pendahuluan: string;
  pendahuluanEn: string;
  kkniNarrative: string;
  kkniNarrativeEn: string;
  kkniNarrative2: string;
  kkniNarrativeEn2: string;
  kkniNarrative3: string;
  kkniNarrativeEn3: string;
  namaDekan: string;
  nipDekan: string;
  tempatTerbit: string;
  tanggalTerbit: string;
  kopSurat: string;
  prodi: string; // This will now be dynamic based on selected department
  prodiEn: string; // This will now be dynamic based on selected department
  jenisJenjang: string;
  jenisJenjangEn: string;
  persyaratanPenerimaan: string;
  persyaratanPenerimaanEn: string;
  bahasaPengantar: string;
  bahasaPengantarEn: string;
  sistemPenilaian: string;
  sistemPenilaianEn: string;
  lamaStudi: string;
  lamaStudiEn: string;
  pendidikanLanjutan: string;
  pendidikanLanjutanEn: string;
  statusProfesi: string;
  statusProfesiEn: string;
  deskripsiKKNI: string;
  deskripsiKKNIEn: string;
}

export interface LearningOutcomes {
  sikap: { id: string; en: string };
  pengetahuan: { id: string; en: string };
  keterampilanUmum: { id: string; en: string };
  keterampilanKhusus: { id: string; en: string };
}

export type SkpiSubmissionStatus = 'IDLE' | 'SUBMITTED' | 'APPROVED';

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  nim?: string; 
  email?: string; // New field
  whatsappNumber?: string; // New field
  role: UserRole;
  department: string;
  birthPlace?: string; 
  birthDate?: string; 
  admissionYear?: string; 
  graduationYear?: string; 
  diplomaNumber?: string; 
  degree?: string; 
  degreeEn?: string; 
  skpiNumber?: string;
  skpiSubmissionStatus?: SkpiSubmissionStatus;
  skpiPrintingStatus?: SkpiPrintingStatus;
}