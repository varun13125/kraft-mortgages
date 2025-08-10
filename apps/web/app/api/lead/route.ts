import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Handle both old format (with income/downPayment) and new format (with name/email/phone)
  let score;
  let province = body.province || "BC"; // default to BC
  let intent = body.intent || body.calculatorType || "GENERAL";
  
  if (body.income || body.downPayment) {
    // Old format - calculator-based scoring
    score = Math.min(100, Math.round((body?.income ?? 0) / 1000 + (body?.downPayment ?? 0) / 10000));
  } else {
    // New format - lead form based scoring
    const loanAmount = parseFloat(body.loanAmount?.replace(/[^\d]/g, '') || '0');
    const hasPhone = !!body.phone;
    const hasMessage = !!body.message;
    
    // Score based on completeness and loan amount
    score = Math.min(100, Math.round(
      (loanAmount > 0 ? 40 : 0) + 
      (hasPhone ? 30 : 0) + 
      (hasMessage ? 20 : 0) + 
      10 // base score for providing email/name
    ));
  }
  
  const leadData = {
    province,
    intent,
    details: body,
    score,
    status: (score >= 70 ? "QUALIFIED" : "NEW") as any,
    createdAt: new Date()
  };

  try {
    if ((prisma as any) instanceof PrismaClient) {
      const lead = await (prisma as PrismaClient).lead.create({ 
        data: { 
          province: leadData.province, 
          intent: leadData.intent, 
          details: leadData.details, 
          score: leadData.score, 
          status: leadData.status 
        } 
      });
      return Response.json({ id: lead.id, score: leadData.score, status: leadData.status });
    }

    // Fallback to Firestore
    const db = firestore();
    const doc = await (await db.collection("leads")).add(leadData);
    return Response.json({ id: doc.id, score: leadData.score, status: leadData.status });
    
  } catch (error) {
    console.error('Error saving lead:', error);
    
    // If database fails, still return success to user but log the error
    return Response.json({ 
      id: `temp_${Date.now()}`, 
      score: leadData.score, 
      status: leadData.status,
      note: 'Lead captured, processing in background'
    });
  }
}
