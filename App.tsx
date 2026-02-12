import React, { useState, useEffect } from 'react';
import { User, UserRole, Achievement, AchievementStatus, SkpiMasterData, LearningOutcomes, SkpiDepartment } from './types';
import Auth from './components/Auth';
import StudentModule from './components/StudentModule';
import ProdiModule from './components/ProdiModule';
import OperatorModule from './components/OperatorModule';
import { UI_ICONS } from './constants';

const DEFAULT_USERS: User[] = [
  {
    id: 'permanent-student-123',
    username: '123',
    password: '123',
    fullName: 'MAHASISWA CONTOH',
    nim: '123456789',
    email: 'mahasiswa.contoh@uin.ac.id', // Added email
    whatsappNumber: '6281234567890', // Added WhatsApp number
    role: UserRole.STUDENT,
    department: 'Ekonomi Syariah', // Updated default department
    birthPlace: 'Palu',
    birthDate: '1998-05-20',
    admissionYear: '2018',
    graduationYear: '2022',
    degree: 'Sarjana Ekonomi (S.E.)',
    degreeEn: 'Bachelor in Economics',
    diplomaNumber: 'D-2022-001',
    skpiNumber: 'SKPI/2022/FEB/001'
  },
  {
    id: 'permanent-prodi-123',
    username: '123',
    password: '123',
    fullName: 'Koordinator Prodi',
    role: UserRole.PRODI,
    department: 'Ekonomi Syariah' // Updated default department
  },
  {
    id: 'permanent-operator-123',
    username: '123',
    password: '123',
    fullName: 'Staf Operator (Cetak)',
    role: UserRole.OPERATOR,
    department: 'Bagian Akademik'
  }
];

