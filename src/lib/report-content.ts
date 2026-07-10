// report-content.ts
// AUTO-ASSEMBLED report content for the Decision Distortion Assessment.
// Source of truth: DD_Assessment_Reports_Draft2.docx (4 base reports + 20 signal paragraphs).
// Each report renders in this order:
//   opening -> whatItIs -> howItShowsUp -> [signal] -> whereToStart -> research -> whatsNext -> CTA
//
// If you edit copy, edit it HERE (this is the single source the UI reads).

export type ForceKey = "N" | "B" | "A" | "I";

export interface Section {
  heading: string;
  body: string[];
}

export interface ForceReport {
  key: ForceKey;
  name: string;          // e.g. "Noise"
  number: string;        // e.g. "01"
  eyebrow: string;       // "Your Decision Distortion Assessment"
  title: string;         // "Noise Is Your Dominant Force"
  opening: string[];
  whatItIs: Section;
  howItShowsUp: Section;
  whereToStart: Section;
  research: Section;
  whatsNext: Section;
}

export interface Signal {
  signalOn: string;      // the question the report is keyed to
  body: string;
}

export interface Cta {
  talk: string;
  calendly: { label: string; url: string; href: string };
  lfb: { label: string; url: string; href: string };
  badCallIntro: string;
  badCall: { label: string; url: string; href: string };
}

