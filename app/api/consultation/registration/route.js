import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const data = await req.json();
    const { fullName, email, phone, plan } = data;
    
    if (!fullName || !email || !phone || !plan) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    
    // Create registration with status pending_payment
    const docRef = await adminDb.collection("consultation-registrations").add({
      fullName,
      email,
      phone,
      plan,
      status: "pending_payment", // Fixed: added status field
      createdAt: new Date(),
    });
    
    return new Response(JSON.stringify({ id: docRef.id }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const data = await req.json();
    const { registrationId, ...fields } = data;
    if (!registrationId) {
      return new Response(JSON.stringify({ error: "Missing registrationId" }), { status: 400 });
    }
    // Remove registrationId from fields to update
    delete fields.registrationId;
    // If status is 'paid', set paidAt
    if (fields.status === "paid") {
      fields.paidAt = new Date();
    }
    await adminDb.collection("consultation-registrations").doc(registrationId).update(fields);
    return new Response(JSON.stringify({ message: "Registration updated" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}