// Base initial master data to be customized for each department
const BASE_INITIAL_MASTER_DATA: SkpiMasterData = {
  kementerian: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
  kementerianEn: 'MINISTRY OF RELIGIOUS AFFAIRS OF THE REPUBLIC OF INDONESIA',
  perguruanTinggi: 'UNIVERSITAS ISLAM NEGERI DATOKARAMA PALU',
  perguruanTinggiEn: 'STATE ISLAMIC UNIVERSITY DATOKARAMA PALU',
  fakultas: 'FAKULTAS EKONOMI DAN BISNIS ISLAM',
  fakultasEn: 'FAKULTAS EKONOMI DAN BISNIS ISLAM',
  skPendirian: 'Keputusan Presiden RI Nomor 61 Tahun 2021 Tanggal 08 Juli 2021',
  skPendirianEn: 'Presidential Decree of the Republic of Indonesia Number 61 of 2021 dated July 8, 2021',
  akreditasiProdi: 'Terakditasi Baik Sekali dari Lembaga Akreditasi Mandiri Ekonomi, Bisnis, dan Manajemen',
  akreditasiProdiEn: 'Excellent Accreditation from the Independent Accreditation Institute for Economics, Business, and Management',
  kualifikasiKKNI: 'Level 6',
  kualifikasiKKNIEn: 'Level 6',
  pendahuluan: 'Surat Keterangan Pendamping Ijazah (SKPI) ini mengacu pada Kerangka Kualifikasi Nasional Indonesia (KKNI) dan Konvensi UNESCO tentang pengakuan studi, ijazah dan gelar perguruan tinggi. Tujuan dari SKPI ini adalah menjadi dokumen yang menyatakan kemampuan kerja, penguasaan pengetahuan, dan sikap/moral pemegangnya.',
  pendahuluanEn: 'This Diploma Supplement refers to the Indonesian Qualification Framework and UNESCO Convention on the Recognition of Studies, Diplomas and Degrees in Higher Education. The purpose of the supplement is to provide a description of the nature, level, context and status of the studies that were pursued and successfully completed by the individual named on the original qualification to which this supplement is appended.',
  kkniNarrative: 'Kerangka Kualifikasi Nasional Indonesia (KKNI) adalah kerangka penjenjangan kualifikasi dan kompetensi tenaga kerja Indonesia yang menyandingkan, menyetarakan, dan mengintegrasikan sektor pendidikan dengan sektor pelatihan dan pengalaman kerja dalam suatu skema pengakuan kemapuan kerja yang disesuaikan dengan struktur diberbagai sektor pekerjaan.',
  kkniNarrativeEn: 'The Indonesian National Qualification Framework is a framework denoting levels of Indonesian workforce qualifications and competence, that compares, equalizes, and integrates the education and training sectors and work experience in a scheme recognizing work competence based on the structures of various work sectors.',
  kkniNarrative2: 'KKNI merupakan perwujudan mutu dan jati diri Bangsa Indonesia terkait dengan sistem pendidikan nasional, sistem pelatihan kerja nasional, serta sistem penilaian kesetaraan capaian pembelajaran (learning outcomes) nasional, yang dimiliki Indonesia untuk menghasilkan sumber daya manusia yang bermutu dan produktif.',
  kkniNarrativeEn2: 'The Framework is the manifestation of the quality and identity of the Indonesian people in relations to the national education system, national workforce training system and national learning outcomes equality evaluation system that Indonesia has in order to produce qualified and productive human resources.',
  kkniNarrative3: 'Jenjang kualifikasi adalah tingkat capaian pembelajaran yang disepakati secara nasional, disusun berdasarkan ukuran hasil pendidikan dan/atau pelatihan yang diperoleh melalui pendidikan formal. Nonformal, informal, atau pengalaman kerja.',
  kkniNarrativeEn3: 'Qualification level is a nationally legalized learning outcomes, composed based on the assesment of the results of education and/or training activities achieved through formal education, nonformal education or working experiences.',
  namaDekan: 'Sagir Muhammad Amin',
  nipDekan: '197501012005011001',
  tempatTerbit: 'Palu',
  tanggalTerbit: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  kopSurat: 'Jl. Diponegoro No. 23, Kota Palu, Sulawesi Tengah',
  prodi: '', // This will be set by specific department
  prodiEn: '', // This will be set by specific department
  jenisJenjang: 'Akademik & Sarjana (Strata 1)',
  jenisJenjangEn: 'Academic & Bachelor Degree',
  persyaratanPenerimaan: 'Lulus pendidikan menengah atas/sederajat',
  persyaratanPenerimaanEn: 'Graduate from high school or similar level of education',
  bahasaPengantar: 'Indonesia',
  bahasaPengantarEn: 'Indonesian',
  sistemPenilaian: 'Skala 1-4; A=4, B=3, C=2, D=1',
  sistemPenilaianEn: 'Scale 1-4; A=4, B=3, C=2, D=1',
  lamaStudi: '8 semester',
  lamaStudiEn: '8 semesters',
  pendidikanLanjutan: 'Program Magister & Doktoral',
  pendidikanLanjutanEn: 'Master & Doctoral Program',
  statusProfesi: '-',
  statusProfesiEn: '-',
  deskripsiKKNI: 'Kerangka Kualifikasi Nasional Indonesia (KKNI) adalah kerangka penjenjangan kualifikasi dan kompetensi tenaga kerja Indonesia yang menyandingkan, menyetarakan, dan mengintegrasikan sektor pendidikan dengan sektor pelatihan dan pengalaman kerja.',
  deskripsiKKNIEn: 'The Indonesian National Qualification Framework (IQF) is a framework of Indonesian workforce qualifications and competencies that aligns, equalizes, and integrates the education sector with the training sector and work experience.'
};

