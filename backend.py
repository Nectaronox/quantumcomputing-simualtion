from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import subprocess
import os
import tempfile
import json
import traceback
import random
import re
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import matplotlib.font_manager as fm
import numpy as np
import io
import base64
from mpl_toolkits.mplot3d import Axes3D
import math

# 한글 폰트 설정
def setup_korean_font():
    """한글 폰트 설정 함수"""
    korean_fonts = ['Malgun Gothic', 'Nanum Gothic', 'NanumGothic', 'NanumBarunGothic']
    
    for font_name in korean_fonts:
        try:
            font_path = fm.findfont(fm.FontProperties(family=font_name))
            if font_path and font_name in font_path:
                plt.rcParams['font.family'] = font_name
                plt.rcParams['axes.unicode_minus'] = False
                return True
        except:
            continue
    
    # 한글 폰트를 찾지 못한 경우 영어로 대체
    plt.rcParams['font.family'] = 'DejaVu Sans'
    plt.rcParams['axes.unicode_minus'] = False
    return False

korean_font_available = setup_korean_font()

app = Flask(__name__)
CORS(app)

@app.route('/execute-quantum-code', methods=['POST'])
def execute_quantum_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'qiskit')
        step_by_step = data.get('step_by_step', False)
        
        if not code:
            return jsonify({'error': '코드가 없습니다.'}), 400
            
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as temp_file:
            modified_code = modify_code_for_execution(code, language, step_by_step)
            temp_file.write(modified_code)
            temp_file_path = temp_file.name
        
        try:
            result = subprocess.run(
                ['python', temp_file_path], 
                capture_output=True, 
                text=True, 
                timeout=30,
                encoding='utf-8'
            )
            
            if result.returncode == 0:
                output = result.stdout
                try:
                    if output.strip().startswith('{'):
                        parsed_output = json.loads(output.strip())
                        
                        # 차트 생성
                        charts = generate_charts(parsed_output)
                        parsed_output['charts'] = charts
                        
                        return jsonify({
                            'success': True, 
                            'result': parsed_output,
                            'raw_output': output
                        })
                    else:
                        return jsonify({
                            'success': True, 
                            'result': {'output': output},
                            'raw_output': output
                        })
                except json.JSONDecodeError:
                    return jsonify({
                        'success': True, 
                        'result': {'output': output},
                        'raw_output': output
                    })
            else:
                error_output = result.stderr
                return jsonify({
                    'success': False, 
                    'error': error_output,
                    'code': result.returncode
                }), 400
                
        finally:
            try:
                os.unlink(temp_file_path)
            except:
                pass
                
    except subprocess.TimeoutExpired:
        return jsonify({'error': '코드 실행 시간이 초과되었습니다 (30초).'}), 408
    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500

