from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from typing import Optional
import uvicorn  # fastapi 내장 웹서버

app = FastAPI() # FastAPI 객체 생성


# http://localhost:8000/users
# body(JSON)로 username, password, avatar_url를 받아서 생성
class UserCreate(BaseModel):
    username: str
    password: str
    avatar_url: HttpUrl
    user_full_name: Optional[str] = None

# DTO : 응답 전송 객체
class UserResponse(BaseModel):
    username: str
    avatar_url: HttpUrl

# http://localhost:8000/
# http://127.0.0.1:8000/
@app.get("/") # GET 요청 처리
async def read_root():
    # 비즈니스 로직
    data = "DB에서 데이터 읽어오기"
    return {"message": data}     # JSON 응답 반환

# http://127.0.0.1:8000/items/
@app.get("/items")
def read_item():
    item_id = 1
    q = "사과"
    return {"item_id": item_id, "q": q}

@app.post("/user_info/", response_model=UserResponse)
def create_user(user: UserCreate):
    print(f" ▕  username: {user.username}, password: {user.password}, avatar_url: {user.avatar_url}, user_full_name: {user.user_full_name}")

    user_info = UserResponse(username=user.username, avatar_url=user.avatar_url)
    return user_info


# uv run fastapi dev
# uv run main.py
if __name__ == "__main__":
    # uvicorn.run("현재 파일이름: FastAPi 객체 식별자")
    uvicorn.run("main:app", reload=True)