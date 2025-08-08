from typing import List, Dict, Optional, Protocol

class LenderAdapter(Protocol):
    name: str
    async def fetch(self, province: Optional[str] = None) -> List[Dict]: ...
