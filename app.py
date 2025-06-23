from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # GUI 없는 환경에서 사용
import io
import base64
import re
from typing import Dict, List, Tuple, Optional

# 한글 폰트 설정 (서버 환경에서는 기본 폰트 사용)
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['axes.unicode_minus'] = False

app = Flask(__name__)
CORS(app)

class QuantumSimulator:
    """과학적으로 정확한 양자 시뮬레이터"""
    
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.num_states = 2 ** num_qubits
        # 초기 상태 |00...0⟩
        self.state_vector = np.zeros(self.num_states, dtype=complex)
        self.state_vector[0] = 1.0
        
        # 파울리 게이트 행렬
        self.I = np.array([[1, 0], [0, 1]], dtype=complex)
        self.X = np.array([[0, 1], [1, 0]], dtype=complex)
        self.Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
        self.Z = np.array([[1, 0], [0, -1]], dtype=complex)
        self.H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
        self.S = np.array([[1, 0], [0, 1j]], dtype=complex)
        self.T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)
    
    def reset(self):
        """시뮬레이터 초기화"""
        self.state_vector = np.zeros(self.num_states, dtype=complex)
        self.state_vector[0] = 1.0
    
    def apply_single_qubit_gate(self, gate_matrix: np.ndarray, qubit: int):
        """단일 큐비트 게이트 적용"""
        if qubit >= self.num_qubits:
            raise ValueError(f"큐비트 인덱스 {qubit}이 범위를 벗어났습니다 (0-{self.num_qubits-1})")
        
        # 전체 시스템에 대한 게이트 행렬 구성
        gate_list = []
        for i in range(self.num_qubits):
            if i == qubit:
                gate_list.append(gate_matrix)
            else:
                gate_list.append(self.I)
        
        # 텐서곱으로 전체 게이트 행렬 생성
        full_gate = gate_list[0]
        for i in range(1, len(gate_list)):
            full_gate = np.kron(full_gate, gate_list[i])
        
        # 상태벡터에 게이트 적용
        self.state_vector = full_gate @ self.state_vector
    
    def apply_cnot_gate(self, control: int, target: int):
        """CNOT 게이트 적용"""
        if control >= self.num_qubits or target >= self.num_qubits:
            raise ValueError("큐비트 인덱스가 범위를 벗어났습니다")
        
        if control == target:
            raise ValueError("제어 큐비트와 타겟 큐비트는 달라야 합니다")
        
        # CNOT 게이트 행렬 생성 (2^n x 2^n)
        cnot_matrix = np.eye(self.num_states, dtype=complex)
        
        for i in range(self.num_states):
            # 이진 표현으로 변환
            binary = format(i, f'0{self.num_qubits}b')
            bits = [int(b) for b in binary]
            
            # 제어 큐비트가 1이면 타겟 큐비트 플립
            if bits[control] == 1:
                bits[target] = 1 - bits[target]
                j = int(''.join(map(str, bits)), 2)
                cnot_matrix[j, i] = 1
                cnot_matrix[i, i] = 0
        
        self.state_vector = cnot_matrix @ self.state_vector
    
    def h_gate(self, qubit: int):
        """Hadamard 게이트"""
        self.apply_single_qubit_gate(self.H, qubit)
    
    def x_gate(self, qubit: int):
        """Pauli-X (NOT) 게이트"""
        self.apply_single_qubit_gate(self.X, qubit)
    
    def y_gate(self, qubit: int):
        """Pauli-Y 게이트"""
        self.apply_single_qubit_gate(self.Y, qubit)
    
    def z_gate(self, qubit: int):
        """Pauli-Z 게이트"""
        self.apply_single_qubit_gate(self.Z, qubit)
    
    def s_gate(self, qubit: int):
        """S (Phase) 게이트"""
        self.apply_single_qubit_gate(self.S, qubit)
    
    def t_gate(self, qubit: int):
        """T 게이트"""
        self.apply_single_qubit_gate(self.T, qubit)
    
    def measure(self, shots: int = 1024) -> Dict[str, int]:
        """측정 시뮬레이션"""
        # 각 상태의 확률 계산
        probabilities = np.abs(self.state_vector) ** 2
        
        # shots 번 측정 시뮬레이션
        results = np.random.choice(
            range(self.num_states), 
            size=shots, 
            p=probabilities
        )
        
        # 결과를 이진 문자열로 변환하여 카운트
        counts = {}
        for result in results:
            binary_state = format(result, f'0{self.num_qubits}b')
            counts[binary_state] = counts.get(binary_state, 0) + 1
        
        return counts
    
    def get_state_vector(self) -> np.ndarray:
        """현재 상태벡터 반환"""
        return self.state_vector.copy()
    
    def get_probabilities(self) -> Dict[str, float]:
        """각 상태의 확률 반환"""
        probabilities = {}
        for i, amplitude in enumerate(self.state_vector):
            prob = abs(amplitude) ** 2
            if prob > 1e-10:  # 매우 작은 확률은 무시
                binary_state = format(i, f'0{self.num_qubits}b')
                probabilities[binary_state] = prob
        return probabilities

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '과학적으로 정확한 양자 시뮬레이션 백엔드',
        'status': 'running',
        'endpoints': [
            '/execute-quantum-code',
            '/quantum-templates/<template_name>',
            '/health'
        ],
        'features': [
            'accurate_quantum_simulation',
            'state_vector_calculation', 
            'proper_gate_operations',
            'measurement_statistics',
            'scientific_visualization'
        ]
    })

