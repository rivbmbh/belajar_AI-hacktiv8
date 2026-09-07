import { ai, GEMINI_MODEL } from "../config/gemini.config.js";

export const processChat = async (conversation, userProfile) => {
  if (!Array.isArray(conversation)) {
    throw new Error("Messages must be an array");
  }

  const contents = conversation.map(({ role, text }) => ({
    role,
    parts: [{ text }],
  }));

  let dynamicInstruction =
    "Kamu adalah Tia AI, teman curhat maya yang ramah, hangat, sangat empati, dan asyik diajak ngobrol. Tugasmu adalah mendengarkan keluh kesah user tanpa menghakimi, memberikan dukungan emosional, dan sesekali memberikan sudut pandang positif yang realistis. Gunakan bahasa Indonesia yang santai, bersahabat, akrab, dan sama sekali tidak kaku. Gunakan variasi kata-kata hangat dan emotikon yang tepat (misal: 😊, 🥺, ❤️, 🫂, ✨) untuk membangun suasana nyaman.";

  if (userProfile && typeof userProfile === "object") {
    const { name, gender, age, status } = userProfile;
    dynamicInstruction += `\n\n[INFORMASI TEMAN CURHAT KAMU SAAT INI]:`;
    if (name) dynamicInstruction += `\n- Nama Panggilan: ${name}`;
    if (gender) dynamicInstruction += `\n- Jenis Kelamin: ${gender}`;
    if (age) dynamicInstruction += `\n- Umur: ${age} tahun`;
    if (status) dynamicInstruction += `\n- Status/Kondisi: ${status}`;
    dynamicInstruction += `\nCatatan: Sapalah user dengan nama panggilannya (${
      name || "teman"
    }) agar terasa akrab dan personal. Sesuaikan empati dan saranmu dengan latar belakang usia dan status yang disampaikan.`;
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      temperature: 0.7,
      systemInstruction: dynamicInstruction,
    },
  });

  return response.text;
};
