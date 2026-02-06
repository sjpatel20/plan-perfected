
# Accessibility Enhancements for Non-Educated Farmers

This plan outlines features to make KisanIQ usable by farmers with limited literacy or technical experience.

## Overview

The goal is to create a "Voice-First, Visual-Heavy" experience where farmers can operate the entire app using voice commands, large visual icons, and audio feedback without needing to read text.

## Key Features to Implement

### 1. Voice Input for AI Chat (High Priority)
Add a microphone button to the Expert Chat (AIkosh) that allows farmers to speak their questions instead of typing.

**What it does:**
- Large microphone button next to the text input
- Tap and hold to record voice
- Visual feedback (pulsing animation) while recording
- Automatic transcription using Web Speech API
- Works in regional languages (Hindi, Telugu, Tamil, Marathi)

**User Experience:**
```text
+------------------------------------------+
|  Ask your question...          [Mic] [>] |
+------------------------------------------+
         Press and hold to speak
```

### 2. Text-to-Speech for AI Responses
Add a speaker button on AI responses so farmers can listen to advice.

**What it does:**
- Speaker icon on each AI response message
- Reads the response aloud in the selected language
- Pause/Resume controls
- Adjustable speech rate (slower for complex advice)

### 3. Visual Quick Actions with Audio Labels
Enhance the dashboard quick action cards with audio support.

**What it does:**
- Larger touch targets (minimum 48x48px icons)
- Long-press on any card plays audio description
- Add emoji/pictograms alongside icons for universal recognition
- Color-coded categories (green for crops, blue for weather, orange for market)

**Visual Representation:**
```text
+----------------+  +----------------+
|    [Camera]    |  |   [Clouds]     |
|      ||||      |  |      ||||      |
|   Scan Crop    |  |    Weather     |
| (tap & listen) |  | (tap & listen) |
+----------------+  +----------------+
```

### 4. Simplified Mode Toggle
Add a "Simple Mode" setting that transforms the UI for low-literacy users.

**When enabled:**
- Larger fonts and buttons
- Fewer options shown at once
- More visual icons, fewer text labels
- Audio instructions on each screen
- Simplified navigation with picture-based menu

### 5. Visual Tutorials / Guided Walkthrough
Add animated tutorials showing how to use key features.

**Implementation:**
- Auto-play visual guide on first visit to each feature
- Simple animations showing tap gestures
- No text required - purely visual instruction
- Skip button for experienced users

### 6. Voice-Guided Onboarding
Enhance the onboarding wizard with audio narration.

**What it does:**
- Auto-play voice instruction for each step
- "Enter your name" spoken in selected language
- Voice confirmation of entered values
- Number pad with audio feedback for phone entry

### 7. Emergency Help Button
Add a floating help button throughout the app.

**What it does:**
- Always visible floating action button
- Tapping it opens AIkosh with a pre-filled voice prompt
- "I need help" in the user's language
- Direct call option to local KVK (agricultural extension)

## Implementation Order

| Phase | Feature | Complexity |
|-------|---------|------------|
| 1 | Voice Input in Chat | Medium |
| 1 | Text-to-Speech for Responses | Medium |
| 2 | Simple Mode Toggle | Medium |
| 2 | Larger Touch Targets | Low |
| 3 | Visual Tutorials | High |
| 3 | Voice-Guided Onboarding | High |
| 4 | Emergency Help Button | Low |

## Technical Details

### Voice Input Implementation
- Use Web Speech API (`SpeechRecognition`) for browser-native voice capture
- Set language based on user's preferred language setting
- Fallback to manual text input if voice not supported
- No external API needed for basic recognition

### Text-to-Speech Implementation
- Use Web Speech API (`SpeechSynthesis`) for reading text
- Map language codes to available voices
- Queue management for long responses
- Visual indicator showing which text is being read

### Simple Mode State
- Store preference in `localStorage` and user profile
- Toggle in Settings page
- Global context to apply UI modifications
- Conditional rendering for simplified components

### Files to Create/Modify
1. `src/components/voice/VoiceInput.tsx` - Voice recording component
2. `src/components/voice/TextToSpeech.tsx` - Audio playback component
3. `src/contexts/AccessibilityContext.tsx` - Simple mode state
4. `src/components/help/FloatingHelpButton.tsx` - Emergency help
5. `src/components/tutorials/FeatureTutorial.tsx` - Visual guides
6. Modify `ChatInput.tsx` - Add microphone button
7. Modify `ChatMessage.tsx` - Add speaker button
8. Modify `Settings.tsx` - Add accessibility section
9. Modify `Dashboard.tsx` - Enhance quick action cards
10. Modify `Onboarding.tsx` - Add voice guidance

## User Benefits

| Feature | Benefit for Non-Literate Farmers |
|---------|----------------------------------|
| Voice Input | No typing needed - just speak |
| Audio Responses | Listen instead of read |
| Large Icons | Easy to tap, visually clear |
| Simple Mode | Less overwhelming interface |
| Tutorials | Learn by watching, not reading |
| Help Button | Instant access to assistance |

## Notes on Bhashini Integration

The project has plans for Bhashini platform integration for regional language voice support. This plan uses the Web Speech API as an immediate solution that works without external APIs. When Bhashini is integrated later, it can replace the Web Speech API for better regional language accuracy.
