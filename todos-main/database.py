from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from db_env  import user, password, host, db_name 

#####################
# sqlite3 엔진을 정의, DB파일 todo.sqlite3
# DB_URL = 'sqlite:///todo.sqlite3'

# # 엔진객체 생성
# engine = create_engine(DB_URL, connect_args={'check_same_thread': False})
#####################

#####################
# mysql 엔진 정의
DB_URL = f"mysql+pymysql://{user}:{password}@{host}:3306/{db_name}"
# 엔진객체 생성
engine = create_engine(DB_URL)
#####################

# DB 연결(세션) 객체 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()