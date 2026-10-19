from fastapi import FastAPI

app = FastAPI(
    title="Urlens API",
    description="",
    version="1.1.1"
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}