from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.rates import fetch_rates
from services.lead_scoring import score as score_fn
from services.lenders.aggregate import aggregate as lenders_aggregate
from services.ocr import extract_text_from_pdf
from services.s3store import put_object_bytes

app = FastAPI(title="Kraft Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"])

class RateRequest(BaseModel):
    province: str | None = None

@app.post("/rates")
async def rates(req: RateRequest):
    return {"rates": fetch_rates(req.province)}

class LeadData(BaseModel):
    income: float | None = None
    down_payment: float | None = None
    credit_score: int | None = None

@app.post("/score")
async def score(lead: LeadData):
    return {"score": score_fn(lead.income, lead.down_payment, lead.credit_score)}

@app.post("/documents/upload")
async def upload(file: UploadFile):
    blob = await file.read()
    loc = put_object_bytes(blob, file.filename)
    text = ""
    pages = 0
    if file.filename.lower().endswith(".pdf"):
        text, pages = extract_text_from_pdf(blob)
    # naive field sniff
    parsed = {}
    for line in text.splitlines():
        if "Total income" in line or "Line 150" in line:
            parsed.setdefault("indicators", []).append(line.strip())
    return {"ok": True, "filename": file.filename, "s3": loc, "pages": pages, "preview": text[:2000], "parsed": parsed}

class ProvinceReq(BaseModel):
    province: str | None = None

@app.post("/lenders/aggregate")
async def lenders(req: ProvinceReq):
    out = await lenders_aggregate(req.province)
    return {"rows": out}
