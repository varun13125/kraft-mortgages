import os, json, aiohttp
from typing import List, Dict, Optional

class MockJsonAdapter:
    name = "MockJSON"
    def __init__(self, url: Optional[str] = None):
        self.url = url or os.getenv("LENDER_MOCK_JSON_URL")
    async def fetch(self, province: Optional[str] = None) -> List[Dict]:
        if not self.url:
            # fallback sample
            return [
                {"lender":"Sample Lender A","termMonths":60,"rateAPR":5.24,"province":province},
                {"lender":"Sample Lender B","termMonths":36,"rateAPR":5.09,"province":province},
            ]
        async with aiohttp.ClientSession() as s:
            async with s.get(self.url) as r:
                data = await r.json()
                # expected shape: [{lender,termMonths,rateAPR,province?}]
                return [{**item, "province": province or item.get("province")} for item in data]
