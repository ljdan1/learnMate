document.addEventListener('DOMContentLoaded', function() {
    const personalContext = `
You are an AI assistant representing LearnMate, an AI-driven learning platform. Here's the comprehensive information about LearnMate:

MISSION & VISION:
- Name: LearnMate
- Tagline: Empowering Students Through AI-Driven Learning
- Goal: To help students in grades 9-12 succeed in their exam preparation journey by creating an accessible, AI-powered tutoring platform.
- Focus: Personalized education for effective and confidence-building entrance exam preparation.
- Languages: Supports learning in both English and Amharic.

OUR STORY:
- Origin: Emerged from our founder's grade 12 experience, witnessing students struggle with new curriculum and entrance tests.
- Philosophy: "When technology meets education, even the smallest student can achieve great success."

PRODUCTS:
1. LearnMate AI Tutor:
   - Description: An intelligent chatbot that answers questions from Grades 9–12 subjects like math, physics, biology, and chemistry.
   - Key Feature: Bilingual AI Support (English + Amharic), trained on school subjects.
2. Exam Practice & Quiz Engine:
   - Description: A smart quiz system that includes past national exams, chapter-based tests, and personalized quizzes.
   - Key Feature: Custom quizzes based on performance.
   - Benefit: Improves exam scores by focusing on areas where students need the most help.
3. Study Planner:
   - Description: Creates a daily or weekly study plan to help students prepare for exams on time.
   - Key Feature: AI-powered scheduling.
   - Benefit: Reduces exam anxiety by ensuring students are well-prepared and confident.

TEAM (Key Personnel - from HTML):
- Daniel : Founder & CEO (Leads product development and AI chatbot training)
- Rediet : CFO (Manages budgeting, financial planning, and funding)
- Eyob : CTO (Leads technology development, AI integration, and platform scalability/security)

TESTIMONIALS (Examples):
- Rediet  (Directed bootcamp classmate): "LearnMate helped me understand difficult physics topics step-by-step, and I improved my test scores dramatically."
- Eyob  (Directed bootcamp classmate): "The personalized quizzes pinpointed exactly where I was struggling, and the instant feedback really helped me focus my studies. I felt more confident going into my exams."

CONTACT INFORMATION:
- Email: info@learnmate.com
- Phone: +251 91 234 56780
- Location: Addis Ababa, Ethiopia

When answering questions, be helpful, encouraging, and informative, representing the LearnMate platform. Provide specific details when asked about products, features, or the platform's story. Be enthusiastic about LearnMate's mission to transform education.
    `;

    let puterInstance = null; 
    let puterInitializationAttempted = false; 

    async function initializePuterOnce() {
        if (puterInstance || puterInitializationAttempted) {
            
            return;
        }
        puterInitializationAttempted = true;

        if (typeof window.puter === 'undefined') {
            console.error('Puter SDK (window.puter) not found. Ensure Puter.js script is loaded before this script.');
            
            if (sendButton) sendButton.disabled = true;
            if (chatInput) {
                chatInput.placeholder = "AI Assistant unavailable.";
                chatInput.disabled = true;
            }
            addMessage("The AI assistant is currently unavailable. Please ensure you are connected to the internet and try refreshing the page.");
            return;
        }

        try {
            console.log('Attempting to use Puter SDK...');
            puterInstance = window.puter; 
            
            console.log('Puter SDK is available and assigned to puterInstance.');
        } catch (error) {
            console.error('Error assigning or initializing Puter SDK:', error);
            puterInstance = null; 
            addMessage("There was an error initializing the AI assistant. Please try again later.");
            if (sendButton) sendButton.disabled = true;
            if (chatInput) {
                chatInput.placeholder = "AI Assistant initialization failed.";
                chatInput.disabled = true;
            }
        }
    }

    const chatMessages = document.querySelector('.ai-tutor-messages');
    const chatInput = document.querySelector('.ai-tutor-input');
    const sendButton = document.querySelector('.ai-tutor-send-btn');
    const chatBox = document.querySelector('.ai-tutor-chatbox');
    let typingIndicator;

    if (chatBox) {
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator'; 
        typingIndicator.style.display = 'none'; 
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';

        const inputRow = document.querySelector('.ai-tutor-input-row');
        if (inputRow) {
            chatBox.insertBefore(typingIndicator, inputRow);
        } else {
            chatBox.appendChild(typingIndicator); // Fallback append
        }
    } else {
        console.error("Chatbox element '.ai-tutor-chatbox' not found. Typing indicator cannot be added.");
    }

    
    window.addEventListener('load', initializePuterOnce);

    function addMessage(content, isUser = false) {
        if (!chatMessages) {
            console.error("Chat messages container '.ai-tutor-messages' not found.");
            return;
        }

        const messageRow = document.createElement('div');
        messageRow.className = 'ai-tutor-message-row';

        const messageBubble = document.createElement('div');
        messageBubble.className = 'ai-tutor-message';
        messageBubble.textContent = content;
       
        const icon = document.createElement('img');

        if (isUser) {
            messageRow.classList.add('ai-tutor-message-row-user');
            messageBubble.classList.add('ai-tutor-message-user');
            icon.src = '../public/user.png'; 
            icon.alt = 'User';
            icon.className = 'ai-tutor-user-icon';
            messageRow.appendChild(messageBubble);
            messageRow.appendChild(icon);
        } else { 
            messageBubble.classList.add('ai-tutor-message-bot');
            icon.src = '../public/bot-1.png';
            icon.alt = 'Bot';
            icon.className = 'ai-tutor-bot-icon';
            messageRow.appendChild(icon);
            messageRow.appendChild(messageBubble);
        }

        chatMessages.appendChild(messageRow);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    async function sendMessage() {
        if (!chatInput || !sendButton) {
             console.error("Chat input or send button not found.");
             return;
        }
        const message = chatInput.value.trim();
        
        if (!message) {
            addMessage("Please enter some question you want to ask."); 
            chatInput.focus(); 
            return; 
        }

        addMessage(message, true);
        chatInput.value = '';
        sendButton.disabled = true;
        showTypingIndicator();


        if (!puterInstance) {   
            await initializePuterOnce(); 
            if (!puterInstance) { 
                console.error('Puter AI chat is not available (puterInstance is null after second attempt).');
                hideTypingIndicator();
                addMessage("Sorry, the AI assistant is currently unavailable. Please check your connection or try refreshing the page.");
                sendButton.disabled = false;
                chatInput.focus();
                return;
            }
        }
        
        if (typeof puterInstance.ai?.chat !== 'function') {
            console.error('Puter AI chat function is not available on puterInstance.');
            hideTypingIndicator();
            addMessage("Sorry, the AI assistant is experiencing a technical difficulty. Please try again later.");
            sendButton.disabled = false;
            chatInput.focus();
            return;
        }

        try {
            const fullPrompt = `${personalContext}\n\nUser question: ${message}\n\nPlease respond as LearnMate's AI assistant, providing helpful and accurate information based on the context above.`;
            const response = await puterInstance.ai.chat(fullPrompt, {
                model: 'gpt-4', 
                temperature: 0.7,
                max_tokens: 500
            });

            hideTypingIndicator();

            if (response && response.message) {
                addMessage(response.message);
            } else {
                addMessage("I'm here to help! Ask me about LearnMate's products, features, or our mission.");
            }

        } catch (error) {
            console.error('Error sending message:', error);
            hideTypingIndicator();
            const fallbackResponse = getFallbackResponse(message.toLowerCase());
            addMessage(fallbackResponse);
        }

        sendButton.disabled = false;
        chatInput.focus();
    }

    function getFallbackResponse(message) {
        if (message.includes('who are you')|| message.includes('what is learnmate') || message.includes('about learnmate')) {
            return "I am LearnMate's AI assistant! LearnMate is an AI-driven learning platform designed to help students in grades 9-12 succeed in their exam preparation, offering support in English and Amharic.";
        } else if (message.includes('What services or products does it offer?')||message.includes('product') || message.includes('feature') || message.includes('tool')) {
            return "LearnMate offers an AI Tutor for subject help, an Exam Practice & Quiz Engine with personalized quizzes, and a Study Planner to organize your prep. Which one are you interested in?";
        } else if (message.includes('ai tutor')) {
            return "Our AI Tutor is an intelligent chatbot that answers questions from Grades 9–12 subjects like math, physics, biology, and chemistry, with bilingual support in English and Amharic.";
        } else if (message.includes('quiz') || message.includes('exam practice')) {
            return "The Exam Practice & Quiz Engine includes past national exams, chapter-based tests, and creates personalized quizzes based on your performance to help you focus on areas needing improvement.";
        } else if (message.includes('study plan') || message.includes('planner')) {
            return "Our Study Planner uses AI to create a daily or weekly study plan, helping you prepare for exams on time and reduce anxiety.";
        } else if (message.includes('language') || message.includes('amharic')) {
            return "Yes, LearnMate provides learning support in both English and Amharic across our tools.";
        } else if (message.includes('contact') || message.includes('reach you')) {
            return "You can reach out to LearnMate via email at info@learnmate.com or call us at +251 91 234 5678. We are based in Addis Ababa, Ethiopia.";
        } else if(message.includes('hi')|| message.includes('hello') || message.includes('hey')) {
            return "Hello! I'm here to help you with any questions about LearnMate. What would you like to know?";
        } else if (message.includes('story') || message.includes('founder')) {
            return "LearnMate was founded based on the experience of students struggling with new curricula and entrance exams. We aim to make quality exam prep accessible through AI.";

        } else if (message.includes('What problems does it solve?') || message.includes('what problems does learnmate solve?')) {
            return "LearnMate addresses key challenges in exam preparation, including personalized learning paths, access to bilingual resources, and AI-driven support to boost student confidence.";
        } else if(message.includes('Who founded the startup?') || message.includes('who is ceo')){
            return "the founder and ceo is daniel fekede ";
        }
        else if(message.includes('How can someone support or contact the team?')){
            return "You can support LearnMate by sharing our platform with others or providing feedback. To contact the team, please email info@learnmate.com.";
        }
        else if(message.includes(' who is cfo')){
            return "redu is cfo"
        }
        else if(message.includes('who is cto')){
            return "eyoba is cto"
        }
        
        else {
            return "I can tell you about LearnMate's products, features, our story, or how to get in touch. What would you like to know?";
        }
    }

    window.askQuestion = function(question) {
        if (chatInput) {
            chatInput.value = question;
            sendMessage();
        }
    }


    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

  
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                console.warn(`Smooth scroll target ${targetId} not found or invalid:`, error)
            }
        });
    });

 
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
            }
        });
    }, observerOptions);


    document.querySelectorAll('.products .card, .testimonial-card, .team-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    
});

const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
        
            console.log('Form submitted:', { name, email, message });
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
 const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing to our newsletter!');
            
        });
    }
