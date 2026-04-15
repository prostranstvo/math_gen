/**
 * @typedef {Object} WeekConfig
 * @property {string} weekId
 * @property {string} date
 * @property {string[]} spelling
 * @property {string} grammar
 * @property {string} writingTopic
 * @property {string} writingPrompt
 * @property {string} mathTopic
 * @property {string} scienceTopic
 * @property {string} reviewPrompt
 */

/** @type {Readonly<Record<string, WeekConfig>>} */
export const swanseaWeeks = Object.freeze({
    "2": {
        weekId: "2",
        date: "October 10, 2025",
        spelling: ["review", "rebuild", "replace", "reconsider", "restore", "thought", "theme", "thunder", "thousand", "theory", "whisper", "whistle", "whimsical", "while", "whirlwind"],
        grammar: "Prefix re- and digraphs th, wh.",
        writingTopic: "Letter Writing (Formal vs Informal)",
        writingPrompt: "Write a short letter to a family member or friend. Use a greeting, a clear message, and a closing sentence.",
        mathTopic: "Patterning",
        scienceTopic: "Circulatory System",
        reviewPrompt: "Draw or list 3 facts about how the circulatory system helps the body."
    },
    "3": {
        weekId: "3",
        date: "October 17, 2025",
        spelling: ["Reading", "Building", "Creating", "Understanding", "Communicating", "Breathe", "Reason", "Speaker", "Release", "Appeal", "Indeed", "Succeed", "Squeeze", "Foresee", "Guarantee"],
        grammar: "Suffix -ing and vowel teams ea, ee.",
        writingTopic: "Letter Writing (Revising and Drafting)",
        writingPrompt: "Revise a letter draft by adding one stronger detail and one clearer closing sentence.",
        mathTopic: "Estimation (Add/Sub)",
        scienceTopic: "Circulatory System (Diseases)",
        reviewPrompt: "List or sketch 3 healthy habits that protect the circulatory system."
    },
    "4": {
        weekId: "4",
        date: "October 24, 2025",
        spelling: ["studied", "created", "explored", "watched", "explained", "cherish", "vanish", "cushion", "marsh", "fashion", "alphabet", "dolphin", "hemisphere", "philosophy", "phantom"],
        grammar: "Suffix -ed and blends sh, ph. Fixing run-on sentences.",
        writingTopic: "Letter Writing (Final Letter)",
        writingPrompt: "Write your final letter neatly with a greeting, body, and respectful sign-off.",
        mathTopic: "Subtraction Strategies",
        scienceTopic: "Musculoskeletal System",
        reviewPrompt: "Write or draw 3 facts about how muscles and bones work together."
    },
    "5": {
        weekId: "5",
        date: "October 31, 2025",
        spelling: ["Disagree", "Disobey", "Disregard", "Disband", "Disconnect", "Choice", "Rejoice", "Poison", "Turmoil", "Noise", "Doubt", "Shout", "Mountain", "Encounter", "Announce"],
        grammar: "Prefix dis-, vowel teams oi and ou. Compound sentences.",
        writingTopic: "Persuasive Writing",
        writingPrompt: "Write a short persuasive paragraph and give at least two reasons to support your opinion.",
        mathTopic: "Measurement (Volume/Mass)",
        scienceTopic: "Musculoskeletal System",
        reviewPrompt: "List 3 ways to keep muscles and bones strong and safe."
    },
    "6": {
        weekId: "6",
        date: "November 7, 2025",
        spelling: ["quickly", "softly", "honestly", "eventually", "rapidly", "brain", "available", "complain", "detail", "failure", "display", "birthday", "portray", "always", "betray"],
        grammar: "Suffix -ly and vowel teams ai, ay. Advanced conjunctions.",
        writingTopic: "Persuasive Writing (Bias)",
        writingPrompt: "Explain one opinion and one fact on the same topic so you can compare them clearly.",
        mathTopic: "Metric Conversions",
        scienceTopic: "Digestive System",
        reviewPrompt: "List or draw 3 facts about what happens to food during digestion."
    },
    "7": {
        weekId: "7",
        date: "November 14, 2025",
        spelling: ["precaution", "preview", "predetermine", "prearrange", "prepay", "thriller", "thrifty", "through", "throat", "throne", "splash", "splurge", "splatter", "splinter", "split"],
        grammar: "Prefix pre- and blends thr, spl. Subordinating conjunctions.",
        writingTopic: "Narrative Writing (Setting)",
        writingPrompt: "Write a short scene that helps the reader picture where the story takes place.",
        mathTopic: "Multiplication (9x9)",
        scienceTopic: "Digestive System",
        reviewPrompt: "Write 3 facts about how nutrients help the body after digestion."
    },
    "8": {
        weekId: "8",
        date: "November 21, 2025",
        spelling: ["happiness", "kindness", "willingness", "loneliness", "forgiveness", "drool", "smooth", "rookie", "scooter", "kangaroo", "withdraw", "awesome", "awkward", "sprawl", "brawny"],
        grammar: "Suffix -ness and vowel teams oo, aw. Connecting words such as because, although, and if.",
        writingTopic: "Narrative Writing (Setting and Mood)",
        writingPrompt: "Add details that show the mood of the setting without saying the mood word directly.",
        mathTopic: "2-Digit Multiplication (Area Model)",
        scienceTopic: "Citizenship and Rights",
        reviewPrompt: "List 3 rights or responsibilities that help a classroom community work well."
    },
    "9": {
        weekId: "9",
        date: "November 28, 2025",
        spelling: ["misplace", "misunderstand", "misbehave", "mismanage", "misinform", "approach", "groan", "loathe", "boast", "board", "society", "ancient", "achieve", "belief", "shield"],
        grammar: "Prefix mis- and vowel teams ie, oa. Similes versus metaphors.",
        writingTopic: "Narrative Writing (Character Development)",
        writingPrompt: "Show what a character is like through actions, dialogue, and choices.",
        mathTopic: "3-Digit Division (Area Model)",
        scienceTopic: "Nervous System (Research)",
        reviewPrompt: "Write or draw 3 facts about how the nervous system sends messages."
    },
    "10": {
        weekId: "10",
        date: "December 5, 2025",
        spelling: ["lovable", "washable", "honourable", "valuable", "believable", "autumn", "auction", "applaud", "astronaut", "flaunt", "silhouette", "antique", "continue", "dialogue", "tissue"],
        grammar: "Suffix -able and vowel teams au, ue. Personification and hyperbole.",
        writingTopic: "Narrative Writing (Character Development)",
        writingPrompt: "Write a paragraph that gives your character a challenge and shows how they respond.",
        mathTopic: "Minute Math Drills (Facts up to 12)",
        scienceTopic: "Charter of Rights and Freedoms",
        reviewPrompt: "List 3 ideas from the Charter of Rights and Freedoms that matter in daily life."
    },
    "11": {
        weekId: "11",
        date: "January 5, 2026",
        spelling: ["submarine", "submerge", "subsoil", "subterranean", "subdivide", "embark", "target", "sarcastic", "partial", "pardon", "verdict", "prefer", "nervous", "service", "versatile"],
        grammar: "Prefix sub- and letter blends ar, er. Idioms and alliteration.",
        writingTopic: "Informational Report (Planning and Drafting)",
        writingPrompt: "Choose a topic, gather facts, organize your ideas, and begin drafting a simple informational report.",
        mathTopic: "Data Management",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "Draw or list 3 facts about solids, liquids, and gases."
    },
    "12": {
        weekId: "12",
        date: "January 9, 2026",
        spelling: ["helpless", "speechless", "tireless", "shameless", "countless", "mirror", "circumstance", "irritate", "require", "whirl", "current", "pure", "curve", "furious", "purpose"],
        grammar: "Suffix -less and r-controlled vowels ir, ur. Imperative and interrogative sentences.",
        writingTopic: "Informational Report",
        writingPrompt: "Continue your informational report with clear facts, organized ideas, and complete sentences.",
        mathTopic: "Data Management",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "Write or draw 3 examples of physical and chemical changes."
    },
    "13": {
        weekId: "13",
        date: "January 23, 2026",
        spelling: ["interact", "interfere", "interject", "intermediate", "intertwine", "ignore", "adore", "explore", "restore", "torment", "script", "scramble", "scratch", "scream", "screech"],
        grammar: "Prefix inter-, vowel digraph or, and consonant blend scr. Declarative and exclamatory sentences.",
        writingTopic: "Informational Report",
        writingPrompt: "Keep building your informational report using clear facts and strong organization.",
        mathTopic: "Algebra",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "List or draw 3 changes of state that matter can go through."
    },
    "14": {
        weekId: "14",
        date: "January 30, 2026",
        spelling: ["wonderful", "thankful", "delightful", "respectful", "thoughtful", "stream", "struggle", "strict", "stranded", "stranger", "sprain", "sprawl", "sprinkle", "sprout", "spread"],
        grammar: "Suffix -ful and consonant blends spr and str. Using commas with different clauses.",
        writingTopic: "Informational Report and Poetry",
        writingPrompt: "Finish your informational report assessment and begin exploring poetry.",
        mathTopic: "Algebra",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "Draw or list 3 ways matter can change from one state to another."
    },
    "15": {
        weekId: "15",
        date: "February 6, 2026",
        spelling: ["antitrust", "antihero", "antifreeze", "antislip", "antivirus", "wrong", "shingle", "linger", "younger", "language", "knuckle", "knitted", "knight", "kneel", "knowledge"],
        grammar: "Prefix anti- and digraphs ng and kn. Colons and semicolons.",
        writingTopic: "Black History Presentation",
        writingPrompt: "Prepare and present a short piece about a Black Canadian of Significance.",
        mathTopic: "Perimeter and Area",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "List 3 physical properties that can be used to describe matter."
    },
    "16": {
        weekId: "16",
        date: "February 20, 2026",
        spelling: ["agreement", "endorsement", "government", "achievement", "alignment", "wrestle", "wrinkle", "wrist", "wrapper", "wreckage", "blame", "blemish", "blizzard", "blossom", "blaze"],
        grammar: "Suffix -ment and letter blends wr and bl. Review homophones.",
        writingTopic: "Poetry (Haiku and Limerick)",
        writingPrompt: "Present your haiku, then begin planning and writing a limerick.",
        mathTopic: "Perimeter and Area",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "Write or draw 3 processes that change matter between solid, liquid, and gas."
    },
    "17": {
        weekId: "17",
        date: "February 27, 2026",
        spelling: ["nonrenewable", "nonfiction", "nonstick", "nonstop", "nonhuman", "applause", "cause", "cleanse", "noise", "pause", "turquoise", "browse", "blouse", "poise", "please"],
        grammar: "Prefix non- and the /z/ sound spelled se. Review capitalization.",
        writingTopic: "Poetry",
        writingPrompt: "Present your limerick and publish a poem of your choice.",
        mathTopic: "Angles",
        scienceTopic: "Properties of and Changes in Matter",
        reviewPrompt: "List 3 facts about the material your group researched or how it is used."
    },
    "18": {
        weekId: "18",
        date: "March 6, 2026",
        spelling: ["limb", "crumb", "thumb", "remember", "plumber", "palm", "calmness", "balmy", "almond", "overwhelm", "semicircle", "semisweet", "semifinal", "semiprivate", "semipro"],
        grammar: "The m sound with mb and lm, plus prefix semi-. Review possessive nouns.",
        writingTopic: "Book Review (Planning)",
        writingPrompt: "Plan a book review by thinking about your audience, your opinion, and the reasons that support it.",
        mathTopic: "Angles",
        scienceTopic: "Forces Acting on Structures",
        reviewPrompt: "Write or draw 3 ways natural forces like wind and gravity can affect structures."
    },
    "19": {
        weekId: "19",
        date: "March 20, 2026",
        spelling: ["catalogue", "crossbar", "dialogue", "ostrich", "offered", "awkward", "clawed", "yawn", "squawk", "sprawl", "audience", "automatic", "cautious", "haunt", "nauseous"],
        grammar: "Complex vowel /aw/ with o, aw, and au. Review synonyms and antonyms.",
        writingTopic: "Book Review (Rough Draft)",
        writingPrompt: "Write the rough draft of a book review about a book you have already read.",
        mathTopic: "Properties of Triangles",
        scienceTopic: "Forces Acting on Structures",
        reviewPrompt: "List 3 ways natural disasters can damage structures."
    },
    "20": {
        weekId: "20",
        date: "March 27, 2026",
        spelling: ["affordable", "fortunate", "performance", "territory", "enormous", "cardboard", "coarse", "roared", "hoarse", "soar", "quarter", "warmer", "swarm", "reward", "warning"],
        grammar: "Complex vowel /or/ with or, ar, and oar. Review homographs.",
        writingTopic: "Book Review Presentations",
        writingPrompt: "Present your book review clearly and share the strongest parts of your reading response.",
        mathTopic: "Grids and Transformations",
        scienceTopic: "Forces Acting on Structures",
        reviewPrompt: "Write or draw 3 facts about how structures are planned, tested, or built."
    },
    "21": {
        weekId: "21",
        date: "April 10, 2026",
        spelling: ["balloon", "doodle", "swoop", "gloomy", "cartoonist", "crucial", "supervisor", "truthful", "pollution", "junior", "approval", "remove", "whoever", "improve", "losing"],
        grammar: "Common long vowel /oo/ with oo, u, and o. Interrogative adjectives: whose, what, which.",
        writingTopic: "Comic Strip",
        writingPrompt: "Draft the first version of a comic strip using clear dialogue and a sequence of events.",
        mathTopic: "Financial Literacy",
        scienceTopic: "Forces Acting on Structures",
        reviewPrompt: "List 3 ideas that help structures stay strong and safe."
    }
});

export const weekOrder = Object.freeze(["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"]);
