import React from 'react'

function ListRender() {
    const messages = [
        { id: 1, role: "user", content: "안녕하세요." },
        { id: 2, role: "assistant", content: "무엇을 도와드릴까요?" },
        { id: 3, role: "user", content: "local LLM에 대해 알여줘" },
        { id: 4, role: "assistant", content: "local llm ~~~" },
        
    ]
  return (
    <div>
        <main> 
            <h1>메시지 목록메시지 목록</h1>
            {
                messages.map((message) => (
                    // key는 React가 목록의 각 항목을 구분하기 위해 사용하는 고유 식별자
                    <div key = {message.id}>
                        <span>{message.id} - </span>
                        <strong>{message.role} </strong>
                        <span>{message.content} </span>
                    </div>
                ))
            }
        </main>
    </div>
  )
}

export default ListRender