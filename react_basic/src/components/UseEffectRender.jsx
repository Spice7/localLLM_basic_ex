import axios from "axios";
import { useEffect, useState } from 'react'

function UseEffectRender() {
  // hook 초기화
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState([]);
  const URL = "http://localhost:8000/models";

//   fetch 함수로 비동기 처리
//   useEffect(() => {
//       fetch(URL)
//       .then((response) => response.json())
//       .then((data) => setModels(data.models || []))
//       .catch((error) => console.error(error));
//     }, []); // [] 처음 한번만 실행하는 장치

  // axios 라이브러리 사용하기
  // npm install axios
  useEffect(() => {
    axios
      .get(URL)
      .then((response) => {
        setModels(response.data.models || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);   // [] 처음 실행될 때 한번만 실행하도록 함

  return (
    <div>
      <h2>모델 목록</h2>
      {/* <ul>
        {models.map((model) => (
          <li key={model}>{model}</li>
        ))}
      </ul>
      <hr /> */}
      <select
        value={selectedModel}
        onChange={(event) => setSelectedModel(event.target.value)}
      >
        <option value="">모델을 선택하세요</option>

        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

      <p>선택한 모델: {selectedModel}</p>

    </div>
  )
}

export default UseEffectRender