import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '메인'},
    { path: '/education', label: '양자 컴퓨터 설명'},
    { path: '/circuit-builder', label: '양자회로 설계'},
    { path: '/templates', label: '양자 알고리즘 템플릿'},
    { path: '/simulation', label: '알고리즘 비교'},
    { path: '/bloch-studio', label: '블로흐 스튜디오'}
  ];

  return (
    /* 
    🎨 배경 스타일 옵션들 - 아래 중 하나를 선택하여 사용하세요:
    
    1. 현재 스타일 (흰색 배경):
    bg-white shadow-lg border-b-2 border-blue-500
    
    2. 다크 모드:
    bg-gray-900 shadow-xl border-b-2 border-purple-500
    
    3. 그라디언트 (파란색):
    bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl
    
    4. 그라디언트 (따뜻한 색):
    bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 shadow-xl
    
    5. 글래스모피즘:
    bg-white/10 backdrop-blur-md shadow-lg border border-white/20
    
    6. 네온 효과:
    bg-black shadow-lg border-b border-cyan-400 shadow-cyan-400/50
    
    7. 미니멀 투명:
    bg-transparent backdrop-blur-sm border-b border-gray-200/50
    
    8. 매트 블랙:
    bg-gray-800 shadow-2xl border-b-4 border-emerald-500
    */
    <nav className="bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* 🎨 초록색 아이콘 옵션들 - 원하는 것을 선택하세요: */}
              
              {/* 옵션 1: 초록색 이모지들 */}
              {/* 🎨 크기 옵션들:
              - 작게: w-6 h-6 (24px)
              - 보통: w-8 h-8 (32px) - 현재
              - 크게: w-10 h-10 (40px)
              - 매우 크게: w-12 h-12 (48px)
              - 특대: w-16 h-16 (64px)
              */}
              <span className="text-2xl"><svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="2"/>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1"/>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(120 12 12)"/>
              </svg></span> {/* 실험용 비커 */}
              
              {/* 반응형 크기 예시 (화면 크기별로 다른 크기) */}
              {/* <span className="text-2xl"><svg className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:w-10 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                모바일: 24px, 태블릿: 32px, 데스크톱: 40px
              </svg></span> */}
              
              {/* <span className="text-2xl">⚡</span> */} {/* 번개 (노란색이지만 에너지 느낌) */}
              {/* <span className="text-2xl">🔬</span> */} {/* 현미경 */}
              {/* <span className="text-2xl">🌿</span> */} {/* 초록 잎사귀 */}
              {/* <span className="text-2xl">💚🧪</span> */} {/* 초록 하트 */}
              
              {/* 옵션 2: SVG 아이콘 (완전한 색상 제어 가능) */}
              {/* 양자 원자 모델 SVG - 초록색 */}
              {/* <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                <path d="M12 1a9 9 0 0 1 0 22 9 9 0 0 1 0-22" strokeWidth="1.5"/>
                <path d="M12 1a9 9 0 0 0 0 22 9 9 0 0 0 0-22" strokeWidth="1.5"/>
                <path d="M1 12a9 9 0 0 1 22 0 9 9 0 0 1-22 0" strokeWidth="1.5"/>
              </svg> */}
              
              {/* 원자 핵과 전자 궤도 SVG - 에메랄드 색상 */}
              {/* <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="2"/>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1"/>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(120 12 12)"/>
              </svg> */}
              
              {/* 간단한 Q 로고 - 그라디언트 초록색 */}
              {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div> */}
              
              {/* 
              로고 텍스트 색상 옵션들:
              - 기본: text-gray-800
              - 다크모드용: text-white  
              - 그라디언트: text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600
              - 네온: text-cyan-400 drop-shadow-lg
              */}
              <span className="font-bold text-xl text-gray-800">Quantum Lab</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'bg-emerald-500 text-white shadow-md'
                    /* 활성 상태 다른 옵션들:
                    - 보라색: bg-purple-600 text-white shadow-lg shadow-purple-500/30
                    - 그라디언트: bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg
                    - 에메랄드: bg-emerald-500 text-white shadow-lg shadow-emerald-500/30
                    - 오렌지 + 스케일: bg-orange-500 text-white shadow-lg transform scale-105
                    - 글래스: bg-white/20 text-white border border-white/30 backdrop-blur-sm
                    - 네온: bg-cyan-400/20 text-cyan-400 border border-cyan-400 shadow-cyan-400/50
                    */
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    /* 비활성/호버 상태 다른 옵션들:
                    - 다크모드: text-gray-300 hover:text-white hover:bg-white/10
                    - 그라디언트용: text-white/80 hover:text-white hover:bg-white/20
                    - 에메랄드: text-gray-600 hover:text-emerald-600 hover:bg-emerald-50
                    - 네온: text-white/70 hover:text-cyan-400 hover:bg-cyan-400/10
                    - 스케일효과: text-gray-500 hover:text-orange-600 hover:bg-orange-50 hover:scale-105 transform
                    */
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 