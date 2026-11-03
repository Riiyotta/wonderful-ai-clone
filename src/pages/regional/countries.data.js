// Country landing pages (/adriatics … /uae). Extracted verbatim from _source/pages/<slug>.html by the regional
// extractor: hero (title, banner image + object-position) and the body as a flat list of blocks.
// Each block: t = text | divider | quote | links; gap = [desktop, tablet, mobile] space above (px, Framer flex gap);
// ord = [d, t, m] flex order (-1 = hidden at that breakpoint). Breakpoints: d >=1200, t 810-1199, m <810.
// text.paras: array of paragraphs, each an array of runs {t, href?} or {br}. abs: absolutely positioned (live /baltics quirk).
export const COUNTRIES = {
 "adriatics": {
  "slug": "adriatics",
  "title": "Wonderful Adriatics",
  "img": "/assets/gzPDA9WNtVsXEtZ92TV9fhHcE.jpg",
  "alt": "city buildings near body of water during daytime",
  "pos": "48.5% 61.2%",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is expanding its presence across the Adriatic Region, bringing enterprise-grade AI agents to a market defined by diversity, resilience, and growth. This step reflects our mission to support every language, every market, and every region, ensuring that businesses here have access to technology built not only for global performance but also for local authenticity."
      }
     ],
     [
      {
       "br": 1
      }
     ],
     [
      {
       "t": "The Adriatic Region is one of Europe’s most dynamic crossroads. Its blend of established industries and fast-growing digital ecosystems creates a fertile ground for AI transformation. Yet, enterprises often face unique challenges. Languages in the region, as well as their regional variants, are rich and nuanced, but too often overlooked by mainstream AI tools. Compliance and regulatory requirements differ significantly from country to country, adding complexity for businesses that operate across borders. At the same time, customer expectations are rising: people demand personalized, high-quality experiences, but organizations struggle to scale operations efficiently while staying true to local culture."
      }
     ],
     [
      {
       "br": 1
      },
      {
       "t": "By delivering AI that truly understands the region’s languages and adapts to its diverse business practices, Wonderful can help organizations modernize operations, unlock new efficiencies, and serve customers better than ever before."
      }
     ],
     [
      {
       "br": 1
      }
     ],
     [
      {
       "t": "Wonderful is committed to building AI that is fluent in the region’s languages and sensitive to its cultural realities. We design technology that respects local laws and privacy frameworks, while enabling enterprises to operate at global scale without sacrificing local relevance. Our vision is to empower companies with tools that increase efficiency, reduce costs, and create new pathways for growth. Whether in finance, telecommunications, e-commerce, hospitality, or government services, we are here to help organizations reimagine what’s possible."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“The Adriatic Region is more than a cluster of markets. It is a vibrant community of ideas, traditions, and ambitions. For too long, businesses here have had to choose between global solutions that don’t fully grasp local realities, or local approaches that can’t scale globally. At Wonderful, we believe they deserve both. Our mission is to empower companies throughout the Adriatic Region to thrive with AI that feels truly theirs - technology that speaks their language, respects their culture, and amplifies their strengths. By combining world-class innovation with deep regional understanding, we aim to help organizations deliver service that is not only efficient and scalable, but also authentic and human. This is the beginning of a new chapter where the Adriatic Region doesn’t just adopt AI - it helps define its future.”",
    "name": "Vedran Bajer",
    "role": "General Manager, Adriatic Region",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is already working with organizations across financial services, telecommunications, travel and hospitality, e-commerce, retail, and the public sector. Each partnership demonstrates how AI can create meaningful impact when it is grounded in local knowledge and global expertise."
      },
      {
       "br": 1
      },
      {
       "br": 1
      },
      {
       "t": "We’ve built a team on the ground in Zagreb, Croatia and continue to expand. Explore our "
      },
      {
       "t": "Careers page",
       "href": "/"
      },
      {
       "t": " to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "items": [
     {
      "href": "https://www.linkedin.com/in/vedranbajer/",
      "w": 154,
      "name": "Vedran Bajer",
      "appear": true,
      "icon": "/assets/9GhIaR1nN3TxLj0X0ufdR4MUaqk.png"
     },
     {
      "href": "https://www.linkedin.com/in/georgioskontogiannis/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      "w": 197,
      "minH": 15
     }
    ],
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "baltics": {
  "slug": "baltics",
  "title": "Wonderful Baltics",
  "img": "/assets/r3Cw4j7Yvx5zPGV6uUBMz0xnfDQ.jpg",
  "alt": "aerial photograph of road beside sea",
  "pos": "49.5% 43.7%",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is opening in the Baltics, three digitally advanced nations where innovation and multilingual excellence meet. From finance to telecom, Baltic enterprises are setting new standards for digital service. Wonderful brings AI agents built for local language, culture, and context so companies can scale support in the most natural way. Baltic enterprises operate in a unique environment: three distinct languages, each rich in history and nuance, within a multilingual and highly regulated European market. Balancing local precision with cross-border scale makes customer operations increasingly complex and resource intensive. Support teams often face fragmented systems and rising customer expectations, while most AI tools still fail to capture the linguistic and cultural depth of the region. Wonderful’s AI agents close this gap. They communicate naturally in Latvian, Lithuanian, and Estonian across voice, chat, and email, embedding into enterprise systems with full data security, compliance, and transparency. Designed for enterprise scale, they bring fluency, empathy, and reliability to every interaction, enhancing efficiency without compromising the human touch."
      }
     ]
    ],
    "appear": true,
    "abs": {
     "top": "91%",
     "left": "50%",
     "transform": "translate(-50%,-50%)"
    },
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“This launch is personal. The Baltics have the infrastructure, talent, and ambition, yet many companies still struggle to turn digital plans into outcomes. With Wonderful, we are bringing AI agents that speak Baltic languages and understand regional context. It is a chance to serve clients smarter, scale faster, and compete without adding complexity.”",
    "name": "Piotr Antropov",
    "role": "General Manager, Wonderful Baltics",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "For Baltic businesses, Wonderful offers a path from digital ambition to real execution without adding more complexity."
      },
      {
       "br": 1
      },
      {
       "br": 1
      },
      {
       "t": "We’ve built a very strong team on the ground and continue to expand. Explore our "
      },
      {
       "t": "Careers page",
       "href": "/"
      },
      {
       "t": " to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "minH": 15,
    "items": [],
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "belgium": {
  "slug": "belgium",
  "title": "Wonderful Belgium",
  "img": "/assets/zV8i6DHl7f5ILuaBPvC2fnLOhY.jpg",
  "alt": "brown concrete gate",
  "pos": "40.8% 76.1%",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is expanding into Belgium, strengthening our European presence and bringing world-class AI agents to one of the continent’s most dynamic and multilingual markets. With our Benelux office, we are partnering with leading enterprises to deliver AI that speaks every language of Belgium, including Flemish, French, and beyond."
      }
     ],
     [
      {
       "br": 1
      },
      {
       "t": "Belgian enterprises operate in a uniquely multilingual and highly regulated environment. Customers expect seamless service in multiple languages across digital and traditional channels. Maintaining consistent service quality in French, Flemish, Dutch, and English is costly, time-consuming, and difficult to scale."
      }
     ],
     [
      {
       "br": 1
      },
      {
       "t": "At the same time, Belgium’s financial services, telecom, and public sectors are accelerating digital transformation. With a strong national focus on compliance, data privacy, and customer trust, the demand for secure, multilingual, and enterprise-ready AI is growing rapidly. These dynamics make Belgium an ideal market for Wonderful’s AI agents built for precision, speed, and cultural fluency."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“Belgium’s complexity, from its languages and regulations to its customer expectations, is exactly where Wonderful thrives. We bring AI that understands every nuance, helping Belgian companies deliver efficient, high-quality service that truly connects with people.”",
    "name": "General Manager",
    "role": "Wonderful Benelux",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "We are already collaborating with leading banks, telecom providers, and e-commerce leaders to transform how they engage customers. Wonderful’s enterprise-grade AI brings consistency, speed, and personalization to every interaction, while our local delivery team ensures seamless deployment and ongoing optimization. Together, they help Belgian enterprises reduce wait times, improve customer satisfaction, and scale operations securely. We’ve built a very strong team on the ground and continue to expand. Explore our Careers page to see open roles and join us in shaping the future of enterprise AI.",
       "href": "/"
      }
     ]
    ],
    "appear": true,
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "minH": 15,
    "items": [],
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "greece": {
  "slug": "greece",
  "title": "Wonderful Greece",
  "img": "/assets/H0wSl8ak1zjBNkshGaJHfPiO6cE.jpg",
  "alt": "a view of the part of the part of the part of the part of the",
  "pos": "47.2% 37.4%",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is opening its first international office in Greece, expanding beyond Israel for the first time. This milestone marks the beginning of our journey to bring world-class AI agents to every market, in every language. Greek enterprises face unique challenges: a linguistically complex language underserved by mainstream AI models, customer service that cannot be outsourced abroad, and a market where efficiency is critical. These realities make scaling customer operations both costly and difficult. At the same time, Greece is home to a tech-savvy population, a fast-growing digital economy, and a business community eager for transformation, creating strong demand for advanced AI solutions tailored to local needs."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“Wonderful is proof of the talent and energy in Greece today. Collaborating with their team means moving fast, meeting high standards, and seeing scalable ideas come to life - an approach that supports Greek enterprises in becoming globally competitive.”",
    "name": "Antonis Avgeropoulos",
    "role": "CEO of Nespresso Greece",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     6
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Launching in Greece marks a huge step in bringing enterprise-ready AI to markets often overlooked by today’s global platforms. It reflects our commitment to building technology that adapts to local languages, regulations, and business realities, ensuring enterprises can deliver world-class service at scale."
      }
     ],
     [
      {
       "br": 1
      }
     ],
     [
      {
       "t": "We are already partnering with some of Greece’s largest banks, e-commerce companies, and airlines. By creating AI that understands and generates Greek with precision and cultural fluency, we aim to become the trusted partner for enterprises across the country."
      }
     ]
    ],
    "appear": true,
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "divider",
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   },
   {
    "t": "quote",
    "text": "“Greece is the perfect market for Wonderful: a linguistically complex and historically underserved language, where customer support remains costly and limited. Wonderful overcomes that. By providing state-of-the-art AI tools comparable to those used in the US today, we empower Greek enterprises to become globally competitive.”",
    "name": "Ilia Tzortzopoulou",
    "role": "General Manager, Greece",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     6,
     6,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     7,
     7,
     7
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "We’ve built a team on the ground in Greece and continue to expand. Explore our "
      },
      {
       "t": "Careers page",
       "href": "/"
      },
      {
       "t": " to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     8,
     8,
     8
    ]
   },
   {
    "t": "links",
    "items": [
     {
      "href": "https://www.linkedin.com/in/ilia-tzortzopoulou-8302b191/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      "w": 154,
      "name": "Ilia Tzortzopoulou",
      "appear": true,
      "icon": "/assets/9GhIaR1nN3TxLj0X0ufdR4MUaqk.png"
     },
     {
      "href": "https://www.linkedin.com/in/georgioskontogiannis/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      "w": 197,
      "name": "Georgios Kontogiannis",
      "nameW": 161,
      "appear": true,
      "icon": "/assets/9GhIaR1nN3TxLj0X0ufdR4MUaqk.png"
     }
    ],
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     9,
     9,
     9
    ]
   }
  ]
 },
 "italy": {
  "slug": "italy",
  "title": "Wonderful Italy",
  "img": "/assets/dUYg8m5XXX4Qgg7XM48UPWjH0.jpg",
  "alt": "Venice, Italy during daytime",
  "pos": "center",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is opening its first office in Italy, bringing the next generation of AI agents to a country that has always been a global benchmark for creativity, style, and excellence. Italy presents a complexity all its own: a territory of a thousand accents, cadences, and dialects, where language is rich, nuanced, and deeply tied to identity. For enterprises, this diversity makes scaling customer operations uniquely challenging — every interaction must feel personal, human, and culturally attuned. At the same time, Italy is home to some of the world’s most iconic companies in fashion, luxury, automotive, energy, and telecommunications, enterprises that demand solutions capable of matching their global influence and uncompromising standards. Wonderful enters this stage with a clear mission: to harness AI that speaks the language of Italy in all its forms, while delivering measurable impact and setting new benchmarks for customer experience worldwide."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“Opening in Italy is more than a geographic expansion — it’s a statement. Wonderful enters a market where language is not just a tool of communication but an expression of culture and identity. By embracing this complexity, we can help Italy’s leading enterprises transform their customer operations with AI that is multilingual, human-centered, and built to perform at global scale.”",
    "name": "General Manager",
    "role": "Wonderful Italy",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is already working with organizations across financial services, telecommunications, fashion, hospitality, retail, and the public sector. Each partnership demonstrates how AI can create meaningful impact when it is grounded in local knowledge and global expertise. We’ve built a team on the ground in Italy and continue to expand. Explore our Careers page to see open roles and join us in shaping the future of enterprise AI.",
       "href": "/"
      }
     ]
    ],
    "appear": true,
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "minH": 15,
    "items": [],
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "netherlands": {
  "slug": "netherlands",
  "title": "Wonderful Netherlands",
  "img": "/assets/QIWUl8TYtmCYYGLo02X1nrzlelg.jpg",
  "alt": "body of water under white sky",
  "pos": "center",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful continues its mission to bring world-class AI agents to enterprises across Europe, the Middle East, Africa, Latin America, and Asia Pacific. With our new HQ office in Amsterdam, we are deepening our presence in one of the world’s most digitally advanced and innovation-driven economies. Dutch enterprises face distinct challenges in a highly globalized, multilingual market where customers expect instant, human-like service across every channel. With one of Europe’s tightest labor markets and rising operational costs, scaling support teams without sacrificing quality has become increasingly complex. At the same time, the Netherlands leads in digital adoption, fintech innovation, and e-commerce. Dutch consumers are digital-first, businesses are data-driven, and the appetite for efficient, compliant, and natural-sounding AI is stronger than ever. These conditions make the Netherlands an ideal market for Wonderful’s enterprise-ready AI agents."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“The Netherlands has always been at the forefront of digital innovation. Wonderful’s arrival strengthens that momentum, bringing AI capabilities that help Dutch companies scale globally while maintaining the high service standards customers here expect.”",
    "name": "General Manager",
    "role": "Wonderful Benelux",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Launching in the Netherlands reinforces our vision to make enterprise-ready AI available to every market, adapted to local languages, regulations, and business needs. We are already partnering with leading banks, healthcare providers, and retail brands to build AI that understands Dutch, English, and regional dialects with precision and cultural fluency. Our AI agents handle complex customer interactions with natural empathy and full compliance, helping enterprises deliver faster, more consistent service at scale."
      },
      {
       "br": 1
      },
      {
       "br": 1
      }
     ],
     [
      {
       "t": "Wonderful is driving transformation across Dutch industries, from financial services and insurance to hospitality and retail. Our AI solutions automate high-volume interactions, reduce operational costs, and empower teams to focus on what matters most: building better customer relationships."
      },
      {
       "br": 1
      },
      {
       "br": 1
      },
      {
       "t": "We’ve built a very strong team on the ground and continue to expand. Explore our "
      },
      {
       "t": "Careers page",
       "href": "/"
      },
      {
       "t": " to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "minH": 15,
    "items": [],
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "poland": {
  "slug": "poland",
  "title": "Wonderful Poland",
  "img": "/assets/R86YOSpCW95xtVXWsN7HW6nXtYA.jpeg",
  "alt": "brown concrete gateway during daytime",
  "pos": "50.8% 39.7%",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is expanding its European presence with a new office in Poland, one of the world’s twenty largest economies and a rising hub for digital innovation. Poland’s reputation for diligence, resilience, and openness to technology makes it a natural home for the next generation of AI agents designed for enterprise scale."
      }
     ],
     [
      {
       "br": 1
      },
      {
       "t": "Poland’s language and culture reflect a long tradition of adaptability and precision, qualities that also define its business landscape. The richness and complexity of the Polish language present unique challenges for speech recognition and synthesis, requiring AI that goes beyond translation to achieve natural fluency and understanding."
      },
      {
       "br": 1
      },
      {
       "br": 1
      }
     ],
     [
      {
       "t": "Many Polish enterprises are advancing rapidly in their digital transformation, yet scaling customer operations remains difficult. Balancing service quality, regulatory compliance, and efficiency demands intelligent solutions built for the local market. Wonderful meets this need by combining top-tier AI technology with a dedicated local team on the ground that ensures seamless deployment and long-term success. Our AI agents deliver secure, compliant, and human-like conversations across voice, chat, and email with native-level command of the Polish language and context."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“Today, we combine this linguistic tradition with modern technology to ensure that Polish sounds natural even in the world of artificial intelligence. Above all, we want the language used by agents to have a significant impact on customer satisfaction and business efficiency.”",
    "name": "Marcin Motel",
    "role": "General Manager, Wonderful Poland",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Launching in Poland reflects Wonderful’s commitment to creating AI that adapts to every market linguistically, culturally, and operationally. With advanced technology and a local delivery team on the ground, we help enterprises deploy AI successfully and do it right, ensuring every interaction is precise, compliant, and authentically Polish."
      },
      {
       "br": 1
      },
      {
       "br": 1
      },
      {
       "t": "We’ve built a very strong team on the ground and continue to expand. Explore our "
      },
      {
       "t": "Careers page",
       "href": "/"
      },
      {
       "t": " to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "minH": 15,
    "items": [],
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "romania": {
  "slug": "romania",
  "title": "Wonderful Romania",
  "img": "/assets/qGM6xmRPfGNxwLQQ7LzAKLVacl0.jpg",
  "alt": "a couple of people standing in front of a building",
  "pos": "48.3% 52.6%",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is proud to announce the opening of its second international office in Romania — a move that reflects our commitment to delivering world-class AI agents to every market, in every language. Romanian enterprises, especially those managing intensive customer service operations, face increasing demands: strict SLAs, complex enterprise integrations, and high call volumes across fragmented support systems (email, voice, chat). Scaling teams during growth or peak periods is challenging, and the need for multilingual capabilities is rising. To succeed, organizations require automation that is powerful, flexible, and fully compliant with GDPR, EU AI Act, DORA, SOC2 and NIS2.Romania is uniquely positioned for AI voice adoption. As the only Eastern Romance language, it blends Latin roots with Slavic and Balkan influences, making it both distinctly Latin and uniquely regional. Wonderful’s AI agents speak fluent Romanian — mastering postposed definite articles, diacritics, and the subtle nuances of politeness and register. We are already starting collaborations with some of Romania’s largest banks, utilities, telecom, and energy providers, aiming to benchmark our position as best-in-class Agentic AI Platform for Romanian language. By continuously expanding the depth and complexity of use cases, we empower enterprises to seamlessly integrate AI agents into their customer service and sales operations."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“Romania is the country where timeless legends meet bold innovation. With world-class technical talent, a fast-adopting tech ecosystem, and a thriving BPO industry, this is the right market at the right time for Wonderful. I believe AI is the greatest source of empowerment in today’s competitive landscape, and I am on a personal mission of driving the adoption of trusted AI in my country.”",
    "name": "Lucia Stoicescu",
    "role": "Country Manager, Romania",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "We’re building the Wonderful Romania local team. Explore our Careers page to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "items": [
     {
      "href": "https://www.linkedin.com/in/luciastoicescu/",
      "w": 154,
      "name": "Lucia Stoicescu",
      "appear": true,
      "icon": "/assets/9GhIaR1nN3TxLj0X0ufdR4MUaqk.png"
     },
     {
      "href": "https://www.linkedin.com/in/georgioskontogiannis/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      "w": 197,
      "minH": 15
     }
    ],
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "switzerland": {
  "slug": "switzerland",
  "title": "Wonderful Switzerland",
  "img": "/assets/68TxE0Jf0tlek9Rk7yT9EAr6SA.jpg",
  "alt": "aerial view of city buildings during daytime",
  "pos": "center",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful is opening its first office in Switzerland, bringing the next generation of AI agents to a country where financial leadership and multilingual heritage make it a global hub for innovation and collaboration."
      }
     ],
     [
      {
       "br": 1
      },
      {
       "t": "Swiss enterprises face unique challenges: a diverse, multilingual environment, largely underserved by mainstream AI models, and a business culture where efficiency and precision are critical. These realities make scaling customer operations both costly and complex. At the same time, Switzerland is a hub for a tech-savvy population, a mature digital economy, and a business community eager for transformation, creating strong demand for advanced AI solutions tailored to local needs."
      }
     ],
     [
      {
       "br": 1
      },
      {
       "t": "Launching in Switzerland marks a huge step in bringing enterprise-ready AI to a market that demands technological precision and linguistic versatility. It reflects our commitment to building technology that adapts to local languages, regulations, and business realities, ensuring that Swiss enterprises can deliver world-class service at scale."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "\"Switzerland is the ideal market for Wonderful: a diverse, multilingual nation where customer support is both costly and complex. Wonderful overcomes these challenges. By providing state-of-the-art AI tools used already by some of the brightest brands across Europe, we empower Swiss enterprises to achieve new levels of quality, efficiency, and global competitiveness.\"",
    "name": "General Manager",
    "role": "Wonderful Switzerland",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     3,
     3,
     3
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "We are already partnering with some of Switzerland’s largest retailers, insurance and telco companies. By creating AI that understands and speaks Swiss German, French, and Italian with precision and cultural fluency, we aim to become the trusted partner for enterprises across the country. We’ve built a very strong team on the ground in Switzerland and continue to expand. Explore our Careers page to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     4,
     4,
     4
    ]
   },
   {
    "t": "links",
    "minH": 15,
    "items": [],
    "gap": [
     40,
     40,
     40
    ],
    "ord": [
     5,
     5,
     5
    ]
   }
  ]
 },
 "uae": {
  "slug": "uae",
  "title": "Wonderful United Arab Emirates",
  "img": "/assets/qwCz7SFhaiTBrziR0N8G9eYT8SA.jpg",
  "alt": "a large sculpture of a whale in front of a cityscape",
  "pos": "center",
  "blocks": [
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Following Wonderful's rapid growth in Europe, our new offices in Abu Dhabi and Dubai will support customers in the UAE and lead our expansion across the Middle East and Africa."
      },
      {
       "br": 1
      },
      {
       "br": 1
      }
     ],
     [
      {
       "t": "Enterprises in the United Arab Emirates face unique challenges: a multilingual society of more than 200 nationalities, requiring customer support across diverse languages and dialects; the complexity of Arabic voice and regional dialects, where precision is critical to trust; and stringent data protection and compliance frameworks that demand local expertise and robust solutions. At the same time, the UAE is a global leader in AI adoption and home to the world’s first Minister of AI. It is a global hub for innovation across finance, aviation, government, and digital services. This combination of high expectations, cultural diversity, and ambition creates strong demand for advanced AI solutions tailored to local needs."
      }
     ]
    ],
    "appear": true,
    "gap": [
     0,
     0,
     0
    ],
    "ord": [
     0,
     0,
     0
    ]
   },
   {
    "t": "divider",
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     1,
     1,
     1
    ]
   },
   {
    "t": "quote",
    "text": "“As a UAE bank, we see Wonderful’s arrival as game-changing. Their ability to bring Arabic voice AI at scale while meeting local compliance requirements will transform how we serve our customers.”",
    "name": "Local Banking Enterprise Partner",
    "role": "UAE",
    "gap": [
     32,
     32,
     40
    ],
    "ord": [
     2,
     2,
     2
    ]
   },
   {
    "t": "divider",
    "gap": [
     32,
     32,
     40
    ],
    "ord": [
     3,
     3,
     5
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "Wonderful brings leading AI agents that naturally handle the most complex customer interactions—seamlessly integrating with enterprise systems across voice, chat, and email. For UAE businesses, this means higher customer satisfaction, reduced operational costs, and scalable support without compromising on quality."
      }
     ]
    ],
    "appear": true,
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     4,
     4,
     3
    ]
   },
   {
    "t": "divider",
    "gap": [
     60,
     60,
     0
    ],
    "ord": [
     5,
     5,
     -1
    ]
   },
   {
    "t": "quote",
    "text": "\"Establishing Wonderful in the UAE is an exciting milestone. The region is at the forefront of AI-driven transformation, and we are committed to helping regional and global enterprises deliver human-like customer support across Arabic, English, and other languages. With our presence in Abu Dhabi and Dubai, we're building partnerships that will not only redefine service excellence in the UAE but also set new benchmarks across the Middle East and Africa. Wonderful's AI agents enable organizations to integrate effortlessly with their existing systems, scaling support with unmatched efficiency and quality.\"",
    "name": "Claudius Boller",
    "role": "Executive General Manager, Wonderful UAE",
    "gap": [
     32,
     32,
     40
    ],
    "ord": [
     6,
     6,
     4
    ]
   },
   {
    "t": "divider",
    "gap": [
     32,
     32,
     0
    ],
    "ord": [
     7,
     7,
     -1
    ]
   },
   {
    "t": "text",
    "paras": [
     [
      {
       "t": "We’ve built a team on the ground in the UAE and continue to expand. Explore our "
      },
      {
       "t": "Careers page",
       "href": "/"
      },
      {
       "t": " to see open roles and join us in shaping the future of enterprise AI."
      }
     ]
    ],
    "appear": true,
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     8,
     8,
     6
    ]
   },
   {
    "t": "links",
    "items": [
     {
      "href": "https://www.linkedin.com/in/claudiusboller/",
      "w": 154,
      "name": "Claudius Boller",
      "appear": true,
      "icon": "/assets/9GhIaR1nN3TxLj0X0ufdR4MUaqk.png"
     },
     {
      "href": "https://www.linkedin.com/in/georgioskontogiannis/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      "w": 197,
      "minH": 15
     }
    ],
    "gap": [
     60,
     60,
     40
    ],
    "ord": [
     9,
     9,
     7
    ]
   }
  ]
 }
}