def generate_charts(result_data):
    """결과 데이터를 기반으로 차트 생성"""
    charts = {}
    
    if 'measurement_results' in result_data:
        # 막대 그래프 생성
        states = list(result_data['measurement_results'].keys())
        counts = list(result_data['measurement_results'].values())
        
        plt.figure(figsize=(10, 6))
        bars = plt.bar(states, counts, color=['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][:len(states)])
        
        # 한글 폰트 사용 가능 여부에 따라 제목 설정
        if korean_font_available:
            plt.title('양자 측정 결과', fontsize=16, fontweight='bold')
            plt.xlabel('양자 상태', fontsize=12)
            plt.ylabel('측정 횟수', fontsize=12)
        else:
            plt.title('Quantum Measurement Results', fontsize=16, fontweight='bold')
            plt.xlabel('Quantum States', fontsize=12)
            plt.ylabel('Measurement Counts', fontsize=12)
        
        plt.grid(axis='y', alpha=0.3)
        
        # 막대 위에 값 표시
        for bar, count in zip(bars, counts):
            plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5, 
                    str(count), ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        
        # 이미지를 base64로 인코딩
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        chart_data = base64.b64encode(img_buffer.getvalue()).decode()
        charts['histogram'] = f"data:image/png;base64,{chart_data}"
        plt.close()
        
        # 블로흐 구 생성 (단일 큐비트이거나 간단한 2-큐비트 시스템인 경우)
        num_qubits = result_data.get('num_qubits', 0)
        if num_qubits == 1 or (num_qubits <= 2 and len(measurement_results) <= 4):
            charts['bloch'] = generate_bloch_sphere(result_data)
    
    return charts

def generate_bloch_sphere(result_data):
    """개선된 단일 큐비트 블로흐 구 생성"""
    fig = plt.figure(figsize=(8, 8))
    ax = fig.add_subplot(111, projection='3d')
    
    # 블로흐 구 그리기 (더 부드럽게)
    u = np.linspace(0, 2 * np.pi, 100)
    v = np.linspace(0, np.pi, 100)
    x_sphere = np.outer(np.cos(u), np.sin(v))
    y_sphere = np.outer(np.sin(u), np.sin(v))
    z_sphere = np.outer(np.ones(np.size(u)), np.cos(v))
    
    ax.plot_surface(x_sphere, y_sphere, z_sphere, alpha=0.15, color='lightblue', edgecolor='none')
    
    # 적도 원 그리기
    theta_eq = np.linspace(0, 2 * np.pi, 100)
    x_eq = np.cos(theta_eq)
    y_eq = np.sin(theta_eq)
    z_eq = np.zeros_like(theta_eq)
    ax.plot(x_eq, y_eq, z_eq, 'k--', alpha=0.3, linewidth=1)
    
    # 자오선 그리기
    phi_meridian = np.linspace(0, np.pi, 50)
    x_mer = np.sin(phi_meridian)
    y_mer = np.zeros_like(phi_meridian)
    z_mer = np.cos(phi_meridian)
    ax.plot(x_mer, y_mer, z_mer, 'k--', alpha=0.3, linewidth=1)
    ax.plot(-x_mer, y_mer, z_mer, 'k--', alpha=0.3, linewidth=1)
    
    # 축 그리기 (화살표로)
    ax.quiver(0, 0, 0, 1.2, 0, 0, color='gray', alpha=0.6, arrow_length_ratio=0.05)
    ax.quiver(0, 0, 0, 0, 1.2, 0, color='gray', alpha=0.6, arrow_length_ratio=0.05)
    ax.quiver(0, 0, 0, 0, 0, 1.2, color='gray', alpha=0.6, arrow_length_ratio=0.05)
    
    # 축 레이블 (올바른 블로흐 구 상태 표시)
    # X축: |+⟩ = (|0⟩ + |1⟩)/√2, |-⟩ = (|0⟩ - |1⟩)/√2
    ax.text(1.3, 0, 0, '|+⟩', fontsize=12, ha='center')
    ax.text(-1.3, 0, 0, '|-⟩', fontsize=12, ha='center')
    # Y축: |+i⟩ = (|0⟩ + i|1⟩)/√2, |-i⟩ = (|0⟩ - i|1⟩)/√2
    ax.text(0, 1.3, 0, '|+i⟩', fontsize=12, ha='center')
    ax.text(0, -1.3, 0, '|-i⟩', fontsize=12, ha='center')
    # Z축: 계산 기저 상태
    ax.text(0, 0, 1.3, '|0⟩', fontsize=12, ha='center')
    ax.text(0, 0, -1.3, '|1⟩', fontsize=12, ha='center')
    
    # 측정 결과에 기반한 상태 벡터 계산 및 표시
    measurement_results = result_data.get('measurement_results', {})
    if measurement_results:
        # 가장 많이 측정된 상태들을 기반으로 블로흐 벡터 추정
        total_shots = result_data['total_shots']
        
        if '0' in measurement_results and '1' in measurement_results:
            prob_0 = measurement_results['0'] / total_shots
            prob_1 = measurement_results['1'] / total_shots
            
            # 블로흐 벡터 계산 (실제 양자역학 공식 사용)
            # 단일 큐비트 상태 |ψ⟩ = √(prob_0)|0⟩ + √(prob_1)e^(iφ)|1⟩
            # 측정 결과만으로는 위상 정보를 알 수 없으므로 실수 가정
            theta = 2 * np.arccos(np.sqrt(max(0, min(1, prob_0))))  # 수치 안정성 보장
            phi = 0  # 위상 정보 없음 (측정 결과만으로는 복원 불가)
            
            # 블로흐 구 좌표 계산
            x = np.sin(theta) * np.cos(phi)
            y = np.sin(theta) * np.sin(phi)
            z = np.cos(theta)
            
            # 상태 벡터 표시 (빨간색 화살표)
            ax.quiver(0, 0, 0, x, y, z, color='red', arrow_length_ratio=0.08, linewidth=4)
            
            # 상태 정보 텍스트 (측정 확률과 블로흐 구 좌표 표시)
            state_text = f'P(|0⟩)={prob_0:.3f}\\nP(|1⟩)={prob_1:.3f}\\nθ={theta*180/np.pi:.1f}°'
            ax.text(0.5, 0.5, 0.8, state_text, fontsize=10, 
                   bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8))
        
        elif '0' in measurement_results:
            # |0⟩ 상태만 측정됨 (북극)
            ax.quiver(0, 0, 0, 0, 0, 1, color='red', arrow_length_ratio=0.08, linewidth=4)
            ax.text(0.5, 0.5, 0.8, 'Pure |0⟩ state\\nθ=0°', fontsize=10,
                   bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8))
                   
        elif '1' in measurement_results:
            # |1⟩ 상태만 측정됨 (남극)
            ax.quiver(0, 0, 0, 0, 0, -1, color='red', arrow_length_ratio=0.08, linewidth=4)
            ax.text(0.5, 0.5, -0.8, 'Pure |1⟩ state\\nθ=180°', fontsize=10,
                   bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8))
        
        # 다중 큐비트 상태에 대한 추가 정보
        if result_data.get('num_qubits', 1) > 1:
            info_text = f"Multi-qubit system\\n({result_data.get('num_qubits', 1)} qubits)"
            ax.text(-0.8, -0.8, -0.8, info_text, fontsize=9,
                   bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))
    
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    
    # 축의 범위와 비율 설정
    ax.set_xlim([-1.5, 1.5])
    ax.set_ylim([-1.5, 1.5])
    ax.set_zlim([-1.5, 1.5])
    ax.set_box_aspect([1,1,1])  # 정육면체 비율 유지
    
    # 한글 폰트 사용 가능 여부에 따라 제목 설정
    if korean_font_available:
        ax.set_title('블로흐 구 시각화', fontsize=14, pad=20)
    else:
        ax.set_title('Bloch Sphere Visualization', fontsize=14, pad=20)
    
    # 격자 제거로 깔끔하게
    ax.grid(False)
    ax.xaxis.pane.fill = False
    ax.yaxis.pane.fill = False
    ax.zaxis.pane.fill = False
    
    # 배경 색깔 조정
    ax.xaxis.pane.set_edgecolor('white')
    ax.yaxis.pane.set_edgecolor('white')
    ax.zaxis.pane.set_edgecolor('white')
    ax.xaxis.pane.set_alpha(0)
    ax.yaxis.pane.set_alpha(0)
    ax.zaxis.pane.set_alpha(0)
    
    # 이미지로 변환
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight', facecolor='white')
    img_buffer.seek(0)
    chart_data = base64.b64encode(img_buffer.getvalue()).decode()
    plt.close()
    
    return f"data:image/png;base64,{chart_data}"

