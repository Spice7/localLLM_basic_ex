import { useState } from "react"

function Counter() {
    // count 변수 0로 state 초기화
    const [count, setCount ] = useState(0);
    return (
        <div>
            <h1>카운터 예제</h1>
            <p>현재 값: {count}</p>
            <button onClick={() => setCount(count - 1)}>감소</button>
            <button onClick={() => setCount(count + 1)}>증가</button>
            <button onClick={() => setCount(0)}>리셋</button>
        </div>
    )
}

export default Counter