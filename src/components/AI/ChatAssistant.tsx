import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { mockChatReply } from '@services/ai';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  locale: string;
}

const ChatAssistant: React.FC<Props> = ({ visible, onClose, locale }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      from: 'bot',
      text: t('ai.greeting')
    }
  ]);

  if (!visible) {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: input.trim()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    const replyText = await mockChatReply(userMessage.text, locale);
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        from: 'bot',
        text: replyText
      }
    ]);
    setIsSending(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('common.aiAssistant')}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.message, item.from === 'user' ? styles.user : styles.bot]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={t('common.chatPlaceholder') ?? ''}
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
          <Text style={styles.sendText}>{isSending ? t('ai.typing') : t('common.send')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  headerText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16
  },
  close: {
    color: '#94a3b8',
    fontSize: 18
  },
  list: {
    maxHeight: 220
  },
  message: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#1d4ed8'
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b'
  },
  messageText: {
    color: '#f8fafc'
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    color: '#f8fafc'
  },
  sendButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  sendText: {
    color: '#0f172a',
    fontWeight: '700'
  }
});

export default ChatAssistant;
