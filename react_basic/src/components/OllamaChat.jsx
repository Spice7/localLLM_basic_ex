// React의 useState Hook을 가져온다.
// useState는 컴포넌트 안에서 변하는 값, 즉 상태(state)를 관리할 때 사용한다.
import { useState, useEffect } from "react";

// HTTP 요청을 보내기 위한 axios 라이브러리를 가져온다.
// 여기서는 FastAPI 백엔드의 /chat API를 호출할 때 사용한다.
import axios from "axios";

// 채팅 요청을 보낼 백엔드 API 주소를 상수로 정의한다.
// FastAPI 서버가 localhost:8000에서 실행 중이어야 한다.
const CHAT_URL = "http://localhost:8000/chat";
const MODELS_URL = "http://localhost:8000/models";

// Ollama 채팅 화면을 담당하는 React 컴포넌트이다.
function OllamaChat() {
  // 사용자가 textarea에 입력한 메시지를 저장하는 상태이다.
  // 초기값은 빈 문자열이다.
  const [message, setMessage] = useState("");

  // 백엔드에서 받은 Ollama 응답 결과를 저장하는 상태이다.
  // 응답 전에는 값이 없으므로 초기값을 null로 둔다.
  // 응답이 오면 { model, message, elapsed_time } 형태의 객체가 저장된다.
  const [answer, setAnswer] = useState(null);

  // 서버에 요청을 보내고 응답을 기다리는 중인지 여부를 저장하는 상태이다.
  // true이면 "응답 생성 중..." 화면을 보여준다.
  const [isLoading, setIsLoading] = useState(false);

  // 서버 요청 중 오류가 발생했을 때 화면에 보여줄 오류 메시지를 저장한다.
  const [errorMessage, setErrorMessage] = useState("");

  // Ollama 모델 목록
  const [models, setModels] = useState([]);

  // 사용자가 선택한 모델
  const [selectedModel, setSelectedModel] = useState("");

  // 컴포넌트가 처음 실행될 때 모델 목록을 가져온다.
  useEffect(() => {
    axios
      .get(MODELS_URL)
      .then((response) => {
        const modelList = response.data.models || [];
        setModels(modelList);

        // 모델 목록이 있으면 첫 번째 모델을 기본 선택값으로 설정한다.
        if (modelList.length > 0) {
          setSelectedModel(modelList[0]);
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("모델 목록을 가져오는 중 오류가 발생했습니다.");
      });
  }, []);

  // 사용자가 전송 버튼을 클릭했을 때 실행되는 함수이다.
  const handleSend = async () => {
    // 입력값에서 앞뒤 공백을 제거했을 때 아무 내용도 없으면 요청하지 않는다.
    if (!message.trim()) {
      alert("메시지를 입력하세요.");
      return;
    }

    // 요청 시작 전에 로딩 상태를 true로 변경한다.
    setIsLoading(true);

    // 이전 오류 메시지를 초기화한다.
    setErrorMessage("");

    // 이전 응답 결과를 초기화한다.
    setAnswer(null);

    try {
      // FastAPI 백엔드의 /chat API로 POST 요청을 보낸다.
      // 두 번째 인자로 전달하는 객체가 요청 본문 JSON이 된다.
      const response = await axios.post(CHAT_URL, {
        // 사용자가 입력한 메시지
        message: message,

        // Ollama에서 사용할 모델명

        // model: "gemma4:e4b",
        model: setSelectedModel,

        // 모델의 역할 또는 응답 스타일을 지정하는 시스템 프롬프트
        system_prompt: "너는 초보자를 돕는 AI 강사다.",

        // 응답의 무작위성 정도를 조절한다.
        // 값이 높을수록 다양한 답변이 나오고, 낮을수록 안정적인 답변이 나온다.
        temperature: 0.7,

        // 누적 확률 기반 샘플링 옵션이다.
        // 일반적으로 temperature와 함께 응답 다양성을 조절한다.
        top_p: 0.9,

        // 생성할 최대 토큰 수 또는 예측 길이를 제한한다.
        num_predict: 256,
      });

      // 백엔드에서 받은 실제 응답 데이터이다.
      // axios는 JSON 응답을 자동으로 파싱해서 response.data에 넣어준다.
      const data = response.data;

      // 브라우저 개발자 도구 Console에서 응답 구조를 확인하기 위한 로그이다.
      console.log(data);

      // 응답 전체 객체를 answer 상태에 저장한다.
      // 이후 화면에서는 answer.model, answer.message, answer.elapsed_time처럼 접근한다.
      setAnswer(data);
    } catch (error) {
      // 요청 실패 또는 서버 오류가 발생하면 콘솔에 오류를 출력한다.
      console.error(error);

      // 사용자 화면에 보여줄 오류 메시지를 설정한다.
      setErrorMessage("서버 요청 중 오류가 발생했습니다.");
    } finally {
      // 요청 성공/실패 여부와 관계없이 로딩 상태를 종료한다.
      setIsLoading(false);
    }
  };

  // 컴포넌트가 화면에 렌더링할 JSX를 반환한다.
  return (
    <main className="app">
      <h1>Ollama Chat</h1>
      {/* 모델 선택 영역 */}
      <section>
        <h2>모델 선택</h2>
        <select
          value={selectedModel}
          onChange={(event) => setSelectedModel(event.target.value)}
          disabled={isLoading}
        >
          <option value="">모델을 선택하세요</option>

          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <p>선택한 모델: {selectedModel}</p>
      </section>
      {/* 사용자 입력 영역 */}
      <section>
        <textarea
          // textarea의 현재 값은 message 상태와 연결된다.
          value={message}

          // 사용자가 입력할 때마다 message 상태를 갱신한다.
          onChange={(event) => setMessage(event.target.value)}

          // 입력창이 비어 있을 때 표시되는 안내 문구이다.
          placeholder="메시지를 입력하세요."

          // textarea의 기본 높이를 5줄로 설정한다.
          rows={5}
        />

        <br />

        <button
          // 버튼 클릭 시 handleSend 함수가 실행된다.
          onClick={handleSend}

          // 응답 생성 중에는 버튼을 비활성화하여 중복 요청을 막는다.
          disabled={isLoading}
        >
          {/* 로딩 상태에 따라 버튼 문구를 다르게 표시한다. */}
          {isLoading ? "응답 생성 중..." : "전송"}
        </button>
      </section>

      {/* 응답 출력 영역 */}
      <section>
        <h2>응답</h2>

        {/* 오류 메시지가 있을 때만 화면에 출력한다. */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* 
          isLoading이 true이면 로딩 메시지를 보여준다.
          isLoading이 false이고 answer 값이 있으면 응답 결과를 출력한다.
        */}
        {isLoading ? (
          <p>Ollama가 응답을 생성하고 있습니다.</p>
        ) : (
          answer && (
            <>
              {/* 백엔드가 반환한 모델명 출력 */}
              <p>{answer.model}</p>

              {/* 백엔드가 반환한 응답 메시지 출력 */}
              <p>{answer.message}</p>

              {/* 백엔드가 반환한 응답 소요 시간 출력 */}
              <p>{answer.elapsed_time}</p>
            </>
          )
        )}
      </section>
    </main>
  );
}

// 다른 파일에서 OllamaChat 컴포넌트를 import해서 사용할 수 있도록 내보낸다.
export default OllamaChat;