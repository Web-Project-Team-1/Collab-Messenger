# Collab Messenger App

**Connecto** is a modern communication and collaboration platform designed for individuals and teams. It supports real-time messaging, resource sharing, and video/audio meetings, making it an ideal solution for enhancing productivity and teamwork.

---

## Features

### Public Access
- **Landing Page**: Displays the total number of active users.
- **Authentication**: User registration and login using Firebase, ensuring secure access.

### User Features
- **Profile Management**: Users can update their name, avatar, and personal details.
- **Search Functionality**: Users can search for others by name or email.
- **Multiple Team Membership**: A user can belong to multiple teams.

### Team Management
- **Team Ownership**: Teams are created by users who act as owners of the team.
- **Team Page**: Displays team details and a list of all channels associated with the team.
- **Participant Management**: Users can leave the team and stop receiving messages.


### Channels & Chats
- **Chat Features**:
  - Messages are displayed in chronological order.
  - Emoji picker presents in the chatbox.

### Meetings
- **Audio/Video Calls**: Includes features such as raise hand, chat, participant list, and call timing.
- **Gallery View**: Displays participants in a column layout.
- **Meeting Reports**: Tracks participation time and generates a summary.

---

## Functional Requirements

### Users
- Have a **username**, **email** (unique), **phone number**, and **profile photo**.
- Can belong to multiple teams and participate in multiple channels.

### Teams
- Have a **name** and an **owner**.
- Include a list of **members** and associated **channels**.
- Can be created from each user.

### Channels
- Have a **title** and at least one participant.
- Can be created from each user.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Web-Project-Team-1/Collab-Messenger.git