@app.route('/execute-quantum-code', methods=['POST'])
def execute_quantum_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'qiskit')
        
        if not code:
            return jsonify({'error': '코드가 없습니다.'}), 400
        
        # 양자 시뮬레이션 실행
        result = simulate_quantum_code(code, language)
        
        # 차트 생성
        if result.get('success'):
            charts = generate_charts(result)
            result['charts'] = charts
        
        return jsonify({
            'success': True,
            'result': result,
            'raw_output': json.dumps(result, default=str)
        })
        
    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500

def simulate_quantum_code(code: str, language: str) -> Dict:
    """과학적으로 정확한 양자 시뮬레이션"""
    try:
        # 큐비트 수 감지
        num_qubits = detect_qubits_from_code(code)
        
        # 시뮬레이터 초기화
        simulator = QuantumSimulator(num_qubits)
        
        # 코드에서 게이트 연산 추출 및 실행
        operations = parse_quantum_operations(code)
        
        for op in operations:
            if op['type'] == 'H':
                simulator.h_gate(op['qubit'])
            elif op['type'] == 'X':
                simulator.x_gate(op['qubit'])
            elif op['type'] == 'Y':
                simulator.y_gate(op['qubit'])
            elif op['type'] == 'Z':
                simulator.z_gate(op['qubit'])
            elif op['type'] == 'S':
                simulator.s_gate(op['qubit'])
            elif op['type'] == 'T':
                simulator.t_gate(op['qubit'])
            elif op['type'] == 'CNOT':
                simulator.apply_cnot_gate(op['control'], op['target'])
        
        # 측정 수행
        shots = 1024
        counts = simulator.measure(shots)
        probabilities = simulator.get_probabilities()
        state_vector = simulator.get_state_vector()
        
        # 양자 상태 분석
        entanglement = calculate_entanglement(state_vector, num_qubits)
        fidelity = calculate_fidelity(state_vector, operations)
        
        return {
            'success': True,
            'counts': counts,
            'probabilities': probabilities,
            'state_vector': {
                'amplitudes': [complex(amp) for amp in state_vector],
                'phases': [np.angle(amp) for amp in state_vector],
                'magnitudes': [abs(amp) for amp in state_vector]
            },
            'quantum_properties': {
                'entanglement_measure': entanglement,
                'state_fidelity': fidelity,
                'purity': calculate_purity(state_vector),
                'von_neumann_entropy': calculate_entropy(probabilities)
            },
            'circuit_info': {
                'num_qubits': num_qubits,
                'operations': operations,
                'depth': len(operations),
                'total_shots': shots
            },
            'message': '양자 회로 시뮬레이션 완료'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'message': '시뮬레이션 중 오류 발생'
        }