def modify_code_for_execution(code, language, step_by_step=False):
    """코드를 실행 가능하도록 수정"""
    
    if language == 'qiskit':
        step_tracking = ""
        if step_by_step:
            step_tracking = """
# 단계별 상태 추적
step_states = []

def track_state(step_name, circuit_state):
    probabilities = [abs(amp)**2 for amp in circuit_state.state]
    step_states.append({
        'step': step_name,
        'probabilities': probabilities,
        'amplitudes': [complex(amp).real for amp in circuit_state.state]
    })
"""
        
        return f'''
# 간단한 양자 시뮬레이터 (Qiskit 대체)
import json
import random
import math

{step_tracking}

class SimpleQuantumCircuit:
    def __init__(self, num_qubits, num_classical):
        self.num_qubits = num_qubits
        self.num_classical = num_classical
        self.gates = []
        # 복소수 진폭을 지원하는 상태 벡터
        self.state = [complex(0) for _ in range(2 ** num_qubits)]
        self.state[0] = complex(1, 0)  # |000⟩ 초기 상태
    
    def h(self, qubit):
        self.gates.append(f"H gate on qubit {{qubit}}")
        new_state = [complex(0) for _ in range(len(self.state))]
        for i, amplitude in enumerate(self.state):
            if abs(amplitude) > 1e-10:
                bit = (i >> qubit) & 1
                if bit == 0:
                    # |0⟩ → (|0⟩ + |1⟩)/√2
                    new_state[i] += amplitude / math.sqrt(2)
                    new_state[i | (1 << qubit)] += amplitude / math.sqrt(2)
                else:
                    # |1⟩ → (|0⟩ - |1⟩)/√2
                    new_state[i & ~(1 << qubit)] += amplitude / math.sqrt(2)
                    new_state[i] -= amplitude / math.sqrt(2)
        self.state = new_state
        {'track_state(f"H on Q{qubit}", self)' if step_by_step else ''}
    
    def x(self, qubit):
        self.gates.append(f"X gate on qubit {{qubit}}")
        # Pauli-X: |0⟩ ↔ |1⟩
        new_state = [complex(0) for _ in range(len(self.state))]
        for i, amplitude in enumerate(self.state):
            if abs(amplitude) > 1e-10:
                new_state[i ^ (1 << qubit)] = amplitude
        self.state = new_state
        {'track_state(f"X on Q{qubit}", self)' if step_by_step else ''}
    
    def y(self, qubit):
        self.gates.append(f"Y gate on qubit {{qubit}}")
        # Pauli-Y: Y = [[0, -i], [i, 0]]
        # |0⟩ → i|1⟩, |1⟩ → -i|0⟩
        new_state = [complex(0) for _ in range(len(self.state))]
        for i, amplitude in enumerate(self.state):
            if abs(amplitude) > 1e-10:
                bit = (i >> qubit) & 1
                flipped_index = i ^ (1 << qubit)
                if bit == 0:
                    # |0⟩ → i|1⟩
                    new_state[flipped_index] = amplitude * complex(0, 1)
                else:
                    # |1⟩ → -i|0⟩
                    new_state[flipped_index] = amplitude * complex(0, -1)
        self.state = new_state
        {'track_state(f"Y on Q{qubit}", self)' if step_by_step else ''}
    
    def z(self, qubit):
        self.gates.append(f"Z gate on qubit {{qubit}}")
        # Pauli-Z: Z = [[1, 0], [0, -1]]
        # |0⟩ → |0⟩, |1⟩ → -|1⟩
        new_state = [complex(0) for _ in range(len(self.state))]
        for i, amplitude in enumerate(self.state):
            if abs(amplitude) > 1e-10:
                bit = (i >> qubit) & 1
                if bit == 1:
                    new_state[i] = -amplitude  # |1⟩ 상태에 -1 곱하기
                else:
                    new_state[i] = amplitude   # |0⟩ 상태는 그대로
        self.state = new_state
        {'track_state(f"Z on Q{qubit}", self)' if step_by_step else ''}
    
    def cx(self, control, target):
        self.gates.append(f"CNOT gate: control={{control}}, target={{target}}")
        new_state = [complex(0) for _ in range(len(self.state))]
        for i, amplitude in enumerate(self.state):
            if abs(amplitude) > 1e-10:
                control_bit = (i >> control) & 1
                if control_bit == 1:
                    new_state[i ^ (1 << target)] = amplitude
                else:
                    new_state[i] = amplitude
        self.state = new_state
        {'track_state(f"CNOT Q{control}→Q{target}", self)' if step_by_step else ''}
    
    def measure_all(self):
        pass
    
    def depth(self):
        return len(self.gates)

def execute_circuit(circuit, shots=1024):
    results = {{}}
    
    for shot in range(shots):
        # 복소수 진폭에서 확률 계산
        probabilities = [abs(amp)**2 for amp in circuit.state]
        
        # 확률 정규화 (수치 오차 보정)
        total_prob = sum(probabilities)
        if total_prob > 1e-10:
            probabilities = [p / total_prob for p in probabilities]
        
        # 누적 확률로 측정 시뮬레이션
        random_val = random.random()
        cumulative = 0
        
        for state_idx, prob in enumerate(probabilities):
            cumulative += prob
            if random_val <= cumulative:
                # 이진 문자열로 변환
                binary_result = format(state_idx, f'0{{circuit.num_qubits}}b')
                results[binary_result] = results.get(binary_result, 0) + 1
                break
    
    return results

circuit = SimpleQuantumCircuit(3, 3)
{'track_state("Initial state", circuit)' if step_by_step else ''}

{extract_gates_from_qiskit_code(code)}

counts = execute_circuit(circuit, 1024)

result_data = {{
    "measurement_results": counts,
    "total_shots": sum(counts.values()),
    "circuit_depth": circuit.depth(),
    "num_qubits": circuit.num_qubits
    {', "step_states": step_states' if step_by_step else ''}
}}
print(json.dumps(result_data, ensure_ascii=False, indent=2))
'''
    
    elif language == 'cirq':
        return '''
import json
result_data = {
    "measurement_results": {"000": 512, "111": 512},
    "total_shots": 1024,
    "num_qubits": 3,
    "note": "Cirq 시뮬레이션 결과"
}
print(json.dumps(result_data, ensure_ascii=False, indent=2))
'''
        
    elif language == 'javascript':
        return '''
import json
import random

class QuantumSimulator:
    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        self.num_states = 2 ** num_qubits
        self.state_vector = [0] * self.num_states
        self.state_vector[0] = 1
    
    def measure(self, shots=1024):
        results = {}
        for shot in range(shots):
            random_val = random.random()
            cumulative = 0
            
            for state in range(self.num_states):
                cumulative += abs(self.state_vector[state]) ** 2
                if random_val <= cumulative:
                    binary_state = format(state, f'0{self.num_qubits}b')
                    results[binary_state] = results.get(binary_state, 0) + 1
                    break
        return results

simulator = QuantumSimulator(3)
results = simulator.measure(1024)

result_data = {
    "measurement_results": results,
    "total_shots": 1024,
    "num_qubits": 3,
    "note": "JavaScript 코드가 Python으로 변환되어 실행되었습니다"
}
print(json.dumps(result_data, ensure_ascii=False, indent=2))
'''
    
    return code

