from typing import List, Dict, Optional
from .mock_json import MockJsonAdapter

adapters = [ MockJsonAdapter() ]

async def aggregate(province: Optional[str] = None) -> List[Dict]:
    results: List[Dict] = []
    for a in adapters:
        try:
            rows = await a.fetch(province=province)
            results.extend(rows)
        except Exception as e:
            results.append({"lender": a.name, "error": str(e)})
    return results
