from fastapi import FastAPI

from app.config.config import settings

from .database.database import Base, engine
from .interfaces.routes.auth_routes import auth_router
from .interfaces.routes.otp_routes import otp_router

app = FastAPI(title="Urlens API", description="", version="1.1.1")
Base.metadata.create_all(bind=engine)


app.include_router(auth_router, prefix="/api")
app.include_router(otp_router,prefix="/api")
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "origins": settings.BACKEND_CORS_ORIGINS}


@app.get("/", dependencies=[])
async def root():
    return {"message": "Urlens Backend running 👍"}


# --- Only enable for PRODUCTION 😄 ---
if __name__ == "__main__":
    import os

    import uvicorn

    port = int(os.environ.get("PORT", " 8000"))
    uvicorn.run("src.main:app", host="0.0.0.0", port=port)
