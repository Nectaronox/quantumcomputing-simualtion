import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      title: '양자컴퓨터 설명',
      description: '큐비트, 게이트, 대표적인 양자 알고리즘에 대해 알아보기기',
      icon: '📚',
      path: '/education',
      color: 'bg-green-400 hover:bg-green-400'
    },
    {
      title: '간단하게 시작하기',
      description: '드래그앤드롭으로 양자 회로를 만들고 실시간으로 실행해보기기',
      icon: '🔧',
      path: '/circuit-builder',
      color: 'bg-green-500 hover:bg-green-500'
    },
    {
      title: '양자 알고리즘 템플릿',
      description: 'Grover, 양자 텔레포테이션, GHZ 상태 등의 템플릿과 비교 분석하기기',
      icon: '⚡',
      path: '/templates',
      color: 'bg-green-600 hover:bg-purple-600'
    },
    {
      title: '블로흐 스튜디오',
      description: '3D 블로흐 구를 조작하며 양자 상태를 시각적으로 탐구하기기',
      icon: '🌐',
      path: '/bloch-studio',
      color: 'bg-green-700 hover:bg-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-32 mt-32">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Quantum Lab
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto">
              양자 컴퓨팅의 세계를 탐험하고, 직접 체험하며 배우는 
              <br />
              <span className="font-semibold text-green-600">인터랙티브 학습 플랫폼</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/circuit-builder"
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                지금 시작하기
              </Link>
              <Link
                to="/education"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                 먼저 배우기
              </Link>
            </div>

            {/* 특징 설명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-64 mb-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="font-bold text-lg mb-2">실시간 실행</h3>
                <p className="text-gray-600 text-sm">
                  만든 양자 회로를 바로 실행하고 결과를 확인하세요
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-bold text-lg mb-2">시각적 학습</h3>
                <p className="text-gray-600 text-sm">
                  3D 블로흐 구 시뮬레이션으로 양자 상태를 시각적으로 탐구해보세요
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-bold text-lg mb-2">알고리즘 템플릿</h3>
                <p className="text-gray-600 text-sm">
                  유명한 양자 알고리즘들을 한 번에 체험해보세요
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-4">🔬</div>
                <h3 className="font-bold text-lg mb-2">단계별 학습</h3>
                <p className="text-gray-600 text-sm">
                  기초부터 고급까지 체계적인 학습 과정을 통해 양자 컴퓨팅을 배워보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mt-32 mb-12">
          주요 기능들
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  시작하기 <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white mt-64" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            양자 컴퓨팅의 미래를 지금 경험해보세요!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            복잡한 이론도 재미있고 쉽게 배울 수 있습니다
          </p>
          <Link
            to="/circuit-builder"
            className="bg-white text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg inline-block"
          >
            🚀 지금 바로 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 