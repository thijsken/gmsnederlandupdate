const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { admin, db } = require('./api/firebaseAdmin');  // import admin & db instance

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // product: zet hier je frontend URL
    methods: ['GET', 'POST'],
  },
});

// Chats cache (optioneel, voor snellere toegang)
const chats = {};

// Socket.IO verbinding
io.on('connection', (socket) => {
  console.log('📡 Verbonden:', socket.id);

  socket.on('authenticate', ({ userId }) => {
    console.log('✅ Geauthenticeerd:', userId);
    socket.userId = userId;
    socket.emit('authentication_success');
  });

  // Nieuwe chat aanmaken
  socket.on('create_chat', async (data) => {
    const chatId = data.customerId;
    const now = new Date().toISOString();

    const chatData = {
      id: chatId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      createdAt: now,
      lastActivity: now,
      messages: [],
    };

    chats[chatId] = chatData;

    try {
      await db.collection('chats').doc(chatId).set(chatData);
      console.log(`🆕 Chat opgeslagen in Firestore: ${chatId}`);
    } catch (err) {
      console.error('❌ Fout bij opslaan chat:', err);
    }

    io.emit('new_chat', chatData);
  });

  // Nieuw bericht toevoegen
  socket.on('send_message', async (message) => {
    if (!chats[message.chatId]) {
      console.warn('⚠️ Chat niet gevonden:', message.chatId);
      return;
    }

    // Voeg bericht toe aan lokale cache
    chats[message.chatId].messages.push(message);
    chats[message.chatId].lastActivity = new Date().toISOString();

    // Update Firestore document (messages array en lastActivity)
    try {
      const chatRef = db.collection('chats').doc(message.chatId);
      await chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(message),
        lastActivity: chats[message.chatId].lastActivity,
      });
      console.log(`💾 Bericht opgeslagen in Firestore chat ${message.chatId}`);
    } catch (err) {
      console.error('❌ Fout bij opslaan bericht:', err);
    }

    console.log(`💬 [${message.sender}] ${message.content}`);
    io.emit('new_message', message);
  });

  // Actieve chats opvragen
  socket.on('get_active_chats', async () => {
    try {
      const snapshot = await db.collection('chats').orderBy('lastActivity', 'desc').get();
      const allChats = snapshot.docs.map(doc => doc.data());
      socket.emit('chat_list', allChats);
    } catch (err) {
      console.error('❌ Fout bij ophalen chats:', err);
      socket.emit('chat_list', []);
    }
  });

  // Geschiedenis chat opvragen
  socket.on('get_chat_history', async ({ chatId }) => {
    try {
      const doc = await db.collection('chats').doc(chatId).get();
      if (!doc.exists) {
        socket.emit('chat_history', { chat: null, messages: [] });
      } else {
        const chatData = doc.data();
        socket.emit('chat_history', {
          chat: chatData,
          messages: chatData.messages || [],
        });
      }
    } catch (err) {
      console.error('❌ Fout bij ophalen chat geschiedenis:', err);
      socket.emit('chat_history', { chat: null, messages: [] });
    }
  });

  // Supportstatus instellen en opvragen
  socket.on('set_support_status', (status) => {
    io.emit('support_status', status);
    console.log('🔄 Supportstatus:', status);
  });

  socket.on('get_support_status', () => {
    io.emit('support_status', 'online');
  });
});

// Server starten
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Support backend draait op http://localhost:${PORT}`);
});
