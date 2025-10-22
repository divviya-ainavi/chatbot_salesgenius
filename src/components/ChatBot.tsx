import React, { useState, useRef, useEffect } from "react";
import { Send, Copy, Check, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputMessage]);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const streamText = async (text: string, messageId: string) => {
    const words = text.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: currentText,
                isStreaming: i < words.length - 1,
              }
            : msg
        )
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 30 + Math.random() * 40)
      );
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://salesgenius.ainavi.co.uk/n8n/webhook/mockup-chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseText =
        data?.[0].output ||
        data?.[0]?.text ||
        "I apologize, but I received an empty response.";

      const botMessageId = generateId();
      const botMessage: Message = {
        id: botMessageId,
        type: "bot",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);

      await streamText(responseText, botMessageId);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: generateId(),
        type: "bot",
        content:
          "I apologize, but I encountered an error while processing your message. Please check if the API server is running and try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/chatbotlogo (1) copy.png"
                alt="Bravura AI Logo"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Bravura-AI Partner
                </h1>
                <p className="text-sm text-gray-500">
                  Your intelligent companion for any question
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-3xl mb-6 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              {/* <img
                src="/chatbotlogo (1) copy.png"
                alt="Bravura AI Logo"
                className="h-12 w-auto"
              /> */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome! How can I help you today?
              </h3>
              <p className="text-gray-600 max-w-md leading-relaxed">
                I'm here to assist with your questions, provide recommendations,
                or help with any tasks you have in mind. Let's start a
                conversation!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={message.id} className="mb-8">
              {message.type === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl px-6 py-3 max-w-2xl shadow-lg">
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="group">
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-2.5 rounded-2xl flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                      <div className="prose prose-gray max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-xl font-bold mb-3 text-gray-800">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-medium mb-2 text-gray-800">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-3 text-gray-700 leading-relaxed">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-3 text-gray-700 space-y-1">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-3 text-gray-700 space-y-1">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-relaxed">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-gray-800">
                                {children}
                              </strong>
                            ),
                            code: ({ children }) => (
                              <code className="bg-gradient-to-r from-blue-50 to-cyan-50 px-2 py-1 rounded text-sm font-mono text-blue-800 border border-blue-200">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl overflow-x-auto text-sm font-mono mb-3 border border-blue-200 shadow-inner">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div className="flex items-center space-x-2 ml-16 transition-all duration-300">
                    <button
                      onClick={() =>
                        copyToClipboard(message.content, message.id)
                      }
                      className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border ${
                        copiedMessageId === message.id
                          ? "text-white bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-300"
                          : "text-gray-600 hover:text-white bg-white/70 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 border-white/50"
                      }`}
                      title="Copy response"
                    >
                      {copiedMessageId === message.id ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span className="text-white font-medium">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-2.5 rounded-2xl shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="text-gray-600 text-sm">
                      Bravura AI Partner is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-white/50 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              disabled={isLoading}
              rows={1}
              className="w-full px-6 py-4 pr-16 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg placeholder-gray-500 resize-none overflow-hidden min-h-[56px] max-h-[120px]"
              style={{ height: "auto" }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-3 bottom-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-xl focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Press Enter to send • Shift+Enter for new line • AI Assistant can
            make mistakes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
