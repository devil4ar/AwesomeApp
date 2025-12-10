import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LeadCard } from '../components/LeadCard';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { mockAIQuery } from '../utils/mockData';

type LeadChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadChat'
>;

interface Props {
  navigation: LeadChatScreenNavigationProp;
}

export const LeadChatScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I can help you find leads. Try asking me:\n• "Show me nearby leads"\n• "Find high score leads"\n• "Show leads in San Francisco"',
      createdAt: new Date(),
      user: { _id: 0, name: 'AI Assistant' },
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: { _id: 1, name: 'You' },
    };

    setMessages(prev => [userMessage, ...prev]);
    setInputText('');
    setIsTyping(true);

    try {
      // Query the mock AI API
      const leads = await mockAIQuery(inputText);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text:
          leads.length > 0
            ? `I found ${leads.length} lead${
                leads.length > 1 ? 's' : ''
              } for you:`
            : 'No leads found matching your query. Try a different search.',
        createdAt: new Date(),
        user: { _id: 0, name: 'AI Assistant' },
        leads: leads.length > 0 ? leads : undefined,
      };

      setMessages(prev => [aiMessage, ...prev]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        user: { _id: 0, name: 'AI Assistant' },
      };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.user._id === 1;

    return (
      <View style={styles.messageContainer}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>

          {item.leads && item.leads.length > 0 && (
            <View style={styles.leadsContainer}>
              {item.leads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onPress={() =>
                    navigation.navigate('LeadDetails', { leadId: lead.id })
                  }
                  isBestMatch={false}
                  showDistance={false}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Lead Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask me to find leads for you</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.typingText}>AI is thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about leads..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#040913ff',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#111827',
  },
  userMessageText: {
    paddingLeft: 8,
    color: '#FFFFFF',
  },
  leadsContainer: {
    marginTop: 12,
    gap: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
