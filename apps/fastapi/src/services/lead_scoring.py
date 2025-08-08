from typing import Optional

def score(income: Optional[float], down_payment: Optional[float], credit_score: Optional[int]) -> int:
    s = 0
    if income: s += min(60, income/2000)
    if down_payment: s += min(25, down_payment/20000)
    if credit_score: s += max(0, (credit_score - 580)/10)
    return int(min(100, s))
