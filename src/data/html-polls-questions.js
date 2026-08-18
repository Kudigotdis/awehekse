const MODULE_1 = 'Mass Media & Social Media Conditioning'
const MODULE_2 = 'Intimacy, Erotica, & Taboo Consumption'
const MODULE_3 = 'Emotional Regulation & Stress Coping'
const MODULE_4 = 'Self-Esteem, Validation, & Identity'
const MODULE_5 = 'Attachment Styles & Relational Dynamics'
const MODULE_6 = 'Female Platonic Friendships & Community'
const MODULE_7 = 'Childhood Conditioning & Family Scripts'
const MODULE_8 = 'Body Literacy, Cycle Psychology, & Somatics'
const MODULE_9 = 'Ambition, Financial Independence, & Power'
const MODULE_10 = 'Boundaries, Assertiveness, & Vulnerability'
const MODULE_11 = 'Trauma, Safety, & Hyper-Vigilance'
const MODULE_12 = 'Sexuality, Pleasure, & Consent Architecture'
const MODULE_13 = 'Spirituality, Faith, & Philosophical Foundations'
const MODULE_14 = 'Loneliness, Aging, & Generational Evolution'
const MODULE_15 = 'Recovery, Resilience, & Help-Seeking Readiness'

const htmlPollsQuestions = [
  // Module 1: Mass Media & Social Media Conditioning (1-6)
  { id: 1, module: 1, moduleName: MODULE_1, question: 'How many hours per day do you spend passively scrolling through short-form video platforms (TikTok, Instagram Reels, YouTube Shorts)?', options: ['Less than 1 hour', '1 to 3 hours', 'More than 3 hours'] },
  { id: 2, module: 1, moduleName: MODULE_1, question: 'When viewing curated, highly aesthetic lifestyle content online, how frequently do you experience a negative shift in your self-worth?', options: ['Rarely or never', 'Occasionally', 'Frequently'] },
  { id: 3, module: 1, moduleName: MODULE_1, question: 'Do you find yourself using social media notifications or algorithmic validation (likes, comments, DMs) to regulate your immediate mood when stressed or bored?', options: ['Never', 'Sometimes', 'Often'] },
  { id: 4, module: 1, moduleName: MODULE_1, question: 'To what extent has constant exposure to digitally altered imagery changed your baseline expectations of what a natural human body should look like?', options: ['Not at all', 'Somewhat', 'Significantly'] },
  { id: 5, module: 1, moduleName: MODULE_1, question: 'Have you ever encountered explicit or adult-themed content unexpectedly via mainstream social media algorithms (e.g., TikTok/Reels)?', options: ['Never', 'Occasionally', 'Frequently'] },
  { id: 6, module: 1, moduleName: MODULE_1, question: 'How often do you compare your career, relationship, or personal milestones to the highlight reels of peers or influencers online?', options: ['Rarely', 'Sometimes', 'Constantly'] },

  // Module 2: Intimacy, Erotica, & Taboo Consumption (7-14)
  { id: 7, module: 2, moduleName: MODULE_2, question: 'How frequently do you consume adult content (visual, auditory, or written erotica)?', options: ['Never', 'Occasionally', 'Regularly'] },
  { id: 8, module: 2, moduleName: MODULE_2, question: 'Which medium of adult media or erotica do you find yourself drawn to most often?', options: ['Written prose or audio-only', 'Mainstream videos', 'Queer or alternative categories'] },
  { id: 9, module: 2, moduleName: MODULE_2, question: 'What is your primary psychological motivation for consuming erotica or adult content?', options: ['Stress relief or physical pleasure', 'Curiosity or boredom', 'Emotional escape or coping'] },
  { id: 10, module: 2, moduleName: MODULE_2, question: 'When consuming adult content, do you actively seek out ethical production, respectful communication, or performer safety?', options: ['Never', 'Sometimes', 'Always prioritize it'] },
  { id: 11, module: 2, moduleName: MODULE_2, question: 'How much internal or societal guilt do you experience following the consumption of adult or explicit media?', options: ['None', 'Mild', 'Intense'] },
  { id: 12, module: 2, moduleName: MODULE_2, question: 'Have you ever used erotica collaboratively with a partner to build intimacy or explore new dynamics?', options: ['Never', 'Once or twice', 'Regularly'] },
  { id: 13, module: 2, moduleName: MODULE_2, question: 'Do you feel that your private sexual fantasies align with what you actually desire in a real-world partner?', options: ['Closely aligned', 'Somewhat separate', 'Completely separate escapes'] },
  { id: 14, module: 2, moduleName: MODULE_2, question: 'If you have ever felt your consumption of explicit media was becoming compulsive or problematic, how comfortable have you felt seeking professional help or guidance?', options: ['Very comfortable', 'Hesitant due to stigma', 'Completely isolated or unhelped'] },

  // Module 3: Emotional Regulation & Stress Coping (15-21)
  { id: 15, module: 3, moduleName: MODULE_3, question: 'When experiencing high stress or burnout, what is your primary behavioral defense mechanism?', options: ['Isolation or overworking', 'Masking or emotional eating', 'Reaching out for support'] },
  { id: 16, module: 3, moduleName: MODULE_3, question: 'How often do you feel the pressure of the "double burden"—balancing professional expectations with domestic or emotional labor?', options: ['Rarely', 'Frequently', 'Constantly overwhelmed'] },
  { id: 17, module: 3, moduleName: MODULE_3, question: 'Do you rely on subtle dependencies (such as compulsive screen-checking, retail therapy, or caffeine/substances) to get through the day?', options: ['None', 'Occasional (caffeine, retail)', 'Heavy reliance (screen checking, substances)'] },
  { id: 18, module: 3, moduleName: MODULE_3, question: 'How easily are you able to express your raw emotions (anger, sadness, fear) without filtering them to make others comfortable?', options: ['Easily', 'With difficulty', 'Rarely (prefer to filter)'] },
  { id: 19, module: 3, moduleName: MODULE_3, question: 'When emotionally overwhelmed, do you tend to internalize your distress (self-blame) or externalize it (frustration toward others)?', options: ['Always internalize', 'Mixed balance', 'Usually externalize'] },
  { id: 20, module: 3, moduleName: MODULE_3, question: 'How frequently do you experience emotional burnout that manifests as physical exhaustion or cognitive fatigue?', options: ['Rarely', 'Frequently', 'Chronic baseline'] },
  { id: 21, module: 3, moduleName: MODULE_3, question: 'Do you have a safe, confidential outlet where you can unpack heavy psychological stress without fear of judgment?', options: ['Yes, robust support', 'Limited or conditional', 'None at all'] },

  // Module 4: Self-Esteem, Validation, & Identity (22-27)
  { id: 22, module: 4, moduleName: MODULE_4, question: 'Where do you primarily draw your sense of self-worth from?', options: ['Internal achievements and personal growth', 'External validation and appearance', 'Caretaking and serving others'] },
  { id: 23, module: 4, moduleName: MODULE_4, question: 'How frequently do you experience the "imposter phenomenon," feeling like a fraud despite clear evidence of your competence or success?', options: ['Rarely', 'Often', 'Constantly feel like a fraud'] },
  { id: 24, module: 4, moduleName: MODULE_4, question: 'To what extent does perfectionism dictate your daily routine and decision-making process?', options: ['Low', 'Moderate', 'Extreme'] },
  { id: 25, module: 4, moduleName: MODULE_4, question: 'How harshly do you judge yourself when you fail to meet self-imposed standards of excellence?', options: ['Compassionately', 'Moderately critical', 'Extremely harsh'] },
  { id: 26, module: 4, moduleName: MODULE_4, question: 'How easily can you accept compliments or praise from others without deflecting or minimizing them?', options: ['Easily', 'With mild discomfort', 'Deflect or minimize completely'] },
  { id: 27, module: 4, moduleName: MODULE_4, question: 'Do you feel your core identity is shaped by what you do for others rather than who you inherently are?', options: ['Shaped by who I am', 'Balanced', 'Shaped entirely by what I do for others'] },

  // Module 5: Attachment Styles & Relational Dynamics (28-34)
  { id: 28, module: 5, moduleName: MODULE_5, question: 'In romantic relationships, do you lean more toward anxious attachment (fear of abandonment), avoidant attachment (fear of intimacy), or secure attachment?', options: ['Secure attachment', 'Anxious attachment (fear of abandonment)', 'Avoidant attachment (fear of intimacy)'] },
  { id: 29, module: 5, moduleName: MODULE_5, question: 'How do you typically react during high-stress relational friction or arguments?', options: ['Open communication and confrontation', 'People-pleasing', 'Stonewalling or withdrawal'] },
  { id: 30, module: 5, moduleName: MODULE_5, question: 'How much psychological and emotional weight do you carry regarding the mental load and logistical management of your household or relationship?', options: ['Balanced distribution', 'Heavy mental load', 'Total solitary management'] },
  { id: 31, module: 5, moduleName: MODULE_5, question: 'How comfortable are you expressing your core needs to a romantic partner without anticipating rejection?', options: ['Comfortably', 'With some hesitation', 'Fear of rejection prevents it'] },
  { id: 32, module: 5, moduleName: MODULE_5, question: 'Do you frequently compromise your own boundaries to keep the peace or prevent a partner from pulling away?', options: ['Rarely', 'Sometimes', 'Frequently'] },
  { id: 33, module: 5, moduleName: MODULE_5, question: 'How long does it typically take you to emotionally recover after a conflict or rupture in a close relationship?', options: ['Quickly (within hours)', 'Moderately (a few days)', 'Extended period (weeks)'] },
  { id: 34, module: 5, moduleName: MODULE_5, question: 'Do you find yourself naturally attracted to partners who require fixing, rescuing, or intense emotional labor?', options: ['No', 'Occasionally', 'Frequently pattern'] },

  // Module 6: Female Platonic Friendships & Community (35-40)
  { id: 35, module: 6, moduleName: MODULE_6, question: 'Do you have at least one same-gender friend with whom you can share absolute vulnerabilities without fear of betrayal?', options: ['Multiple close friends', 'One trusted friend', 'None'] },
  { id: 36, module: 6, moduleName: MODULE_6, question: 'How often do you sense underlying, unspoken competition or comparison within your female peer groups?', options: ['Rarely sensed', 'Occasionally sensed', 'Pervasive dynamic'] },
  { id: 37, module: 6, moduleName: MODULE_6, question: 'Have you ever experienced social exclusion or passive-aggressive behavior from other women during pivotal life stages?', options: ['Never', 'Past experiences', 'Frequent dynamic'] },
  { id: 38, module: 6, moduleName: MODULE_6, question: 'Despite having active social networks, how frequently do you experience deep, chronic feelings of loneliness or isolation?', options: ['Rarely', 'Sometimes', 'Chronic and deep'] },
  { id: 39, module: 6, moduleName: MODULE_6, question: "How comfortable are you celebrating a close friend's success without comparing it to your own trajectory?", options: ['Easily and genuinely', 'Mixed feelings', 'Triggers comparison or envy'] },
  { id: 40, module: 6, moduleName: MODULE_6, question: 'Do your friendships primarily revolve around surface-level activities, or do they offer deep emotional safety and psychological processing?', options: ['Deep psychological safety', 'Mix of both', 'Primarily surface-level'] },

  // Module 7: Childhood Conditioning & Family Scripts (41-47)
  { id: 41, module: 7, moduleName: MODULE_7, question: 'How heavily did parental expectations and behavioral conditioning shape your adult choices regarding career and relationships?', options: ['Minimal', 'Moderate', 'Heavy steering'] },
  { id: 42, module: 7, moduleName: MODULE_7, question: 'Did you grow up with a "Good Girl" script—where compliance, quietness, and helping others were heavily rewarded?', options: ['Not really', 'Somewhat', 'Heavily conditioned'] },
  { id: 43, module: 7, moduleName: MODULE_7, question: 'How frequently did you witness or experience emotional instability, neglect, or boundary violations in your formative home environment?', options: ['None', 'Occasional', 'Significant history'] },
  { id: 44, module: 7, moduleName: MODULE_7, question: 'To what extent do you feel you had to parent yourself or look after the emotional needs of your parents when you were a child?', options: ['Rare', 'Sometimes', 'Heavily parentified'] },
  { id: 45, module: 7, moduleName: MODULE_7, question: 'How do residual patterns from your primary caregivers influence how you handle conflict or stress today?', options: ['Unlearned and healed', 'Working through them', 'Dominates current behavior'] },
  { id: 46, module: 7, moduleName: MODULE_7, question: 'Did your family encourage open emotional expression, or were feelings treated as a weakness or a disruption?', options: ['Encouraged', 'Tolerated', 'Treated as weakness or disruption'] },
  { id: 47, module: 7, moduleName: MODULE_7, question: 'How much do you feel you are living out your own authentic life choices versus fulfilling inherited family expectations?', options: ['Fully authentic', 'Blended', 'Fulfilling family expectations'] },

  // Module 8: Body Literacy, Cycle Psychology, & Somatics (48-54)
  { id: 48, module: 8, moduleName: MODULE_8, question: 'How noticeably do your psychological moods, anxiety levels, and energy shift across the four phases of your menstrual cycle (follicular, ovulatory, luteal, menstrual)?', options: ['Minimal', 'Noticeable', 'Severe disruption'] },
  { id: 49, module: 8, moduleName: MODULE_8, question: 'Have you noticed a direct correlation between hormonal contraceptives (or hormonal shifts) and changes in your baseline mental health or libido?', options: ['None noticed', 'Moderate link', 'Direct, powerful impact'] },
  { id: 50, module: 8, moduleName: MODULE_8, question: 'How frequently does your psychological stress manifest as physical symptoms (e.g., chronic fatigue, insomnia, tension headaches, digestive issues)?', options: ['Rarely', 'Frequently', 'Chronic baseline (fatigue, insomnia)'] },
  { id: 51, module: 8, moduleName: MODULE_8, question: 'How connected do you feel to your physical body when making day-to-day decisions versus living entirely "in your head"?', options: ['Deeply connected', 'Moderately connected', 'Living entirely in my head'] },
  { id: 52, module: 8, moduleName: MODULE_8, question: 'Do you track your somatic and hormonal changes to better understand your emotional fluctuations?', options: ['Consistently', 'Occasionally', 'Never'] },
  { id: 53, module: 8, moduleName: MODULE_8, question: 'How comfortable are you discussing reproductive health, cycle changes, or somatic challenges with healthcare providers?', options: ['Very comfortable', 'Somewhat hesitant', 'Dismissed or deeply uncomfortable'] },
  { id: 54, module: 8, moduleName: MODULE_8, question: 'Have you ever experienced physical health dismissals from medical professionals regarding your pain or somatic symptoms?', options: ['Never', 'Once or twice', 'Frequently dismissed'] },

  // Module 9: Ambition, Financial Independence, & Power (55-60)
  { id: 55, module: 9, moduleName: MODULE_9, question: 'What is your primary psychological relationship with money?', options: ['Tool for freedom and security', 'Neutral necessity', 'Trigger for scarcity anxiety'] },
  { id: 56, module: 9, moduleName: MODULE_9, question: 'How comfortable are you negotiating for fair compensation, promotions, or recognition in professional spaces?', options: ['Very comfortable', 'Hesitant', 'Avoid it entirely'] },
  { id: 57, module: 9, moduleName: MODULE_9, question: 'How do you handle systemic pushback or boundary-testing when asserting your professional authority?', options: ['Assertive and firm', 'Navigate carefully', 'Yield to pressure'] },
  { id: 58, module: 9, moduleName: MODULE_9, question: 'Do you experience guilt or internal conflict when prioritizing your career ambitions over domestic or caretaking roles?', options: ['None', 'Moderate guilt', 'Intense internal conflict'] },
  { id: 59, module: 9, moduleName: MODULE_9, question: 'How comfortable are you holding absolute leadership authority versus preferring a supportive, collaborative role?', options: ['Love leading', 'Prefer collaboration', 'Prefer deferring leadership'] },
  { id: 60, module: 9, moduleName: MODULE_9, question: 'To what extent is financial independence a non-negotiable anchor for your personal sense of safety and autonomy?', options: ['Non-negotiable safety', 'Important', 'Secondary concern'] },

  // Module 10: Boundaries, Assertiveness, & Vulnerability (61-67)
  { id: 61, module: 10, moduleName: MODULE_10, question: 'How physically or emotionally difficult is it for you to say a clear, unyielding "no" to requests you do not want to fulfill?', options: ['Easy', 'Moderate difficulty', 'Extremely difficult'] },
  { id: 62, module: 10, moduleName: MODULE_10, question: 'How intense is your underlying fear of rejection or abandonment when you set firm personal boundaries?', options: ['Low', 'Moderate', 'High'] },
  { id: 63, module: 10, moduleName: MODULE_10, question: 'Do you find yourself building high emotional walls or practicing hyper-independence to protect yourself from getting hurt?', options: ['Rarely', 'Sometimes', 'Habitual defense mechanism'] },
  { id: 64, module: 10, moduleName: MODULE_10, question: 'How often do you agree to things you despise just to avoid creating discomfort or tension for others?', options: ['Rarely', 'Sometimes', 'Habitual people-pleasing'] },
  { id: 65, module: 10, moduleName: MODULE_10, question: 'How do you define and practice calculated vulnerability—opening up selectively versus over-sharing out of desperation for connection?', options: ['Consistently practiced', 'Selective', 'High walls or over-sharing extremes'] },
  { id: 66, module: 10, moduleName: MODULE_10, question: 'When someone violates your boundary, how quickly do you address it, versus minimizing it and letting resentment build?', options: ['Immediately', 'After hesitation', 'Minimize and let resentment build'] },
  { id: 67, module: 10, moduleName: MODULE_10, question: 'Do you feel that setting firm boundaries makes you a "difficult" or "selfish" person based on your conditioning?', options: ['Disagree', 'Sometimes worry', 'Strongly feel conditioned to believe so'] },

  // Module 11: Trauma, Safety, & Hyper-Vigilance (68-74)
  { id: 68, module: 11, moduleName: MODULE_11, question: 'What level of daily mental gymnastics or unconscious threat calculation do you perform when navigating public or private spaces?', options: ['Minimal', 'Moderate baseline', 'Constant, exhausting calculation'] },
  { id: 69, module: 11, moduleName: MODULE_11, question: 'How would you rate your baseline level of hyper-vigilance regarding the moods, tones, and potential threats of people around you?', options: ['Low / relaxed', 'Moderate awareness', 'High / constant alertness'] },
  { id: 70, module: 11, moduleName: MODULE_11, question: 'Have you experienced any past history of emotional, physical, or sexual boundary violations that still impact your current trust levels?', options: ['None', 'Past healed', 'Ongoing impact on trust'] },
  { id: 71, module: 11, moduleName: MODULE_11, question: 'How frequently do you find yourself scanning a room or anticipating worst-case scenarios to ensure your safety?', options: ['Rarely', 'Occasionally', 'Constantly'] },
  { id: 72, module: 11, moduleName: MODULE_11, question: 'How easily can your nervous system settle into a state of deep relaxation when you are alone in a secure environment?', options: ['Easily', 'With effort', 'Rarely or never truly relaxed'] },
  { id: 73, module: 11, moduleName: MODULE_11, question: 'Do you carry somatic imprints or physical tension associated with past traumatic experiences or chronic stress?', options: ['None', 'Occasional', 'Chronic physical tension'] },
  { id: 74, module: 11, moduleName: MODULE_11, question: 'How supported do you feel by societal systems and justice structures when it comes to personal safety and accountability?', options: ['Feel supported', 'Neutral', 'Deeply unsupported or distrustful'] },

  // Module 12: Sexuality, Pleasure, & Consent Architecture (75-82)
  { id: 75, module: 12, moduleName: MODULE_12, question: 'How comfortable are you initiating intimacy and explicitly stating your physical desires to a partner?', options: ['Very comfortable', 'Moderately comfortable', 'Difficult or passive'] },
  { id: 76, module: 12, moduleName: MODULE_12, question: 'Have you ever engaged in sexual activity strictly out of compliance—to appease a partner, avoid an argument, or prevent rejection?', options: ['Never', 'Occasionally', 'Frequently'] },
  { id: 77, module: 12, moduleName: MODULE_12, question: 'How easily can you communicate about sexual health, boundaries, and consent without feeling awkward or ashamed?', options: ['Effortlessly', 'With some awkwardness', 'Significant shame or barrier'] },
  { id: 78, module: 12, moduleName: MODULE_12, question: 'How would you rate your personal comfort level with claiming your own physical pleasure and climax during intimacy?', options: ['Confident', 'Moderate', 'Low or rarely prioritize'] },
  { id: 79, module: 12, moduleName: MODULE_12, question: 'Have you ever felt disconnected from your body or experienced numbness during sexual encounters?', options: ['Never', 'Occasionally', 'Frequently'] },
  { id: 80, module: 12, moduleName: MODULE_12, question: 'How much has societal conditioning or religious messaging influenced your feelings of sexual freedom versus sexual shame?', options: ['No impact (freedom)', 'Mild impact', 'Heavy internal shame'] },
  { id: 81, module: 12, moduleName: MODULE_12, question: 'How open are you to exploring alternative kinks, BDSM, or unconventional preferences within safe parameters?', options: ['Open and exploring', 'Curious', 'Uninterested or closed off'] },
  { id: 82, module: 12, moduleName: MODULE_12, question: 'Do you feel that your modern understanding of sex and pleasure aligns more with personal self-discovery or traditional expectations?', options: ['Modern self-discovery', 'Balanced', 'Traditional expectations'] },

  // Module 13: Spirituality, Faith, & Philosophical Foundations (83-88)
  { id: 83, module: 13, moduleName: MODULE_13, question: 'What core moral frameworks or belief systems guide your ethical decisions and perception of life purpose?', options: ['Internal humanism and ethics', 'Secular philosophy', 'Organized religious doctrine'] },
  { id: 84, module: 13, moduleName: MODULE_13, question: 'Have you ever experienced religious trauma, institutional judgment, or moral shaming from organized faith communities?', options: ['None', 'Minor friction', 'Significant trauma or shaming'] },
  { id: 85, module: 13, moduleName: MODULE_13, question: 'How much do you rely on your internal intuition and gut guidance versus empirical logic when facing high-stakes decisions?', options: ['Heavily lean on intuition', 'Balanced blend', 'Purely empirical or logical'] },
  { id: 86, module: 13, moduleName: MODULE_13, question: 'How do you handle existential dread, uncertainty, or the search for meaning in times of crisis?', options: ['Internal resilience', 'Philosophical inquiry', 'Spiritual or faith reliance'] },
  { id: 87, module: 13, moduleName: MODULE_13, question: "Has your spiritual or philosophical outlook evolved significantly away from your family's traditional upbringing?", options: ['Stayed the same', 'Moderately shifted', 'Radically evolved away'] },
  { id: 88, module: 13, moduleName: MODULE_13, question: 'Do you find comfort in spiritual practices, meditation, or connection with something larger than yourself?', options: ['High comfort', 'Occasional', 'None'] },

  // Module 14: Loneliness, Aging, & Generational Evolution (89-94)
  { id: 89, module: 14, moduleName: MODULE_14, question: 'How much anxiety or dread do you experience regarding the prospect of long-term isolation or aging alone?', options: ['Low', 'Moderate', 'High dread'] },
  { id: 90, module: 14, moduleName: MODULE_14, question: 'How do societal pressures regarding physical aging, loss of youth, or fertility timelines affect your psychological well-being?', options: ['Unfazed', 'Moderately impacted', 'Highly distressed'] },
  { id: 91, module: 14, moduleName: MODULE_14, question: 'In what ways are your lifestyle choices, career paths, and relationship structures radically different from those of your mother or grandmothers?', options: ['Radical shift', 'Moderate changes', 'Traditional path'] },
  { id: 92, module: 14, moduleName: MODULE_14, question: 'How visible do you feel in society as you transition through different decades of your life?', options: ['Feel visible and valued', 'Neutral', 'Feel invisible or discounted'] },
  { id: 93, module: 14, moduleName: MODULE_14, question: 'How do you cope with the cultural pressure for women to maintain eternal youthfulness and perfection?', options: ['Reject the standard', 'Struggle with it', 'Conform to it'] },
  { id: 94, module: 14, moduleName: MODULE_14, question: 'Do you feel a strong sense of solidarity with the modern generation of women redefining societal expectations?', options: ['Strong solidarity', 'Moderate', 'Disconnected'] },

  // Module 15: Recovery, Resilience, & Help-Seeking Readiness (95-100)
  { id: 95, module: 15, moduleName: MODULE_15, question: 'When facing major life failures, burnout, or emotional crises, what are your primary self-correction strategies?', options: ['Internal reflection and adaptation', 'Reaching out to friends', 'Shutting down or escapism'] },
  { id: 96, module: 15, moduleName: MODULE_15, question: 'How willing are you to approach professional psychological support, therapists, or support groups when struggling?', options: ['Highly willing', 'Hesitant', 'Refuse or isolate entirely'] },
  { id: 97, module: 15, moduleName: MODULE_15, question: 'Have you ever hidden a personal struggle (such as compulsive habits, mental health issues, or intimacy stress) out of fear of social judgment?', options: ['Never', 'Sometimes', 'Always (code of silence)'] },
  { id: 98, module: 15, moduleName: MODULE_15, question: 'How effectively can you integrate past mistakes, shadows, and personal flaws into a healthy, compassionate sense of self?', options: ['Effectively integrated', 'Working on it', 'Burdened by shame'] },
  { id: 99, module: 15, moduleName: MODULE_15, question: 'How resilient do you feel your psychological baseline is when facing unpredictable disruptions or systemic stressors?', options: ['Highly resilient', 'Moderate', 'Fragile or easily overwhelmed'] },
  { id: 100, module: 15, moduleName: MODULE_15, question: 'How ready are you to actively dismantle old conditioning and build an authentic life aligned with your true psychological needs?', options: ['Ready and active', 'Contemplating', 'Overwhelmed by the prospect'] }
]

export default htmlPollsQuestions