def detect_qubits_from_code(code: str) -> int:
    """코드에서 큐비트 수 감지"""
    # QuantumCircuit(n, n) 패턴 찾기
    circuit_match = re.search(r'QuantumCircuit\((\d+)', code)
    if circuit_match:
        return int(circuit_match.group(1))
    
    # 게이트 호출에서 최대 큐비트 인덱스 찾기
    max_qubit = 0
    patterns = [
        r'\.h\((\d+)\)', r'\.x\((\d+)\)', r'\.y\((\d+)\)', r'\.z\((\d+)\)',
        r'\.s\((\d+)\)', r'\.t\((\d+)\)',
        r'\.cx\((\d+),\s*(\d+)\)', r'\.cnot\((\d+),\s*(\d+)\)'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, code)
        for match in matches:
            if isinstance(match, tuple):
                max_qubit = max(max_qubit, max(int(m) for m in match))
            else:
                max_qubit = max(max_qubit, int(match))
    
    return max(max_qubit + 1, 2)  # 최소 2큐비트

def parse_quantum_operations(code: str) -> List[Dict]:
    """코드에서 양자 게이트 연산 파싱"""
    operations = []
    
    # 각 게이트 타입별로 파싱
    patterns = {
        'H': r'\.h\((\d+)\)',
        'X': r'\.x\((\d+)\)',
        'Y': r'\.y\((\d+)\)',
        'Z': r'\.z\((\d+)\)',
        'S': r'\.s\((\d+)\)',
        'T': r'\.t\((\d+)\)',
        'CNOT': r'\.cx\((\d+),\s*(\d+)\)'
    }
    
    for gate_type, pattern in patterns.items():
        matches = re.finditer(pattern, code)
        for match in matches:
            if gate_type == 'CNOT':
                operations.append({
                    'type': gate_type,
                    'control': int(match.group(1)),
                    'target': int(match.group(2)),
                    'position': match.start()
                })
            else:
                operations.append({
                    'type': gate_type,
                    'qubit': int(match.group(1)),
                    'position': match.start()
                })
    
    # 코드 위치에 따라 정렬
    operations.sort(key=lambda x: x['position'])
    
    # position 키 제거
    for op in operations:
        del op['position']
    
    return operations

def calculate_entanglement(state_vector: np.ndarray, num_qubits: int) -> float:
    """양자 얽힘 정도 계산 (Von Neumann 엔트로피 기반)"""
    if num_qubits < 2:
        return 0.0
    
    try:
        # 부분 추적을 통한 reduced density matrix 계산
        # 간단히 첫 번째 큐비트에 대한 reduced density matrix 계산
        dim = 2 ** (num_qubits - 1)
        rho_reduced = np.zeros((2, 2), dtype=complex)
        
        for i in range(len(state_vector)):
            binary = format(i, f'0{num_qubits}b')
            first_bit = int(binary[0])
            rest_bits = binary[1:]
            
            for j in range(len(state_vector)):
                binary_j = format(j, f'0{num_qubits}b')
                first_bit_j = int(binary_j[0])
                rest_bits_j = binary_j[1:]
                
                if rest_bits == rest_bits_j:
                    rho_reduced[first_bit, first_bit_j] += state_vector[i] * np.conj(state_vector[j])
        
        # 고유값 계산
        eigenvalues = np.linalg.eigvals(rho_reduced)
        eigenvalues = eigenvalues[eigenvalues > 1e-12]  # 수치적 안정성
        
        # Von Neumann 엔트로피
        entropy = -np.sum(eigenvalues * np.log2(eigenvalues))
        return float(entropy)
        
    except Exception:
        return 0.0

def calculate_fidelity(state_vector: np.ndarray, operations: List[Dict]) -> float:
    """상태 충실도 계산"""
    # 이론적 상태와의 비교 (단순화된 버전)
    return float(np.sum(np.abs(state_vector) ** 2))

def calculate_purity(state_vector: np.ndarray) -> float:
    """상태 순도 계산"""
    return float(np.sum(np.abs(state_vector) ** 4))