const DATA = {
  "cta": {
    "talk": "Your results describe a pattern, not a verdict. If you'd like to walk through what they mean for your company specifically \u2014 where this force is most likely costing you, and which single gap would be cheapest to close \u2014 book a conversation. No pitch, no obligation.",
    "calendly": {
      "label": "Book a 30-minute conversation",
      "url": "calendly.com/rcleander/15min",
      "href": "https://calendly.com/rcleander/15min"
    },
    "lfb": {
      "label": "LFB Holdings",
      "url": "lfbholdings.com",
      "href": "https://lfbholdings.com"
    },
    "badCallIntro": "For ongoing case-by-case analysis of how these forces operate in real organizational decisions, Bad Call is a subscription brief that applies this framework to actual decision sequences — company autopsies, one at a time.",
    "badCall": {
      "label": "Bad Call",
      "url": "badcall.ai",
      "href": "https://badcall.ai"
    }
  },
  "forces": {
    "N": {
      "key": "N",
      "name": "Noise",
      "number": "01",
      "eyebrow": "Your Decision Distortion Assessment",
      "title": "Noise Is Your Dominant Force",
      "opening": [
        "Your assessment is in. Of the four forces that bend organizational judgment under pressure, noise is showing up most actively in your company right now. That's worth understanding clearly, because noise is the one force that rarely feels like a problem from inside the organization experiencing it.",
        "Of the four forces — noise, bias, accumulation, and incentive misalignment — noise is the most distributed. Bias pushes judgment in a consistent direction; accumulation builds across decisions over time; incentives govern how fast either compounds. Noise operates differently: it scatters conclusions across people and moments, turning the same information into different answers depending on who's in the room and when. The damage isn't a single wrong call. It's the erosion of the organization's ability to reach reliable ones."
      ],
      "whatItIs": {
        "heading": "What noise is",
        "body": [
          "Noise is unwanted variability in judgment — the same information producing different conclusions, even from the same people, depending on who's in the room and when the conversation happens. It is not disagreement. Disagreement is two people with different views on the same facts. Noise is two people — or the same person on different occasions — reaching different conclusions from identical inputs with no principled reason for the divergence.",
          "Two forms operate differently. Level noise is consistent differences between evaluators — one executive is reliably more optimistic, another reliably more conservative, not because of the data but because of who they are. Pattern noise is more disruptive: different people weighting different features of the same situation, so the team isn't actually evaluating the same thing even when it believes it is. Both produce the same visible symptom — inconsistent conclusions — from different mechanisms, and they require different responses.",
          "In a venture-backed company operating under pressure, noise turns reliable signals into organizational static at exactly the moment you can least afford it."
        ]
      },
      "howItShowsUp": {
        "heading": "How it typically shows up",
        "body": [
          "A company's Monday product review looks at usage data and reads it as evidence that the product is working. Thursday, different meeting, different attendees, same data — the conclusion is that it's too early to tell. No one notices that the company has given two answers to one question in a single week. Three weeks of roadmap paralysis follow. From outside, it looks like weak demand signal. From inside, it feels like a hard call in an ambiguous market. What actually happened: unstable evaluation standards converted a real signal into noise before anyone made a decision.",
          "That's the mechanism. The data wasn't the problem. The absence of shared standards for reading the data was."
        ]
      },
      "whereToStart": {
        "heading": "Where to start",
        "body": [
          "Two interventions address noise directly, and they work on different parts of the problem.",
          "The first targets evaluation standards. Before any major decision, agree in writing on which data matters and what good looks like — before anyone starts analyzing. This sounds procedural. It is. That's the point. The moment analysis begins, data selection is already being shaped by the conclusions that are forming. The agreement has to precede the analysis or it doesn't work.",
          "The second targets the conversation itself. Collect independent assessments from the people in the room before group discussion begins. Written, not verbal. This prevents the most confident voice from becoming everyone's anchor before the conversation formally starts, which is the primary mechanism by which group deliberation amplifies noise rather than reducing it. Aggregate after. Discuss the differences. That sequence matters.",
          "Neither of these requires a process overhaul. They require one new habit at the beginning of the decisions that matter most."
        ]
      },
      "research": {
        "heading": "The research behind this",
        "body": [
          "The academic foundation for what your assessment detected comes primarily from Noise: A Flaw in Human Judgment by Daniel Kahneman, Olivier Sibony, and Cass Sunstein — the most rigorous account of how uncontrolled variability in judgment operates across organizations, and why it causes more total decision error than most leaders realize. The finding that organizations routinely underestimate their own noise levels — and that the errors don't cancel out, they accumulate — is directly applicable to what your scores are showing."
        ]
      },
      "whatsNext": {
        "heading": "What's next",
        "body": [
          "The full Decision Distortion whitepaper from LFB Holdings walks through how noise combines with the other three forces — bias, accumulation, and incentive misalignment — and how to locate the specific points in your decision process where a single closed gap would have the greatest effect."
        ]
      }
    },
    "B": {
      "key": "B",
      "name": "Bias",
      "number": "02",
      "eyebrow": "Your Decision Distortion Assessment",
      "title": "Bias Is Your Dominant Force",
      "opening": [
        "Your assessment is in. Of the four forces that bend organizational judgment under pressure, bias is showing up most actively in your company right now.",
        "Of the four forces — noise, bias, accumulation, and incentive misalignment — bias is the one that moves in a single direction. Noise scatters conclusions randomly; accumulation builds through the weight of individually-defensible decisions; incentives govern the rate at which either compounds. Bias does something different: it systematically bends judgment toward a predictable conclusion before the evidence has had a real chance to land. That consistency is what makes it compound rather than cancel — and what makes it nearly invisible from inside the organization experiencing it."
      ],
      "whatItIs": {
        "heading": "What bias is",
        "body": [
          "Bias is systematic directional error: judgment pushed consistently in a predictable direction regardless of the evidence. It operates through a mechanism Kahneman calls WYSIATI — What You See Is All There Is. The fast cognitive system constructs coherent, confident narratives from whatever information is available without registering what's absent. The resulting confidence feels warranted because the narrative is internally consistent — not because the underlying judgment is accurate.",
          "Four forms show up most in venture-backed companies. Overconfidence — systematically underestimating implementation complexity, competitive response, and time to revenue. Confirmation bias — weighting evidence that supports the current thesis and discounting evidence that doesn't, often without awareness that the filtering is happening. The planning fallacy — building timelines and resource plans from the inside out, ignoring the base rate of what typically happens to companies at this stage. And escalation of commitment — continuing in a direction past the point where the evidence supports it, because stopping means realizing the original call was wrong.",
          "What these forms share: they don't look like errors from inside. They look like clear thinking, conviction, and pattern recognition."
        ]
      },
      "howItShowsUp": {
        "heading": "How it typically shows up",
        "body": [
          "A Series B company raised on a strong enterprise thesis. Early pilots look promising. Six months in, renewal conversations come back soft — not bad, not good, but not what the model assumed. The team reads the softness as implementation friction, as a sales motion problem, as a product gap that can be closed. Each explanation is plausible. Each explanation directs resources toward fixing the thesis rather than questioning it. Twelve months later the renewal data is unambiguous. But the company has built an enterprise sales team, a customer success function, and a product roadmap all oriented around a thesis the market has been declining to confirm since month six.",
          "Overconfidence set the original projections. Confirmation bias filtered the early signals. Escalation of commitment kept the machine running after the signals cleared. None of it looked like bias at the time. It looked like execution."
        ]
      },
      "whereToStart": {
        "heading": "Where to start",
        "body": [
          "Two interventions address the bias forms most likely to be active in your company.",
          "The first is a structured challenge mechanism for significant decisions. Designate someone — rotating, not permanently assigned — to take the opposing position before any major commitment is made. Not as a formality. As a genuine mandate to find the strongest version of the case against the direction the room is leaning. The goal isn't to reach the opposite conclusion. It's to make sure the current conclusion has actually been tested. Bias survives best in rooms where everyone agrees before anyone has to disagree.",
          "The second is a pre-committed re-evaluation trigger. Before a significant decision, write down — in advance — the specific data point that would tell you the thesis is wrong. Not a vague 'if things get worse.' A specific, observable condition. Bind the team to look at it on a fixed date. This is the structural mechanism that breaks escalation of commitment before it becomes unbreakable: it converts the re-evaluation from a choice (which loss aversion will prevent) into a pre-committed obligation (which is harder to quietly ignore)."
        ]
      },
      "research": {
        "heading": "The research behind this",
        "body": [
          "The academic foundation for what your assessment detected comes primarily from Thinking, Fast and Slow by Daniel Kahneman — the foundational account of how the fast cognitive system generates systematic directional errors that the slow, corrective system is too depleted or inattentive to catch. The WYSIATI mechanism, the planning fallacy, confirmation bias, and escalation of commitment are all documented there in detail. The insight that matters most for your situation: bias rarely feels like bias from the inside, because the narrative it produces is internally coherent. Coherence is not accuracy."
        ]
      },
      "whatsNext": {
        "heading": "What's next",
        "body": [
          "The full Decision Distortion whitepaper from LFB Holdings walks through how bias combines with the other three forces — noise, accumulation, and incentive misalignment — and how to locate the specific points in your decision process where a single closed gap would have the greatest effect."
        ]
      }
    },
    "A": {
      "key": "A",
      "name": "Accumulation",
      "number": "03",
      "eyebrow": "Your Decision Distortion Assessment",
      "title": "Accumulation Is Your Dominant Force",
      "opening": [
        "Your assessment is in. Of the four forces that bend organizational judgment under pressure, accumulation is showing up most actively in your company right now. It's the quietest of the four forces — and typically the last one an organization recognizes in itself, because every individual decision that produced it looked reasonable when it was made.",
        "Of the four forces — noise, bias, accumulation, and incentive misalignment — accumulation is the only one that operates across decisions rather than within them. Noise distorts individual judgment calls. Bias bends the direction of individual calls. Incentives govern how fast either compounds. Accumulation is different: no single decision has to go wrong for it to take hold. What it requires is simply that addition keeps winning over subtraction, decision after decision, until the aggregate weight of individually-defensible choices has made the next decision harder than it needs to be."
      ],
      "whatItIs": {
        "heading": "What accumulation is",
        "body": [
          "Accumulation is what happens when organizations have a deeply ingrained, largely invisible default toward addition — adding features, processes, hires, metrics, and strategic priorities when faced with a problem — while systematically overlooking subtraction as an equally valid path forward.",
          "This isn't a preference. It's a cognitive accessibility failure: additive options come to mind first, readily and automatically. Subtractive options require deliberate generation, and under pressure, deliberate generation is exactly what's in short supply. The pull operates at three reinforcing levels. Cognitively, addition is simply more accessible — it surfaces first. Culturally, accumulation looks like action; subtraction leaves no visible trace. And economically, the incentive structures of venture-backed companies reward what gets built and launched, not what gets wisely stopped or removed.",
          "Each individual addition — a feature, a process, a hire — seems reasonable in isolation. The problem only becomes visible in aggregate. And by the time it does, the aggregate has made the next decision harder: more variables, more stakeholders, more weight resisting clarity."
        ]
      },
      "howItShowsUp": {
        "heading": "How it typically shows up",
        "body": [
          "Facing a new competitor, a Series C company launches two new product modules, attacks both enterprise and SMB simultaneously, and spins up four parallel pilots. The KPI dashboard swells to fifteen metrics. Decision rights blur. Coordination meetings triple while capital spreads thin. From outside, it looks like scaling execution issues. From inside, every one of those decisions felt justified — the modules addressed real gaps, the market expansion was based on real signals, the pilots were tracking real opportunities. What none of those individual decisions accounted for was what all of them together had created: a company that had outrun its own ability to steer.",
          "The hardest part of accumulation is that no single decision was wrong. The aggregate was the problem. And the aggregate was invisible until the speed dropped and the burn rose."
        ]
      },
      "whereToStart": {
        "heading": "Where to start",
        "body": [
          "Two practices address accumulation directly, and both involve making the subtractive option visible enough to compete.",
          "The first is a subtraction mandate in strategic planning. Every quarter, require every team to identify one thing it will stop doing, exit, or simplify — before any conversation about additions. Not as an afterthought. As a first-order agenda item with the same standing as resource requests. The mechanism matters: when subtraction has to fight for consideration against addition, addition wins by default because it's more cognitively accessible. When subtraction gets dedicated time first, it competes.",
          "The second is a cumulative exposure check. Before any significant addition — a hire, a feature, a market — step back and map what all current commitments together have created. Not just whether this next decision makes sense in isolation, but what it adds to the total weight of what the organization is already carrying. This is the check that accumulation most reliably prevents organizations from performing, because it requires looking at the aggregate rather than the next incremental choice."
        ]
      },
      "research": {
        "heading": "The research behind this",
        "body": [
          "The academic foundation for what your assessment detected comes primarily from Subtract: The Untapped Science of Less by Leidy Klotz — the most direct account of addition default and why subtractive options systematically fail to surface when organizations are under pressure to improve. The finding that's most directly applicable to your situation: even when adding and subtracting require identical effort, people still overwhelmingly default to addition. The default isn't about convenience. It's cognitive, cultural, and economic simultaneously — which is why it takes a structural intervention to counteract it."
        ]
      },
      "whatsNext": {
        "heading": "What's next",
        "body": [
          "The full Decision Distortion whitepaper from LFB Holdings walks through how accumulation combines with the other three forces — noise, bias, and incentive misalignment — and how to locate the specific points in your decision process where a single closed gap would have the greatest effect."
        ]
      }
    },
    "I": {
      "key": "I",
      "name": "Incentive Misalignment",
      "number": "04",
      "eyebrow": "Your Decision Distortion Assessment",
      "title": "Incentive Misalignment Is Your Dominant Force",
      "opening": [
        "Your assessment is in. Of the four forces that bend organizational judgment under pressure, incentive misalignment is showing up most actively in your company right now. This one operates differently from the other three. Noise, bias, and accumulation distort judgment from inside the decision process. Incentives operate in the environment surrounding decisions — they determine how fast the other forces compound and how much friction exists to slow them. When incentives are misaligned, the other three forces run without resistance."
      ],
      "whatItIs": {
        "heading": "What incentive misalignment is",
        "body": [
          "Incentive misalignment is the environmental layer that governs the rate at which noise, bias, and accumulation compound. Think of it as the fuel the other forces run on. Noise, bias, and accumulation are always present in organizations — they're latent. The incentive structure determines whether they operate with friction or without it.",
          "In a clean incentive environment — honest feedback loops, no pressure to perform a narrative, no penalty for surfacing a hard truth — the three cognitive forces still operate, but they also self-correct. Disconfirming evidence lands. Honest dissent is possible. The chain forms slowly and breaks more easily. In a high-fuel environment — runway pressure, valuation optics, board expectations, identity fusion between founder and thesis — the same latent forces run without friction. The chain closes faster.",
          "Two empirical regularities describe how misaligned incentives corrupt the signal environment. When a measure becomes a target, it ceases to be a good measure. And when a quantitative indicator is used for accountability, it becomes subject to gaming — not always through fraud, but through the rational redirection of effort toward what is measured and away from what matters."
        ]
      },
      "howItShowsUp": {
        "heading": "How it typically shows up",
        "body": [
          "The metrics a company reports to its board and the metrics it actually runs the business by start to diverge. Not dramatically, not dishonestly — but the external story and the internal reality are different documents. Sales reports units shipped; the operational reality is that implementation timelines are slipping and renewals are at risk. The company isn't lying. It's performing the narrative the incentive environment rewards, and the people inside can see the gap but can't quite say so without cost.",
          "Then a harder truth surfaces — a product problem, a customer defection, a market signal that the thesis may need revisiting. The person who could have raised it three months ago didn't, because they had watched what happened to the last person who brought a hard problem into the room. By the time the truth is undeniable, the window for the cheaper response has closed.",
          "That sequence — rational silence, delayed signal, expensive correction — is what high-fuel incentive environments produce. Reliably."
        ]
      },
      "whereToStart": {
        "heading": "Where to start",
        "body": [
          "Two interventions address incentive misalignment directly, and they work at different levels of the problem.",
          "The first is a signal environment audit. Map the incentive structure against the behaviors it actually produces rather than the behaviors it was designed to produce. For each major metric or reward mechanism, ask: what does a rational person do when evaluated by this? If the answer diverges from what the organization says it wants, the gap is the problem — not the people operating inside it. Founders and executives rarely act irrationally in a vacuum. They act rationally inside incentive systems that have stopped pointing at the right outcomes.",
          "The second is a safe channel for early signal. Structure at least one regular mechanism — a board pre-read, a skip-level conversation, an anonymous ops review — where problems can surface without attaching cost to the person who surfaces them. The goal isn't to find problems. It's to remove the reason people stay quiet when they see them. Fear-driven silence is the most expensive consequence of a misaligned incentive environment, and it compounds every other force the organization is experiencing."
        ]
      },
      "research": {
        "heading": "The research behind this",
        "body": [
          "The academic foundation for what your assessment detected comes primarily from The Tyranny of Metrics by Jerry Muller — the most direct account of how incentive structures and metric fixation distort organizational behavior, and why the behaviors an incentive system produces are often not the behaviors it intended. Goodhart's Law and Campbell's Law — both documented in detail there — are directly applicable to what your scores are showing. The insight that matters most: the harder an organization pushes on a metric, the less reliable that metric becomes as a guide to the underlying reality it was meant to capture."
        ]
      },
      "whatsNext": {
        "heading": "What's next",
        "body": [
          "The full Decision Distortion whitepaper from LFB Holdings walks through how incentive misalignment combines with the other three forces — noise, bias, and accumulation — and how to locate the specific points in your decision process where a single closed gap would have the greatest effect."
        ]
      }
    }
  },
  "signals": {
    "n1": {
      "signalOn": "Before a major decision, we explicitly agree on which data we need — before anyone starts analyzing anything.",
      "body": "Where your assessment is pointing most clearly within noise is on data selection. The question your assessment flagged is whether your organization agrees on what to look at before anyone starts looking. When that agreement is absent, the data selection process itself introduces the first layer of noise — different people are already pulling different information before the evaluation formally begins. By the time the room sits down to discuss, it isn't analyzing the same situation. It's comparing the outputs of several parallel, self-directed research processes that each started from different assumptions about what mattered. The conclusions diverge not because the data is ambiguous but because the data isn't shared. The fix is structural and it has to precede analysis, not follow it."
    },
    "n2": {
      "signalOn": "Before we look at the data, we agree on what good looks like — so the data can't be interpreted to fit a conclusion we've already reached.",
      "body": "Where your assessment is pointing most clearly within noise is on evaluation criteria. The question your assessment flagged is whether your organization establishes what a good outcome looks like before the data arrives. When evaluation criteria are set after the data is visible, they become vulnerable to a quiet form of recruitment: the forming conclusion shapes the standard, not the other way around. A team that hasn't agreed on what counts as a strong renewal rate before looking at renewal data will read the same number differently depending on what they were hoping to find. The disagreement looks like a difference of interpretation. It's actually a difference of standard — and the standard shifted to fit the conclusion already in progress. Agreeing on the evaluation framework before the data lands is a small procedural change with a disproportionate effect on how consistently the organization reads what it sees."
    },
    "n3": {
      "signalOn": "After a major decision is made, people in the room would describe what was decided the same way.",
      "body": "Where your assessment is pointing most clearly within noise is on decision coherence — specifically, what happens in the hours and days after a major call is made. The question your assessment flagged is whether the people who were in the room would describe the decision the same way if asked independently. When they wouldn't, the decision wasn't actually made — a conversation happened, and different people left with different conclusions about what it meant. This matters because execution follows the decision each person thought was made, not the decision that was intended. Misaligned execution driven by post-decision noise is one of the most common sources of organizational friction that never gets correctly attributed. The fix is simple and uncomfortable: at the close of significant decisions, someone reads back the decision as made — including what was considered and rejected — and the room confirms or corrects it before anyone leaves."
    },
    "n4": {
      "signalOn": "Across our organization, two people given identical information would reach the same conclusion — without needing to consult each other first.",
      "body": "Where your assessment is pointing most clearly within noise is on shared judgment. The question your assessment flagged is whether your organization has developed enough alignment on how to evaluate situations that two people working independently would land in roughly the same place. The qualifying clause matters: without needing to consult each other first. Convergence after discussion is social behavior, not shared judgment. What the question is probing is whether your evaluation standards are genuinely internalized across the team or whether agreement is being manufactured through coordination rather than produced by a common analytical framework. In a venture-backed company, this distinction becomes expensive when speed matters — when there's no time to calibrate before a decision has to move. Organizations with high pattern noise can look aligned because they consult constantly. They discover they're not when the consultation breaks down."
    },
    "n5": {
      "signalOn": "When we make a major decision, we document the reasoning behind it — including what we considered and rejected — so we can learn from it later rather than repeat it.",
      "body": "Where your assessment is pointing most clearly within noise is on decision memory. The question your assessment flagged is whether your organization captures not just what was decided but why — including the options that were considered and set aside. When that documentation doesn't exist, two things happen. First, the organization loses the ability to distinguish between a good decision that produced a bad outcome and a bad decision that produced a bad outcome — which means it can't learn correctly from either one. Second, when similar situations arise, the evaluation process starts from scratch, with whatever assumptions and standards happen to be active that day. Decision memory isn't administrative overhead. It's the mechanism that converts individual decisions into organizational learning — and its absence is one of the primary ways noise compounds across time rather than self-correcting."
    },
    "b1": {
      "signalOn": "When evidence pushes back on a direction we favor, we treat it as signal — not as a problem to be explained away.",
      "body": "Where your assessment is pointing most clearly within bias is on how your organization handles contradictory evidence. The question your assessment flagged is whether disconfirming information gets genuine consideration or whether it gets explained away — and the distinction matters because the two look nearly identical from inside the room. A team experiencing confirmation bias doesn't ignore contradictory evidence. It engages with it, reasons about it, and reaches the conclusion that it doesn't change the direction — usually because one of a small set of ready explanations (timing, execution, market conditions) absorbs the signal before it can do its work. The failure isn't ignoring the data. It's that the data never gets a real chance to change the conclusion because the conclusion is already filtering how the data is read. The question to ask before any contradictory signal gets explained away: what would this evidence have to mean for us to take it seriously?"
    },
    "b2": {
      "signalOn": "In our organization, the person who challenges the prevailing view in a meeting is respected for it — not quietly noted for it.",
      "body": "Where your assessment is pointing most clearly within bias is on whether your organization has genuine dissent or merely tolerated dissent. The question your assessment flagged is the difference between a challenger who gains standing and one who loses it — because that difference determines whether bias gets checked or whether it compounds unchallenged. Confirmation bias survives best in rooms where the cost of contradicting the dominant view is nonzero. It doesn't require overt punishment. The quiet noting of who pushed back, the subtle shift in how their contributions are received afterward — these are sufficient to suppress the dissent that would otherwise catch the directional error before it becomes expensive. An organization where challenge is genuinely rewarded is one where the fast system's conclusions get tested before they become commitments. One where it's merely tolerated is one where the testing happens too late, if at all."
    },
    "b3": {
      "signalOn": "Before we use a past success to justify a current decision, we explicitly examine whether the conditions that produced that success still exist.",
      "body": "Where your assessment is pointing most clearly within bias is on past-success transfer — the specific form of overconfidence that arrives wearing the clothes of pattern recognition. The question your assessment flagged is whether your organization checks whether the conditions that produced a previous win still apply before using that win as justification for a current call. This failure is particularly common in founder-led companies and high-performing investor firms because it's indistinguishable from genuine expertise until it isn't. The market that rewarded a particular approach in 2021 is not the same market. The enterprise buying motion that worked at the last company isn't guaranteed to translate. Past success is real information — it's just not sufficient information, and the gap between the two is where overconfidence lives. The explicit examination doesn't have to be long. It has to happen before the past success becomes the argument."
    },
    "b4": {
      "signalOn": "Before major decisions, we deliberately look for risks we wouldn't recognize from experience alone — because the most dangerous risks are the ones our past hasn't prepared us to see.",
      "body": "Where your assessment is pointing most clearly within bias is on unknown unknowns — the risks that experience hasn't equipped the team to recognize. The question your assessment flagged is whether your organization has a deliberate practice of looking for what it can't see through its own accumulated pattern-matching. This is WYSIATI operating at the level of an organization's entire experiential history: the fast system can only construct narratives from what it has already encountered, which means it consistently underweights — or entirely misses — risks that fall outside the team's domain of experience. Regulatory exposure, supply chain fragility, competitive dynamics in adjacent markets, second-order customer behavior — these tend to surface late not because they were hidden but because the team's existing framework wasn't designed to look for them. The intervention is deliberate and structured: before significant commitments, explicitly ask what experienced people outside the company's domain would see that insiders are missing."
    },
    "b5": {
      "signalOn": "In our organization, the sequence in which people share views during a major decision is actively managed to prevent early opinions from dominating the outcome.",
      "body": "Where your assessment is pointing most clearly within bias is on anchoring — specifically, the degree to which the first voice in the room becomes everyone else's reference point. The question your assessment flagged is whether your organization manages conversation sequence deliberately or lets it default to seniority and confidence, which amounts to the same thing. The anchor effect is structural, not personal: it operates regardless of whether the first speaker intends to dominate and regardless of whether subsequent speakers are aware of being influenced. In a room where the senior voice goes first, junior and mid-level assessments will systematically cluster around that initial position — not because of deference alone but because of how the human evaluative system works when it has an existing reference point. The correction is also structural: written independent assessments before verbal discussion begins, and a deliberate inversion of the default speaking order. Neither requires changing the culture. Both require changing the meeting format."
    },
    "a1": {
      "signalOn": "When something isn't working, we seriously consider eliminating it — not just fixing it or adding resources to it.",
      "body": "Where your assessment is pointing most clearly within accumulation is on the first-response reflex — specifically, whether elimination gets genuine consideration when something isn't working, or whether the conversation goes immediately to fixing or resourcing. The question your assessment flagged sits at the beginning of the accumulation chain: the moment when a struggling feature, a failing initiative, or an underperforming team is first identified. In most organizations, that moment triggers an additive response — more resources, a new approach, a revised timeline — because elimination doesn't come to mind with the same accessibility. It's not that people decide against eliminating. It's that eliminating doesn't surface as an option competing for the decision. Accumulation compounds from this point forward, because every struggling thing that gets resourced rather than removed adds weight to the organization's next decision. The intervention is to make elimination an explicit first option — named and evaluated before any resource conversation begins."
    },
    "a2": {
      "signalOn": "In our strategic discussions, subtraction — stopping, exiting, or simplifying — gets the same consideration as addition.",
      "body": "Where your assessment is pointing most clearly within accumulation is on strategic symmetry — whether your organization's planning conversations treat addition and subtraction as genuinely equivalent options. The question your assessment flagged is structural: not whether subtraction ever happens, but whether it enters the room with the same standing as addition. In most strategic planning processes, it doesn't. The agenda organizes around what to build, where to expand, what to invest in. What to stop, exit, or simplify is addressed — if at all — as a secondary conversation, after the additive directions have been established. By that point, the cognitive bandwidth for subtraction has already been spent, and the cultural weight of visible action has already tilted the room. The organizations that do this well treat subtraction as a first-order agenda item, not a closing note — and find that the quality of their additive decisions improves as a result, because the additions that survive a genuine subtraction conversation are the ones that actually deserve the resources."
    },
    "a3": {
      "signalOn": "When performance falls short, we diagnose what's actually wrong before adding people, budget, or features.",
      "body": "Where your assessment is pointing most clearly within accumulation is on resource addition as a diagnostic substitute — the pattern of applying more resources to a problem before understanding what the problem actually is. The question your assessment flagged is one of the most expensive failure modes in venture-backed companies: not that resources are added, but that they're added in lieu of diagnosis. When a growth target is missed, the accessible response is to add a sales rep, expand the marketing budget, accelerate the roadmap. Each of those responses assumes the problem is execution capacity. If the problem is product-market fit, or pricing architecture, or a broken ICP, the resource addition doesn't fix the underlying issue — it funds the continuation of the wrong approach and adds complexity that will have to be unwound later. The diagnosis has to precede the resource conversation, not follow it."
    },
    "a4": {
      "signalOn": "We regularly step back to assess what all of our decisions together have created — because individually defensible choices can combine into a position no single decision would have produced.",
      "body": "Where your assessment is pointing most clearly within accumulation is on aggregate visibility — specifically, the absence of a regular practice of looking at what all current commitments together have created. The question your assessment flagged names the central mechanism of accumulation: no individual decision was wrong; the aggregate was the problem, and it was only visible in retrospect. Most organizations evaluate decisions one at a time, which is how accumulation hides. The product decision looked right. The hire looked right. The new market looked right. The strategic priority looked right. The question that didn't get asked was what all of them together meant for the organization's ability to operate with clarity and speed. Building that aggregate review into the rhythm of the company — not as a crisis response but as a standing practice — is the primary structural protection against accumulation becoming unsteerable before anyone notices it has."
    },
    "a5": {
      "signalOn": "When we've invested significantly in a direction, we evaluate whether to continue based on future potential — not on what we've already spent.",
      "body": "Where your assessment is pointing most clearly within accumulation is on sunk cost — the specific form of accumulation in which prior investment becomes the primary argument for continued investment. The question your assessment flagged is the clearest expression of escalation of commitment: the evaluation of whether to continue is being run against what's already been spent rather than against what the future actually looks like from here. This is loss aversion operating as strategy. Stopping triggers the full psychological weight of the sunk investment as a realized loss. Continuing defers that accounting while preserving the possibility that the original thesis is still right. The mechanism that makes this tractable is the pre-committed trigger: before significant investment begins, define the specific observable condition that would indicate the thesis isn't holding — and bind the team to evaluate it on a fixed date, independent of how much has been spent by then. The question is never what we've invested. The question is always whether the expected value of what's ahead justifies what it will cost to get there."
    },
    "i1": {
      "signalOn": "The metrics we report to outside evaluators and the metrics we actually run the business by are the same list.",
      "body": "Where your assessment is pointing most clearly within incentive misalignment is on the gap between the external story and the internal reality. The question your assessment flagged is whether the metrics that go to the board, to investors, or to external stakeholders are the same ones leadership actually uses to run the company day to day. When they're not — and in many high-growth companies they're not — the divergence creates a predictable set of downstream problems. The external metrics get optimized because that's what carries accountability consequences. The internal reality, which the operational metrics are meant to capture, gets less attention precisely when external pressure is highest. Over time, the organization gets better at performing the external story and worse at reading its own operational signal. The correction isn't to make the external metrics simpler — it's to ask honestly why the two lists diverged and whether the external metrics are still measuring what they were designed to measure."
    },
    "i2": {
      "signalOn": "In our organization, people are rewarded for the quality of their decisions — not just for whether those decisions happened to work out.",
      "body": "Where your assessment is pointing most clearly within incentive misalignment is on outcome bias — rewarding results rather than the quality of the judgment that produced them. The question your assessment flagged is one of the most structurally embedded problems in venture-backed companies: compensation, recognition, and advancement tend to track outcomes, not decision quality. A good decision can produce a bad outcome. A bad decision can produce a good outcome. An organization that can't distinguish between the two trains its people to be lucky rather than rigorous — and it will be unable to identify this problem until the luck runs out. The intervention isn't to stop caring about outcomes. It's to build in a deliberate practice of reviewing the decision process separately from the outcome — asking not just what happened but whether the decision was well-made given what was known at the time it was made."
    },
    "i3": {
      "signalOn": "In our organization, the person who raises a difficult problem early is valued for it — not treated as the person who created the problem by naming it.",
      "body": "Where your assessment is pointing most clearly within incentive misalignment is on fear-driven silence — the dynamic where people stay quiet not because they don't see the problem but because of what happens to the person who names it. The question your assessment flagged describes the most expensive single consequence of a misaligned incentive environment: the suppression of early signal. Problems that are visible and nameable early are cheap to address. The same problems, visible but unspoken, compound until they're undeniable — at which point they're no longer cheap. The mechanism isn't irrational. If raising a hard truth has visibly cost others standing in this organization, staying quiet is the rational response to a rational calculation. The organization doesn't have a candor problem. It has an incentive problem that produces a silence problem. Changing the calculus requires making the cost of silence — operationally, not rhetorically — higher than the cost of speaking."
    },
    "i4": {
      "signalOn": "The metrics we use to evaluate performance measure what actually matters — not what's convenient to track, which over time becomes what people optimize instead.",
      "body": "Where your assessment is pointing most clearly within incentive misalignment is on proxy corruption — the sequence by which a convenient metric gradually replaces the underlying goal it was meant to track. The question your assessment flagged describes Goodhart's Law in operational terms: when a measure becomes a target, it stops being a reliable measure of the reality it was designed to capture, because rational people optimize what they're evaluated on. This isn't a character problem. It's a structural inevitability once a metric carries accountability consequences. The company that measures sales activity starts getting activity. The company that measures NPS starts getting NPS responses. Whether those metrics still connect to revenue health, customer retention, or competitive position is a separate question — one that rarely gets asked while the numbers look acceptable. The audit to run: for each major performance metric, ask what a rational person does to improve their score on that metric, and whether those behaviors are the ones that actually move the underlying outcome the metric was meant to track."
    },
    "i5": {
      "signalOn": "In our organization, what's good for an individual team and what's good for the organization are pointed in the same direction — so teams aren't winning while the company is losing.",
      "body": "Where your assessment is pointing most clearly within incentive misalignment is on cross-functional misalignment — the specific condition where team-level incentives and organizational health point in different directions. The question your assessment flagged describes one of the most recognizable failure patterns in scaling companies: sales hits quota while implementation collapses under the volume. Marketing delivers leads while product can't absorb the feedback. Engineering ships velocity metrics while technical debt accumulates to the point of constraint. Each team is winning by its own measure. The company is losing by the measures that actually matter. The misalignment isn't accidental — it's a predictable output of incentive structures that were designed for functional accountability without sufficient attention to how those functions interact. The correction requires examining compensation design and goal-setting at the organizational level, not the team level, and asking whether the behaviors each team's incentives reward are the behaviors that produce collective health or merely individual team performance."
    }
  }
} as {
  cta: Cta;
  forces: Record<ForceKey, ForceReport>;
  signals: Record<string, Signal>;
};

