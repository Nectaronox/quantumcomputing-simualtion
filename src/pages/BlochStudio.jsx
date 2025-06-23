import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

// 블로흐 벡터 컴포넌트
const BlochVector = ({ theta, phi }) => {
  const vectorRef = useRef();
  
  // 구면 좌표를 카르테지안 좌표로 변환
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(x, y, z)
  ];

  return (
    <group ref={vectorRef}>
      {/* 벡터 라인 */}
      <Line points={points} color="red" lineWidth={5} />
      {/* 벡터 끝점 */}
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};

// 블로흐 구 컴포넌트
const BlochSphere = ({ theta, phi, showTrajectory, trajectory }) => {
  return (
    <>
      {/* 반투명 구 */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="lightblue" transparent opacity={0.2} />
      </Sphere>

      {/* 좌표축 */}
      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="black" lineWidth={2} />
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="black" lineWidth={2} />
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="black" lineWidth={2} />

      {/* 축 레이블 */}
      <Text position={[1.3, 0, 0]} fontSize={0.1} color="black">X</Text>
      <Text position={[0, 1.3, 0]} fontSize={0.1} color="black">Y</Text>
      <Text position={[0, 0, 1.3]} fontSize={0.1} color="black">Z</Text>

      {/* 블로흐 벡터 */}
      <BlochVector theta={theta} phi={phi} />

      {/* 궤적 표시 */}
      {showTrajectory && trajectory.length > 1 && (
        <Line points={trajectory} color="orange" lineWidth={3} />
      )}

      {/* 적도 원 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshBasicMaterial color="gray" />
      </mesh>
    </>
  );
};

const BlochStudio = () => {
  const [theta, setTheta] = useState(Math.PI / 2); // 0 to π
  const [phi, setPhi] = useState(0); // 0 to 2π
  const [isAnimating, setIsAnimating] = useState(false);
  const [gateSequence, setGateSequence] = useState('');
  const [trajectory, setTrajectory] = useState([]);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // 복소수 클래스 (간단한 구현)
  class Complex {
    constructor(real, imag) {
      this.real = real;
      this.imag = imag;
    }
    
    magnitude() {
      return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
    
    add(other) {
      return new Complex(this.real + other.real, this.imag + other.imag);
    }
    
    multiply(other) {
      if (typeof other === 'number') {
        return new Complex(this.real * other, this.imag * other);
      }
      return new Complex(
        this.real * other.real - this.imag * other.imag,
        this.real * other.imag + this.imag * other.real
      );
    }
    
    toString() {
      if (Math.abs(this.imag) < 1e-10) {
        return Math.abs(this.real) < 1e-10 ? '0' : this.real.toFixed(3);
      }
      if (Math.abs(this.real) < 1e-10) {
        return this.imag > 0 ? `${this.imag.toFixed(3)}i` : `-${Math.abs(this.imag).toFixed(3)}i`;
      }
      if (this.imag >= 0) {
        return `${this.real.toFixed(3)} + ${this.imag.toFixed(3)}i`;
      } else {
        return `${this.real.toFixed(3)} - ${Math.abs(this.imag).toFixed(3)}i`;
      }
    }
  }

  // 상태 벡터에서 블로흐 구 좌표 계산
  const blochFromState = (alpha, beta) => {
    // |ψ⟩ = α|0⟩ + β|1⟩에서 블로흐 구 좌표 계산
    // 올바른 블로흐 벡터 공식 사용: r⃗ = ⟨ψ|σ⃗|ψ⟩
    
    // 정규화 확인
    const norm = alpha.magnitude() ** 2 + beta.magnitude() ** 2;
    if (Math.abs(norm - 1) > 1e-10) {
      // 정규화 필요
      const normSqrt = Math.sqrt(norm);
      alpha = alpha.multiply(1 / normSqrt);
      beta = beta.multiply(1 / normSqrt);
    }
    
    // 블로흐 벡터 성분 계산
    // x = ⟨ψ|σx|ψ⟩ = 2 * Re(α*β)  
    const x = 2 * (alpha.real * beta.real + alpha.imag * beta.imag);
    // y = ⟨ψ|σy|ψ⟩ = 2 * Im(α*β) 
    const y = 2 * (beta.imag * alpha.real - alpha.imag * beta.real);
    // z = ⟨ψ|σz|ψ⟩ = |α|² - |β|²
    const z = alpha.magnitude() ** 2 - beta.magnitude() ** 2;
    
    // 구면 좌표로 변환
    const r = Math.sqrt(x*x + y*y + z*z);
    const theta = r > 1e-10 ? Math.acos(Math.max(-1, Math.min(1, z/r))) : 0;
    let phi = Math.atan2(y, x);
    if (phi < 0) phi += 2 * Math.PI;
    
    return { theta, phi };
  };

  // 블로흐 구 좌표에서 상태 벡터 계산
  const stateFromBloch = (theta, phi) => {
    // 올바른 블로흐 구 매개변수화
    // |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
    const alpha = new Complex(Math.cos(theta / 2), 0);
    const beta = new Complex(
      Math.sin(theta / 2) * Math.cos(phi),
      Math.sin(theta / 2) * Math.sin(phi)
    );
    return { alpha, beta };
  };

  // 양자 게이트 적용 (올바른 유니타리 변환)
  const applyGate = (gateType) => {
    // 현재 상태를 복소수 진폭으로 변환
    const { alpha, beta } = stateFromBloch(theta, phi);
    let newAlpha, newBeta;

    switch (gateType) {
      case 'H': // Hadamard - H = (1/√2) * [[1, 1], [1, -1]]
        newAlpha = alpha.add(beta).multiply(1 / Math.sqrt(2));
        newBeta = alpha.add(beta.multiply(-1)).multiply(1 / Math.sqrt(2));
        break;
      
      case 'X': // Pauli-X - X = [[0, 1], [1, 0]]
        newAlpha = beta;
        newBeta = alpha;
        break;
      
      case 'Y': // Pauli-Y - Y = [[0, -i], [i, 0]]
        newAlpha = beta.multiply(new Complex(0, -1)); // -i * β
        newBeta = alpha.multiply(new Complex(0, 1));  // i * α
        break;
      
      case 'Z': // Pauli-Z - Z = [[1, 0], [0, -1]]
        newAlpha = alpha;
        newBeta = beta.multiply(-1);
        break;
      
      case 'S': // S gate - S = [[1, 0], [0, i]]
        newAlpha = alpha;
        newBeta = beta.multiply(new Complex(0, 1)); // i * β
        break;
      
      case 'T': // T gate - T = [[1, 0], [0, e^(iπ/4)]]
        newAlpha = alpha;
        const tPhase = new Complex(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
        newBeta = beta.multiply(tPhase);
        break;
      
      case 'RX': // X축 회전 (π/4 각도)
        const rxAngle = Math.PI / 4;
        const cosRx = Math.cos(rxAngle / 2);
        const sinRx = Math.sin(rxAngle / 2);
        newAlpha = alpha.multiply(cosRx).add(beta.multiply(new Complex(0, -sinRx)));
        newBeta = alpha.multiply(new Complex(0, -sinRx)).add(beta.multiply(cosRx));
        break;
      
      case 'RY': // Y축 회전 (π/4 각도)
        const ryAngle = Math.PI / 4;
        const cosRy = Math.cos(ryAngle / 2);
        const sinRy = Math.sin(ryAngle / 2);
        newAlpha = alpha.multiply(cosRy).add(beta.multiply(-sinRy));
        newBeta = alpha.multiply(sinRy).add(beta.multiply(cosRy));
        break;
      
      case 'RZ': // Z축 회전 (π/4 각도)  
        const rzAngle = Math.PI / 4;
        const rzPhase1 = new Complex(Math.cos(-rzAngle / 2), Math.sin(-rzAngle / 2));
        const rzPhase2 = new Complex(Math.cos(rzAngle / 2), Math.sin(rzAngle / 2));
        newAlpha = alpha.multiply(rzPhase1);
        newBeta = beta.multiply(rzPhase2);
        break;
        
      default:
        newAlpha = alpha;
        newBeta = beta;
    }

    // 정규화 (양자 상태는 항상 정규화되어야 함)
    const norm = Math.sqrt(newAlpha.magnitude() ** 2 + newBeta.magnitude() ** 2);
    if (norm > 1e-10) {
      newAlpha = newAlpha.multiply(1 / norm);
      newBeta = newBeta.multiply(1 / norm);
    }

    // 새로운 블로흐 구 좌표 계산
    const { theta: newTheta, phi: newPhi } = blochFromState(newAlpha, newBeta);
    
    setTheta(newTheta);
    setPhi(newPhi);

    // 궤적에 추가
    const x = Math.sin(newTheta) * Math.cos(newPhi);
    const y = Math.sin(newTheta) * Math.sin(newPhi);
    const z = Math.cos(newTheta);
    setTrajectory(prev => [...prev, new THREE.Vector3(x, y, z)]);
  };

  // 게이트 시퀀스 실행
  const executeGateSequence = () => {
    if (!gateSequence.trim()) return;

    const gates = gateSequence.toUpperCase().split(/[\s,]+/).filter(g => g);
    setTrajectory([]);
    setIsAnimating(true);

    // 초기 위치 추가
    const x0 = Math.sin(theta) * Math.cos(phi);
    const y0 = Math.sin(theta) * Math.sin(phi);
    const z0 = Math.cos(theta);
    setTrajectory([new THREE.Vector3(x0, y0, z0)]);

    let delay = 0;
    gates.forEach((gate, index) => {
      setTimeout(() => {
        applyGate(gate);
        if (index === gates.length - 1) {
          setIsAnimating(false);
        }
      }, delay);
      delay += 1000 / animationSpeed;
    });
  };

  // 리셋 함수 (올바른 블로흐 구 좌표)
  const resetToZero = () => {
    // |0⟩ 상태: 블로흐 구의 북극 (z = +1)
    setTheta(0);
    setPhi(0);
    setTrajectory([]);
  };

  const resetToOne = () => {
    // |1⟩ 상태: 블로흐 구의 남극 (z = -1)
    setTheta(Math.PI);
    setPhi(0);
    setTrajectory([]);
  };

  const resetToPlus = () => {
    // |+⟩ = (|0⟩ + |1⟩)/√2 상태: x축 양의 방향
    setTheta(Math.PI / 2);
    setPhi(0);
    setTrajectory([]);
  };
  
  const resetToMinus = () => {
    // |-⟩ = (|0⟩ - |1⟩)/√2 상태: x축 음의 방향
    setTheta(Math.PI / 2);
    setPhi(Math.PI);
    setTrajectory([]);
  };
  
  const resetToPlusI = () => {
    // |+i⟩ = (|0⟩ + i|1⟩)/√2 상태: y축 양의 방향
    setTheta(Math.PI / 2);
    setPhi(Math.PI / 2);
    setTrajectory([]);
  };
  
  const resetToMinusI = () => {
    // |-i⟩ = (|0⟩ - i|1⟩)/√2 상태: y축 음의 방향
    setTheta(Math.PI / 2);
    setPhi(3 * Math.PI / 2);
    setTrajectory([]);
  };

  const clearTrajectory = () => {
    setTrajectory([]);
  };

  // 블로흐 벡터 검증 함수 (개발/디버깅용)
  const verifyBlochVector = (theta, phi) => {
    const { alpha, beta } = stateFromBloch(theta, phi);
    const { theta: verifyTheta, phi: verifyPhi } = blochFromState(alpha, beta);
    
    // 수치 오차 확인 (1e-10 이내)
    const thetaError = Math.abs(theta - verifyTheta);
    const phiError = Math.min(Math.abs(phi - verifyPhi), Math.abs(phi - verifyPhi + 2*Math.PI), Math.abs(phi - verifyPhi - 2*Math.PI));
    
    if (thetaError > 1e-10 || phiError > 1e-10) {
      console.warn('블로흐 구 변환 오차:', { theta, phi, verifyTheta, verifyPhi, thetaError, phiError });
    }
    
    return { thetaError, phiError };
  };

  // 상태 확률 계산
  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌐 블로흐 스튜디오
          </h1>
          <p className="text-lg text-gray-600">
            3D 블로흐 구를 조작하며 양자 상태를 시각적으로 탐구해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3D 블로흐 구 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">🎮 3D 블로흐 구</h2>
            <div className="h-96 border rounded-lg overflow-hidden">
              <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <BlochSphere 
                  theta={theta} 
                  phi={phi} 
                  showTrajectory={showTrajectory}
                  trajectory={trajectory}
                />
                <OrbitControls />
              </Canvas>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showTrajectory}
                  onChange={(e) => setShowTrajectory(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">궤적 표시</span>
              </label>
              <button
                onClick={clearTrajectory}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                궤적 지우기
              </button>
            </div>
          </div>

          {/* 컨트롤 패널 */}
          <div className="space-y-6">
            
            {/* 각도 슬라이더 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">🎛️ 각도 조절</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    θ (Theta): {(theta * 180 / Math.PI).toFixed(1)}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.PI}
                    step="0.01"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    φ (Phi): {(phi * 180 / Math.PI).toFixed(1)}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.01"
                    value={phi}
                    onChange={(e) => setPhi(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <button onClick={resetToZero} className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">|0⟩</button>
                <button onClick={resetToOne} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">|1⟩</button>
                <button onClick={resetToPlus} className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">|+⟩</button>
                <button onClick={resetToMinus} className="bg-purple-500 text-white py-1 px-2 rounded hover:bg-purple-600">|-⟩</button>
                <button onClick={resetToPlusI} className="bg-orange-500 text-white py-1 px-2 rounded hover:bg-orange-600">|+i⟩</button>
                <button onClick={resetToMinusI} className="bg-pink-500 text-white py-1 px-2 rounded hover:bg-pink-600">|-i⟩</button>
              </div>
            </div>

            {/* 양자 게이트 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">🚪 양자 게이트</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'].map(gate => (
                  <button
                    key={gate}
                    onClick={() => applyGate(gate)}
                    className={`py-2 px-3 rounded font-bold text-white text-sm ${
                      gate === 'H' ? 'bg-purple-500 hover:bg-purple-600' :
                      gate === 'X' ? 'bg-red-500 hover:bg-red-600' :
                      gate === 'Y' ? 'bg-green-500 hover:bg-green-600' :
                      gate === 'Z' ? 'bg-blue-500 hover:bg-blue-600' :
                      gate === 'S' ? 'bg-indigo-500 hover:bg-indigo-600' :
                      gate === 'T' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      gate === 'RX' ? 'bg-pink-500 hover:bg-pink-600' :
                      gate === 'RY' ? 'bg-teal-500 hover:bg-teal-600' :
                      gate === 'RZ' ? 'bg-cyan-500 hover:bg-cyan-600' :
                      'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {gate}
                  </button>
                ))}
              </div>
            </div>

            {/* 게이트 시퀀스 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">⚡ 게이트 시퀀스</h3>
              
              <textarea
                value={gateSequence}
                onChange={(e) => setGateSequence(e.target.value)}
                placeholder="예: H X Z H"
                className="w-full border rounded p-2 text-sm mb-4"
                rows="3"
              />
              
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm">속도:</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm">{animationSpeed}x</span>
              </div>
              
              <button
                onClick={executeGateSequence}
                disabled={isAnimating}
                className={`w-full py-2 rounded font-semibold ${
                  isAnimating 
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isAnimating ? '실행 중...' : '🎬 애니메이션 실행'}
              </button>
            </div>

            {/* 상태 정보 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">📊 양자 상태 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">확률 분포</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>P(|0⟩):</span>
                      <span className="font-mono">{prob0.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>P(|1⟩):</span>
                      <span className="font-mono">{prob1.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">블로흐 구 좌표</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>θ (theta):</span>
                      <span className="font-mono">{(theta * 180 / Math.PI).toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>φ (phi):</span>
                      <span className="font-mono">{(phi * 180 / Math.PI).toFixed(1)}°</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">상태 벡터 (근사)</h4>
                  <div className="bg-gray-100 rounded p-3">
                    <div className="font-mono text-sm">
                      {(() => {
                        const { alpha, beta } = stateFromBloch(theta, phi);
                        const alphaStr = alpha.magnitude() > 0.001 ? alpha.toString() : '0';
                        const betaStr = beta.magnitude() > 0.001 ? beta.toString() : '0';
                        
                        // 더 나은 표시를 위한 부호 처리
                        const betaSign = (beta.real >= 0 && beta.imag >= 0) || 
                                       (beta.real >= 0 && Math.abs(beta.imag) < 1e-10) ? '+ ' : '';
                        
                        return (
                          <div>
                            <div>|ψ⟩ = {alphaStr}|0⟩</div>
                            <div className="ml-8">
                              {betaSign}{betaStr}|1⟩
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded">
                  <strong>블로흐 구 원리:</strong> 단일 큐비트의 모든 가능한 양자 상태를 3차원 구 표면에 표현합니다.
                  <br/>• <strong>극축(Z):</strong> |0⟩(북극) ↔ |1⟩(남극)
                  <br/>• <strong>적도(XY):</strong> 중첩 상태들 |+⟩, |-⟩, |+i⟩, |-i⟩
                  <br/>• <strong>블로흐 벡터:</strong> r⃗ = (⟨σx⟩, ⟨σy⟩, ⟨σz⟩)로 계산됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 도움말 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">💡 사용법</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">🎛️ 슬라이더</h4>
              <p>θ와 φ 슬라이더로 블로흐 벡터를 직접 조작할 수 있습니다.</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold mb-2">🚪 양자 게이트</h4>
              <p><strong>Pauli 게이트:</strong> X, Y, Z - 블로흐 구의 각 축 주위로 π 회전</p>
              <p><strong>회전 게이트:</strong> RX, RY, RZ - 각 축 주위로 π/4 회전</p>
              <p><strong>기타:</strong> H(Hadamard), S, T - 특수한 유니타리 변환</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h4 className="font-semibold mb-2">⚡ 시퀀스</h4>
              <p>여러 게이트를 연속으로 실행하는 애니메이션을 볼 수 있습니다.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <h4 className="font-semibold mb-2">🎮 3D 조작</h4>
              <p>마우스로 블로흐 구를 회전하고 확대/축소할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlochStudio; 