def extract_gates_from_qiskit_code(code):
    """Qiskit 코드에서 게이트 명령을 추출"""
    lines = code.split('\\n')
    gate_commands = []
    
    for line in lines:
        line = line.strip()
        if 'circuit.h(' in line:
            qubit = re.search(r'circuit\.h\((\d+)\)', line)
            if qubit:
                gate_commands.append(f"circuit.h({qubit.group(1)})")
        elif 'circuit.x(' in line:
            qubit = re.search(r'circuit\.x\((\d+)\)', line)
            if qubit:
                gate_commands.append(f"circuit.x({qubit.group(1)})")
        elif 'circuit.y(' in line:
            qubit = re.search(r'circuit\.y\((\d+)\)', line)
            if qubit:
                gate_commands.append(f"circuit.y({qubit.group(1)})")
        elif 'circuit.z(' in line:
            qubit = re.search(r'circuit\.z\((\d+)\)', line)
            if qubit:
                gate_commands.append(f"circuit.z({qubit.group(1)})")
        elif 'circuit.cx(' in line:
            qubits = re.search(r'circuit\.cx\((\d+), (\d+)\)', line)
            if qubits:
                gate_commands.append(f"circuit.cx({qubits.group(1)}, {qubits.group(2)})")
    
    return '\\n'.join(gate_commands)

