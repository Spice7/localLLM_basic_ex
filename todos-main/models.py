from sqlalchemy import Column, Boolean, Integer, Text
from database import Base

# todos 테이블
class Todo(Base):
    __tablename__ = 'todos'
    id = Column(Integer, primary_key=True)
    task = Column(Text)
    completed = Column(Boolean, default=False)

# 다른테이블