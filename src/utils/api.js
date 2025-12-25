const API_URL = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

export async function saveResult(payload) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors"   // 👈 แก้เป็น no-cors เพื่อให้ Google Apps Script รับข้อมูลได้
    });
    // ❌ no-cors จะไม่ได้ response JSON กลับมา
    return { status: "ok" };
  } catch (err) {
    console.error("Error saving result:", err);
    return { status: "error", message: err.message };
  }
}
