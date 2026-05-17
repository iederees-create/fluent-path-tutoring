import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    nav: {
      findTutors: "Find Tutors",
      signIn: "Sign In",
      getStarted: "Get Started",
      expertPortal: "Expert Portal",
      myLearning: "My Learning"
    },
    hero: {
      badge: "Master Conversational English",
      title1: "Conversational English for",
      title2: "Real Life Confidence",
      subtitle: "The first credentialed ecosystem connecting expert tutors with ambitious global learners. Master conversation, exams, and professional English.",
      findExpert: "Find Your Expert",
      becomeTutor: "Become a Tutor"
    },
    features: {
      conversationalTitle: "Conversational English",
      conversationalDesc: "Speak naturally and confidently in everyday situations. Practical, real-life conversations from day one.",
      examTitle: "Exam Preparation",
      examDesc: "IELTS, TOEFL, and TEFL support with structured lessons and mock assessments to hit your target score.",
      skillsTitle: "Professional Skills",
      skillsDesc: "Master Business English, interview preparation, and workplace communication to advance your global career."
    },
    footer: {
      desc: "Empowering global learners to speak with confidence through real-world conversation and expert guidance.",
      platform: "Platform",
      legal: "Legal & Safety",
      experts: "For Experts",
      learningPortal: "Learning Portal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      childSafety: "Child Safety",
      tutorGuide: "Tutor Guide",
      rights: "© 2026 FluentPath Ecosystem. All rights reserved."
    }
  },
  es: {
    nav: {
      findTutors: "Buscar Tutores",
      signIn: "Iniciar Sesión",
      getStarted: "Comenzar",
      expertPortal: "Portal de Expertos",
      myLearning: "Mi Aprendizaje"
    },
    hero: {
      badge: "Domina el inglés conversacional",
      title1: "Inglés conversacional para tener",
      title2: "Confianza en la vida real",
      subtitle: "El primer ecosistema acreditado que conecta a tutores expertos con estudiantes globales ambiciosos. Domina conversaciones, exámenes e inglés profesional.",
      findExpert: "Encuentra tu Experto",
      becomeTutor: "Conviértete en Tutor"
    },
    features: {
      conversationalTitle: "Inglés Conversacional",
      conversationalDesc: "Habla con naturalidad y confianza en situaciones cotidianas. Conversaciones prácticas y reales desde el primer día.",
      examTitle: "Preparación de Exámenes",
      examDesc: "Apoyo en IELTS, TOEFL y TEFL con lecciones estructuradas y evaluaciones simuladas para alcanzar tu meta.",
      skillsTitle: "Habilidades Profesionales",
      skillsDesc: "Domina el inglés de negocios, la preparación de entrevistas y la comunicación laboral para avanzar en tu carrera."
    },
    footer: {
      desc: "Capacitando a estudiantes globales para hablar con confianza a través de conversaciones reales y tutorías expertas.",
      platform: "Plataforma",
      legal: "Legal y Seguridad",
      experts: "Para Expertos",
      learningPortal: "Portal de Aprendizaje",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      childSafety: "Protección Infantil",
      tutorGuide: "Guía del Tutor",
      rights: "© 2026 Ecosistema FluentPath. Todos los derechos reservados."
    }
  },
  pt: {
    nav: {
      findTutors: "Encontrar Tutores",
      signIn: "Entrar",
      getStarted: "Começar",
      expertPortal: "Portal do Especialista",
      myLearning: "Meu Aprendizado"
    },
    hero: {
      badge: "Domine o Inglês Conversacional",
      title1: "Inglês conversacional para",
      title2: "Confiança na vida real",
      subtitle: "O primeiro ecossistema credenciado que conecta tutores especialistas a estudantes globais ambiciosos. Domine conversação, exames e inglês profissional.",
      findExpert: "Encontrar seu Especialista",
      becomeTutor: "Seja um Tutor"
    },
    features: {
      conversationalTitle: "Inglês Conversacional",
      conversationalDesc: "Fale naturalmente e com confiança em situações do dia a dia. Conversas práticas e reais desde o primeiro dia.",
      examTitle: "Preparação para Exames",
      examDesc: "Suporte para IELTS, TOEFL e TEFL com lições estruturadas e simulados para alcançar sua pontuação ideal.",
      skillsTitle: "Habilidades Profissionais",
      skillsDesc: "Domine o inglês para negócios, preparação para entrevistas e comunicação corporativa para alavancar sua carreira."
    },
    footer: {
      desc: "Capacitando estudantes globais a falar com confiança através de conversas reais e orientação especializada.",
      platform: "Plataforma",
      legal: "Legal & Segurança",
      experts: "Para Especialistas",
      learningPortal: "Portal de Aprendizado",
      privacy: "Política de Privacidade",
      terms: "Termos de Serviço",
      childSafety: "Segurança Infantil",
      tutorGuide: "Guia do Tutor",
      rights: "© 2026 Ecossistema FluentPath. Todos os direitos reservados."
    }
  },
  ja: {
    nav: {
      findTutors: "講師を探す",
      signIn: "サインイン",
      getStarted: "今すぐ始める",
      expertPortal: "講師用ポータル",
      myLearning: "マイページ"
    },
    hero: {
      badge: "日常英会話をマスター",
      title1: "現実の自信のための",
      title2: "実践型英会話レッスン",
      subtitle: "優秀なプロ講師とグローバルで野心的な受講生をつなぐ、初の資格認定オンライン英語学習プラットフォーム。日常会話、資格試験、ビジネス英語を完全攻略。",
      findExpert: "講師を探す",
      becomeTutor: "講師に応募する"
    },
    features: {
      conversationalTitle: "日常英会話",
      conversationalDesc: "日常のあらゆるシーンで、自然かつ自信を持って英語を話しましょう。初日から実生活に役立つ英会話が身につきます。",
      examTitle: "試験対策",
      examDesc: "IELTS、TOEFL、TEFL対策を完全サポート。スコアアップに必要な模擬テストと体系化された個別指導を提供します。",
      skillsTitle: "ビジネス英語",
      skillsDesc: "ビジネス会話、面接対策、英語プレゼンテーションを習得し、グローバルキャリアでのステップアップを可能にします。"
    },
    footer: {
      desc: "実践的な会話とプロの個別指導を通じて、世界中の学習者が自信を持って話せるようにサポートします。",
      platform: "プラットフォーム",
      legal: "利用規約と安全対策",
      experts: "講師の方へ",
      learningPortal: "学習ポータル",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      childSafety: "子ども安全対策",
      tutorGuide: "講師ガイド",
      rights: "© 2026 FluentPath エコシステム. All rights reserved."
    }
  },
  zh: {
    nav: {
      findTutors: "寻找导师",
      signIn: "登录",
      getStarted: "开始使用",
      expertPortal: "导师门户",
      myLearning: "我的学习"
    },
    hero: {
      badge: "攻克英语口语",
      title1: "英语口语助您在",
      title2: "真实生活中自信表达",
      subtitle: "首个连接专家导师与雄心勃勃全球学员的专业平台。攻克日常口语、专业考试和商务英语。",
      findExpert: "寻找您的专属导师",
      becomeTutor: "成为特约导师"
    },
    features: {
      conversationalTitle: "英语口语",
      conversationalDesc: "在日常情景中自然自信地交流。从第一天起就进行实用、真实的口语演练。",
      examTitle: "备考辅导",
      examDesc: "IELTS 雅思、TOEFL 托福以及 TEFL 教学支持，配合系统化的课程和模拟测评助您顺利通关。",
      skillsTitle: "职场商务",
      skillsDesc: "熟练掌握商务英语、面试技巧和日常工作沟通，助力您的全球职场腾飞。"
    },
    footer: {
      desc: "致力于通过真实的口语交流与专家指导，帮助全球学员在真实场景中重拾英语自信。",
      platform: "平台服务",
      legal: "法律与安全",
      experts: "导师通道",
      learningPortal: "学习门户",
      privacy: "隐私政策",
      terms: "服务条款",
      childSafety: "儿童防护",
      tutorGuide: "导师指南",
      rights: "© 2026 飞路英语(FluentPath). 版权所有。"
    }
  },
  tr: {
    nav: {
      findTutors: "Eğitmen Bul",
      signIn: "Giriş Yap",
      getStarted: "Başla",
      expertPortal: "Eğitmen Paneli",
      myLearning: "Eğitimlerim"
    },
    hero: {
      badge: "İngilizce Konuşmayı Geliştir",
      title1: "Gerçek hayatta güven için",
      title2: "Pratik İngilizce Konuşma",
      subtitle: "Uzman eğitmenleri hedefi olan global öğrencilerle bir araya getiren ilk sertifikalı ekosistem. Konuşma, sınavlar ve iş İngilizcesine odaklanın.",
      findExpert: "Eğitmenini Seç",
      becomeTutor: "Eğitmen Ol"
    },
    features: {
      conversationalTitle: "Konuşma Pratiği",
      conversationalDesc: "Günlük hayatta doğal ve kendinizden emin konuşun. İlk günden itibaren gerçek, pratik konuları öğrenin.",
      examTitle: "Sınav Hazırlığı",
      examDesc: "IELTS, TOEFL ve TEFL hazırlık desteği. Özel dersler ve deneme sınavlarıyla hedefinize ulaşın.",
      skillsTitle: "Mesleki Beceriler",
      skillsDesc: "Kariyerinizde yükselmek için iş İngilizcesi, mülakat teknikleri ve iş yeri iletişimi alanında uzmanlaşın."
    },
    footer: {
      desc: "Öğrencileri gerçek pratikler ve uzman eğitmenler aracılığıyla öz güvenle konuşmaları için güçlendiriyoruz.",
      platform: "Platform",
      legal: "Yasal & Güvenlik",
      experts: "Eğitmenler İçin",
      learningPortal: "Öğrenci Paneli",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Koşulları",
      childSafety: "Çocuk Güvenliği",
      tutorGuide: "Eğitmen Rehberi",
      rights: "© 2026 FluentPath Ekosistemi. Tüm hakları saklıdır."
    }
  },
  fr: {
    nav: {
      findTutors: "Trouver un tuteur",
      signIn: "Se connecter",
      getStarted: "Commencer",
      expertPortal: "Portail Expert",
      myLearning: "Mon Apprentissage"
    },
    hero: {
      badge: "Maîtriser l'anglais oral",
      title1: "L'anglais conversationnel pour",
      title2: "S'exprimer avec assurance",
      subtitle: "Le premier écosystème accrédité connectant des tuteurs experts avec des apprenants ambitieux. Maîtrisez la conversation, les examens et l'anglais professionnel.",
      findExpert: "Trouver votre Expert",
      becomeTutor: "Devenir Tuteur"
    },
    features: {
      conversationalTitle: "Anglais Conversationnel",
      conversationalDesc: "Parlez naturellement et avec assurance au quotidien. Des conversations pratiques et réelles dès le premier jour.",
      examTitle: "Préparation aux Examens",
      examDesc: "Accompagnement pour l'IELTS, TOEFL et TEFL grâce à des leçons structurées et des évaluations blanches.",
      skillsTitle: "Compétences Professionnelles",
      skillsDesc: "Maîtrisez l'anglais des affaires, l'entretien d'embauche et la communication en entreprise pour booster votre carrière."
    },
    footer: {
      desc: "Permettre aux apprenants de s'exprimer sereinement grâce à des cours pratiques et des conseils d'experts.",
      platform: "Plateforme",
      legal: "Légal & Sécurité",
      experts: "Pour les Experts",
      learningPortal: "Portail d'Apprentissage",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      childSafety: "Sécurité des Enfants",
      tutorGuide: "Guide du Tuteur",
      rights: "© 2026 Écosystème FluentPath. Tous droits réservés."
    }
  },
  de: {
    nav: {
      findTutors: "Lehrer finden",
      signIn: "Anmelden",
      getStarted: "Loslegen",
      expertPortal: "Lehrer-Portal",
      myLearning: "Mein Lernen"
    },
    hero: {
      badge: "Fließend Englisch sprechen",
      title1: "Konversationsenglisch für",
      title2: "Echtes Selbstvertrauen",
      subtitle: "Das erste zertifizierte Netzwerk, das Profi-Lehrer mit anspruchsvollen Schülern weltweit verbindet. Meistern Sie Konversation, Prüfungen und Business-Englisch.",
      findExpert: "Lehrer auswählen",
      becomeTutor: "Lehrer werden"
    },
    features: {
      conversationalTitle: "Konversationsenglisch",
      conversationalDesc: "Sprechen Sie in Alltagssituationen natürlich und selbstbewusst. Praxisnahe Gespräche ab dem ersten Tag.",
      examTitle: "Prüfungsvorbereitung",
      examDesc: "Unterstützung bei IELTS, TOEFL und TEFL mit strukturierten Lektionen und Testsimulationen für Ihre Bestnote.",
      skillsTitle: "Kariere-Englisch",
      skillsDesc: "Meistern Sie Business-Englisch, Bewerbungsgespräche und professionelle Kommunikation für Ihren globalen Erfolg."
    },
    footer: {
      desc: "Wir befähigen Lernende weltweit dazu, durch praktische Gespräche und fachkundige Anleitung selbstbewusst zu sprechen.",
      platform: "Plattform",
      legal: "Rechtliches & Sicherheit",
      experts: "Für Lehrer",
      learningPortal: "Lern-Portal",
      privacy: "Datenschutzerklärung",
      terms: "Nutzungsbedingungen",
      childSafety: "Kinderschutz",
      tutorGuide: "Lehrer-Handbuch",
      rights: "© 2026 FluentPath Netzwerk. Alle Rechte vorbehalten."
    }
  }
};

