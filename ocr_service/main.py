from fastapi import FastAPI, UploadFile, File
import uvicorn
import easyocr
import shutil
import os

app = FastAPI()
reader = easyocr.Reader(['en'])

@app.get("/")
def read_root():
    return {"message": "OCR Service Running"}

@app.post("/extract")
async def extract_text(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = reader.readtext(temp_file, detail=0)
        text = " ".join(result)
        return {"text": text}
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    # Mock classification logic
    # In a real scenario, you'd use a deep learning model (e.g., PyTorch/TensorFlow)
    return {
        "classification": "X-ray", 
        "confidence": 0.98,
        "hint": "This looks like a chest X-ray. Vision AI can provide more details."
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
