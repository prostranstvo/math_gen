// The topic scope comes from the teacher's Grade 6 outline supplied by the parent.
// Activities are extra practice. They are not assignments or an official lesson order.
const topic = (id, title, scope, activity, prompts, practice = null) => ({ id, title, scope, activity, prompts, practice });
export const grade6Subjects = [
    {
        id: "math", title: "Mathematics", short: "Math", color: "blue", mark: "01",
        description: "Find patterns. Explain your method. Check your answer.",
        topics: [
            topic("place-value", "Place value & whole numbers", "Place value and whole number fluency.", "Explain a number", ["Choose a six-digit number. Write it in expanded form.", "Use your number in an addition or subtraction problem.", "Explain how you checked your answer."], "place-value"),
            topic("factors", "Prime numbers & factors", "Prime and composite numbers; prime factorization.", "Build a factor tree", ["List all the factor pairs of 36.", "Split 36 into prime factors. Draw or describe your factor tree.", "Explain why 1 is neither prime nor composite."], "factors"),
            topic("powers", "Powers & square roots", "Powers and square roots.", "Connect squares and roots", ["Draw a square array of 25 dots.", "Write a power and a square root that describe the array.", "Explain the difference between 5 × 2 and 5²."], "powers"),
            topic("fractions", "Fractions", "Fractions, equivalent fractions, and comparisons.", "Show the same amount", ["Draw two different fraction models that show one half.", "Compare 3/4 and 2/3. Show your method.", "Explain why a larger denominator does not always mean a larger fraction."], "fractions"),
            topic("fraction-operations", "Fraction operations", "Operations with fractions.", "Work with equal parts", ["Show how to add 1/3 and 1/4 using equal-sized parts.", "Write a story problem that uses fractions.", "Solve your problem. Check whether the answer makes sense."], "fraction-operations"),
            topic("decimals", "Decimals", "Decimal place value and operations.", "Check a decimal calculation", ["Write a number with thousandths. Name the value of each digit.", "Make an addition problem with two decimal numbers.", "Estimate first. Then calculate and compare."], "decimals"),
            topic("percents", "Percents", "Connections between fractions, decimals, and percents.", "One amount, three forms", ["Represent 25% as a fraction and a decimal.", "Find 25% of 80. Explain your method.", "Make a different example and check it."], "percents"),
            topic("integers", "Integers", "Positive and negative integers.", "Use a number line", ["Place −4, 0, and 3 on a number line.", "Describe a situation that uses a negative number.", "Explain which is greater: −2 or −5."], "integers"),
            topic("measurement", "Length, mass & capacity", "Measuring length, mass, and capacity.", "Choose a useful unit", ["Choose three objects. Select a suitable unit for each measurement.", "Estimate a length, mass, and capacity. Measure where possible.", "Compare your estimates with your measurements."], "measurement"),
            topic("area", "2D area", "Measuring area of two-dimensional shapes.", "Measure a space", ["Draw a rectangle and label its length and width.", "Find its area and perimeter. Include units.", "Draw a different rectangle with the same area."], "area"),
            topic("angles", "Angles & polygons", "Measuring angles and describing polygon properties.", "Investigate a shape", ["Draw a polygon. Name it and label its sides.", "Identify acute, right, or obtuse angles.", "Describe two properties that identify your polygon."], "angles"),
            topic("solids", "3D solids & surface area", "Three-dimensional solids and 3D area.", "Unfold a solid", ["Choose a box. Sketch its faces as a net.", "Label the measurements of each face.", "Find the total surface area. State your units."], "solids"),
            topic("transformations", "Transformations", "Translations, reflections, and rotations.", "Move a shape", ["Draw a shape on a coordinate grid.", "Translate, reflect, or rotate it. Record the rule.", "Explain what changed and what stayed the same."], "transformations"),
            topic("data", "Data management", "Collecting, displaying, and interpreting data.", "Ask a data question", ["Write a question you could answer with a small survey.", "Make a table or graph of your results.", "Write two conclusions supported by the data."], "data"),
            topic("algebra", "Variables & equations", "Variables, patterns, and equations.", "Find the unknown", ["Describe what a variable represents.", "Write and solve an equation for a short story problem.", "Substitute your answer into the equation to check it."], "algebra"),
            topic("probability", "Probability", "Describing and calculating chance.", "Predict and test", ["Describe a simple chance experiment.", "Predict the probability of one outcome.", "Repeat the experiment. Compare the results with your prediction."], "probability"),
            topic("coding", "Coding", "Coding as part of data and algebra learning.", "Write a clear algorithm", ["Write step-by-step instructions to draw a repeating pattern.", "Use a loop to shorten the repeated instructions.", "Test your instructions. Explain one error you corrected."], "coding"),
            topic("economy", "Classroom Economy", "Financial literacy through the year-round Classroom Economy.", "Plan a budget", ["Record an example income and three expenses using classroom money.", "Calculate the balance and choose a savings goal.", "Explain one choice you could make to reach the goal."], "economy"),
            topic("eqao-math", "EQAO math preparation", "EQAO practice in late spring.", "Explain a complete solution", ["Use a practice question provided by the teacher.", "Show your calculation, diagram, or reasoning.", "Check your answer and explain any correction."], "review"),
            topic("year-review", "Year-end math review", "A comprehensive year-end review.", "Find your next review topic", ["Choose one topic you can explain without help.", "Choose one topic that needs more practice.", "Solve an example from each topic. Record your next step."], "review")
        ]
    },
    {
        id: "language", title: "Language", short: "Language", color: "green", mark: "02",
        description: "Read closely. Build an idea. Make your words clear.",
        topics: [
            topic("current-events", "Current events", "Language Centres: current events.", "Read a news report", ["Record the report title, source, and date.", "Summarize who, what, where, when, and why.", "Separate one reported fact from one opinion. Explain your choice."]),
            topic("word-study", "Word study", "Language Centres: word study.", "Explore a word", ["Choose words from your current class list.", "Explain their meanings and identify useful word parts.", "Write a sentence for each word. Check its spelling."]),
            topic("nonfiction", "Non-fiction reading", "Language Centres: non-fiction reading.", "Read for evidence", ["Record your text title and source.", "State the main idea. Find two details that support it.", "Explain how a heading, diagram, or caption helped you."]),
            topic("summaries", "Summary writing", "Language Centres: summary writing.", "Keep the main ideas", ["Record the title of the text you read.", "Write its main idea and key details in your own words.", "Revise your summary. Remove minor details and personal opinions."]),
            topic("literary-devices", "Literary devices", "Recognizing and using literary devices.", "Look at the writer's choice", ["Find an example of a literary device in your class text.", "Name the device and explain its effect.", "Write your own example and explain what it adds."]),
            topic("book-talks", "Book & author talks", "Book and author talks.", "Prepare a short talk", ["Name your book or author and introduce the topic.", "Choose two points to explain with examples.", "Prepare a closing recommendation. Practise aloud."]),
            topic("novel", "Whole-class novel study", "Whole-class novel study and a culminating novel project.", "Follow a character", ["Record the novel title and the assigned chapter.", "Explain a character's choice using evidence from the text.", "Connect this evidence to a theme or project idea."]),
            topic("descriptive-writing", "Descriptive writing", "Descriptive writing during the novel study.", "Make a scene clear", ["Plan a setting and select useful sensory details.", "Write a draft with precise nouns and verbs.", "Revise one passage. Explain why it is clearer."]),
            topic("poetry", "Poetry", "A unit on poetry.", "Read, then write a poem", ["Record a poem title. Describe its imagery, sound, or structure.", "Draft your own poem around one idea.", "Read it aloud. Revise the words or line breaks."]),
            topic("persuasive", "Persuasive essay writing", "Planning and writing persuasive essays.", "Support your position", ["State your position. Plan your audience and purpose.", "Draft reasons with evidence. Consider another point of view.", "Revise your introduction, paragraphs, and conclusion."]),
            topic("eqao-language", "EQAO language preparation", "EQAO skills preparation.", "Support a reading response", ["Use a text and question from the teacher.", "Answer the question with evidence from the text.", "Check that each part of the question has an answer."])
        ]
    },
    {
        id: "science", title: "Science", short: "Science", color: "coral", mark: "03",
        description: "Ask a question. Observe carefully. Explain the evidence.",
        topics: [
            topic("biodiversity", "Biodiversity", "Exploring the variety of life on Earth.", "Observe a local habitat", ["Choose a place to observe without disturbing living things.", "Record different living things and how you grouped them.", "Describe a connection between two organisms and their habitat."]),
            topic("electricity", "Electricity", "Electrical energy, circuits, and energy transformation.", "Explain a circuit", ["Use a class diagram or an approved low-voltage classroom kit.", "Draw and label a complete circuit. Predict what happens if it opens.", "Explain an energy transformation in your example."]),
            topic("flight", "Flight", "Aerodynamics and the principles of flight.", "Compare paper gliders", ["Use your class notes to label forces acting on a glider.", "Plan a fair comparison. Change one feature at a time.", "Record the results and explain what the evidence supports."]),
            topic("space", "Space", "Space systems, planets, and celestial bodies.", "Compare two objects in space", ["Choose two planets or other celestial bodies.", "Use a class source to compare three features.", "Explain a pattern or difference. Record your source."]),
            topic("science-fair", "Swansea Science Fair", "Hands-on projects presented near the end of the year.", "Plan an investigation", ["Write a question you can investigate. Discuss the method with an adult.", "Plan materials, measurements, and a fair comparison.", "Use the project planner to record results and prepare your display."])
        ]
    },
    {
        id: "social", title: "Social Studies", short: "Social Studies", color: "gold", mark: "04",
        description: "Use sources to explore communities and connections.",
        topics: [
            topic("global", "Canada & the global community", "Canada's interactions with the global community, international organizations, and global affairs.", "Investigate a connection", ["Choose an international organization or global issue from class.", "Explain Canada's role using two sources. Record their dates.", "Describe who is affected and compare two points of view."]),
            topic("communities", "Communities: past & present", "Heritage, identity, and the diverse communities shaping Canada.", "Compare then and now", ["Choose a community studied in class.", "Use sources to compare an aspect of its past and present.", "Explain continuity or change. Include the community's own perspective."])
        ]
    },
    {
        id: "arts", title: "Arts", short: "Arts", color: "rose", mark: "05",
        description: "Try an idea. Make something. Reflect on your choices.",
        topics: [
            topic("art-elements", "Elements of art", "Using the elements of visual art.", "Study an artwork", ["Choose an artwork and record its creator.", "Identify elements such as line, colour, shape, and texture.", "Make a small study. Explain one choice you made."]),
            topic("perspective", "Perspective drawing", "Drawing with perspective.", "Show depth", ["Use your class example to mark a horizon and vanishing point.", "Draw a scene with objects at different distances.", "Explain how your lines show depth."]),
            topic("world-art", "Canadian & global art", "Exploring Canadian and global art.", "Compare two artworks", ["Choose one Canadian artwork and one work from another place.", "Record the artists, sources, and relevant context.", "Compare a visual choice and explain its effect."]),
            topic("pop-art", "Pop Art", "Exploring Pop Art.", "Transform an everyday subject", ["Use a class example to identify Pop Art features.", "Plan a work using an everyday subject, repetition, or colour.", "Make your work and explain the choices you made."]),
            topic("art-project", "Year-end art project", "A final year-end visual art project.", "Develop your idea", ["Choose an idea and medium. Read the teacher's criteria.", "Make a plan and a first version.", "Revise the work and prepare an artist statement."]),
            topic("drama-community", "Community & improvisation", "Community building, improvisation, and role-playing.", "Build a scene together", ["Choose roles and agree on how each person will contribute.", "Try a short improvised scene with a clear situation.", "Reflect on listening, communication, and cooperation."]),
            topic("drama-stories", "Story creation", "Creating stories with soundscapes, movement, and tableaus.", "Tell a story in three moments", ["Plan a beginning, middle, and end.", "Use movement, sound, or still group pictures called tableaus.", "Explain how the audience can understand the story."]),
            topic("performance", "Year-end performance", "Preparing a year-end performance.", "Prepare and rehearse", ["Record your role and the teacher's performance criteria.", "Plan rehearsal steps and note feedback.", "Reflect on one improvement and one next step."])
        ]
    },
    {
        id: "health", title: "Health", short: "Health", color: "teal", mark: "06",
        description: "Use class materials to think about choices and well-being.",
        topics: [
            topic("relationships", "Healthy relationships", "Positive friendships and communication skills.", "Practise a respectful response", ["Use an imaginary situation from class.", "Describe a respectful response and a listening skill.", "Explain how the response could help the people involved."]),
            topic("mental-health", "Mental health", "Understanding well-being and personal coping strategies.", "Review a class example", ["Use a fictional example from the teacher's materials.", "Identify a coping strategy taught in class.", "Describe how the person could ask a trusted adult for support."]),
            topic("substances", "Substance use & addictions", "Substance abuse and addictions; healthy choices and safety.", "Check a safety message", ["Read the teacher's assigned material.", "Summarize its key safety message in your own words.", "Write a question to discuss with the teacher or a trusted adult."]),
            topic("development", "Human development & sexual health", "Human development and personal health topics.", "Review the class lesson", ["Use the teacher's assigned materials and learning goals.", "Summarize a general concept without personal details.", "Discuss any private questions with a trusted adult offline."])
        ]
    }
];
export const grade6Topics = grade6Subjects.flatMap(subject => subject.topics.map(item => ({ ...item, subjectId: subject.id })));
export const getTopic = id => grade6Topics.find(item => item.id === id);
export const getSubject = id => grade6Subjects.find(item => item.id === id);
export const projectTemplates = [
    { id: "science-fair", subjectId: "science", title: "Swansea Science Fair", timing: "Near the end of the year", steps: ["Question & prediction", "Method & materials", "Observations & results", "Conclusion & limits", "Display & presentation"] },
    { id: "novel-project", subjectId: "language", title: "Novel project", timing: "After the class novel study", steps: ["Book & teacher criteria", "Main idea & text evidence", "Plan", "Draft & feedback", "Final project & reflection"] },
    { id: "persuasive-essay", subjectId: "language", title: "Persuasive essay", timing: "When assigned in class", steps: ["Position & audience", "Reasons & evidence", "First draft", "Review & revision", "Final essay"] },
    { id: "art-project", subjectId: "arts", title: "Year-end art project", timing: "End of the year", steps: ["Idea & teacher criteria", "References & materials", "Study & first version", "Revision", "Final work & artist statement"] },
    { id: "performance", subjectId: "arts", title: "Year-end performance", timing: "End of the year", steps: ["Role & teacher criteria", "Story & rehearsal plan", "Rehearsal notes", "Feedback & changes", "Performance & reflection"] },
    { id: "economy", subjectId: "math", title: "Classroom Economy", timing: "Throughout the year", steps: ["Class rules & role", "Income record", "Expenses & balance", "Savings goal", "Choices & reflection"] }
];
