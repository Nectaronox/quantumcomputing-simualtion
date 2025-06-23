from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import random
import math

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '양자 시뮬레이션 백엔드 서버',
        'status': 'running',
        'endpoints': [
            '/execute-quantum-code',
            '/quantum-templates/<template_name>',
            '/health'
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
        
        # 간단한 양자 시뮬레이션 실행
        result = simulate_quantum_code(code, language)
        return jsonify({
            'success': True,
            'result': result,
            'raw_output': json.dumps(result)
        })
        
    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500

def simulate_quantum_code(code, language):
    """간단한 양자 시뮬레이션"""
    try:
        # 기본 양자 회로 시뮬레이션
        qubits = 2  # 2-큐비트 시뮬레이션
        
        # 간단한 측정 결과 생성
        states = ['00', '01', '10', '11']
        counts = {}
        
        # 코드에 따른 결과 시뮬레이션
        if 'h(' in code.lower():  # Hadamard 게이트가 있으면
            # 균등 분포
            for state in states:
                counts[state] = random.randint(200, 300)
        elif 'x(' in code.lower():  # X 게이트가 있으면
            # 비트 플립 결과
            counts['11'] = random.randint(400, 500)
            counts['00'] = random.randint(50, 150)
            counts['01'] = random.randint(50, 150)
            counts['10'] = random.randint(50, 150)
        elif 'cx(' in code.lower() or 'cnot' in code.lower():  # CNOT 게이트
            # 얽힘 상태 시뮬레이션
            counts['00'] = random.randint(450, 550)
            counts['11'] = random.randint(450, 550)
            counts['01'] = random.randint(0, 50)
            counts['10'] = random.randint(0, 50)
        else:
            # 기본 상태 |00⟩
            counts['00'] = random.randint(800, 1000)
            counts['01'] = random.randint(0, 50)
            counts['10'] = random.randint(0, 50)
            counts['11'] = random.randint(0, 50)
        
        # 게이트 분석
        detected_gates = []
        if 'h(' in code.lower():
            detected_gates.append('H')
        if 'x(' in code.lower():
            detected_gates.append('X')
        if 'y(' in code.lower():
            detected_gates.append('Y')
        if 'z(' in code.lower():
            detected_gates.append('Z')
        if 'cx(' in code.lower() or 'cnot' in code.lower():
            detected_gates.append('CNOT')
        
        return {
            'success': True,
            'counts': counts,
            'message': '양자 회로 시뮬레이션 완료',
            'qubits': qubits,
            'gates': detected_gates,
            'code_analysis': {
                'language': language,
                'gates_found': len(detected_gates),
                'has_measurement': 'measure' in code.lower()
            }
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'message': '시뮬레이션 중 오류 발생'
        }

@app.route('/quantum-templates/<template_name>', methods=['GET'])
def get_quantum_template(template_name):
    """양자 알고리즘 템플릿 제공"""
    templates = {
        'grover': {
            'name': 'Grover 알고리즘',
            'description': '데이터베이스 검색 가속화',
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'H', 'qubit': 1, 'step': 0},
                {'type': 'CNOT', 'qubit': 0, 'step': 1, 'targetQubit': 1}
            ],
            'advantage': 'Classical: O(N), Quantum: O(√N)'
        },
        'bell': {
            'name': '벨 상태',
            'description': '양자 얽힘 생성',
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'CNOT', 'qubit': 0, 'step': 1, 'targetQubit': 1}
            ],
            'advantage': '양자 얽힘을 통한 완전 상관관계'
        },
        'ghz': {
            'name': 'GHZ 상태',
            'description': '3-큐비트 최대 얽힘',
            'gates': [
                {'type': 'H', 'qubit': 0, 'step': 0},
                {'type': 'CNOT', 'qubit': 0, 'step': 1, 'targetQubit': 1},
                {'type': 'CNOT', 'qubit': 1, 'step': 2, 'targetQubit': 2}
            ],
            'advantage': '3-파티 얽힘 상태'
        }
    }
    
    if template_name in templates:
        return jsonify(templates[template_name])
    else:
        return jsonify({'error': '템플릿을 찾을 수 없습니다.'}), 404

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': '양자 코드 실행 서버가 정상 작동 중입니다.',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 