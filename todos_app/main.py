from fastapi import FastAPI, HTTPException, Request, Form, Depends, status
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import os
import uvicorn

from database import engine, SessionLocal, Base
import models

# models에 정의한 모든 클래스, 연결한 DB엔진에 테이블로 생성
Base.metadata.create_all(bind=engine)

# FastAPI 객체 생성
app = FastAPI()

# 배포까지 생각하면 필요한 코드     # 배포 서버에서는 root/templates를 찾으려 할 수도 있는데, __file__로 경로를 현재 파일로부터 찾도록 명시
abs_path = os.path.dirname(os.path.realpath(__file__))
print(abs_path)

# html 템플릿 폴더를 지정하여 jinja템플릿 객체 생성
templates = Jinja2Templates(directory=f"{abs_path}/templates")

# static/ 폴더를 fastapi에서 인식할 수 있도록 마운트
app.mount("/static", StaticFiles(directory=f"{abs_path}/static"), name="static")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        # 마지막에 무조건 닫음
        db.close()

# http://localhost:8000
@app.get("/")
def home(
    request: Request,
    db_ss: Session = Depends(get_db)
):
    # 테이블 조회
    todos_list = db_ss.query(models.Todo).order_by(models.Todo.id.desc())
    print(todos_list)

    for todo in todos_list:
        print(f"{todo.id}, {todo.task}")

    return templates.TemplateResponse(
        request = request,
        name = "index.html",
        context = {"todos" : todos_list}
    )

# todo 데이터를 받아서 db 테이블에 저장
# http://localhost:8000/add/
@app.post("/add")
def add(
    req: Request, 
    task: str = Form(),
    db_ss: Session = Depends(get_db)
):
    print(task)
    # task 데이터를 받고, Todo 클래스를 통해 테이블과 연결 된 객체 생성
    todo = models.Todo(task = task)
    db_ss.add(todo) # todos 테이블에 task 추가

    # db table에 저장하고
    db_ss.commit()

    # 엔드포인트 함수 home으로 redirect
    return RedirectResponse(url=app.url_path_for("home"), 
                            status_code=status.HTTP_303_SEE_OTHER)

# todo 수정할 레코드조회
@app.get("/edit/{todo_id}")
def show_record(
    req: Request,
    todo_id: int,
    db_ss: Session = Depends(get_db)
):
    # todo_id 조회
    todo = db_ss.query(models.Todo).filter(models.Todo.id==todo_id).first()
    print(todo.task)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    # edit form에 렌더링해서 return
    return templates.TemplateResponse(
        request=req,
        name = "edit.html",
        context = {"todo": todo},
    )
# todo 수정 내용 반영
@app.post("/edit/{todo_id}")
def edit(
    req: Request,
    todo_id: int,
    db_ss: Session = Depends(get_db),
    task: str = Form(),
    completed: bool = Form(False)
):
    todo = db_ss.query(models.Todo).filter(models.Todo.id == todo_id).first()
    todo.task = task    # 조회한 객체의 task 컬럼 수정
    todo.completed = completed  
    db_ss.commit()

    # home으로
    return RedirectResponse(url=app.url_path_for("home"), 
                                status_code=status.HTTP_303_SEE_OTHER)

# todo 삭제
@app.post("/delete/{todo_id}")
def delete(
    req: Request,
    todo_id: int,
    db_ss: Session = Depends(get_db)
):
    todo = db_ss.query(models.Todo).filter(models.Todo.id == todo_id).first()

    if todo is not None:
        db_ss.delete(todo)
        db_ss.commit()
        print(f"{todo_id}번 삭제 완료")

    # home으로
    return RedirectResponse(url=app.url_path_for("home"), 
                                    status_code=status.HTTP_303_SEE_OTHER)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)