// Base initial learning outcomes to be customized for each department
const BASE_INITIAL_LEARNING_OUTCOMES: LearningOutcomes = {
  sikap: { 
    id: '1. Bertakwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius\n2. Menjunjung tinggi nilai kemanusiaan dalam menjalankan tugas berdasarkan agama, moral, and etika', 
    en: '1. Fear of God Almighty and able to show religious attitude\n2. Upholding human values in carrying out duties based on religion, morals, and ethics' 
  },
  pengetahuan: { 
    id: '1. Menguasai konsep teoritis bidang pengetahuan ekonomi Islam secara mendalam\n2. Mampu menganalisis fenomena ekonomi berdasarkan prinsip syariah', 
    en: '1. Mastering theoretical concepts of Islamic economics in depth\n2. Able to analyze economic phenomena based on sharia principles' 
  },
  keterampilanUmum: { 
    id: '1. Mampu menerapkan pemikiran logis, kritis, and sistematis\n2. Mampu mengambil keputusan secara tepat dalam konteks penyelesaian masalah di bidang keahliannya', 
    en: '1. Able to apply logical, critical, and systematic thinking\n2. Able to make appropriate decisions in the context of problem solving in their field of expertise' 
  },
  keterampilanKhusus: { 
    id: '1. Mampu menyusun rencana bisnis syariah yang inovatif\n2. Mampu mengelola lembaga keuangan syariah dengan profesional', 
    en: '1. Able to develop innovative sharia business plans\n2. Able to manage sharia financial institutions professionally' 
  }
};

const INITIAL_MASTER_DATA_PER_DEPARTMENT: Record<SkpiDepartment, SkpiMasterData> = {
  'Ekonomi Syariah': { ...BASE_INITIAL_MASTER_DATA, prodi: 'Ekonomi Syariah', prodiEn: 'Islamic Economics' },
  'Perbankan Syariah': { ...BASE_INITIAL_MASTER_DATA, prodi: 'Perbankan Syariah', prodiEn: 'Islamic Banking' },
  'Akuntansi Syari\'ah': { ...BASE_INITIAL_MASTER_DATA, prodi: 'Akuntansi Syari\'ah', prodiEn: 'Islamic Accounting' },
};