export const FORCES: Record<ForceKey, ForceReport> = DATA.forces;
export const SIGNALS: Record<string, Signal> = DATA.signals;
export const CTA: Cta = DATA.cta;

/**
 * Normalize whatever `saveLead` puts in `report.force` to a canonical key.
 * Accepts "N"/"noise"/"Noise", "B"/"bias", "A"/"accumulation",
 * "I"/"incentive"/"incentives"/"incentive misalignment" (case-insensitive).
 */
export function normalizeForce(input: string | null | undefined): ForceKey | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  if (s === "n" || s.startsWith("noise")) return "N";
  if (s === "b" || s.startsWith("bias")) return "B";
  if (s === "a" || s.startsWith("accumulat")) return "A";
  if (s === "i" || s.startsWith("incentive")) return "I";
  return null;
}

/** Normalize a question id like "N3", " n3 ", "Noise-N3" -> "n3" (or null). */
export function normalizeQuestion(input: string | null | undefined): string | null {
  if (!input) return null;
  const m = input.trim().toLowerCase().match(/[nbai][1-5]/);
  return m ? m[0] : null;
}

export interface AssembledReport {
  force: ForceReport;
  signal: Signal | null;
}

/**
 * Resolve the `{ force, q }` object from saveLead into a ready-to-render report.
 * Returns null only if the force can't be recognized; a missing/invalid `q`
 * still yields a valid report (the signal callout is simply omitted).
 */
export function getReport(
  force: string | null | undefined,
  q?: string | null,
): AssembledReport | null {
  const key = normalizeForce(force);
  if (!key) return null;
  const qid = normalizeQuestion(q);
  return {
    force: FORCES[key],
    signal: qid ? SIGNALS[qid] ?? null : null,
  };
}
