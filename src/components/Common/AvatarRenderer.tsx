import React from 'react';

export type AvatarKey = 'boy' | 'girl' | 'adventurer' | 'scientist' | 'wizard' | 'princess';

interface AvatarRendererProps {
  avatarId?: AvatarKey | string;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatarId = 'boy',
  className = 'player-avatar-img',
}) => {
  switch (avatarId) {
    case 'wizard':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-label="Avatar Penyihir Geometri">
          <circle cx="18" cy="18" r="18" fill="#e0e7ff" />
          {/* Rambut & Janggut Putih Penyihir */}
          <circle cx="18" cy="19" r="10" fill="#f8fafc" />
          <path d="M12 22 C12 30, 24 30, 24 22 Z" fill="#f8fafc" />
          {/* Wajah */}
          <circle cx="18" cy="18" r="7.5" fill="#fed7aa" />
          {/* Topi Kerucut Penyihir Biru Emas */}
          <polygon points="18,2 8,16 28,16" fill="#3730a3" />
          <ellipse cx="18" cy="16" rx="12" ry="2.5" fill="#4338ca" />
          <circle cx="18" cy="10" r="1.5" fill="#facc15" />
          {/* Mata Bijak */}
          <circle cx="15.5" cy="18" r="1.1" fill="#1e1b4b" />
          <circle cx="20.5" cy="18" r="1.1" fill="#1e1b4b" />
          <circle cx="15.8" cy="17.6" r="0.4" fill="#ffffff" />
          <circle cx="20.8" cy="17.6" r="0.4" fill="#ffffff" />
          {/* Senyum Ramah */}
          <path d="M16 21 Q18 23 20 21" stroke="#b45309" strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Jubah Bintang */}
          <path d="M12 28 C12 25, 24 25, 24 28 L26 36 L10 36 Z" fill="#312e81" />
          <circle cx="18" cy="31" r="1.2" fill="#facc15" />
        </svg>
      );

    case 'princess':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-label="Avatar Putri Mahkota Angka">
          <circle cx="18" cy="18" r="18" fill="#fdf2f8" />
          {/* Rambut Emas Berkilau Panjang */}
          <path d="M8 15 C8 6, 28 6, 28 15 C28 28, 26 32, 24 34 C22 35, 14 35, 12 34 C10 32, 8 28, 8 15 Z" fill="#d97706" />
          {/* Wajah Cantik */}
          <circle cx="18" cy="19" r="8.5" fill="#ffedd5" />
          {/* Poni Lembut */}
          <path d="M11 15 C14 12, 22 12, 25 15 C23 16, 18 14, 11 15 Z" fill="#b45309" />
          {/* Mahkota Emas Permata */}
          <polygon points="13,11 15,7 18,10 21,7 23,11" fill="#facc15" stroke="#b45309" strokeWidth="0.8" />
          <circle cx="18" cy="10" r="1" fill="#ec4899" />
          {/* Mata Berbinar */}
          <circle cx="15" cy="18.5" r="1.3" fill="#0f172a" />
          <circle cx="21" cy="18.5" r="1.3" fill="#0f172a" />
          <circle cx="15.4" cy="18" r="0.5" fill="#ffffff" />
          <circle cx="21.4" cy="18" r="0.5" fill="#ffffff" />
          {/* Senyum */}
          <path d="M16 22.5 Q18 24.5 20 22.5" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="13" cy="20.5" r="1.2" fill="#f43f5e" opacity="0.6" />
          <circle cx="23" cy="20.5" r="1.2" fill="#f43f5e" opacity="0.6" />
          {/* Gaun Kerajaan */}
          <path d="M12 28 C12 24, 24 24, 24 28 L27 36 L9 36 Z" fill="#db2777" />
          <polygon points="18,27 16,33 20,33" fill="#fbcfe8" />
        </svg>
      );
    case 'girl':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-label="Avatar Alya">
          {/* Latar Belakang Lembut */}
          <circle cx="18" cy="18" r="18" fill="#fbcfe8" />
          {/* Rambut Kuncir Kiri & Kanan */}
          <circle cx="8" cy="18" r="5" fill="#78350f" />
          <circle cx="28" cy="18" r="5" fill="#78350f" />
          {/* Rambut Belakang */}
          <circle cx="18" cy="17" r="11" fill="#78350f" />
          {/* Wajah */}
          <circle cx="18" cy="19" r="9" fill="#ffedd5" />
          {/* Poni Depan */}
          <path d="M10 14 C14 10, 22 10, 26 14 C24 16, 21 13, 18 14 C15 13, 12 16, 10 14 Z" fill="#78350f" />
          {/* Mata */}
          <circle cx="15" cy="18.5" r="1.3" fill="#0f172a" />
          <circle cx="21" cy="18.5" r="1.3" fill="#0f172a" />
          <circle cx="15.4" cy="18" r="0.4" fill="#ffffff" />
          <circle cx="21.4" cy="18" r="0.4" fill="#ffffff" />
          {/* Senyum */}
          <path d="M16 22 Q18 24 20 22" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Pipi Merah */}
          <circle cx="13.5" cy="20.5" r="1.2" fill="#f43f5e" opacity="0.5" />
          <circle cx="22.5" cy="20.5" r="1.2" fill="#f43f5e" opacity="0.5" />
          {/* Baju Pink */}
          <path d="M13 28 C13 25, 23 25, 23 28 L25 36 L11 36 Z" fill="#ec4899" />
          <circle cx="18" cy="30" r="1" fill="#ffffff" />
          {/* Pita Rambut */}
          <polygon points="7,14 11,16 7,18" fill="#f43f5e" />
          <polygon points="29,14 25,16 29,18" fill="#f43f5e" />
        </svg>
      );

    case 'adventurer':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-label="Avatar Petualang Bima">
          {/* Latar Belakang Lembut */}
          <circle cx="18" cy="18" r="18" fill="#fef08a" />
          {/* Rambut Belakang */}
          <path d="M7 16 C7 7, 29 7, 29 16 C29 18, 28 20, 27 21 C27 21, 26 25, 24 26 C22 27, 14 27, 12 26 C10 25, 9 21, 9 21 C8 20, 7 18, 7 16 Z" fill="#451a03" />
          {/* Wajah */}
          <circle cx="18" cy="19" r="9" fill="#fed7aa" />
          {/* Bandana Petualang Oranye */}
          <path d="M9 13 Q18 10 27 13 L27 16 Q18 13 9 16 Z" fill="#ea580c" />
          <circle cx="18" cy="13" r="1.5" fill="#facc15" />
          {/* Poni */}
          <path d="M11 16 Q14 13 18 16 Q22 13 25 16" fill="#451a03" />
          {/* Mata Semangat */}
          <circle cx="15" cy="19" r="1.3" fill="#0f172a" />
          <circle cx="21" cy="19" r="1.3" fill="#0f172a" />
          <circle cx="15.4" cy="18.5" r="0.4" fill="#ffffff" />
          <circle cx="21.4" cy="18.5" r="0.4" fill="#ffffff" />
          {/* Senyum Lebar */}
          <path d="M15.5 22.5 Q18 25 20.5 22.5" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Pipi */}
          <circle cx="13.5" cy="21" r="1" fill="#fb923c" opacity="0.6" />
          <circle cx="22.5" cy="21" r="1" fill="#fb923c" opacity="0.6" />
          {/* Rompi Hijau Petualang */}
          <path d="M13 28 C13 25, 23 25, 23 28 L25 36 L11 36 Z" fill="#15803d" />
          <path d="M16 28 L18 36 L20 28 Z" fill="#facc15" />
        </svg>
      );

    case 'scientist':
      return (
        <svg viewBox="0 0 36 36" className={className} aria-label="Avatar Cendekiawan Zahra">
          {/* Latar Belakang Lembut */}
          <circle cx="18" cy="18" r="18" fill="#e9d5ff" />
          {/* Rambut Belakang Bergelombang */}
          <circle cx="18" cy="17" r="11" fill="#1e1b4b" />
          {/* Wajah */}
          <circle cx="18" cy="19" r="9" fill="#ffedd5" />
          {/* Poni Rapih */}
          <path d="M10 13 Q18 16 26 13 Q24 16 18 16 Q12 16 10 13 Z" fill="#1e1b4b" />
          {/* Kacamata Pintar Bulat */}
          <circle cx="14.5" cy="18.5" r="3" fill="none" stroke="#7c3aed" strokeWidth="1" />
          <circle cx="21.5" cy="18.5" r="3" fill="none" stroke="#7c3aed" strokeWidth="1" />
          <line x1="17.5" y1="18.5" x2="18.5" y2="18.5" stroke="#7c3aed" strokeWidth="1" />
          {/* Mata */}
          <circle cx="14.5" cy="18.5" r="1.1" fill="#0f172a" />
          <circle cx="21.5" cy="18.5" r="1.1" fill="#0f172a" />
          {/* Senyum Manis */}
          <path d="M16 23 Q18 24.5 20 23" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Pipi */}
          <circle cx="12.5" cy="21" r="1" fill="#f472b6" opacity="0.6" />
          <circle cx="23.5" cy="21" r="1" fill="#f472b6" opacity="0.6" />
          {/* Baju Ungu Cendekia */}
          <path d="M13 28 C13 25, 23 25, 23 28 L25 36 L11 36 Z" fill="#7c3aed" />
          <polygon points="18,28 16,33 20,33" fill="#ffffff" />
        </svg>
      );

    case 'boy':
    default:
      return (
        <svg viewBox="0 0 36 36" className={className} aria-label="Avatar Siswa Rizki">
          {/* Soft background */}
          <circle cx="18" cy="18" r="18" fill="#a5f3fc" />
          {/* Hair back */}
          <path d="M7 16 C7 7, 29 7, 29 16 C29 18, 28 20, 27 21 C27 21, 26 25, 24 26 C22 27, 14 27, 12 26 C10 25, 9 21, 9 21 C8 20, 7 18, 7 16 Z" fill="#1e293b" />
          {/* Face */}
          <circle cx="18" cy="19" r="9" fill="#ffedd5" />
          {/* Hair bangs */}
          <path d="M10 13 C12 9, 24 9, 26 13 C24 12, 21 14, 18 13 C15 14, 12 12, 10 13 Z" fill="#1e293b" />
          {/* Eyes */}
          <circle cx="15" cy="18.5" r="1.3" fill="#0f172a" />
          <circle cx="21" cy="18.5" r="1.3" fill="#0f172a" />
          <circle cx="15.4" cy="18" r="0.4" fill="#ffffff" />
          <circle cx="21.4" cy="18" r="0.4" fill="#ffffff" />
          {/* Smile */}
          <path d="M16 22 Q18 24 20 22" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Cheeks */}
          <circle cx="13.5" cy="20.5" r="1" fill="#fca5a5" opacity="0.6" />
          <circle cx="22.5" cy="20.5" r="1" fill="#fca5a5" opacity="0.6" />
          {/* Collar/Shirt */}
          <path d="M13 28 C13 25, 23 25, 23 28 L25 36 L11 36 Z" fill="#0284c7" />
          <path d="M16 27 L18 29 L20 27 Z" fill="#ffffff" />
        </svg>
      );
  }
};
