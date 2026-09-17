from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
 
app = FastAPI()

# 요청 데이터 모델 정의
class UserCreate(BaseModel):
    name: str
    password: str
    avatar_url: Optional[HttpUrl] = None

# 응답 데이터 모델 정의
class UserResponse(BaseModel):
    name: str
    avatar_url: Optional[HttpUrl] = None

# http://127.0.0.1:8000/
@app.get("/")
def read_root():
    word = "안녕"
    # 비즈니스 로직 처리
    # DB 조회
    # AI와 통신한 결과
    return {"Hello": word}

# 경로 매개 변수
# http://127.0.0.1:8000/items/1
# http://127.0.0.1:8000/items/2
# http://127.0.0.1:8000/items/3
# http://127.0.0.1:8000/items/5
# http://127.0.0.1:8000/items/6
@app.post("/items/{item_id}")
def read_item(item_id:int, q: str | None = None):
    print(f"item_id : {item_id}, q : {q}  ")
    return {"item_id": item_id, "q": q}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str | None = None):
#     return {"item_id": item_id, "q": q}

# 요청 및 응답 API
@app.post("/user_info", response_model=UserResponse)
def get_user(user: UserCreate):
    # 비즈니스 로직 처리
    # DB 저장 처리
    print("user: ", user)
    user_info = UserResponse(
        name=user.name,
        avatar_url=str(user.avatar_url) if user.avatar_url else None
    )
    # Pydantic model 객체를 JSON으로 직렬화해서 응답함.
    return user_info