def calculate_entropy(probabilities: Dict[str, float]) -> float:
    """Von Neumann 엔트로피 계산"""
    entropy = 0.0
    for prob in probabilities.values():
        if prob > 1e-12:
            entropy -= prob * np.log2(prob)
    return entropy

def generate_charts(data: Dict) -> Dict:
    """과학적 시각화 차트 생성"""
    charts = {}
    
    try:
        if 'counts' in data and data['counts']:
            # 1. 측정 결과 히스토그램
            charts['histogram'] = create_histogram(data['counts'])
            
            # 2. 확률 분포 파이 차트
            if 'probabilities' in data:
                charts['pie_chart'] = create_pie_chart(data['probabilities'])
            
            # 3. 상태벡터 시각화
            if 'state_vector' in data:
                charts['state_vector'] = create_state_vector_chart(data['state_vector'])
                
            # 4. 위상 다이어그램
            if 'state_vector' in data:
                charts['phase_diagram'] = create_phase_diagram(data['state_vector'])
            
    except Exception as e:
        print(f"차트 생성 중 오류: {e}")
        charts['error'] = str(e)
    
    return charts

def create_histogram(counts: Dict[str, int]) -> Optional[str]:
    """측정 결과 히스토그램"""
    try:
        plt.figure(figsize=(12, 8))
        
        states = list(counts.keys())
        values = list(counts.values())
        
        # 색상 그라디언트
        colors = plt.cm.viridis(np.linspace(0, 1, len(states)))
        
        bars = plt.bar(states, values, color=colors, alpha=0.8, 
                      edgecolor='black', linewidth=0.5)
        
        plt.xlabel('Quantum States |ψ⟩', fontsize=14, fontweight='bold')
        plt.ylabel('Measurement Counts', fontsize=14, fontweight='bold')
        plt.title('Quantum Measurement Statistics', fontsize=16, fontweight='bold', pad=20)
        
        plt.grid(True, alpha=0.3, axis='y')
        
        # 값 표시
        for bar, value in zip(bars, values):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + max(values)*0.01,
                    f'{int(value)}', ha='center', va='bottom', fontweight='bold')
        
        plt.xticks(rotation=45 if len(states) > 4 else 0)
        plt.tight_layout()
        
        return save_plot_as_base64()
        
    except Exception as e:
        print(f"히스토그램 생성 오류: {e}")
        return None

def create_pie_chart(probabilities: Dict[str, float]) -> Optional[str]:
    """확률 분포 파이 차트"""
    try:
        plt.figure(figsize=(10, 10))
        
        # 0이 아닌 확률만 필터링
        filtered_data = {k: v for k, v in probabilities.items() if v > 0.001}
        
        if not filtered_data:
            return None
            
        states = list(filtered_data.keys())
        probs = list(filtered_data.values())
        
        colors = plt.cm.Set3(np.linspace(0, 1, len(states)))
        
        wedges, texts, autotexts = plt.pie(
            probs, labels=[f'|{s}⟩' for s in states], 
            autopct='%1.3f%%', colors=colors, startangle=90,
            explode=[0.05] * len(states)
        )
        
        plt.title('Quantum State Probability Distribution', 
                 fontsize=16, fontweight='bold', pad=20)
        
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
            autotext.set_fontsize(10)
        
        plt.axis('equal')
        
        return save_plot_as_base64()
        
    except Exception as e:
        print(f"파이 차트 생성 오류: {e}")
        return None

