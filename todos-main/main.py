from fastapi import FastAPI, Form, Request, Depends, status
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from fastapi import HTTPException
import uvicorn
from database import Base, SessionLocal, engine
import models

app = FastAPI()

# DB 엔진 연결
# -> models.py에 정의한 클래스를 통해 db에 테이블 생성
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e :
        print(f"db연결 오류 {e}")
        raise
    finally:
        db.close()

# html 문서를 위한 객체
templates = Jinja2Templates(directory="templates")

# 정적파일을 위한 설정
## 정적파일(static) 종류(image, css, js)
app.mount("/static", StaticFiles(directory="static"), name="static")

# localhost:8000/
@app.get("/")
async def home(request: Request, db_ss: Session = Depends(get_db)):
    # db 객체 생성, 세션연결하기 <- 의존성 주임으로 처리
    # 테이블 조회
    todos = db_ss.query(models.Todo).order_by(models.Todo.id.desc()).all()
    
    print(type(todos))
    # db 조회한 결과를 출력함
    # for todo in todos:
    #     print(todo.id, todo.task, todo.completed)

    return templates.TemplateResponse(
        request = request,
        name = "index.html",
        context={ "todoss": todos}
        )

@app.post("/add")
async def add(request: Request, task: str = Form(...), 
              db_ss: Session = Depends(get_db)):
    # 클라이언트에서 textarea에서 입력 데이터 넘어온것 확인
    print(task)
    # 클라이언트에서 넘어온 task를 Todo 객체로 생성
    todo = models.Todo(task=task)
    # 의존성 주입에서 처리함 Depends(get_db) : 엔진객체생성, 세션연결
    # db 테이블에 task 저장하기
    print(todo)
    db_ss.add(todo)
    # db에 실제 저장, commit
    db_ss.commit()
    # home 엔드포인함수로 제어권을 넘김
    return RedirectResponse(url=app.url_path_for("home"), 
                            status_code=status.HTTP_303_SEE_OTHER)

# 문제 : todo 1개 삭제
@app.post("/delete/{todo_id}")
async def delete(request: Request, todo_id: int, db_ss: Session = Depends(get_db)):
    todo = db_ss.query(models.Todo).filter(models.Todo.id == todo_id).first()
    print(todo)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db_ss.delete(todo)
    db_ss.commit()
    return RedirectResponse(url=app.url_path_for("home"), status_code=status.HTTP_303_SEE_OTHER)

# todo 수정을 위한 조회
@app.get("/edit/{todo_id}")
async def edit(request: Request, todo_id: int , db_ss: Session = Depends(get_db)):
    # 요청 수정 처리
    todo = db_ss.query(models.Todo).filter(models.Todo.id==todo_id).first()
    print(todo.task)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    return templates.TemplateResponse(
        request=request,
        name = "edit.html",
        context = {"todo": todo}
    )

# todo 업데이터 처리
@app.post("/edit/{todo_id}")
async def update(request: Request, todo_id: int, task: str = Form(...), completed: bool = Form(False), db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    todo.task = task
    todo.completed = completed
    db.commit()
    return RedirectResponse(url=app.url_path_for("home"), status_code=status.HTTP_303_SEE_OTHER)


# python main.py
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)

# CLI명령 : uvicorn main:app --reload