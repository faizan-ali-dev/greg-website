// Site assistant: a scripted chat that answers from fixed website information in the browser.
// Nothing typed here is sent anywhere or stored. To connect a live service later, replace `reply()`.
(() => {
  const root = document.querySelector('[data-assistant]');
  if (!root) return;
  const launcher = root.querySelector('.assistant-launcher');
  const panel = root.querySelector('.assistant-panel');
  const closeButton = root.querySelector('.assistant-close');
  const log = root.querySelector('.assistant-log');
  const form = root.querySelector('.assistant-form');
  const input = form.elements.q;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const wfg = 'https://agents.worldfinancialgroup.com/gregory-denizard';
  const linkedin = 'https://www.linkedin.com/in/gregdenizard/';

  // Each topic: chip label, strong and weak keywords, answer text, optional list, links and follow-up topics.
  const topics = {
    services: {
      ask: 'What does Greg do?',
      keys: ['services', 'what do you do', 'what does greg do', 'what does he do', 'offer', 'areas'],
      weak: ['help', 'work', 'help with', 'how can greg help', 'how can you help'],
      text: ['Greg helps people and organizations move forward in three ways:'],
      list: ['Salesforce & CRM consulting for nonprofits and SaaS teams', 'Financial services: insurance protection, retirement strategies and business-owner needs', 'Coaching & community through the 6TP PILL 2.0 Academy'],
      after: 'Which one would you like to know more about?',
      next: ['crm', 'financial', 'community']
    },
    about: {
      ask: 'Who is Greg?',
      keys: ['who is greg', 'about greg', 'who are you', 'background', 'bio', 'tell me about', 'about him'],
      weak: ['greg', 'gregory', 'denizard', 'who'],
      text: ['Gregory (Greg) Denizard is a consultant, financial professional and coach based in the Yonkers / New York City area.', 'His approach is simple: listen carefully, make the complex clearer, and focus on what matters to the person in front of him.'],
      links: [['More about Greg', './about.html']],
      next: ['services', 'experience', 'contact']
    },
    experience: {
      ask: 'Greg’s experience',
      keys: ['experience', 'certified', 'certification', 'certificate', 'education', 'cornell', 'columbia', 'childrens aid', 'children s aid', 'career', 'qualification', 'qualifications', 'degree', 'resume', 'cv', 'linkedin', 'sthree', 'credentials'],
      weak: ['history'],
      text: ['Greg’s background brings together nonprofit operations, customer success, business technology and community leadership.', 'He is a Salesforce Certified Administrator, holds a B.S. in Business Management from Cornell University and an Executive Leadership certification from Columbia Business School. Public reports reference his leadership at Children’s Aid.'],
      links: [['Experience & values', './experience.html'], ['LinkedIn profile', linkedin, true]],
      next: ['testimonials', 'crm']
    },
    crm: {
      ask: 'CRM consulting',
      keys: ['crm', 'salesforce', 'implementation', 'automation', 'flow', 'integration', 'integrations', 'reporting', 'report', 'dashboard', 'dashboards', 'adoption', 'training', 'nonprofit', 'saas', 'administration', 'admin', 'roadmap', 'denizard consulting', 'consulting', 'system', 'systems'],
      weak: ['data', 'business'],
      text: ['Denizard Consulting offers Salesforce and CRM consulting for nonprofits and SaaS teams.', 'Support covers implementation, administration, automation & Flow, integrations, data governance, reporting, training & adoption, and CRM strategy.', 'You don’t always need a new implementation. The first conversation looks at your goals and what’s getting in the way.'],
      links: [['CRM consulting', './crm-consulting.html'], ['Discuss your CRM', './contact.html?service=crm']],
      next: ['pricing', 'experience', 'contact']
    },
    financial: {
      ask: 'Financial services',
      keys: ['financial', 'finance', 'insurance', 'retirement', 'wfg', 'world financial', 'protection', 'business owner', 'appointment', 'money', 'planning', 'investment', 'invest', 'family'],
      weak: ['protect', 'future'],
      text: ['Greg offers conversations about insurance protection, retirement strategies and business-owner needs.', 'Appointments and current service details go through his official World Financial Group (WFG) profile. Availability depends on your location and licensing.', 'Please don’t share account numbers or other sensitive details in a general message.'],
      links: [['Financial services', './financial-services.html'], ['Greg’s WFG profile', wfg, true]],
      next: ['location', 'contact']
    },
    community: {
      ask: 'Coaching & community',
      keys: ['coaching', 'coach', 'community', 'academy', '6tp', 'pill', 'skool', 'purpose', 'mindset', 'stillness', 'leadership', 'personal growth', 'growth', 'club', 'membership', 'join'],
      weak: ['grow', 'learn'],
      text: ['The 6TP PILL 2.0 Academy lists Greg as Vice President & Certified Coach. The community focuses on stillness, purpose, leadership and lifelong learning.', 'Current program and membership details are on the Academy’s official Skool page. This is personal development, not clinical care.'],
      links: [['Coaching & community', './community.html'], ['Visit the Academy', 'https://www.skool.com/6tpswclub', true]],
      next: ['contact']
    },
    testimonials: {
      ask: 'What do people say?',
      keys: ['review', 'reviews', 'testimonial', 'testimonials', 'recommendation', 'recommendations', 'what people say', 'what do people say', 'clients say', 'feedback', 'references'],
      weak: [],
      text: ['Two LinkedIn recommendations are featured on this site:'],
      list: ['“Gregory is a fantastic leader.” Julian Schaevitz, Director at High Trail (2019)', '“Gregory’s responsiveness is unparalleled.” Ronald Skeete, nonprofit executive (2015)'],
      links: [['Read on LinkedIn', linkedin, true]],
      next: ['experience', 'contact']
    },
    contact: {
      ask: 'How do I contact Greg?',
      keys: ['contact', 'email', 'e mail', 'mail', 'phone', 'call', 'number', 'reach', 'talk to', 'book', 'meeting', 'schedule', 'get in touch', 'connect', 'speak to'],
      weak: ['talk'],
      text: ['You can reach Greg directly:'],
      list: ['Email: gregorydenizard@gmail.com', 'Phone: +1 (646) 942-1278'],
      after: 'Or use the contact page to prepare a message to him.',
      links: [['Contact page', './contact.html'], ['Email Greg', 'mailto:gregorydenizard@gmail.com'], ['Call Greg', 'tel:+16469421278']],
      next: ['location', 'pricing']
    },
    location: {
      ask: 'Where is Greg based?',
      keys: ['where', 'location', 'located', 'based', 'yonkers', 'new york', 'nyc', 'remote', 'remotely', 'online', 'virtual', 'zoom', 'in person', 'state', 'country', 'travel'],
      weak: [],
      text: ['Greg is based in Yonkers, in the New York City metro area. Remote conversations are available.', 'For financial services, availability depends on your location and licensing.'],
      links: [['Start a conversation', './contact.html']],
      next: ['contact', 'services']
    },
    pricing: {
      ask: 'How is pricing decided?',
      keys: ['price', 'prices', 'pricing', 'cost', 'costs', 'fee', 'fees', 'rate', 'rates', 'charge', 'how much', 'budget', 'quote', 'free', 'paid'],
      weak: [],
      text: ['There’s no fixed price list on this site. Scope, deliverables, timing and pricing are agreed after a first conversation about your priorities.', 'For financial services, current details are on Greg’s official WFG profile.'],
      links: [['Start a conversation', './contact.html']],
      next: ['crm', 'contact']
    },
    language: {
      ask: 'Which languages?',
      keys: ['language', 'languages', 'french', 'english', 'spanish', 'speak'],
      weak: [],
      text: ['Greg’s official financial-services profile lists English and French.'],
      next: ['contact']
    },
    privacy: {
      ask: 'Is my information safe?',
      keys: ['privacy', 'private', 'sensitive', 'ssn', 'social security', 'account number', 'password', 'secure', 'safe', 'store', 'stored', 'tracking'],
      weak: ['data'],
      text: ['This assistant runs in your browser. It doesn’t send or store what you type.', 'Please don’t share Social Security numbers, account numbers, passwords or medical details in a chat or general inquiry. Ask Greg for an appropriate channel if you need to.'],
      links: [['Privacy & disclosures', './privacy.html']],
      next: ['contact']
    }
  };
  const small = {
    greeting: {keys: ['hi', 'hello', 'hey', 'salam', 'assalam', 'assalamualaikum', 'good morning', 'good afternoon', 'good evening', 'hola'], text: ['Hello! What would you like to know about Greg?'], next: ['services', 'about', 'contact']},
    thanks: {keys: ['thanks', 'thank you', 'thx', 'great', 'awesome', 'perfect', 'ok', 'okay', 'bye', 'goodbye', 'cool'], text: ['You’re welcome! Is there anything else I can help with?'], next: ['services', 'contact']}
  };
  const welcome = {text: ['Hi, I’m the Denizard Consulting site assistant.', 'Ask me about Greg’s services, background or how to reach him.'], next: ['services', 'crm', 'financial', 'community', 'contact']};
  const fallback = {text: ['I’m a simple assistant, so I can only answer questions about Greg and this website.', 'Try one of these topics, or contact Greg directly.'], links: [['Contact page', './contact.html']], next: ['services', 'about', 'contact']};

  const normalize = text => ` ${text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()} `;
  // Strong keywords score 3, plus 1 per extra word in a phrase; weak keywords score a flat 1.
  const score = (message, keys, weight, phraseBonus) => keys.reduce((total, key) => message.includes(` ${key} `) ? total + weight + (phraseBonus ? key.split(' ').length - 1 : 0) : total, 0);
  function reply(question) {
    const message = normalize(question);
    let best = null, bestScore = 0;
    for (const [id, topic] of Object.entries(topics)) {
      const value = score(message, topic.keys, 3, true) + score(message, topic.weak, 1, false);
      if (value > bestScore) { best = id; bestScore = value; }
    }
    if (best) return topics[best];
    if (score(message, small.greeting.keys, 1)) return small.greeting;
    if (score(message, small.thanks.keys, 1)) return small.thanks;
    return fallback;
  }

  const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; };
  const scrollToEnd = () => log.scrollTo({top: log.scrollHeight, behavior: reduceMotion.matches ? 'auto' : 'smooth'});
  function addUser(text) {
    log.querySelectorAll('.assistant-chips').forEach(chips => chips.remove());
    log.append(make('div', 'assistant-msg user', text));
    scrollToEnd();
  }
  function addBot(answer) {
    const bubble = make('div', 'assistant-msg bot');
    answer.text.forEach(line => bubble.append(make('p', '', line)));
    if (answer.list) { const list = make('ul'); answer.list.forEach(item => list.append(make('li', '', item))); bubble.append(list); }
    if (answer.after) bubble.append(make('p', '', answer.after));
    if (answer.links) {
      const row = make('div', 'assistant-links');
      for (const [label, href, external] of answer.links) {
        const link = make('a', '', label); link.href = href;
        if (external) { link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `${label} (opens in new tab)`); }
        row.append(link);
      }
      bubble.append(row);
    }
    log.append(bubble);
    if (answer.next?.length) {
      const chips = make('div', 'assistant-chips');
      chips.setAttribute('aria-label', 'Suggested questions');
      answer.next.forEach(id => { const chip = make('button', '', topics[id].ask); chip.type = 'button'; chip.addEventListener('click', () => ask(topics[id].ask, topics[id])); chips.append(chip); });
      log.append(chips);
    }
    scrollToEnd();
  }
  let pending;
  function ask(question, known) {
    clearTimeout(pending);
    log.querySelector('.assistant-typing')?.remove();
    addUser(question);
    const answer = known || reply(question);
    if (reduceMotion.matches) { addBot(answer); return; }
    const typing = make('div', 'assistant-msg bot assistant-typing');
    typing.setAttribute('aria-label', 'Assistant is typing');
    typing.append(make('span'), make('span'), make('span'));
    log.append(typing); scrollToEnd();
    pending = setTimeout(() => { typing.remove(); addBot(answer); }, 650);
  }

  function open() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => root.classList.add('is-open'));
    if (!log.childElementCount) addBot(welcome);
    (finePointer.matches ? input : panel).focus({preventScroll: true});
  }
  function close() {
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    const hide = () => { if (!root.classList.contains('is-open')) panel.hidden = true; };
    reduceMotion.matches ? hide() : setTimeout(hide, 220);
    launcher.focus({preventScroll: true});
  }
  launcher.addEventListener('click', () => (panel.hidden ? open() : close()));
  closeButton.addEventListener('click', close);
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) { input.focus(); return; }
    input.value = '';
    ask(question);
  });
})();
