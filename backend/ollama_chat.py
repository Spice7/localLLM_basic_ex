import time
from ollama import chat
import requests

def call_ollama_chat(
    message: str,
    model: str = "gemma4:e4b",
    system_prompt: str = "너는 초보자를 돕는 친절한 AI 강사다.",
    temperature: float = 0.7,
    top_p: float = 0.9,
    num_predict: int = 256,
):
    """Ollama chat() 함수로 모델 응답과 소요 시간을 반환한다."""

    start_time = time.perf_counter()

    response = chat(
        model=model,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        options={
            "temperature": temperature,
            "top_p": top_p,
            "num_predict": num_predict,
        },
        think = False
    )

    elapsed_time = round(time.perf_counter() - start_time, 3)

    return {
        "model": model,
        "message": response.message.content,
        "elapsed_time": elapsed_time,
    }

# 로컬의 모델 목록 가져오기
OLLAMA_TAGS_URL = "http://localhost:11434/api/tags"
def get_ollama_models():
    """Ollama에서 사용 가능한 모델 목록을 반환한다."""

    response = requests.get(
        OLLAMA_TAGS_URL,
        timeout=30
    )
    # 응답 실패(4xx/5xx)를 여기서 즉시 예외로 전환
    response.raise_for_status()

    data = response.json()
    print(data)
    models = data.get("models", [])

    return [model["name"] for model in models]


if __name__ == "__main__":
    print("\n채팅 응답 테스트(결과를 기다려 주세요.):")
    result = call_ollama_chat(message="Local LLM이 무엇인지 초보자에게 설명해줘.")
    print("\n모델:", result["model"])
    print("소요 시간:", result["elapsed_time"], "초")
    print("응답:")
    print(result["message"])

    models = get_ollama_models()
    print("사용 가능한 모델 목록:")
    print(models)