const countryToLanguageMap = {
  // Spanish-speaking
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es", EC: "es", GT: "es", BO: "es", PR: "es", UY: "es",
  // Portuguese-speaking
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  // Japanese-speaking
  JP: "ja",
  // Chinese-speaking
  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  // Turkish-speaking
  TR: "tr",
  // French-speaking
  FR: "fr", CA: "fr", BE: "fr", CH: "fr",
  // German-speaking
  DE: "de", AT: "de"
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // 1. Check local storage
    const saved = localStorage.getItem("fluentpath_lang");
    if (saved && translations[saved]) return saved;

    // 2. Check browser settings
    const browserLang = navigator.language?.split("-")[0];
    if (browserLang && translations[browserLang]) return browserLang;

    return "en"; // Default fallback
  });

  const [country, setCountry] = useState(null);

  useEffect(() => {
    const detectGeoLanguage = async () => {
      // Avoid overriding if the user has already manually configured their preference in localStorage
      if (localStorage.getItem("fluentpath_lang")) return;

      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        
        if (data && data.country_code) {
          setCountry(data.country_code);
          const targetLang = countryToLanguageMap[data.country_code];
          
          if (targetLang && translations[targetLang]) {
            setLanguage(targetLang);
          }
        }
      } catch (err) {
        console.warn("Geolocation service rate-limited or blocked. Falling back to browser presets.", err);
      }
    };

    detectGeoLanguage();
  }, []);

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
      localStorage.setItem("fluentpath_lang", langCode);
    }
  };

  const t = (keyPath) => {
    try {
      const keys = keyPath.split(".");
      let current = translations[language];
      for (const key of keys) {
        current = current[key];
      }
      return current || keyPath;
    } catch {
      return keyPath;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, country }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
