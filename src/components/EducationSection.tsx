import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Sparkles, Loader2, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatAPI, ChatMessage } from "@/lib/api";
import { toast } from "sonner";

const EducationSection = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const responseText = await chatAPI.sendMessage(newMessage.text, apiKey);
      const aiResponse: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "I apologize, but I'm having trouble retrieving knowledge at this moment.";
      toast.error("Knowledge engine connection issue.");
      setMessages(prev => [...prev, {
        role: 'model',
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Tell me about 9th-century Nath traditions at Kadri Manjunatha",
    "What is the significance of Thenku Thittu Yakshagana?",
    "Explain the history of Mangaladevi Temple and Mangalore's naming",
    "How are 400-year-old Kaavi murals preserved on coastal shrine walls?"
  ];

  return (
    <section className="min-h-[calc(100vh-80px)] w-full bg-[#F5F0E7] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col h-[82vh] border border-[#D8CEBE] bg-white rounded-sm overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-[#24170F] text-[#F5F0E7] p-6 flex items-center justify-between border-b border-[#D8CEBE]">
          <div className="flex items-center gap-3">
            <div className="bg-[#C9562D]/20 border border-[#C9562D]/40 p-2 rounded-sm text-[#D9782A]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-[#F5F0E7]">CultureVerse Scholar</h2>
              <p className="text-xs font-mono text-[#D8CEBE] mt-0.5 uppercase tracking-wider">Coastal Heritage & Liturgical Lore</p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9782A] border border-[#D9782A]/30 px-2 py-1 rounded-sm">
            Curated Corpus
          </span>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6 bg-[#F5F0E7]" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 my-auto py-12">
              <div className="w-12 h-12 rounded-sm bg-[#EFE7DA] border border-[#D8CEBE] flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#C9562D]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl text-[#24170F] font-light">
                  Sacred Knowledge Dialogue
                </h3>
                <p className="text-xs sm:text-sm text-[#756B62] max-w-md mx-auto leading-relaxed">
                  Inquire into the epigraphy, ritual codes, coastal folklore, and architectural traditions of coastal Karnataka.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl pt-4">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(s)}
                    className="p-3.5 border border-[#D8CEBE] bg-white hover:border-[#24170F] transition-all text-left text-xs font-serif text-[#2B211B] rounded-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`h-8 w-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                      m.role === 'user' ? 'bg-[#24170F] text-white' : 'bg-[#C9562D] text-white'
                    }`}>
                      {m.role === 'user' ? <User className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                    </div>

                    {/* Message content */}
                    <div className={`p-4 rounded-sm text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#24170F] text-[#F5F0E7]'
                        : 'bg-white border border-[#D8CEBE] text-[#2B211B] font-serif shadow-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="h-8 w-8 rounded-sm bg-[#C9562D] flex items-center justify-center flex-shrink-0 text-white">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-[#D8CEBE] p-4 rounded-sm shadow-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#C9562D]" />
                      <span className="text-xs font-mono text-[#756B62]">Consulting regional epigraphic records...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#D8CEBE]">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2 max-w-3xl mx-auto relative"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about rituals, temple histories, folk dance-drama..."
              className="pr-12 h-11 bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-xs text-[#2B211B] placeholder:text-[#756B62]"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#C9562D] hover:bg-[#B24722] text-white rounded-sm px-4 h-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
