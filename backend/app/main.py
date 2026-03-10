from fastapi import FastAPI

app = FastAPI(title="EBATEC Stock API")

@app.get("/health")
def health():
    return {"status": "ok"}