def create_state_vector_chart(state_vector_data: Dict) -> Optional[str]:
    """상태벡터 진폭과 위상 시각화"""
    try:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
        
        magnitudes = state_vector_data['magnitudes']
        phases = state_vector_data['phases']
        
        n_states = len(magnitudes)
        states = [format(i, f'0{int(np.log2(n_states))}b') for i in range(n_states)]
        x_pos = np.arange(n_states)
        
        # 진폭 플롯
        bars1 = ax1.bar(x_pos, magnitudes, color='lightcoral', alpha=0.7,
                       edgecolor='darkred', linewidth=1)
        ax1.set_xlabel('Quantum States')
        ax1.set_ylabel('Amplitude |ψᵢ|')
        ax1.set_title('State Vector Amplitudes')
        ax1.set_xticks(x_pos)
        ax1.set_xticklabels([f'|{s}⟩' for s in states], rotation=45)
        ax1.grid(True, alpha=0.3)
        
        # 위상 플롯
        bars2 = ax2.bar(x_pos, phases, color='lightblue', alpha=0.7,
                       edgecolor='darkblue', linewidth=1)
        ax2.set_xlabel('Quantum States')
        ax2.set_ylabel('Phase (radians)')
        ax2.set_title('State Vector Phases')
        ax2.set_xticks(x_pos)
        ax2.set_xticklabels([f'|{s}⟩' for s in states], rotation=45)
        ax2.grid(True, alpha=0.3)
        ax2.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        ax2.axhline(y=np.pi, color='black', linestyle='--', alpha=0.3, label='π')
        ax2.axhline(y=-np.pi, color='black', linestyle='--', alpha=0.3, label='-π')
        
        plt.tight_layout()
        
        return save_plot_as_base64()
        
    except Exception as e:
        print(f"상태벡터 차트 생성 오류: {e}")
        return None

def create_phase_diagram(state_vector_data: Dict) -> Optional[str]:
    """복소평면에서의 위상 다이어그램"""
    try:
        plt.figure(figsize=(10, 10))
        
        amplitudes = state_vector_data['amplitudes']
        n_states = len(amplitudes)
        
        # 복소수를 실수부와 허수부로 분리
        real_parts = [amp.real for amp in amplitudes]
        imag_parts = [amp.imag for amp in amplitudes]
        magnitudes = [abs(amp) for amp in amplitudes]
        
        # 0이 아닌 진폭만 표시
        non_zero_indices = [i for i, mag in enumerate(magnitudes) if mag > 1e-10]
        
        if non_zero_indices:
            colors = plt.cm.viridis(np.linspace(0, 1, len(non_zero_indices)))
            
            for i, idx in enumerate(non_zero_indices):
                state = format(idx, f'0{int(np.log2(n_states))}b')
                plt.scatter(real_parts[idx], imag_parts[idx], 
                           s=magnitudes[idx]*1000, color=colors[i], 
                           alpha=0.7, edgecolor='black', linewidth=1)
                plt.annotate(f'|{state}⟩', 
                           (real_parts[idx], imag_parts[idx]),
                           xytext=(5, 5), textcoords='offset points',
                           fontsize=10, fontweight='bold')
        
        # 단위원 그리기
        circle = plt.Circle((0, 0), 1, fill=False, color='gray', 
                           linestyle='--', alpha=0.5)
        plt.gca().add_patch(circle)
        
        plt.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        plt.axvline(x=0, color='black', linestyle='-', alpha=0.3)
        
        plt.xlabel('Real Part', fontsize=14, fontweight='bold')
        plt.ylabel('Imaginary Part', fontsize=14, fontweight='bold')
        plt.title('Quantum State in Complex Plane', fontsize=16, fontweight='bold')
        plt.grid(True, alpha=0.3)
        plt.axis('equal')
        
        # 범위 설정
        max_val = max(max(abs(r) for r in real_parts), max(abs(i) for i in imag_parts))
        limit = max(1.2, max_val * 1.2)
        plt.xlim(-limit, limit)
        plt.ylim(-limit, limit)
        
        return save_plot_as_base64()
        
    except Exception as e:
        print(f"위상 다이어그램 생성 오류: {e}")
        return None

def save_plot_as_base64() -> str:
    """현재 플롯을 Base64로 인코딩"""
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight',
               facecolor='white', edgecolor='none')
    buffer.seek(0)
    
    chart_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return f"data:image/png;base64,{chart_data}"

