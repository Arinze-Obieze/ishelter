import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const data = await req.json();
    const { fullName, email, phone } = data;
    
    if (!fullName || !email || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    
    // Create consultation registration
    const docRef = await adminDb.collection("consultation-registrations").add({
      fullName,
      email,
      phone,
      createdAt: new Date(),
    });
    
    return new Response(JSON.stringify({ 
      id: docRef.id,
      message: "Registration saved successfully" 
    }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}