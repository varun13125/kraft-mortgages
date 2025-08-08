from typing import Tuple
from io import BytesIO
from pypdf import PdfReader

def extract_text_from_pdf(data: bytes) -> Tuple[str, int]:
    bio = BytesIO(data)
    reader = PdfReader(bio)
    pages = len(reader.pages)
    text_chunks = []
    for i in range(pages):
        try:
            text_chunks.append(reader.pages[i].extract_text() or "")
        except Exception:
            pass
    return ("\n".join(text_chunks), pages)