const INITIAL_LEARNING_OUTCOMES_PER_DEPARTMENT: Record<SkpiDepartment, LearningOutcomes> = {
  'Ekonomi Syariah': { ...BASE_INITIAL_LEARNING_OUTCOMES },
  'Perbankan Syariah': { 
    ...BASE_INITIAL_LEARNING_OUTCOMES, 
    keterampilanKhusus: {
      id: '1. Mampu mengoperasikan sistem informasi perbankan syariah\n2. Mampu menganalisis produk dan layanan perbankan syariah',
      en: '1. Able to operate Islamic banking information systems\n2. Able to analyze Islamic banking products and services'
    }
  },
  'Akuntansi Syari\'ah': { 
    ...BASE_INITIAL_LEARNING_OUTCOMES,
    keterampilanKhusus: {
      id: '1. Mampu menyusun laporan keuangan syariah sesuai standar\n2. Mampu melakukan audit keuangan syariah',
      en: '1. Able to prepare Islamic financial statements according to standards\n2. Able to perform Islamic financial audits'
    }
  },
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  // Changed to Record<SkpiDepartment, ...>
  const [skpiMasterData, setSkpiMasterData] = useState<Record<SkpiDepartment, SkpiMasterData>>(INITIAL_MASTER_DATA_PER_DEPARTMENT);
  const [learningOutcomes, setLearningOutcomes] = useState<Record<SkpiDepartment, LearningOutcomes>>(INITIAL_LEARNING_OUTCOMES_PER_DEPARTMENT);
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAppSection, setActiveAppSection] = useState<string | null>(null); // State for main app navigation

  useEffect(() => {
    const savedUsersStr = localStorage.getItem('skpi_users');
    const savedAchievementsStr = localStorage.getItem('skpi_achievements');
    const savedMasterDataStr = localStorage.getItem('skpi_master_data');
    const savedOutcomesStr = localStorage.getItem('skpi_learning_outcomes');
    const savedCurrentUserStr = localStorage.getItem('skpi_current_user'); // Load current user

    let loadedUsers: User[] = [];
    if (savedUsersStr) {
      loadedUsers = JSON.parse(savedUsersStr);
    }

    const filteredLoaded = loadedUsers.filter(u => 
      !DEFAULT_USERS.some(du => du.id === u.id || (du.username === u.username && du.role === u.role))
    );
    
    const finalUsers = [...DEFAULT_USERS, ...filteredLoaded];
    
    setUsers(finalUsers);
    if (savedAchievementsStr) setAchievements(JSON.parse(savedAchievementsStr));
    
    // Load per-department data
    if (savedMasterDataStr) {
      const parsedData = JSON.parse(savedMasterDataStr);
      setSkpiMasterData(prev => ({ ...prev, ...parsedData }));
    }
    if (savedOutcomesStr) {
      const parsedData = JSON.parse(savedOutcomesStr);
      setLearningOutcomes(prev => ({ ...prev, ...parsedData }));
    }
    
    if (savedCurrentUserStr) {
      const loadedCurrentUser: User = JSON.parse(savedCurrentUserStr);
      setCurrentUser(loadedCurrentUser);
      // Set initial activeAppSection based on loaded user's role
      if (loadedCurrentUser.role === UserRole.STUDENT) {
        setActiveAppSection('studentDashboard');
      } else if (loadedCurrentUser.role === UserRole.PRODI) {
        setActiveAppSection('prodiVerification');
      } else if (loadedCurrentUser.role === UserRole.OPERATOR) {
        setActiveAppSection('operatorQueue');
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('skpi_users', JSON.stringify(users));
      localStorage.setItem('skpi_achievements', JSON.stringify(achievements));
      // Save per-department data
      localStorage.setItem('skpi_master_data', JSON.stringify(skpiMasterData));
      localStorage.setItem('skpi_learning_outcomes', JSON.stringify(learningOutcomes));
      // Save current user to localStorage
      if (currentUser) {
        localStorage.setItem('skpi_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('skpi_current_user');
      }
    }
  }, [users, achievements, skpiMasterData, learningOutcomes, currentUser, isLoading]);

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Set initial activeAppSection based on user role after login
    if (user.role === UserRole.STUDENT) {
      setActiveAppSection('studentDashboard');
    } else if (user.role === UserRole.PRODI) {
      setActiveAppSection('prodiVerification');
    } else if (user.role === UserRole.OPERATOR) {
      setActiveAppSection('operatorQueue');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveAppSection(null); // Reset active section on logout
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setAchievements(prev => prev.filter(a => a.userId !== userId));
  };

  const addAchievement = (achievement: Achievement) => {
    setAchievements(prev => [achievement, ...prev]);
  };

  const updateAchievement = (updatedAchievement: Achievement) => {
    setAchievements(prev => prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a));
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const updateAchievementStatus = (id: string, status: AchievementStatus, note?: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id ? { ...a, status, prodiNote: note } : a
    ));
  };

  // Updated to accept departmentName
  const updateSkpiMasterData = (departmentName: SkpiDepartment, data: SkpiMasterData) => {
    setSkpiMasterData(prev => ({
      ...prev,
      [departmentName]: data
    }));
  };

  // Updated to accept departmentName
  const updateLearningOutcomes = (departmentName: SkpiDepartment, outcomes: LearningOutcomes) => {
    setLearningOutcomes(prev => ({
      ...prev,
      [departmentName]: outcomes
    }));
  };

  // New function for handling forgot password request
  const handleForgotPasswordRequest = async (email: string, nim: string): Promise<{ success: boolean; username?: string }> => {
    const userToReset = users.find(u => 
        u.role === UserRole.STUDENT && 
        u.email === email && 
        u.nim === nim
    );

    if (userToReset) {
      // Simulate password reset to a temporary password
      // Calls the correctly named `handleUpdateUser` function
      handleUpdateUser({ ...userToReset, password: 'reset123' }); 
      return { success: true, username: userToReset.username }; // Return username
    }
    return { success: false };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Auth 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        existingUsers={users}
        onForgotPasswordRequest={handleForgotPasswordRequest} // Pass the new handler
      />
    );
  }

  // Determine which module to render based on activeAppSection
  const renderMainContent = () => {
    if (!currentUser || !activeAppSection) return null;

    switch (currentUser.role) {
      case UserRole.STUDENT:
        return (
          <StudentModule 
            user={currentUser} 
            achievements={achievements} 
            onAddAchievement={addAchievement}
            onUpdateAchievement={updateAchievement}
            onDeleteAchievement={deleteAchievement}
            onUpdateUser={handleUpdateUser}
            initialActiveTab={activeAppSection === 'studentDashboard' ? 'dashboard' : activeAppSection === 'studentEntry' ? 'entry' : 'biodata'}
          />
        );
      case UserRole.PRODI:
        return (
          <ProdiModule 
            user={currentUser} 
            achievements={achievements} 
            users={users}
            skpiMasterData={skpiMasterData}
            learningOutcomes={learningOutcomes}
            onUpdateStatus={updateAchievementStatus}
            onUpdateMasterData={updateSkpiMasterData}
            onUpdateLearningOutcomes={updateLearningOutcomes}
            onUpdateUser={handleUpdateUser}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            initialActiveTab={activeAppSection === 'prodiVerification' ? 'verification' : activeAppSection === 'prodiIsian' ? 'isianSkpi' : 'accountManagement'}
          />
        );
      case UserRole.OPERATOR:
        return (
          <OperatorModule 
            users={users}
            achievements={achievements}
            skpiMasterData={skpiMasterData}
            learningOutcomes={learningOutcomes}
            onUpdateUser={handleUpdateUser}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            initialActiveTab={activeAppSection === 'operatorQueue' ? 'printQueue' : 'accountManagement'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 print:hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100">
            S
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Portal SKPI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Menu Utama
          </div>
          {currentUser.role === UserRole.STUDENT && (
            <>
              <button
                onClick={() => setActiveAppSection('studentDashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'studentDashboard' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.Dashboard />
                <span>Dashboard Mahasiswa</span>
              </button>
              <button
                onClick={() => setActiveAppSection('studentEntry')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'studentEntry' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.Achievement />
                <span>Aktivitas & Prestasi</span>
              </button>
              <button
                onClick={() => setActiveAppSection('studentBiodata')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'studentBiodata' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.User />
                <span>Biodata Mahasiswa</span>
              </button>
            </>
          )}
          {currentUser.role === UserRole.PRODI && (
            <>
              <button
                onClick={() => setActiveAppSection('prodiVerification')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'prodiVerification' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.Checklist />
                <span>Verifikasi Pengajuan</span>
              </button>
              <button
                onClick={() => setActiveAppSection('prodiIsian')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'prodiIsian' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.DocumentText />
                <span>Isian SKPI</span>
              </button>
              <button
                onClick={() => setActiveAppSection('prodiAccounts')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'prodiAccounts' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.Users />
                <span>Manajemen Akun</span>
              </button>
            </>
          )}
          {currentUser.role === UserRole.OPERATOR && (
            <>
              <button
                onClick={() => setActiveAppSection('operatorQueue')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'operatorQueue' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.Printer />
                <span>Antrean Cetak</span>
              </button>
              <button
                onClick={() => setActiveAppSection('operatorAccounts')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeAppSection === 'operatorAccounts' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UI_ICONS.Users />
                <span>Manajemen Akun</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-4 mb-2">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate uppercase">
                {currentUser.role === UserRole.STUDENT ? `Mahasiswa` : currentUser.role === UserRole.PRODI ? 'Staff Prodi' : 'Operator'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all font-bold text-xs"
          >
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto print:p-0">
        <div className="max-w-6xl mx-auto print:max-w-none">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default App;