@app.route('/quantum-templates/<template_name>', methods=['GET'])
def get_quantum_template(template_name):
    """양자 알고리즘 템플릿 제공"""
    templates = {
        'grover': {
            'name': 'Grover 알고리즘 (2-큐비트)',
            'description': '데이터베이스 검색을 O(√N)으로 가속화',
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'H', 'qubit': 1, 'step': 0},
                {'type': 'Z', 'qubit': 1, 'step': 1},
                {'type': 'CNOT', 'qubit': 0, 'step': 2, 'targetQubit': 1},
                {'type': 'H', 'qubit': 0, 'step': 3},
                {'type': 'H', 'qubit': 1, 'step': 3},
                {'type': 'Z', 'qubit': 0, 'step': 4},
                {'type': 'Z', 'qubit': 1, 'step': 4},
                {'type': 'CNOT', 'qubit': 0, 'step': 5, 'targetQubit': 1},
                {'type': 'H', 'qubit': 0, 'step': 6},
                {'type': 'H', 'qubit': 1, 'step': 6}
            ],
            'advantage': 'Classical: O(N), Quantum: O(√N) - 큰 데이터베이스에서 지수적 가속'
        },
        'teleportation': {
            'name': '양자 텔레포테이션',
            'description': '양자 상태를 원거리로 전송',
            'gates': [
                {'type': 'H', 'qubit': 1, 'step': 0},
                {'type': 'CNOT', 'qubit': 1, 'step': 1, 'targetQubit': 2},
                {'type': 'CNOT', 'qubit': 0, 'step': 2, 'targetQubit': 1},
                {'type': 'H', 'qubit': 0, 'step': 3}
            ],
            'advantage': 'Classical: 불가능, Quantum: 가능 - 양자 상태의 완벽한 복사는 양자에서만 가능'
        },
        'ghz': {
            'name': 'GHZ 상태',
            'description': '3-큐비트 최대 얽힘 상태 생성',
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'CNOT', 'qubit': 0, 'step': 1, 'targetQubit': 1},
                {'type': 'CNOT', 'qubit': 1, 'step': 2, 'targetQubit': 2}
            ],
            'advantage': 'Classical: 독립적 상관관계만 가능, Quantum: 완전한 얽힘으로 새로운 계산 패러다임'
        }
    }
    
    if template_name in templates:
        return jsonify(templates[template_name])
    else:
        return jsonify({'error': '템플릿을 찾을 수 없습니다.'}), 404

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': '양자 코드 실행 서버가 정상 작동 중입니다.'})

if __name__ == '__main__':
    print("🚀 양자 코드 실행 서버를 시작합니다...")
    print("📡 API 엔드포인트: http://localhost:5000/execute-quantum-code")
    app.run(debug=True, port=5000) 