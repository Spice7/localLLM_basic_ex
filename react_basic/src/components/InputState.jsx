import React, { useState } from 'react'

function InputState() {
    const [message, setMessage] = useState("")
  return (
    <div>
        <main className="app">
            <h1>입력값 상태 관리 예제</h1>
            {/* message 입력 */}
            <input 
            value = {message}  //입력창의 현재 값을 message 상태와 연결
            onChange = {(event) => setMessage(event.target.value)}
            placeholder = "메시지를 입력하세요."
            />

            {/* message 상태값을 화면에 출력 */}
            <p>입력한 메시지: {message}</p>   
        </main>
    </div>
  )
}

export default InputState