# AI App Builder

## Current State
- Chat interface with sidebar (session list), dark theme
- AI simulated responses with code blocks
- Desktop-only layout (no mobile support)
- No app preview panel
- No system prompting feature
- Sidebar collapses to icons

## Requested Changes (Diff)

### Add
- Mobile/Android responsive layout: sidebar becomes bottom drawer on small screens, full-width chat
- App Preview Panel: split-view with resizable pane showing a simulated app preview (iframe/rendered HTML preview) when AI generates code
- System Prompt settings panel: allow user to set a system prompt that prefixes all AI requests
- Settings modal: system prompt, model selection (UI only), language toggle (Bengali/English)
- Prompt templates panel: quick-access prompt buttons for common tasks
- Copy code button on all code blocks
- Chat history search
- Mobile bottom nav bar with New Chat, History, Settings buttons

### Modify
- Layout to be fully responsive (flex column on mobile, flex row on desktop)
- Sidebar: hidden on mobile, shown as slide-over drawer instead
- ChatArea: full width on mobile, proper padding for mobile keyboards
- ChatInput: larger touch targets on mobile

### Remove
- Nothing removed

## Implementation Plan
1. Make App.tsx layout responsive with mobile breakpoints
2. Add MobileHeader + bottom nav for mobile
3. Create PreviewPanel component with tab toggle (Code / Preview)
4. Add SystemPromptModal with settings gear icon
5. Update ChatArea to show preview panel on desktop when AI responds with code
6. Add search input to sidebar for filtering sessions
7. Add copy-to-clipboard on CodeBlock
8. Ensure all touch targets >= 44px for Android friendliness
