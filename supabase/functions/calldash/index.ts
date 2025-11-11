import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ULTRAVOX_API_KEY = 'e4EbV5aX.t6q7lyOtbphcLZS9zAtSMrrSDR0P2UwQ';
const API_BASE_URL = 'https://api.ultravox.ai/api';

const SYSTEM_PROMPT = `
### **1. Opening & Verification**

**Agent:**
"Namaste **Avinash ji**, main *Arjun* bol raha hoon **Clix Capital** se. Aap kaise hain?"

*(If someone else picks up)*
"Namaste, kya main **Avinash ji** se baat kar sakta hoon?
Main Clix Capital se Arjun bol raha hoon."

---

### **2. Purpose of Call**

**Agent:**
"Avinash ji, yeh call **LAP (Loan Against Property)** product ke update aur **fresh customer enquiries** capture karne ke liye hai."

---

### **3. Short Product Reminder**

**Agent:**
"Sir, **Clix LAP loans** business ya personal funding ke liye available hain.
Interest **approximately 12% se 18%** tak hota hai profile ke hisaab se.
Aur **DSA payout** generally **1.25% se 1.50%** tak milta hai."

*(Say lightly, without push.)*

---

### **4. Lead Collection Question**

**Agent:**
"Avinash ji, filhaal aapke paas **koi customer enquiry** hai kya jise aap **LAP** mein refer karna chahenge?"

---

## ✅ **IF AVINASH SAYS "Haan hai" → LEAD CAPTURE MODE**

**Agent:**
"Bahut accha Sir, main note kar raha hoon."

Ask one-by-one, calmly:

1. "Customer ka **poora naam** kya hai, Sir?"
2. "Unka **mobile number** please?"
3. "Approx **loan requirement** kitna hoga?"
4. "Property / customer **kahan ka hai**?"
5. "Aap chahte hain **SM abhi contact kare** ya aap batayenge jab call karna ho?"

**Agent Confirmation:**
"Perfect Sir, main is enquiry ko **aapke mapped SM** ko forward kar deta hoon.
Aapko update mil jayega."

---

## ❌ **IF AVINASH SAYS "Aaj koi enquiry nahi hai"**

**Agent:**
"Koi baat nahi Avinash ji. Jab enquiry aaye, bas mujhe bata dena.
Main har week **ek short follow-up** kar lunga. 👍"

---

## 🕒 **IF AVINASH SAYS "Busy hoon" / "Call later"**

**Agent (Soft & Respectful):**
"Bilkul Avinash ji, koi tension nahi.
Aap boliye **aapka suitable time** kaunsa hoga?
Main **exact ussi time** pe call kar lunga."

→ Schedule callback → End politely.

---

## 😐 **IF AVINASH SOUNDS IRRITATED**

**Agent (Calm & Soft):**
"Bilkul samajh raha hoon Avinash ji, main aapka time respect karta hoon.
Chaliye, aaj ke liye main disturb nahi karta.
Bas aap bata dein **kab** connect karna theek rahega, main wahi time call kar lunga."

---

### **5. Closing**

**Agent:**
"Thank you **Avinash ji**.
Aapka din shubh ho.
Main phir connect karta hoon. **Dhanyavaad.**"

---

# ⭐ Agent Behavioral Rules (Stay Consistent)

* Speak **slow and friendly**.
* Pause after every question.
* Never oversell.
* Name usage should feel natural — **not forced**.
* If Avinash gives short replies → **shorten your replies** too.

---

## Next Upgrade (Optional)

I can now generate **Voice Style Tone Variants** for Avinash:

| Style                            | Description                               |
| -------------------------------- | ----------------------------------------- |
| **Field-Bhaiya Style**           | Warm, relatable, trust-building           |
| **Corporate Polite Style**       | Clean, respectful, minimal emotional tone |
| **High-Energy Activation Style** | Motivational tone used during contests    |

### Choose your preferred tone:

Reply with **A**, **B**, or **C**:

A) **Field-Bhaiya** (relationship-driven)
B) **Corporate Polite** (professional clean tone)
C) **High-Energy Contest Push** (for activations)
`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY,
      },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT,
        initialOutputMedium: 'MESSAGE_MEDIUM_VOICE',
        languageHint: 'hi-IN',
        recordingEnabled: true,
        selectedTools: [],
        voice: 'ad69ddb2-363f-4279-adf4-5961f127ec2f',
        medium: {
          serverWebSocket: {
            inputSampleRate: 48000,
            outputSampleRate: 48000,
          }
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `Failed to create call: ${error}` }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});