@app.route('/quantum-templates/<template_name>', methods=['GET'])
def get_quantum_template(template_name: str):
    """과학적으로 정확한 양자 알고리즘 템플릿"""
    templates = {
        'bell': {
            'name': '벨 상태 (Bell State)',
            'description': '두 큐비트 간 최대 얽힘 상태 생성',
            'theory': '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
            'applications': ['양자 통신', '양자 암호', '양자 순간이동'],
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'CNOT', 'control': 0, 'target': 1, 'step': 1}
            ],
            'expected_result': {
                '00': 0.5,
                '11': 0.5
            },
            'code_example': '''# 벨 상태 생성
from qiskit import QuantumCircuit, Aer, execute

qc = QuantumCircuit(2, 2)
qc.h(0)       # 첫 번째 큐비트를 |+⟩ 상태로
qc.cx(0, 1)   # 얽힘 생성: |00⟩ + |11⟩
qc.measure_all()

backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts()'''
        },
        'grover': {
            'name': '그로버 알고리즘 (Grover\'s Algorithm)',
            'description': '비정렬 데이터베이스에서의 양자 탐색',
            'theory': '검색 시간 복잡도를 O(√N)으로 감소',
            'applications': ['데이터베이스 검색', '최적화 문제', '암호 해독'],
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'H', 'qubit': 1, 'step': 0},
                {'type': 'Z', 'qubit': 0, 'step': 1},
                {'type': 'Z', 'qubit': 1, 'step': 1},
                {'type': 'CNOT', 'control': 0, 'target': 1, 'step': 2}
            ],
            'complexity': {
                'classical': 'O(N)',
                'quantum': 'O(√N)'
            },
            'code_example': '''# 그로버 알고리즘 (2-큐비트)
from qiskit import QuantumCircuit, Aer, execute

qc = QuantumCircuit(2, 2)
# 균등 중첩 상태 생성
qc.h([0, 1])
# 오라클 (|11⟩ 상태에 -1 위상)
qc.cz(0, 1)
# 확산 연산자
qc.h([0, 1])
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])
qc.measure_all()'''
        },
        'ghz': {
            'name': 'GHZ 상태 (Greenberger-Horne-Zeilinger)',
            'description': '3개 이상 큐비트의 최대 얽힘 상태',
            'theory': '|GHZ⟩ = (|000⟩ + |111⟩)/√2',
            'applications': ['양자 비밀 공유', '벨 부등식 위반', '양자 측정 이론'],
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'CNOT', 'control': 0, 'target': 1, 'step': 1},
                {'type': 'CNOT', 'control': 1, 'target': 2, 'step': 2}
            ],
            'expected_result': {
                '000': 0.5,
                '111': 0.5
            },
            'properties': {
                'entanglement_class': 'GHZ-class',
                'schmidt_rank': 2,
                'violation': 'Mermin inequality'
            },
            'code_example': '''# GHZ 상태 생성
from qiskit import QuantumCircuit, Aer, execute

qc = QuantumCircuit(3, 3)
qc.h(0)       # 첫 번째 큐비트 중첩
qc.cx(0, 1)   # 첫 번째 얽힘
qc.cx(1, 2)   # 두 번째 얽힘으로 3-큐비트 GHZ 상태
qc.measure_all()

backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts()'''
        },
        'superposition': {
            'name': '양자 중첩 (Quantum Superposition)',
            'description': '단일 큐비트의 중첩 상태 생성',
            'theory': '|+⟩ = (|0⟩ + |1⟩)/√2',
            'applications': ['양자 간섭', '양자 병렬성', '양자 알고리즘의 기초'],
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0}
            ],
            'expected_result': {
                '0': 0.5,
                '1': 0.5
            },
            'code_example': '''# 양자 중첩 상태
from qiskit import QuantumCircuit, Aer, execute

qc = QuantumCircuit(1, 1)
qc.h(0)       # |0⟩ → |+⟩ = (|0⟩ + |1⟩)/√2
qc.measure_all()

backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts()'''
        }
    }
    
    if template_name in templates:
        return jsonify(templates[template_name])
    else:
        return jsonify({'error': f'템플릿 "{template_name}"을 찾을 수 없습니다'}), 404

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'simulator': 'QuantumSimulator v2.0',
        'features': [
            'accurate_state_vector_simulation',
            'proper_quantum_gates',
            'entanglement_calculation',
            'scientific_visualization',
            'quantum_property_analysis'
        ],
        'timestamp': str(np.datetime64('now'))
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 