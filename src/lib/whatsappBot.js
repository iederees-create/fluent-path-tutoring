/**
 * WhatsApp AI Conversational Intake Agent Blueprint
 * Powered by LangChain, OpenAI, and Twilio / WhatsApp Cloud API.
 * Handles student screening, speech evaluation, scheduling coordinates, and Stripe invoicing automatically.
 */
export const whatsappBotBlueprint = {
  name: "FluentPath WhatsApp AI Intake Agent",
  version: "1.0.0",
  engine: "gpt-4o-mini / claude-3-5-sonnet",
  
  // 1. Initial Intake Flow Prompt Prompt
  systemPrompt: `
    You are 'Aura', the Senior AI Placement Director at FluentPath.
    Your mission is to welcome new learners, perform a brief conversational speech assessment, identify their target language track (English, Spanish, French, Japanese), and pitch the appropriate 24-week subscription tier.
    
    Conversation Structure:
    1. Welcome the student and ask about their career background.
    2. Ask them to share a 30-second WhatsApp voice note answering: 'What is your primary communications obstacle at work?'
    3. (Integration) Trigger the voice-to-text API (Whisper) to analyze pronunciation, pace, and grammar.
    4. Provide direct conversational praise and offer an immediate recommended tier.
    5. Generate a secure, pre-filled Stripe Checkout billing link to initiate the 24-week roadmap instantly.
  `,

  // 2. Simulated Webhook API handler to process message events
  async handleIncomingMessage(payload) {
    const { From, Body, MediaUrl0, MimeType } = payload;
    console.log(`[WhatsApp Bot] Received message from ${From}: ${Body}`);

    // If student sent a voice note, run speech-to-text
    let transcription = "";
    if (MediaUrl0 && MimeType.startsWith("audio/")) {
      console.log(`[WhatsApp Bot] Processing speech note at: ${MediaUrl0}`);
      transcription = "Simulated Whisper API transcription: 'I want to increase my presentation skills because I get nervous in board meetings.'";
    }

    // Process using LLM
    const replyText = transcription 
      ? `Aura here! I analyzed your voice note. You speak with great baseline speed, but we can definitely polish your rhythm and transitional signposts. I highly recommend our 24-Week Professional Tier ($160/mo) to unlock your presentation roadmap. Pay securely here: https://iederees-create.github.io/fluent-path-tutoring/#/checkout?tier=professional`
      : `Hi! Welcome to FluentPath! 🌟 I'm Aura, your AI Placement Director. To customize your 24-week professional curriculum, tell me a little about your current job role and what language you are looking to master!`;

    return {
      to: From,
      body: replyText
    };
  }
};
