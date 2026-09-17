# 실습 : image to text
from ollama import chat

IMAGE_PATH = "imgs/pika.jpg"
MODEL_NAME = "gemma4:latest"

response = chat(
    model=MODEL_NAME,
    messages=[
        {
            "role": "user",
            "content": """
이 이미지를 한국어로 설명해줘.

다음 형식으로 답변해줘.
1. 전체 장면
2. 주요 객체
3. 배경
4. 이미지에서 추론 가능한 상황
""",
            "images": [IMAGE_PATH],
        }
    ],
    think=False,        # 생각 과정을 보여준다.  # False로 하면 답변만 보여줘서 더 빠름
    stream=True,        # 답변을 한 번에 받을 지, 아니면 토큰 단위로 계속 받을 지 여부
)

for chunk in response:
    print(chunk.message.content, end="", flush=True)  # 토큰 단위로 계속 받을 때는 end=""로 해야 한 줄로 이어서 출력됨