/**
 * 양자 시뮬레이션 엔진
 * 상태 벡터 기반으로 양자 게이트 적용 및 측정 수행
 */
export class QuantumSimulator {
  constructor(numQubits) {
    this.numQubits = numQubits;
    this.numStates = Math.pow(2, numQubits);
    this.reset();
  }

  // 초기 |000...⟩ 상태로 리셋
  reset() {
    this.stateVector = new Array(this.numStates).fill(null).map(() => ({ real: 0, imag: 0 }));
    this.stateVector[0] = { real: 1, imag: 0 }; // 복소수 지원
  }

  // 복소수 곱셈 헬퍼
  complexMultiply(a, b) {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    };
  }

  // 복소수 덧셈 헬퍼
  complexAdd(a, b) {
    return {
      real: a.real + b.real,
      imag: a.imag + b.imag
    };
  }

  // 크기 계산
  magnitude(complex) {
    return Math.sqrt(complex.real * complex.real + complex.imag * complex.imag);
  }

  // Hadamard 게이트 적용
  applyHadamard(qubit) {
    const newState = new Array(this.numStates).fill().map(() => ({ real: 0, imag: 0 }));
    const invSqrt2 = { real: 1 / Math.sqrt(2), imag: 0 };
    
    for (let state = 0; state < this.numStates; state++) {
      if (this.magnitude(this.stateVector[state]) < 1e-10) continue;
      
      const bit = (state >> qubit) & 1;
      const flippedState = state ^ (1 << qubit);
      
      if (bit === 0) {
        // |0⟩ → (|0⟩ + |1⟩)/√2
        newState[state] = this.complexAdd(newState[state], 
          this.complexMultiply(this.stateVector[state], invSqrt2));
        newState[flippedState] = this.complexAdd(newState[flippedState], 
          this.complexMultiply(this.stateVector[state], invSqrt2));
      } else {
        // |1⟩ → (|0⟩ - |1⟩)/√2
        newState[flippedState] = this.complexAdd(newState[flippedState], 
          this.complexMultiply(this.stateVector[state], invSqrt2));
        newState[state] = this.complexAdd(newState[state], 
          this.complexMultiply(this.stateVector[state], { real: -1/Math.sqrt(2), imag: 0 }));
      }
    }
    this.stateVector = newState;
  }

  // Pauli-X 게이트 적용
  applyPauliX(qubit) {
    for (let state = 0; state < this.numStates; state++) {
      const flippedState = state ^ (1 << qubit);
      if (state < flippedState) {
        [this.stateVector[state], this.stateVector[flippedState]] = 
        [this.stateVector[flippedState], this.stateVector[state]];
      }
    }
  }

  // Pauli-Y 게이트 적용
  applyPauliY(qubit) {
    for (let state = 0; state < this.numStates; state++) {
      const bit = (state >> qubit) & 1;
      const flippedState = state ^ (1 << qubit);
      
      if (state < flippedState) {
        const temp = this.stateVector[state];
        if (bit === 0) {
          // |0⟩ → i|1⟩
          this.stateVector[state] = { real: -this.stateVector[flippedState].imag, 
                                     imag: this.stateVector[flippedState].real };
          // |1⟩ → -i|0⟩
          this.stateVector[flippedState] = { real: temp.imag, imag: -temp.real };
        }
      }
    }
  }

  // Pauli-Z 게이트 적용
  applyPauliZ(qubit) {
    for (let state = 0; state < this.numStates; state++) {
      const bit = (state >> qubit) & 1;
      if (bit === 1) {
        // |1⟩에 -1 위상 적용
        this.stateVector[state] = {
          real: -this.stateVector[state].real,
          imag: -this.stateVector[state].imag
        };
      }
    }
  }

  // CNOT 게이트 적용
  applyCNOT(control, target) {
    for (let state = 0; state < this.numStates; state++) {
      const controlBit = (state >> control) & 1;
      if (controlBit === 1) {
        const flippedState = state ^ (1 << target);
        if (state < flippedState) {
          [this.stateVector[state], this.stateVector[flippedState]] = 
          [this.stateVector[flippedState], this.stateVector[state]];
        }
      }
    }
  }

  // 게이트 적용 통합 메소드
  applyGate(gate) {
    switch (gate.type) {
      case 'H':
        this.applyHadamard(gate.qubit);
        break;
      case 'X':
        this.applyPauliX(gate.qubit);
        break;
      case 'Y':
        this.applyPauliY(gate.qubit);
        break;
      case 'Z':
        this.applyPauliZ(gate.qubit);
        break;
      case 'CNOT':
        this.applyCNOT(gate.qubit, gate.targetQubit);
        break;
    }
  }

  // 확률 분포 계산
  getProbabilityDistribution() {
    const probabilities = {};
    
    for (let state = 0; state < this.numStates; state++) {
      const probability = Math.pow(this.magnitude(this.stateVector[state]), 2);
      if (probability > 1e-10) {
        const binaryState = state.toString(2).padStart(this.numQubits, '0');
        probabilities[binaryState] = probability;
      }
    }
    
    return probabilities;
  }

  // 측정 시뮬레이션 (몬테카를로)
  measure(shots = 1024) {
    const results = {};
    const probabilities = this.getProbabilityDistribution();
    
    for (let shot = 0; shot < shots; shot++) {
      const random = Math.random();
      let cumulative = 0;
      
      for (const [state, probability] of Object.entries(probabilities)) {
        cumulative += probability;
        if (random <= cumulative) {
          results[state] = (results[state] || 0) + 1;
          break;
        }
      }
    }
    
    return results;
  }

  // 얽힘 정도 계산 (간단한 추정)
  getEntanglementMeasure() {
    if (this.numQubits < 2) return 0;
    
    // 폰 노이만 엔트로피 기반 간단한 추정
    const probabilities = Object.values(this.getProbabilityDistribution());
    let entropy = 0;
    
    probabilities.forEach(p => {
      if (p > 0) entropy -= p * Math.log2(p);
    });
    
    return Math.min(entropy / this.numQubits, 1); // 정규화
  }

  // 위상 정보 추출
  getPhaseInfo() {
    const phases = [];
    for (let state = 0; state < this.numStates; state++) {
      const complex = this.stateVector[state];
      if (this.magnitude(complex) > 1e-10) {
        const phase = Math.atan2(complex.imag, complex.real);
        const binaryState = state.toString(2).padStart(this.numQubits, '0');
        phases.push({ state: binaryState, phase: phase });
      }
    }
    return phases;
  }

  // 슈퍼포지션 계수 개수
  getSuperpositionCount() {
    return Object.keys(this.getProbabilityDistribution()).length;
  }

  // 현재 상태 벡터 복사
  getStateVector() {
    return this.stateVector.map(complex => ({ ...complex }));
  }

  // 상태 벡터 설정
  setStateVector(stateVector) {
    this.stateVector = stateVector.map(complex => ({ ...complex }));
  }
} 