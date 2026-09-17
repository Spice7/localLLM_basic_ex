import React from 'react'

function ConditionalRender() {
  const isLoading = false;
//   const isLoading = true;

  return (

    <main>
      <h1>조건부 렌더링</h1>
      {/* 
        삼항 연산자 
        {조건 ? 조건이 참이면 수행 : 조건이 거짓이면 수행}
      */}
      <div>
        상태값 : { isLoading.toString()} {isLoading ? <p> 응답 생성 중입니다.</p> : <p>응답이 완료되었습니다.</p>}
      </div>

    </main>
  );
}

export default ConditionalRender;