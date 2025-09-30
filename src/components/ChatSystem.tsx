import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  MessageCircle, Send, Phone, Video, MoreVertical, 
  User, Stethoscope, Clock, Search 
} from 'lucide-react';

interface ChatSystemProps {
  user: any;
  userType: 'patient' | 'doctor';
}

export function ChatSystem({ user, userType }: ChatSystemProps) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat data
  const chats = [
    {
      id: 1,
      name: userType === 'patient' ? 'Dr. Van Doom' : 'Coco Marxton',
      role: userType === 'patient' ? 'Cardiologist' : 'Patient',
      lastMessage: 'Thank you for the consultation',
      timestamp: '2 min ago',
      unread: 2,
      status: 'online',
      avatar: null
    },
    {
      id: 2,
      name: userType === 'patient' ? 'Dr. Jojo Makaguba' : 'James Reid',
      role: userType === 'patient' ? 'General Practitioner' : 'Patient',
      lastMessage: 'Your test results are ready',
      timestamp: '1 hour ago',
      unread: 0,
      status: 'offline',
      avatar: null
    },
    {
      id: 3,
      name: userType === 'patient' ? 'Dr. Richard Reeds' : 'Inday Puday',
      role: userType === 'patient' ? 'Dermatologist' : 'Patient',
      lastMessage: 'Please follow the treatment plan',
      timestamp: '3 hours ago',
      unread: 1,
      status: 'busy',
      avatar: null
    }
  ];

  const messages = selectedChat ? [
    {
      id: 1,
      senderId: selectedChat.id,
      senderName: selectedChat.name,
      content: 'Hello! How are you feeling today?',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      senderId: user.id,
      senderName: user.user_metadata?.name || 'You',
      content: 'Hi Doctor, I\'m feeling much better after taking the prescribed medication.',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      senderId: selectedChat.id,
      senderName: selectedChat.name,
      content: 'That\'s great to hear! Continue taking the medication as prescribed. Any side effects?',
      timestamp: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      senderId: user.id,
      senderName: user.user_metadata?.name || 'You',
      content: 'No side effects so far. Thank you for the follow-up.',
      timestamp: '10:36 AM',
      isOwn: true
    }
  ] : [];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      // In a real app, this would send to the backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
        <p className="text-gray-600">
          {userType === 'patient' ? 'Chat with your doctors' : 'Chat with your patients'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Chat List */}
        <div className="md:col-span-1">
          <Card className="h-full border-pink-100">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-300"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedChat?.id === chat.id
                        ? 'bg-pink-50 border-l-pink-500'
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          {userType === 'patient' ? (
                            <Stethoscope className="w-5 h-5 text-pink-600" />
                          ) : (
                            <User className="w-5 h-5 text-pink-600" />
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
                          {chat.unread > 0 && (
                            <Badge className="bg-pink-500 text-white text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{chat.role}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2">
          {selectedChat ? (
            <Card className="h-full border-pink-100 flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        {userType === 'patient' ? (
                          <Stethoscope className="w-5 h-5 text-pink-600" />
                        ) : (
                          <User className="w-5 h-5 text-pink-600" />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedChat.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-500">{selectedChat.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-pink-200">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-pink-200">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-pink-200">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isOwn ? 'text-pink-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 border-pink-200 focus:border-pink-300"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full border-pink-100 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">
                  Choose a {userType === 'patient' ? 'doctor' : 'patient'} from the list to start chatting
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}