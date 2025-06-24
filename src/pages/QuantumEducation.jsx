import React, { useState } from 'react';

const QuantumEducation = () => {
  const [activeTab, setActiveTab] = useState('qubits');

  const tabs = [
    { id: 'qubits', label: '큐비트', icon: '⚡', color: 'from-blue-400 to-blue-600' },
    { id: 'gates', label: '게이트', icon: '🚪', color: 'from-purple-400 to-purple-600' },
    { id: 'algorithms', label: '양자 알고리즘', icon: '🧮', color: 'from-green-400 to-green-600' },
    { id: 'quantum-mechanics', label: '양자역학', icon: '🔬', color: 'from-red-400 to-red-600' }
  ];

  const qubitContent = {
    title: '큐비트 (Quantum Bit)',
    color: 'blue',
    sections: [
      {
        title: '🔬 큐비트란 무엇인가요?',
        content: `큐비트는 양자 컴퓨팅의 기본 정보 단위입니다. 일반 컴퓨터의 비트가 0 또는 1의 값만 가질 수 있는 반면, 큐비트는 0과 1의 상태를 동시에 가질 수 있습니다.`,
        highlight: '이를 "중첩(Superposition)"이라고 합니다.',
        type: 'basic'
      },
      {
        title: '🎯 중첩 (Superposition)',
        content: `큐비트는 |0⟩과 |1⟩ 상태의 확률적 조합으로 표현됩니다. 예를 들어, α|0⟩ + β|1⟩ 형태로 나타낼 수 있으며, 여기서 |α|² + |β|² = 1 입니다.`,
        example: '동전을 던지는 순간을 생각해보세요. 공중에서 회전하는 동안 앞면과 뒷면이 동시에 존재하는 것과 비슷합니다.',
        type: 'concept'
      },
      {
        title: '🔗 얽힘 (Entanglement)',
        content: `두 개 이상의 큐비트가 양자적으로 연결된 상태입니다. 한 큐비트의 측정이 다른 큐비트의 상태를 즉시 결정합니다.`,
        highlight: '아인슈타인이 "유령 같은 원격 작용"이라고 불렀던 현상입니다.',
        type: 'advanced'
      },
      {
        title: '🔒 큐비트 보존의 중요성',
        content: `양자정보를 보존한다는 것은 다음 세 가지를 모두 만족시키는 것을 뜻합니다:

(i) 상태가 에너지 바닥 혹은 준안정 "저소음" 준위에 머물러 T₁(에너지 수명)이 길고,
(ii) 위상이 외부 잡음에 깨지지 않아 T₂(위상수명)이 길며,
(iii) 오류가 생겨도 양자 오류 정정(QEC)이 논리적 차원에서 복구해주는 것

큐비트를 보존해야만 온전하게 사용할 수 있기 때문에 보존 기술은 매우 중요합니다.`,
        highlight: '큐비트의 수명이 길수록 더 복잡한 양자 연산이 가능합니다.',
        type: 'technical'
      },
      {
        title: '⚗️ 큐비트 보존 방법들',
        content: `현재 사용되는 주요 큐비트 보존 방법들:

1. 이온 트랩: 10⁻¹¹ Torr 초고진공 환경에서 레이저 냉각과 RF/펜닝 전자기장으로 Ca⁺, Yb⁺ 등의 이온을 공간에 고정 (수명: 수 초~분)

2. 초전도 큐비트: 희귀금속 회로를 10mK 희석냉동기에 장착하고 마이크로파 펄스로 제어 (수명: 100μs)

3. 다이아몬드 NV 센터: 탄소 격자 안의 질소 공공 결함을 이용 (수명: 100ms)

4. 실리콘 양자점: 반도체 기술과 호환 가능한 전자 스핀 큐비트`,
        highlight: '각 방법마다 장단점이 있으며, 보존 기술의 발전이 양자컴퓨터 실용화의 핵심입니다.',
        type: 'technical'
      },
      {
        title: '🔢 큐비트 순서와 Big-endian 방식',
        content: `양자 컴퓨터 프로그래밍에서 큐비트 순서는 매우 중요한 개념입니다. 본 시뮬레이터는 직관적인 "big-endian" 순서를 사용합니다.

🔹 Big-endian이란?
- Q0가 최상위 비트 (맨 왼쪽)
- Q1이 그 다음 비트
- Q2가 그 다음 비트... (최하위로 갈수록)

🔹 실제 예시:
- 측정 결과 "101" = |Q0=1, Q1=0, Q2=1⟩
- 즉, Q0Q1Q2 순서로 읽으면 됩니다
- 이는 이진수 101₂ = 5₁₀와 같은 값입니다

🔹 다른 시스템과의 차이:
- 일부 시스템은 little-endian을 사용 (Q0가 오른쪽/최하위)
- Big-endian은 일반적인 이진수 표기법과 동일해 더 직관적

🔹 실무에서의 중요성:
- 다중 큐비트 게이트 적용 순서
- 측정 결과 해석
- 상태 벡터 인덱싱
- 양자 알고리즘 구현 시 정확성

이 순서를 정확히 이해하면 양자 프로그래밍이 훨씬 직관적이 됩니다!`,
        highlight: 'Big-endian 방식은 일반적인 이진수 표기법과 동일해 직관적이고 이해하기 쉽습니다.',
        type: 'technical'
      }
    ]
  };

  const gateContent = {
    title: '양자 게이트 (Quantum Gates)',
    sections: [
      {
        title: '🚪 양자 게이트란?',
        content: `양자 게이트는 큐비트의 상태를 변환하는 연산입니다. 일반 컴퓨터의 논리 게이트와 유사하지만, 확률적이고 가역적이며 유니타리 행렬로 표현됩니다.`,
        gates: [
          { 
            name: 'Hadamard (H)', 
            symbol: 'H', 
            description: '큐비트를 중첩 상태로 만듭니다. |0⟩ → (|0⟩ + |1⟩)/√2, |1⟩ → (|0⟩ - |1⟩)/√2',
            matrix: 'H = (1/√2)[[1, 1], [1, -1]]'
          },
          { 
            name: 'Pauli-X', 
            symbol: 'X', 
            description: '큐비트를 뒤집습니다. |0⟩ ↔ |1⟩ (양자 NOT 게이트)',
            matrix: 'X = [[0, 1], [1, 0]]'
          },
          { 
            name: 'Pauli-Y', 
            symbol: 'Y', 
            description: 'Y축을 중심으로 한 π 회전입니다. |0⟩ → i|1⟩, |1⟩ → -i|0⟩',
            matrix: 'Y = [[0, -i], [i, 0]]'
          },
          { 
            name: 'Pauli-Z', 
            symbol: 'Z', 
            description: '|1⟩ 상태의 위상을 바꿉니다. |0⟩ → |0⟩, |1⟩ → -|1⟩',
            matrix: 'Z = [[1, 0], [0, -1]]'
          },
          { 
            name: 'CNOT', 
            symbol: '⊕', 
            description: '조건부 NOT. 제어 큐비트가 |1⟩일 때만 타겟 큐비트를 뒤집습니다.',
            matrix: 'CNOT = [[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]'
          }
        ]
      },
      {
        title: '🌟 Hadamard 게이트 - 중첩의 마법사',
        content: `Hadamard 게이트는 양자 컴퓨팅의 핵심이 되는 게이트입니다. 이 게이트가 없다면 양자 컴퓨터의 장점을 전혀 활용할 수 없을 정도로 중요합니다!

🎯 기본 동작
• |0⟩ → (|0⟩ + |1⟩)/√2  (50% 확률로 0 또는 1)
• |1⟩ → (|0⟩ - |1⟩)/√2  (50% 확률로 0 또는 1, 하지만 위상이 다름)

🔍 깊이 들어가보기
Hadamard 게이트의 수학적 표현:
H = (1/√2) × [[1, 1], [1, -1]]

이 행렬을 두 번 적용하면? 놀랍게도 원래 상태로 돌아옵니다! 즉, H × H = I (항등 행렬)

🌈 시각적 이해
블로흐 구(Bloch Sphere)에서 보면, Hadamard 게이트는 X축과 Z축을 동시에 고려한 복합 회전입니다. 
• |0⟩ (북극) → X축 방향으로 회전
• |1⟩ (남극) → -X축 방향으로 회전

🚀 실제 응용
• 양자 알고리즘의 첫 단계에서 중첩 상태 생성
• 그로버 알고리즘의 확산 연산자
• 양자 푸리에 변환의 핵심 구성 요소
• 양자 텔레포테이션 프로토콜

💡 흥미로운 특성
• 자기 자신의 역함수: H⁻¹ = H
• 유니타리이면서 에르미트: H† = H
• 고유값: +1, -1 (각각 |+⟩, |-⟩ 상태에 대응)`,
        highlight: 'Hadamard 게이트는 양자 컴퓨팅에서 중첩과 간섭을 활용하는 모든 알고리즘의 기초입니다.',
        technical_note: '두 개의 Hadamard 게이트를 연속으로 적용하면 원래 상태로 돌아갑니다: H(H|ψ⟩) = |ψ⟩'
      },
      {
        title: '🔗 CNOT 게이트 - 얽힘의 건축가',
        content: `CNOT(Controlled-NOT) 게이트는 양자 얽힘을 만드는 가장 중요한 2큐비트 게이트입니다. 양자 컴퓨팅의 진정한 힘은 이 게이트에서 시작됩니다!

🎯 기본 동작
제어 큐비트(Control)의 상태에 따라 타겟 큐비트(Target)를 조건부로 뒤집습니다:
• |00⟩ → |00⟩  (제어가 0이면 아무것도 안 함)
• |01⟩ → |01⟩  (제어가 0이면 아무것도 안 함)
• |10⟩ → |11⟩  (제어가 1이면 타겟을 뒤집음)
• |11⟩ → |10⟩  (제어가 1이면 타겟을 뒤집음)

🔍 수학적 표현
CNOT = [[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]

이를 기저 상태로 표현하면:
CNOT = |00⟩⟨00| + |01⟩⟨01| + |11⟩⟨10| + |10⟩⟨11|

🌟 얽힘 생성의 마법
가장 흥미로운 예: |+0⟩ 상태에 CNOT를 적용하면?
|+0⟩ = (|00⟩ + |10⟩)/√2
↓ CNOT 적용
(|00⟩ + |11⟩)/√2 = 벨 상태 (완전한 얽힘!)

이제 두 큐비트는 양자적으로 연결되어, 한 큐비트를 측정하면 다른 큐비트의 상태가 즉시 결정됩니다.

🛠️ 실제 응용
• 벨 상태와 GHZ 상태 생성
• 양자 오류 정정 코드
• 양자 텔레포테이션
• 모든 다중 큐비트 양자 알고리즘

🔄 흥미로운 특성
• 자기 자신의 역함수: CNOT⁻¹ = CNOT
• 클리퍼드 게이트 집합의 원소
• H 게이트와 함께 범용 양자 게이트 집합 구성
• 대칭성: 제어와 타겟을 바꿔도 Hadamard로 변환 가능

🎨 시각적 표현
회로도에서 CNOT는 다음과 같이 표현됩니다:
제어 큐비트: ●——————
타겟 큐비트: ———————⊕

여기서 ●는 제어, ⊕는 타겟을 의미합니다.`,
        highlight: 'CNOT 게이트는 양자 얽힘을 만들어 양자 컴퓨터가 고전 컴퓨터보다 강력해지는 핵심 메커니즘입니다.',
        technical_note: 'CNOT와 단일 큐비트 회전 게이트만으로도 모든 양자 연산을 구현할 수 있습니다 (범용성).'
      },
      {
        title: '⚙️ 고전 논리 게이트와의 비교',
        content: `양자 게이트를 이해하기 위해 익숙한 고전 논리 게이트들과 비교해보겠습니다. 고전 게이트는 확정적이지만, 양자 게이트는 확률적이고 가역적입니다.

🔌 기본 고전 게이트들

1️⃣ NOT 게이트 (인버터)
• 입력: 0 → 출력: 1
• 입력: 1 → 출력: 0
• 양자 버전: Pauli-X 게이트와 동일!

2️⃣ AND 게이트
• 입력: 00 → 출력: 0
• 입력: 01 → 출력: 0  
• 입력: 10 → 출력: 0
• 입력: 11 → 출력: 1
• 특징: 두 입력이 모두 1일 때만 1 출력

3️⃣ OR 게이트
• 입력: 00 → 출력: 0
• 입력: 01 → 출력: 1
• 입력: 10 → 출력: 1  
• 입력: 11 → 출력: 1
• 특징: 하나 이상의 입력이 1이면 1 출력

4️⃣ XOR 게이트 (배타적 OR)
• 입력: 00 → 출력: 0
• 입력: 01 → 출력: 1
• 입력: 10 → 출력: 1
• 입력: 11 → 출력: 0
• 특징: 입력이 다를 때만 1 출력
• 양자 버전: CNOT 게이트의 고전적 부분!

5️⃣ NAND 게이트 (NOT-AND)
• 입력: 00 → 출력: 1
• 입력: 01 → 출력: 1
• 입력: 10 → 출력: 1
• 입력: 11 → 출력: 0
• 특징: AND의 반대, 범용 게이트 (모든 논리 함수 구현 가능)

6️⃣ NOR 게이트 (NOT-OR)  
• 입력: 00 → 출력: 1
• 입력: 01 → 출력: 0
• 입력: 10 → 출력: 0
• 입력: 11 → 출력: 0
• 특징: OR의 반대, 역시 범용 게이트

🔄 가역 고전 게이트들

7️⃣ 프레드킨 게이트 (Fredkin Gate)
• 3비트 입력/출력의 가역 게이트
• 제어 비트가 1이면 두 타겟 비트를 교환
• 입력: abc → 출력: a(b⊕ac)(c⊕ab) (a가 제어)
• 양자 컴퓨팅에서 중요한 범용 가역 게이트

8️⃣ 토폴리 게이트 (Toffoli Gate)
• 3비트 입력/출력, 이중 제어 NOT
• 처음 두 비트가 모두 1일 때만 세 번째 비트를 뒤집음
• 입력: abc → 출력: ab(c⊕ab)
• NAND 게이트의 가역 버전으로 범용 게이트

⚡ 양자 vs 고전 게이트 비교

차이점:
• 고전: 확정적 → 양자: 확률적
• 고전: 일부 비가역 → 양자: 모두 가역
• 고전: 비트 복사 가능 → 양자: 복제 불가 정리
• 고전: 직렬 처리 → 양자: 병렬 중첩 처리

공통점:
• 정보 처리의 기본 단위
• 회로로 조합하여 복잡한 연산 구현
• 수학적 모델링 가능`,
        highlight: '고전 게이트는 확정적이고 일부는 비가역적이지만, 양자 게이트는 확률적이고 모두 가역적입니다.',
        technical_note: 'Toffoli와 Fredkin 게이트는 고전과 양자 컴퓨팅을 잇는 가역 게이트의 좋은 예시입니다.'
      },
      {
        title: '🎛️ 게이트의 특성',
        content: `모든 양자 게이트는 가역적(reversible)이며, 유니타리 행렬로 표현됩니다. 이는 정보의 손실 없이 연산을 되돌릴 수 있음을 의미합니다.`,
        highlight: '이러한 특성 때문에 양자 컴퓨터는 에너지 효율적일 수 있습니다.',
        technical_note: '유니타리 조건: U† U = I (여기서 U†는 에르미트 켤레)'
      }
    ]
  };

  const algorithmContent = {
    title: '대표적인 양자 알고리즘',
    sections: [
      {
        title: '🔍 Grover 알고리즘 - 양자 검색의 마법',
        content: `안녕하세요! 오늘은 양자 컴퓨팅의 스타 알고리즘 중 하나인 Grover 알고리즘에 대해 알아보겠습니다.

📚 문제 상황
여러분이 1억 개의 전화번호가 무작위로 저장된 전화번호부에서 특정 사람의 번호를 찾는다고 생각해보세요. 일반적인 컴퓨터라면 최악의 경우 1억 번을 모두 확인해야 할 수도 있습니다. 평균적으로는 5천만 번 정도 확인해야 하죠.

🚀 Grover의 천재적 아이디어
Grover는 1996년에 양자역학의 중첩과 간섭 현상을 이용해 이 문제를 획기적으로 해결했습니다. 놀랍게도 1억 개 중에서 찾으려면 약 1만 번(√1억)만 확인하면 됩니다!

🔧 작동 원리
1. 모든 항목을 중첩 상태로 만듭니다 (Hadamard 게이트 사용)
2. 찾는 항목에 "음의 위상"을 표시합니다 (Oracle 함수)
3. 평균 위상을 중심으로 증폭 연산을 수행합니다 (Diffusion 연산)
4. 2-3번을 √N번 반복합니다

이 과정을 통해 찾는 항목의 확률만 점점 증폭되어 측정했을 때 원하는 답이 나올 확률이 거의 100%가 됩니다!`,
        advantage: 'Classical: O(N) → Quantum: O(√N)',
        description: '데이터베이스 크기의 제곱근에 비례하는 시간만 필요합니다.',
        applications: ['데이터베이스 검색', '최적화 문제', '암호 해독', '기계학습', '조합 최적화'],
        realWorld: '구글, IBM 등에서 실제 양자 컴퓨터에서 구현하여 성능을 검증했습니다.'
      },
      {
        title: '📡 양자 텔레포테이션 - SF가 현실이 되다',
        content: `SF 영화에서나 보던 텔레포테이션이 양자 세계에서는 실제로 가능합니다! 물론 물질 자체를 순간이동시키는 것은 아니고, "정보"를 순간이동시키는 거예요.

🤔 그게 뭔가요?
양자 텔레포테이션은 한 장소의 양자 상태를 다른 장소로 "완벽하게" 전송하는 기술입니다. 마치 한 곳의 큐비트가 사라지면서 동시에 다른 곳에 똑같은 상태의 큐비트가 나타나는 것처럼 보입니다.

🔮 왜 특별한가요?
양자역학의 "복제 불가 정리"에 의하면 양자 상태는 완벽하게 복사할 수 없습니다. 하지만 텔레포테이션은 복사가 아니라 "이동"이기 때문에 가능합니다. 원본은 파괴되고 사본이 만들어지는 방식이죠.

🛠️ 작동 과정
1. Alice와 Bob이 얽힌 큐비트 쌍을 미리 공유합니다
2. Alice가 전송하려는 큐비트를 자신의 얽힌 큐비트와 측정합니다
3. 측정 결과를 일반 통신으로 Bob에게 알려줍니다
4. Bob이 측정 결과에 따라 자신의 큐비트에 적절한 연산을 적용합니다
5. 완성! Bob의 큐비트가 Alice의 원래 상태와 똑같아집니다

💫 흥미로운 사실
- 정보 전송 속도는 일반 통신에 의해 제한됩니다 (빛의 속도보다 빠르지 않음)
- 하지만 도청이 절대 불가능한 완벽한 보안 통신이 가능합니다!`,
        advantage: 'Classical: 불가능 → Quantum: 가능',
        description: '양자 상태의 완벽한 복사 없이 정보를 전송할 수 있습니다.',
        applications: ['양자 통신', '양자 인터넷', '양자 컴퓨터 연결', '양자 암호', '분산 양자 컴퓨팅'],
        realWorld: '중국이 위성을 이용해 1400km 거리에서 성공적으로 구현했습니다. 유럽에서는 양자 인터넷 구축 프로젝트가 진행 중입니다.'
      },
      {
        title: '🔐 Shor 알고리즘 - 암호의 종말?',
        content: `1994년 Peter Shor가 발표한 이 알고리즘은 전 세계 암호학자들에게 충격을 주었습니다. 현재 인터넷 보안의 근간인 RSA 암호를 무력화할 수 있기 때문입니다!

💳 RSA 암호의 비밀
여러분이 온라인 쇼핑을 할 때 신용카드 정보는 RSA 암호로 보호됩니다. 이 암호의 안전성은 "큰 수의 소인수분해는 어렵다"는 수학적 사실에 기반합니다.

예를 들어, 15 = 3 × 5 는 쉽게 분해할 수 있지만, 2048비트 숫자(600자리 숫자!)의 소인수분해는 현재 컴퓨터로는 수십억 년이 걸립니다.

⚡ Shor의 혁신적 접근
Shor는 이 문제를 "주기 찾기" 문제로 바꾸고, 양자 푸리에 변환을 이용해 해결했습니다. 마치 복잡한 미로 문제를 다른 각도에서 보니 쉬운 길이 보이는 것과 같습니다!

🔄 작동 원리 (간단 버전)
1. 분해하려는 수 N과 서로소인 임의의 수 a를 선택
2. 양자 컴퓨터로 함수 f(x) = a^x mod N의 주기 r을 찾음
3. 주기 r을 이용해 N의 인수를 계산
4. 재귀적으로 완전히 소인수분해 완성

📊 성능 차이
- 고전 컴퓨터: 지수 시간 (2^n)
- 양자 컴퓨터: 다항 시간 (n³)

즉, 2048비트 RSA를 깨는데 고전 컴퓨터로는 현재 기술로 수십억 년이 걸리지만, 충분히 큰 결함 허용 양자 컴퓨터(약 수천만 개의 물리적 큐비트 필요)라면 몇 시간에서 며칠 내에 가능할 것으로 예상됩니다.

🛡️ 대응책은?
다행히 "양자 저항성 암호" 연구가 활발합니다. NIST(미국 표준기술연구소)에서는 이미 새로운 암호 표준을 발표했어요!`,
        advantage: 'Classical: 지수 시간 → Quantum: 다항 시간',
        description: 'RSA 암호 체계의 보안을 무력화할 수 있는 잠재력을 가지고 있습니다.',
        applications: ['암호 해독', '수학 문제 해결', '보안 시스템 평가', '블록체인 보안 분석'],
        realWorld: '구글과 IBM이 작은 숫자(15, 21 등)로 실험에 성공했습니다. 하지만 실용적인 Shor 알고리즘 구현을 위해서는 수백만 개의 물리적 큐비트가 필요하며, 현재 기술로는 아직 수십 년이 더 필요할 것으로 예상됩니다. 그럼에도 불구하고 이론적 위협 때문에 양자 저항성 암호 연구가 활발히 진행되고 있습니다.'
      },
      {
        title: '🔍 사이먼 알고리즘 - 숨겨진 주기의 발견자',
        content: `1994년 Daniel Simon이 개발한 사이먼 알고리즘은 양자 컴퓨팅 역사상 매우 중요한 위치를 차지합니다. 이 알고리즘은 Shor 알고리즘의 전신이 되었고, 양자 우월성을 보여준 첫 번째 사례 중 하나입니다!

🎯 문제 정의
숨겨진 주기(Hidden Period) 찾기 문제를 해결합니다:

주어진 조건:
• 함수 f: {0,1}ⁿ → {0,1}ⁿ
• 함수 f는 "비밀 문자열" s에 대해 다음 성질을 만족:
  f(x) = f(y) ⟺ y = x 또는 y = x ⊕ s
• 즉, f(x) = f(x⊕s) (여기서 ⊕는 XOR 연산)

목표: 이 비밀 문자열 s를 찾아라!

🔍 구체적인 예시
n = 3인 경우, s = "101"이라고 가정:
• f(000) = f(101) = A
• f(001) = f(100) = B  
• f(010) = f(111) = C
• f(011) = f(110) = D

패턴을 보면 x와 x⊕101의 함수값이 같습니다!

🚀 사이먼 알고리즘의 작동 원리

1단계: 중첩 상태 생성
• n개 큐비트에 Hadamard 게이트 적용
• |000...0⟩ → ∑|x⟩ (모든 가능한 x의 중첩)

2단계: 함수 f를 양자적으로 계산
• |x⟩|0⟩ → |x⟩|f(x)⟩
• 중첩상태에서 모든 x에 대해 동시에 계산!

3단계: 측정과 간섭
• 두 번째 레지스터(f(x))를 측정
• 같은 함수값을 가진 x들만 살아남음
• 예: f(x) = A를 측정하면 |000⟩ + |101⟩ 상태

4단계: Hadamard와 측정
• 첫 번째 레지스터에 다시 Hadamard 적용
• 측정 결과 y는 y·s = 0 (mod 2) 조건을 만족

5단계: 선형방정식 풀이
• 여러 번 반복해서 독립적인 y값들 수집
• y₁·s = 0, y₂·s = 0, ... 형태의 선형방정식계
• 이를 풀어서 s 결정!

📊 성능 비교
고전 알고리즘:
• 최악의 경우: O(2^(n/2)) 번의 함수 호출 필요
• n=100이면 약 2⁵⁰ ≈ 10¹⁵ 번 호출

사이먼 알고리즘:
• O(n) 번의 양자 함수 호출만 필요
• n=100이면 약 100번 호출!

💡 혁신적인 아이디어
1. 양자 병렬성 활용: 모든 입력을 동시에 처리
2. 양자 간섭 이용: 원하지 않는 정보는 상쇄
3. 확률적 측정: 숨겨진 구조만 드러냄

🔗 암호학적 응용
사이먼의 문제는 다음과 비슷한 구조입니다:
• 블록 암호의 키 복구
• 해시 함수의 충돌 찾기
• 대칭 암호 시스템 분석

🌟 역사적 중요성
• Shor 알고리즘의 핵심 아이디어 제공
• 양자 푸리에 변환의 암호학적 응용 시초
• 지수적 양자 가속화의 첫 사례
• 양자 우월성 논증의 기초

🛠️ 실제 구현의 어려움
이론적으로는 완벽하지만 실제로는:
• 노이즈에 매우 민감
• 많은 수의 큐비트 필요
• 정확한 함수 구현이 어려움

하지만 이론적 기여는 엄청납니다! 🎓`,
        advantage: 'Classical: O(2^(n/2)) → Quantum: O(n)',
        description: '숨겨진 주기성을 가진 함수에서 주기를 지수적으로 빠르게 찾을 수 있습니다.',
        applications: ['암호 분석', '대칭 키 복구', '해시 함수 분석', '블록 암호 공격', '주기성 검출'],
        realWorld: 'IBM과 구글에서 작은 크기의 사이먼 알고리즘을 실제 양자 컴퓨터에서 구현했습니다. 하지만 실용적인 암호 분석을 위해서는 훨씬 더 큰 규모의 결함 허용 양자 컴퓨터가 필요합니다.'
      },
      {
        title: '🌐 GHZ 상태 - 3개 이상 입자의 완벽한 얽힘',
        content: `1989년 Daniel Greenberger, Michael Horne, Anton Zeilinger가 발견한 GHZ 상태는 3개 이상의 입자가 만들 수 있는 가장 특별한 얽힘 상태입니다. 벨 상태가 2입자 얽힘의 대표라면, GHZ 상태는 다입자 얽힘의 왕이라고 할 수 있어요! 👑

🎯 GHZ 상태란?
3큐비트 GHZ 상태의 가장 간단한 형태:
|GHZ₃⟩ = (|000⟩ + |111⟩)/√2

이 상태는 놀라운 특성을 가지고 있습니다:
• 모든 큐비트가 한 번에 얽혀있음
• 하나를 측정하면 나머지 모두가 즉시 결정됨
• 부분적으로 측정해도 나머지는 여전히 얽혀있음

🔗 벨 상태와의 차이점
벨 상태 (2큐비트):
|Bell⟩ = (|00⟩ + |11⟩)/√2

GHZ 상태 (3큐비트):
|GHZ⟩ = (|000⟩ + |111⟩)/√2

언뜻 비슷해 보이지만 본질적으로 다릅니다!

🧪 측정의 신비로운 결과
GHZ 상태에서 첫 번째 큐비트를 측정하면:
• 50% 확률로 |0⟩ → 나머지는 |00⟩
• 50% 확률로 |1⟩ → 나머지는 |11⟩

하지만 첫 번째와 두 번째를 동시에 측정하면:
• |00⟩와 |11⟩만 나옴 (|01⟩, |10⟩는 절대 안 나옴!)

이는 단순한 확률론으로는 설명할 수 없는 양자적 특성입니다!

🛠️ GHZ 상태 만들기 (양자 회로)
3큐비트 GHZ 상태 생성 방법:

1단계: 초기 상태 |000⟩
2단계: 첫 번째 큐비트에 H 게이트
   → (|0⟩ + |1⟩)/√2 ⊗ |00⟩ = (|000⟩ + |100⟩)/√2
3단계: 첫 번째를 제어로 두 번째에 CNOT
   → (|000⟩ + |110⟩)/√2
4단계: 첫 번째를 제어로 세 번째에 CNOT
   → (|000⟩ + |111⟩)/√2 = |GHZ₃⟩

회로도로 표현하면:
Q₀: ——[H]——●——●——
Q₁: ——————— ⊕ ————————
Q₂: ——————————— ⊕ ——

🔬 GHZ 역설과 국소현실주의
GHZ 상태는 아인슈타인의 "국소현실주의"를 반박하는 강력한 도구입니다!

국소현실주의 예측:
만약 입자들이 미리 정해진 "숨겨진 변수"를 가진다면, 특정 측정 조합에서 항상 일관된 결과가 나와야 함.

양자역학 예측:
GHZ 상태에서는 이런 일관성이 완전히 깨짐!

실험 결과:
양자역학이 100% 맞았습니다! 🎯

📈 n-큐비트로 확장
GHZ 상태는 임의의 n개 큐비트로 확장 가능:
|GHZₙ⟩ = (|00...0⟩ + |11...1⟩)/√2

특성:
• n이 커질수록 얽힘이 더 복잡해짐
• 하나만 측정해도 전체 상태가 결정됨
• 국소현실주의 위반이 더 극명해짐

🌟 실제 응용 분야

1. 양자 센싱:
• n개 센서의 측정 정밀도를 √n배 향상
• 하이젠베르크 한계 달성

2. 양자 오류 정정:
• 3큐비트 비트 플립 코드의 기초
• 논리적 |0⟩ = |000⟩, 논리적 |1⟩ = |111⟩

3. 양자 통신:
• 다자간 비밀 공유 프로토콜
• 양자 회의 키 분배

4. 양자 컴퓨팅:
• 특정 알고리즘에서 리소스 상태로 활용
• 측정 기반 양자 컴퓨팅

💫 흥미로운 사실들
• GHZ 상태는 "극도로 깨지기 쉬움": 하나의 큐비트만 잃어도 얽힘이 완전히 사라짐
• 반면 벨 상태는 하나를 잃어도 나머지는 여전히 얽혀있음
• 이 차이는 양자 네트워크 설계에서 중요한 고려사항

🏆 실험적 성취
• 1998년: 3광자 GHZ 상태 최초 생성 (Zeilinger 그룹)
• 2004년: 8광자 GHZ 상태 생성
• 2017년: 18큐비트 GHZ 상태 달성 (중국 과학기술대학)
• 현재: 20개 이상의 큐비트로 확장 진행 중

GHZ 상태는 양자역학의 가장 깊은 비밀들을 담고 있는 특별한 상태입니다! 🌟`,
        advantage: 'Classical: 불가능 → Quantum: 완벽한 다입자 얽힘',
        description: '3개 이상의 큐비트를 완벽하게 얽어서 고전물리학으로는 불가능한 상관관계를 만들 수 있습니다.',
        applications: ['양자 센싱', '양자 오류 정정', '다자간 양자 통신', '양자 회의', '측정 기반 양자 컴퓨팅'],
        realWorld: '1998년 Zeilinger 그룹이 3광자 GHZ 상태를 최초로 생성했고, 현재는 20개 이상의 큐비트로 확장되었습니다. IBM, 구글, 중국 과학기술대학 등에서 다양한 플랫폼으로 GHZ 상태를 구현하고 있습니다.'
      }
    ]
  };

  const quantumMechanicsContent = {
    title: '양자역학',
    sections: [
      {
        title: '🌟 양자역학? 그게 뭔데요?',
        content: `안녕하세요! 오늘은 우리 모두가 한 번쯤은 들어봤지만 정말 이해하기 어려운 "양자역학"에 대해 이야기해보려고 합니다. 😊

💭 일상 속에서 만나는 양자역학
혹시 스마트폰을 쓰면서 "이게 어떻게 작동하는 거지?"라고 생각해본 적 있나요? 놀랍게도 여러분의 스마트폰 안에는 양자역학의 원리가 숨어있답니다! 반도체, LED, 레이저... 이 모든 것들이 양자역학 없이는 존재할 수 없어요.

🔬 양자역학의 핵심 아이디어
양자역학은 아주 작은 세계(원자보다 작은 세계)에서 일어나는 일들을 설명하는 물리학입니다. 우리가 살아가는 일상적인 세계와는 완전히 다른 규칙이 적용되는 신비로운 세계예요.

예를 들어볼까요? 우리 일상에서는:
- 동전이 앞면이거나 뒷면이거나 둘 중 하나죠
- 공은 한 곳에만 존재할 수 있어요
- 측정해도 물체의 상태는 변하지 않죠

하지만 양자 세계에서는:
- 동전이 앞면이면서 동시에 뒷면일 수 있어요! (중첩상태)
- 입자가 여러 곳에 동시에 존재할 수 있어요!
- 측정하는 순간 상태가 변해버려요!

🤯 "말이 안 돼!" 싶으시죠?
맞아요! 아인슈타인도 "신은 주사위를 던지지 않는다"며 양자역학을 받아들이기 어려워했습니다. 하지만 실험 결과는 양자역학이 맞다는 것을 계속 증명하고 있어요.

이게 바로 양자 컴퓨터가 특별한 이유입니다. 이런 "이상한" 양자역학의 성질들을 이용해서 기존 컴퓨터로는 불가능한 계산을 해내는 거예요!`,
        highlight: '양자역학은 우리 일상과는 전혀 다른 규칙이 적용되는 미시세계의 물리학입니다!'
      },

      {
        title: '🧪 슈테른-게를라흐 실험 - 스핀 양자화의 발견',
        content: `1922년, 독일의 물리학자 오토 슈테른과 발터 게를라흐가 수행한 이 실험은 양자역학 역사상 가장 중요한 실험 중 하나예요. 마치 탐정이 범인을 찾듯이, 이들은 원자의 비밀을 파헤쳤습니다! 🔍

🎯 실험의 목적
당시 과학자들은 "전자가 작은 자석처럼 행동한다"는 걸 알고 있었어요. 하지만 이 작은 자석(전자의 스핀)이 어떤 방향을 향하고 있는지는 몰랐죠.

만약 전자가 나침반 바늘처럼 모든 방향을 가리킬 수 있다면? 🧭
→ 자기장을 통과할 때 연속적인 곡선을 그리며 퍼져야 해요

만약 전자가 특정 방향만 가리킬 수 있다면? 📍
→ 몇 개의 점으로만 나타나야 해요

⚗️ 실험 설계 (천재적 아이디어!)
1. 은(Silver) 원자를 고온으로 가열해서 원자 빔을 만듦
2. 불균등한 자기장(한쪽은 N극, 한쪽은 S극)을 통과시킴
3. 스크린에 어떻게 찍히는지 관찰

🎲 예상 결과 vs 실제 결과
클래식한 예상: 은 원자들이 자기장에 의해 다양하게 굽어져서 스크린에 세로선 모양으로 찍힐 것

충격적인 실제 결과: 딱 두 개의 점만 찍혔어요! 위쪽 하나, 아래쪽 하나!

💥 이게 왜 충격적이었나요?
이 결과는 전자의 스핀이 "위" 또는 "아래" 두 가지 상태만 가질 수 있다는 걸 의미했어요. 마치 동전이 앞면 아니면 뒷면만 있는 것처럼요!

이건 우리의 일상 경험과 완전히 달랐습니다. 나침반은 모든 방향을 가리킬 수 있는데, 전자는 왜 딱 두 방향만 가리킬까요?

🌟 양자화(Quantization)의 발견
이 실험으로 "양자화"라는 개념이 확실해졌어요. 양자 세계에서는 많은 물리량들이 연속적이지 않고 "양자화"되어 있다는 뜻이에요.

마치 계단처럼 1층, 2층, 3층은 있지만 1.5층은 없는 것과 같아요! 🏢`,
        highlight: '전자의 스핀은 연속적이지 않고 딱 두 가지 값만 가질 수 있어요!'
      },

      {
        title: '🎰 스핀 측정의 신비로운 세계',
        content: `이제 양자역학에서 가장 신기하고 이해하기 어려운 부분을 알아볼 차례예요. 바로 "측정"이 어떻게 양자 상태를 바꾸는지 말이에요! 🤔

🕐 양자 시계 이야기 (쉬운 비유)
일반적인 시계를 상상해보세요. 방 안에 시계가 있는데, 우리는 지금이 몇 시인지 모르는 상황이에요. 시계가 말합니다:

"시간이 궁금하면 물어봐! 알려줄게!"

일반 시계라면:
- "지금 3시야?" → "아니야, 7시야"
- 다음에 또 물어봐도 여전히 7시

하지만 양자 시계는 완전히 달라요:
- "지금 12시야?" → "아니야" (그럼 무조건 6시!)
- "지금 3시야?" → "아니야" (그럼 무조건 9시!)
- 양자 시계는 물어본 시간이거나, 정반대 시간만 가져요!

🧲 스핀 측정의 실제 모습
전자의 스핀도 이 양자 시계와 비슷해요. 방향을 정해보죠:
- 수직: 위(↑) vs 아래(↓)  
- 수평: 왼쪽(←) vs 오른쪽(→)

실험 1: 같은 방향으로 연속 측정
1차 측정: 수직 방향 → 위(↑) 나옴
2차 측정: 수직 방향 → 100% 확신으로 위(↑) 나옴

실험 2: 다른 방향으로 측정
1차 측정: 수직 방향 → 위(↑) 나옴
2차 측정: 수평 방향 → 50% 확률로 왼쪽(←), 50% 확률로 오른쪽(→)

실험 3: 측정이 상태를 바꿔버린다!
1차: 수직 → 위(↑)
2차: 수평 → 오른쪽(→)  
3차: 수직 → ???? 

😱 충격적인 결과: 3차 측정에서도 50:50 확률로 위/아래가 나와요!
2차 측정이 1차 측정 결과를 "지워버린" 거예요!

🎲 동전 던지기와의 차이점
동전 던지기:
- 겉보기에는 랜덤하지만 실제로는 물리 법칙으로 예측 가능
- 동전의 무게, 힘의 크기, 공기 저항 등을 모두 계산하면 결과 예측 가능

스핀 측정:
- 진짜로 완전히 랜덤!
- 아무리 정확한 정보를 가져도 결과 예측 불가능
- 우주의 근본적인 불확정성

🌌 하이젠베르크의 불확정성 원리
"위치와 운동량을 동시에 정확히 알 수 없다"는 유명한 원리도 이와 같은 맥락이에요. 측정 자체가 시스템을 교란하기 때문이죠!`,
        highlight: '양자 세계에서는 측정 행위 자체가 시스템의 상태를 바꿔버려요!'
      },

      {
        title: '🔤 브라-켓 표기법 - 양자역학의 언어',
        content: `이제 양자역학에서 사용하는 특별한 수학 언어를 배워볼 시간이에요! 폴 디랙이 만든 이 표기법은 양자역학을 훨씬 쉽게 다룰 수 있게 해줍니다. 😊

📐 벡터 복습부터!
고등학교에서 배운 벡터를 기억하시나요?
- 2차원 벡터: A = [a₁, a₂]
- 3차원 벡터: A = [a₁, a₂, a₃]
- 성분들은 모두 실수였죠!

🌈 복소수 벡터의 등장
그런데 양자역학에서는 성분이 복소수인 벡터가 필요해요!
복소수: z = a + bi (여기서 i는 √(-1))

예시:
- |ψ⟩ = [1+2i, 3-i, 2i]
- 각 성분이 복소수인 벡터!

📝 브라-켓 표기법의 기본 규칙

1. 켓(Ket): |ψ⟩
- "프사이 켓"이라고 읽어요
- 양자 상태를 나타내는 벡터
- 예: |0⟩, |1⟩, |+⟩, |-⟩

2. 브라(Bra): ⟨ψ|
- "프사이 브라"라고 읽어요  
- 켓의 켤레전치(복소켤레를 취하고 전치)
- 만약 |ψ⟩ = [a+bi, c+di]라면
- ⟨ψ| = [a-bi, c-di]

3. 브라켓(Bracket): ⟨φ|ψ⟩
- 두 상태 사이의 내적(inner product)
- 확률 진폭을 나타내요!
- |⟨φ|ψ⟩|² = φ 상태에서 ψ 상태를 측정할 확률

🎯 실제 예시로 이해하기

스핀 상태 표현:
- |↑⟩ = [1, 0] (스핀 위)
- |↓⟩ = [0, 1] (스핀 아래)
- |→⟩ = [1/√2, 1/√2] (스핀 오른쪽)
- |←⟩ = [1/√2, -1/√2] (스핀 왼쪽)

확률 계산:
⟨↑|→⟩ = [1, 0] · [1/√2, 1/√2] = 1/√2

따라서 |⟨↑|→⟩|² = (1/√2)² = 1/2 = 50%

즉, 오른쪽 스핀을 위 방향으로 측정할 확률이 50%라는 뜻!

🔗 왜 이 표기법이 중요한가요?

1. 간결함
- ⟨ψ|H|ψ⟩ 같은 복잡한 계산도 간단히 표현

2. 물리적 의미가 명확
- |ψ⟩²이 아니라 ⟨ψ|ψ⟩가 확률
- 복소수 특성을 자연스럽게 반영

3. 계산 편의성
- 양자 게이트 연산: |ψ'⟩ = U|ψ⟩
- 측정 확률: |⟨φ|ψ⟩|²

🌟 양자 컴퓨터와의 연결
브라-켓 표기법으로 양자 컴퓨터의 모든 연산을 표현할 수 있어요:
- 큐비트 상태: |0⟩, |1⟩, α|0⟩ + β|1⟩
- 양자 게이트: X|0⟩ = |1⟩
- 얽힘 상태: |00⟩ + |11⟩

이제 양자역학의 언어를 어느 정도 이해하셨나요? 🎓`,
        highlight: '브라-켓 표기법은 복소수 벡터를 다루는 양자역학의 핵심 도구예요!'
      },

      {
        title: '🌊 파동-입자 이중성 - 양자역학의 가장 신비로운 현상',
        content: `양자역학의 꽃이라고 할 수 있는 "파동-입자 이중성"에 대해 알아보겠습니다. 이 현상은 정말로 우리의 상식을 완전히 뒤집어놓죠! 🤯

💡 이중슬릿 실험 - 과학사상 가장 아름다운 실험

실험 준비물:
- 광원 (레이저 포인터 같은 것)
- 두 개의 슬릿(틈)이 있는 판
- 스크린

실험 1: 한 번에 하나씩 광자를 쏘기
놀랍게도 한 번에 광자를 하나씩만 쏴도 간섭무늬가 나타나요!

이게 말이 되나요? 🤷‍♀️
- 광자 하나가 어떻게 두 슬릿을 동시에 통과해서 자기 자신과 간섭하죠?
- 마치 한 사람이 동시에 두 개의 문을 통과하는 것과 같아요!

실험 2: 관찰자 효과
"도대체 광자가 어느 슬릿을 통과하는지 보자!"

슬릿 앞에 검출기를 설치하는 순간... 📹
→ 간섭무늬가 사라져버려요!
→ 광자가 입자처럼 행동하기 시작해요

🔍 관찰이 현실을 바꾼다
이 실험이 보여주는 핵심:
- 관찰하지 않을 때: 파동처럼 행동 (중첩상태)
- 관찰할 때: 입자처럼 행동 (하나의 경로)

이건 정말 철학적인 질문을 던져요:
"달을 보지 않을 때도 달이 거기 있을까?" - 아인슈타인

🌟 슈뢰딩거의 고양이 - 거시세계로의 확장
에르빈 슈뢰딩거가 양자역학의 이상함을 보여주기 위해 만든 사고실험:

실험 설정:
- 상자 안에 고양이 한 마리
- 방사성 원소 (50% 확률로 1시간 내 붕괴)
- 붕괴하면 독가스 방출 → 고양이 죽음
- 붕괴하지 않으면 → 고양이 생존

양자역학적 해석:
상자를 열기 전까지 고양이는 "살아있으면서 동시에 죽어있는" 상태!

현실과의 괴리:
우리는 이런 경험이 없죠. 고양이는 살아있거나 죽어있거나 둘 중 하나예요.

그럼 언제부터 양자역학적 중첩이 사라질까요? 🤔

🔬 데코히어런스(Decoherence) - 현실적 해답
양자 상태가 환경과 상호작용하면서 중첩상태가 빠르게 사라지는 현상:

크기별 데코히어런스 시간:
- 전자: 매우 오래 유지 가능
- 원자: 밀리초 정도
- 분자: 마이크로초 정도  
- 고양이: 거의 즉시 (10⁻²³초)

그래서 고양이는 중첩상태를 유지할 수 없어요!

⚡ 양자 컴퓨터의 도전
양자 컴퓨터가 어려운 이유:
- 큐비트를 중첩상태로 유지해야 함
- 환경의 작은 진동, 온도, 전자기파도 데코히어런스 유발
- 절대온도 근처(-273°C)에서 작동해야 함
- 완벽한 차폐와 격리 필요

🌈 파동-입자 이중성의 현대적 이해
현대 물리학에서는 "광자는 파동도 입자도 아니다"라고 봐요:
- 광자는 "양자 객체"예요
- 측정 방법에 따라 파동적 또는 입자적 성질을 보여줄 뿐
- 실체는 확률진폭이라는 복소수 함수

이게 바로 닐스 보어의 "상보성 원리"예요! 🎭`,
        highlight: '양자 객체는 우리가 어떻게 관찰하느냐에 따라 다른 성질을 보여줘요!'
      },

      {
        title: '🔗 양자 얽힘 - "유령같은 원거리 작용"',
        content: `아인슈타인이 "신은 주사위를 던지지 않는다"며 가장 싫어했던 양자역학의 현상을 알아봅시다. 바로 양자 얽힘(Quantum Entanglement)이에요! 👻

🎭 EPR 역설 - 아인슈타인의 도전
1935년, 아인슈타인-포돌스키-로젠이 양자역학의 불완전성을 증명하려고 만든 사고실험:

상황 설정:
두 개의 입자가 얽힌 상태로 만들어져서 우주 반대편으로 날아갔다고 해봅시다.

양자역학의 예측:
- 한 입자를 측정하는 순간
- 다른 입자의 상태가 즉시 결정됨
- 거리에 상관없이!

아인슈타인의 반박:
"이건 말이 안 돼! 빛보다 빠른 정보 전달은 불가능해!"

아인슈타인은 "숨겨진 변수"가 있을 것이라고 생각했어요. 마치 동전에 이미 앞면/뒷면이 정해져 있는 것처럼, 입자에도 미리 정해진 성질이 있을 것이라고요.

🔔 벨의 부등식 - 실험으로 결판내기
1964년 존 벨이 천재적인 아이디어를 냈어요:
"숨겨진 변수가 있다면 특정 부등식을 만족해야 한다!"

벨 테스트 실험:
1. 얽힌 광자 쌍 생성
2. 서로 다른 각도에서 편광 측정
3. 상관관계 계산

결과:
- 벨의 부등식 위반! 
- 숨겨진 변수 이론 완전히 틀림
- 양자역학이 완전히 맞음

알랭 아스페(2022년 노벨물리학상 수상자)의 실험이 결정적이었어요! 🏆

🌌 얽힘의 실제 모습
두 큐비트가 얽힌 상태를 수식으로 표현하면:
|ψ⟩ = (1/√2)(|00⟩ + |11⟩)

이게 의미하는 바:
- 50% 확률로 둘 다 |0⟩
- 50% 확률로 둘 다 |1⟩
- 하나를 측정하면 다른 하나가 즉시 결정됨

중요한 포인트:
- 정보가 전달되는 게 아니에요
- 상관관계만 즉시 나타나는 거예요
- 특수상대성이론은 여전히 유효해요

📱 얽힘의 현실적 활용

1. 양자 암호통신
- 도청하는 순간 얽힘이 깨짐
- 완벽한 보안 통신 가능
- 중국이 위성으로 실용화 중

2. 양자 컴퓨터
- 많은 큐비트를 얽어서 병렬 계산
- 지수적 성능 향상의 핵심

3. 양자 센서
- 얽힘을 이용한 초정밀 측정
- 중력파 검출기 성능 향상

🎪 얽힘 생성하는 방법들

방법 1: 자발적 매개 하향 변환
- 높은 에너지 광자 하나가 두 개의 낮은 에너지 광자로 분해
- 에너지와 운동량 보존에 의해 자동으로 얽힘 생성

방법 2: 이온 트랩
- 레이저로 이온들을 조작
- CNOT 게이트로 얽힘 생성

방법 3: 초전도 큐비트
- 조세프슨 접합을 이용
- 마이크로파로 제어

🔮 얽힘의 미래
- 양자 인터넷: 전 세계 양자 컴퓨터 연결
- 양자 클라우드: 원격으로 양자 컴퓨터 사용
- 양자 시뮬레이션: 복잡한 물리 시스템 모델링

아인슈타인이 "유령같은 원거리 작용"이라며 싫어했던 이 현상이 이제는 미래 기술의 핵심이 되었어요! 😄`,
        highlight: '양자 얽힘은 두 입자가 거리에 상관없이 즉시 상관관계를 보이는 현상이에요!'
      }
    ]
  }

  const getContent = () => {
    switch (activeTab) {
      case 'qubits': return qubitContent;
      case 'gates': return gateContent;
      case 'algorithms': return algorithmContent;
      case 'quantum-mechanics': return quantumMechanicsContent;
      default: return qubitContent;
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            양자 컴퓨터 기초 이론
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            양자 컴퓨팅의 핵심 개념들을 차근차근 알아보세요
          </p>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-white/20">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 min-w-max ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Content Header */}
          <div className={`bg-gradient-to-r ${tabs.find(t => t.id === activeTab)?.color || 'from-blue-400 to-blue-600'} px-8 py-6`}>
            <h2 className="text-3xl font-bold text-white">
              {content.title}
            </h2>
          </div>

          <div className="p-8">
            <div className="space-y-10">
              {content.sections.map((section, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-r from-transparent via-gray-100 to-transparent h-px mb-6"></div>
                  
                  <div className="flex items-start space-x-6">
                    {/* Section Number */}
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${tabs.find(t => t.id === activeTab)?.color || 'from-blue-400 to-blue-600'} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                        {section.title}
                      </h3>
                      
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line text-lg">
                          {section.content}
                        </p>
                      </div>

                      {section.highlight && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-lg p-6 mb-6 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">💡</span>
                            <p className="text-blue-800 font-semibold text-lg">
                              {section.highlight}
                            </p>
                          </div>
                        </div>
                      )}

                      {section.example && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-lg p-6 mb-6 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">🌟</span>
                            <div>
                              <p className="text-green-800 font-semibold mb-2">예시</p>
                              <p className="text-green-700">{section.example}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.gates && (
                        <div className="mt-6 space-y-4">
                          {section.gates.map((gate, index) => (
                            <div key={index} className="bg-white/50 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                                  {gate.symbol}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-purple-800">{gate.name}</h4>
                                  <p className="text-purple-700 text-sm mt-1">{gate.description}</p>
                                  {gate.matrix && (
                                    <div className="mt-2 bg-gray-100 rounded px-3 py-2">
                                      <code className="text-xs text-gray-800">{gate.matrix}</code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.advantage && (
                        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-8 mb-6 border border-purple-200 shadow-lg">
                          <div className="flex items-center mb-4">
                            <span className="text-3xl mr-3">⚡</span>
                            <h4 className="font-bold text-purple-800 text-xl">성능 비교</h4>
                          </div>
                          <p className="text-purple-700 font-semibold text-lg mb-3">{section.advantage}</p>
                          <p className="text-gray-700 text-lg mb-6">{section.description}</p>
                          
                          {section.applications && (
                            <div className="mb-6">
                              <h5 className="font-semibold text-purple-800 mb-3 text-lg flex items-center">
                                <span className="mr-2">🎯</span>
                                활용 분야
                              </h5>
                              <div className="flex flex-wrap gap-3">
                                {section.applications.map((app, appIndex) => (
                                  <span key={appIndex} className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                                    {app}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {section.realWorld && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                              <h5 className="font-semibold text-purple-800 mb-2 flex items-center">
                                <span className="mr-2">🌍</span>
                                실제 구현 사례
                              </h5>
                              <p className="text-purple-700">{section.realWorld}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {section.technical_note && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-blue-600">🧮</span>
                            <span className="font-semibold text-blue-800">기술적 참고</span>
                          </div>
                          <p className="text-blue-700 text-sm">{section.technical_note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Call to Action */}
            <div className="mt-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  이제 직접 체험해보세요!
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  이론을 배웠으니 실제 양자 회로를 만들어보며 학습을 계속해보세요
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="/circuit-builder"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span className="text-xl">🔧</span>
                    <span>회로 만들기</span>
                  </a>
                  <a
                    href="/templates"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span className="text-xl">⚡</span>
                    <span>알고리즘 템플릿</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumEducation; 