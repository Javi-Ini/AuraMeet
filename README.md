# AuraMeet

A meeting intelligence platform that converts audio recordings into structured meeting notes.

## The Problem

During online classes and meetings, it's easy to get distracted and miss important information. AuraMeet solves this by letting you upload a recording after the fact and instantly generating clean, organized notes.

## How It Works

1. Upload an audio or video recording (mp4, m4a, aiff, mp3, wav)
2. Whisper transcribes the audio into raw text
3. An LLM structures the transcription into organized meeting notes
4. View and export the notes as Markdown

## Tech Stack

- **Next.js** — frontend and backend API routes
- **TypeScript** — type safety throughout
- **Prisma + SQLite** — database for storing uploads and generated notes
- **OpenAI Whisper** — local audio transcription
- **Groq (llama-3.3-70b-versatile)** — LLM for structuring notes
- **ReactMarkdown** — rendering formatted notes in the browser

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.9+
- ffmpeg (brew install ffmpeg on macOS)
- Whisper (pip3 install openai-whisper)
- A Groq API key (free at groq.com)

### Installation

Clone the repo and install dependencies:

    git clone https://github.com/Javi-Ini/AuraMeet.git
    cd AuraMeet
    npm install

### Environment Setup

Create a .env file in the root:

    DATABASE_URL="file:./dev.db"
    GROQ_API_KEY=your_groq_api_key_here

### Database Setup

    npx prisma migrate dev

### Run the App

    npm run dev

Open http://localhost:3000 in your browser.