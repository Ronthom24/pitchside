"""Structured lesson content. Markdown bodies, quizzes, and links to glossary terms / interactive components.
Rules content follows the IFAB Laws of the Game as currently in force; check against the latest IFAB edition each July."""


def Q(question, options, answer, explanation):
    return {"question": question, "options": options, "answer": answer, "explanation": explanation}


LESSONS = [
    # ---------------------------------------------------------------- LEVEL 1: BASICS
    {"id": "what-is-football", "level": 1, "order": 1, "title": "What is football?",
     "summary": "The idea of the game before any rules or tactics.",
     "body_markdown": """Football (called **soccer** in some countries) is a team sport where two sides of eleven players each try to score more goals than the opponent.

A goal is scored when the whole ball crosses the goal line between the posts and under the crossbar. Players can use any part of their body **except their hands and arms**. The exception is the **goalkeeper**, who may use their hands inside their own penalty area.

## Why it is so popular
- The rules are simple enough to play with a ball and two bags for goalposts.
- Goals are rare, so every attack has tension.
- It is played in almost every country, from village pitches to 80,000-seat stadiums.

## The shape of a match
A standard match lasts **90 minutes**, in two halves of 45, plus time added by the referee for stoppages.""",
     "quiz": [Q("Who is allowed to use their hands during open play?", ["Any defender", "Only the goalkeeper, inside their own penalty area", "Any player near the touchline"], 1, "Only the goalkeeper may handle the ball, and only inside their own penalty area.")],
     "related_glossary_ids": ["clean-sheet"]},
    {"id": "the-pitch", "level": 1, "order": 2, "title": "The pitch and its markings",
     "summary": "Every line on the pitch has a purpose.",
     "body_markdown": """A football pitch is a rectangle of grass (or artificial turf) marked with white lines.

- **Touchlines** run along the long sides; **goal lines** run along the short sides.
- The **halfway line** splits the pitch into two halves, with the **centre circle** (9.15 m radius) around the **centre spot** used for kick-offs.
- The **penalty area** (the "18-yard box", 16.5 m) is where the goalkeeper can handle the ball and where defensive fouls give a **penalty**.
- The smaller **goal area** (the "six-yard box", 5.5 m) is used for goal kicks.
- The **penalty spot** is 11 m from the goal line.
- The **goals** are 7.32 m wide and 2.44 m high.

Pitch size is not fixed: in professional football it is typically 100-110 m long and 64-75 m wide for international matches.""",
     "quiz": [Q("How far is the penalty spot from the goal line?", ["6 yards", "12 yards (11 m)", "18 yards"], 1, "The penalty spot is 12 yards (11 metres) from the goal line.")],
     "related_glossary_ids": ["penalty"]},
    {"id": "how-a-match-works", "level": 1, "order": 3, "title": "How a match works",
     "summary": "Kick-off, halves, stoppage time, and substitutions.",
     "body_markdown": """## Starting
The match starts with a **kick-off** from the centre spot. The team that wins a coin toss chooses which end to attack or to take the kick-off. After a goal, the team that conceded kicks off again.

## Time
Two halves of **45 minutes** with a break of up to 15 minutes. The referee adds **stoppage time** (also called added time or injury time) at the end of each half to make up for time lost to injuries, substitutions, goal celebrations and time-wasting.

## Teams and substitutions
Each team fields **eleven players**. A match cannot continue if a team has fewer than seven. Most competitions allow **five substitutions** per team, made in at most three windows (plus half-time).

## Restarts
When the ball leaves the pitch, play restarts with a throw-in, goal kick or corner kick, depending on which team touched it last and where it went out.""",
     "quiz": [Q("Who decides how much stoppage time to add?", ["The team captains", "The referee", "The scoreboard"], 1, "The referee decides, and the fourth official shows the minimum added time on a board.")],
     "related_glossary_ids": ["stoppage-time"]},
    {"id": "winning-drawing-losing", "level": 1, "order": 4, "title": "Winning, drawing and losing",
     "summary": "How results work in leagues versus knockout cups.",
     "body_markdown": """## In a league
Each team plays every other team (usually twice, home and away). A **win earns 3 points, a draw 1, a loss 0**. At the end of the season, the team with the most points wins.

## In a knockout cup
Someone has to go through, so a drawn match goes to **extra time** (two 15-minute periods), and if still level, a **penalty shoot-out**: each team takes five penalties alternately; the higher scorer wins, and if still level it goes to sudden death.

## Two-leg ties and the away-goals rule
Some competitions use two-leg ties decided on aggregate goals. UEFA abolished the away-goals rule in 2021, so level aggregate scores now go straight to extra time.""",
     "quiz": [Q("How many points does a draw earn in a league?", ["0", "1", "2"], 1, "A draw earns one point for each team; a win earns three."),
              Q("What decides a drawn knockout match after extra time?", ["A coin toss", "A penalty shoot-out", "The team with more corners"], 1, "A penalty shoot-out decides it.")],
     "related_glossary_ids": ["penalty", "aggregate"]},
    {"id": "positions-overview", "level": 1, "order": 5, "title": "Positions on the pitch",
     "summary": "Goalkeepers, defenders, midfielders and attackers, explained on an interactive pitch.",
     "body_markdown": """Every team is built from four broad groups:

- **Goalkeeper**: the last line of defence and the only player allowed to use their hands (in the box).
- **Defenders** (centre-backs, full-backs, wing-backs): protect the goal and start attacks from the back.
- **Midfielders** (defensive, central, attacking): link defence and attack and control the rhythm of play.
- **Attackers** (wingers, second strikers, centre-forwards): create and score goals.

Use the interactive pitch to explore each role in detail: where it plays, what it does with and without the ball, and who plays it best.""",
     "interactive_component": "PositionsPitch", "related_glossary_ids": ["box-to-box", "trequartista"]},
    {"id": "ball-and-equipment", "level": 1, "order": 6, "title": "The ball and equipment",
     "summary": "What players wear and what they play with.",
     "body_markdown": """## The ball
A match ball (size 5) has a circumference of 68 to 70 cm and weighs 410 to 450 g at the start of the match.

## What players must wear
- A **shirt** and **shorts**
- **Socks**
- **Shin pads** (compulsory, and must be covered by the socks)
- **Football boots**

Goalkeepers wear a kit that distinguishes them from their teammates, the opposition and the officials. **Jewellery** is not permitted.

## Technology
Modern match balls may contain sensors for **semi-automated offside technology**, used at the 2022 World Cup and in many top leagues, and **goal-line technology** confirms whether the ball fully crossed the line.""",
     "quiz": [Q("Which equipment is compulsory?", ["Gloves", "Shin pads", "Helmets"], 1, "Shin pads are compulsory for all outfield players and goalkeepers.")],
     "related_glossary_ids": ["var"]},
    {"id": "the-officials", "level": 1, "order": 7, "title": "The referee and match officials",
     "summary": "Who is on the pitch and what each person does.",
     "body_markdown": """- **The referee** has full authority on the pitch and applies the Laws of the Game; their decisions on the match are final.
- **Two assistant referees** (linesmen) patrol the touchlines, signalling offside, throw-ins and corners.
- **The fourth official** manages the technical areas, substitutions and added-time board.
- **The VAR team** sits in a video room and can advise the referee on clear errors in four categories: goals, penalties, direct red cards and mistaken identity.

The referee uses **cards** (yellow for a caution, red for a sending-off) and a **whistle** to control the game.""",
     "quiz": [Q("Who can recommend a video review?", ["The video assistant referee (VAR)", "The coach", "The goalkeeper"], 0, "The VAR can recommend a review to the referee; coaches cannot request one in most competitions.")],
     "related_glossary_ids": ["var"]},
    {"id": "a-season-explained", "level": 1, "order": 8, "title": "A football season explained",
     "summary": "Leagues, cups, European football and international breaks.",
     "body_markdown": """Most European clubs play across several competitions in the same season, which runs roughly **August to May**:

1. **A domestic league** (e.g. the Premier League): a long, points-based marathon.
2. **A domestic cup** (e.g. the FA Cup): a knockout tournament open to teams from many levels.
3. **European competition** (Champions League, Europa League or Conference League), for clubs that qualified via league position.

In between, there are **international breaks** when players leave their clubs to play for their countries, and **transfer windows** (summer and January in most leagues) when clubs can buy and sell players.""",
     "quiz": [Q("What is a transfer window?", ["A time when clubs can register new players", "A type of stadium door", "A break between halves"], 0, "It is a fixed period in which clubs may sign players.")],
     "related_glossary_ids": ["transfer-window"]},

    # ---------------------------------------------------------------- LEVEL 2: RULES
    {"id": "offside", "level": 2, "order": 1, "title": "Offside",
     "summary": "The rule that trips up most beginners, with an interactive simulator.",
     "body_markdown": """A player is in an **offside position** if, at the moment the ball is played to them by a teammate, **any part of their head, body or legs** is nearer to the opponents' goal line than **both the ball and the second-last opponent**. The goalkeeper counts as an opponent, which is why it is usually the last outfield defender who sets the line.

## Key points
- Being **level** with the second-last opponent is **not** offside.
- Arms and hands do not count when judging position.
- You cannot be offside in **your own half**.
- You cannot be offside directly from a **goal kick, throw-in or corner kick**.
- Being in an offside position is not an offence in itself. It is only penalised if you become **involved in active play** (receiving the ball, interfering with an opponent, or gaining an advantage).

## Why does it exist?
Without it, attackers could simply wait next to the goal for long passes. The rule forces them to stay in the game.""",
     "interactive_component": "OffsideSimulator",
     "quiz": [Q("A striker is exactly level with the last defender when the ball is played. Is this offside?", ["Yes", "No"], 1, "Being level is not offside; the attacker must be nearer the goal line."),
              Q("Can a player be offside from a throw-in?", ["Yes", "No"], 1, "There is no offside offence directly from a throw-in, goal kick or corner."),
              Q("Does the position of a player's arm count?", ["Yes", "No"], 1, "Arms and hands are not considered when judging offside position.")],
     "related_glossary_ids": ["offside", "var"]},
    {"id": "fouls-and-cards", "level": 2, "order": 2, "title": "Fouls, yellow cards and red cards",
     "summary": "What counts as a foul and how referees escalate punishment.",
     "body_markdown": """A **foul** is an unfair challenge on an opponent that the referee judges to be careless, reckless or using excessive force.

| Level | Consequence |
|---|---|
| Careless | Free kick |
| Reckless | Free kick + **yellow card** (caution) |
| Excessive force | Free kick + **red card** (sending-off) |

## Typical yellow-card offences
Reckless tackles, time-wasting, dissent, unsporting behaviour, and stopping a promising attack.

## Straight red-card offences
Serious foul play, violent conduct, spitting, denying an obvious goal-scoring opportunity by handball or foul, and offensive or abusive language.

A **second yellow card** in the same match is a red card. A sent-off player cannot be replaced, so the team plays with ten.""",
     "quiz": [Q("What happens after a second yellow card in the same match?", ["Nothing", "A red card and the player is sent off", "A penalty"], 1, "Two yellow cards equal a red card.")],
     "related_glossary_ids": ["advantage"]},
    {"id": "handball", "level": 2, "order": 3, "title": "Handball",
     "summary": "When touching the ball with the hand or arm is (and is not) an offence.",
     "body_markdown": """Handball is **not** simply the ball touching a hand. It is an offence when:

- A player **deliberately** touches the ball with their hand or arm.
- A player's hand or arm makes their body **unnaturally bigger** and the ball hits it.
- A player scores with their hand or arm, even **accidentally**.
- A player gains control after the ball touched their hand/arm and then scores or creates a chance.

For handball purposes, the **upper limit of the arm** is the bottom of the armpit. Contact with the ball is judged by whether the arm position is a **natural silhouette** for the movement.

A handball by a defender in their own penalty area leads to a **penalty**.""",
     "quiz": [Q("A player accidentally scores with their hand. Is the goal valid?", ["Yes", "No"], 1, "An accidental handball that results directly in a goal disallows it.")],
     "related_glossary_ids": ["penalty"]},
    {"id": "free-kicks", "level": 2, "order": 4, "title": "Free kicks",
     "summary": "Direct and indirect free kicks and walls.",
     "body_markdown": """After most fouls, the fouled team gets a **free kick**, taken from where the foul happened.

## Direct vs indirect
- A **direct** free kick can be scored from straight away.
- An **indirect** free kick must touch another player before a goal can count (the referee raises an arm to signal it).

## The wall
Defenders can form a **wall** at least **9.15 m (10 yards)** from the ball. For a free kick close to their own goal, defenders may stand on their own goal line between the posts.

## Direct free kick offences
Kicking, tripping, charging, jumping at, pushing, striking, tackling an opponent unfairly, and handball.

## Indirect free kick offences
Dangerous play, obstruction, and some goalkeeper offences like handling a deliberate back-pass from a teammate's foot.""",
     "quiz": [Q("How far must the defending wall be from the ball?", ["5 yards", "10 yards (9.15 m)", "15 yards"], 1, "The wall must be at least 9.15 m away.")],
     "related_glossary_ids": ["free-kick"]},
    {"id": "penalties", "level": 2, "order": 5, "title": "Penalty kicks",
     "summary": "When a penalty is awarded and how it is taken.",
     "body_markdown": """A **penalty kick** is awarded when a defender commits a direct-free-kick offence **inside their own penalty area**.

## How it works
- The ball is placed on the **penalty spot**, 11 m from goal.
- Only the kicker and the goalkeeper are inside the area; everyone else stays outside the area and behind the ball.
- The goalkeeper must have **one foot on or above the goal line** until the ball is kicked.
- The kicker must kick the ball forward and cannot touch it again until another player does.

## Shoot-outs
In knockout matches, five penalties each are taken alternately. If still level, it goes to **sudden death**, repeated until one team scores and the other does not.""",
     "quiz": [Q("Where is a penalty taken from?", ["The edge of the box", "The penalty spot, 12 yards out", "The centre circle"], 1, "From the penalty spot, 11 metres (12 yards) from goal.")],
     "related_glossary_ids": ["penalty"]},
    {"id": "restarts", "level": 2, "order": 6, "title": "Throw-ins, goal kicks and corners",
     "summary": "How play restarts after the ball leaves the pitch.",
     "body_markdown": """| Restart | When | Rules |
|---|---|---|
| **Throw-in** | Ball crosses the touchline | Taken with both hands from behind and over the head, both feet on or behind the line. A goal cannot be scored directly from a throw-in. |
| **Goal kick** | Attackers last touched it over the goal line | Taken from the goal area. The ball is in play as soon as it is kicked and clearly moves. |
| **Corner kick** | Defenders last touched it over their own goal line | Taken from the corner arc. A goal can be scored directly. |

The team that did **not** touch the ball last takes the restart.""",
     "quiz": [Q("Can you score directly from a throw-in?", ["Yes", "No"], 1, "No. A goal cannot be scored directly from a throw-in.")],
     "related_glossary_ids": ["corner"]},
    {"id": "advantage-and-added-time", "level": 2, "order": 7, "title": "Advantage and added time",
     "summary": "Why referees sometimes let play continue after a foul.",
     "body_markdown": """## Advantage
When a team is fouled but still has a good attacking chance, the referee can **play advantage** (signalled by an outstretched arm) and let the game continue instead of stopping it. If the advantage does not develop within a few seconds, the referee can go back and award the original foul.

## Added time
Referees add **time** to the end of each half to compensate for stoppages such as injuries, substitutions, VAR checks and time-wasting. The fourth official shows the **minimum** additional time on an electronic board, and play can continue longer.""",
     "quiz": [Q("What does an outstretched arm from the referee after a foul mean?", ["Play advantage", "Penalty", "Goal"], 0, "It signals that the referee is allowing advantage.")],
     "related_glossary_ids": ["advantage", "stoppage-time"]},
    {"id": "var", "level": 2, "order": 8, "title": "VAR: the video assistant referee",
     "summary": "What VAR can and cannot review.",
     "body_markdown": """The **video assistant referee (VAR)** team watches the match on screens and can advise the on-pitch referee when there has been a **clear and obvious error** or a **serious missed incident** in four categories only:

1. **Goals** (including offside, fouls or handball in the build-up)
2. **Penalty decisions**
3. **Direct red cards** (not second yellows)
4. **Mistaken identity** when the referee punishes the wrong player

The final decision always rests with the on-pitch referee, who can watch the footage at a pitchside monitor. VAR was first used at a World Cup in **2018** and is now standard in most top leagues.""",
     "quiz": [Q("Which is NOT a VAR review category?", ["Penalty decisions", "Corner kicks", "Direct red cards"], 1, "Corner and throw-in decisions are not reviewed unless they lead directly to a goal.")],
     "related_glossary_ids": ["var"]},

    # ---------------------------------------------------------------- LEVEL 3: TACTICS
    {"id": "understanding-formations", "level": 3, "order": 1, "title": "Understanding formations",
     "summary": "How the same eleven players can be arranged differently.",
     "body_markdown": """A **formation** describes how a team's outfield players are grouped: **4-3-3** means four defenders, three midfielders and three forwards (the goalkeeper is not counted).

No formation is "best". Each one shapes **where players can pass**, **who covers which space**, and **how the team presses**. Most modern teams change shape between **attacking** and **defending** phases, for example defending in a 4-4-2 but attacking as a 3-2-5.

Use the formation explorer to compare shapes and see strengths and weaknesses side by side.""",
     "interactive_component": "FormationExplorer",
     "quiz": [Q("What does 4-3-3 describe?", ["4 defenders, 3 midfielders, 3 forwards", "4 forwards, 3 defenders, 3 midfielders", "Four goals in three matches"], 0, "It lists outfield players from defence to attack.")],
     "related_glossary_ids": ["false-nine", "half-space"]},
    {"id": "phases-of-play", "level": 3, "order": 2, "title": "The four phases of play",
     "summary": "Build-up, attack, defence and transitions.",
     "body_markdown": """Coaches break football into four phases:

1. **Build-up**: starting from the goalkeeper, moving the ball past the first line of pressure.
2. **Attack**: creating and finishing chances in the final third.
3. **Defence**: organising to stop the opponent from reaching dangerous areas.
4. **Transitions**: the instant a team **wins** (attacking transition) or **loses** (defensive transition) the ball.

Most goals come from a **good transition**, which is why top teams practise the first five seconds after losing or winning the ball.""",
     "quiz": [Q("What is a transition?", ["The moment possession changes sides", "A substitution", "A type of kick-off"], 0, "It's the instant after a team wins or loses the ball.")],
     "related_glossary_ids": ["transition"]},
    {"id": "pressing-and-blocks", "level": 3, "order": 3, "title": "Pressing and defensive blocks",
     "summary": "High press, mid block and low block compared.",
     "body_markdown": """How high a team defends sets its **block**:

| Block | Where the team defends | Aim |
|---|---|---|
| **High press** | Opponent's half | Win the ball near their goal |
| **Mid block** | Around the halfway line | Stay compact, spring counters |
| **Low block** | Near your own goal | Deny space, stay organised |

**Gegenpressing** (counter-pressing) is a variation: the instant a team loses the ball, they press immediately to win it back.

Pressing works best with **pressing triggers**: signals such as a heavy touch, a backward pass or a pass to a weak-footed player that tell the whole team to press together.""",
     "quiz": [Q("Which block sits deepest?", ["High press", "Mid block", "Low block"], 2, "A low block sits near the team's own goal.")],
     "related_glossary_ids": ["gegenpressing", "low-block", "press"]},
    {"id": "build-up-play", "level": 3, "order": 4, "title": "Build-up play",
     "summary": "How teams move the ball out from the back.",
     "body_markdown": """Building from the back means starting attacks with short passes from the goalkeeper and defenders rather than long balls.

Teams create **passing angles** with shapes such as a **back three** or by dropping a midfielder between the centre-backs (a **"pivot"**). The aim is to **draw the press** and then play through or around it.

Risks: a mistake near your own goal is costly. Rewards: a team that beats the press arrives in the opposition half with defenders out of position.""",
     "quiz": [Q("Why do teams build from the back?", ["To draw the press and create space", "Because long passes are illegal", "To waste time"], 0, "It pulls opponents forward, opening space elsewhere.")],
     "related_glossary_ids": ["ball-progression", "sweeper-keeper"]},
    {"id": "width-and-half-spaces", "level": 3, "order": 5, "title": "Width, overlaps and half-spaces",
     "summary": "Using the whole pitch to stretch defences.",
     "body_markdown": """Dividing the pitch vertically into five lanes shows why attackers move where they do. The **wide lanes** next to the touchline and the two **half-spaces** between wide and central lanes are especially important.

- **Width** stretches the defence horizontally, creating gaps.
- An **overlap** is a run around the outside of a teammate on the ball.
- An **underlap** is a run on the inside of a teammate.
- A player in the **half-space** is hard to mark: stepping out leaves a gap, staying leaves them free.""",
     "quiz": [Q("What is an overlap?", ["A run on the outside of a teammate on the ball", "A foul", "A tackle from behind"], 0, "An overlapping player runs around the outside of the ball carrier.")],
     "related_glossary_ids": ["overlap", "underlap", "half-space"]},
    {"id": "transitions", "level": 3, "order": 6, "title": "Transitions and counter-attacks",
     "summary": "Why the seconds after a turnover decide so many matches.",
     "body_markdown": """When possession changes, both teams are briefly out of shape. A **counter-attack** exploits that chaos by sprinting forward before the opponent can reorganise.

A well-organised team keeps **rest defence**: a few players positioned behind the ball while the team attacks, so that if possession is lost, a counter is quickly stopped.""",
     "quiz": [Q("What is rest defence?", ["Players kept back to deal with counter-attacks", "A tactical formation for resting players", "A defensive substitution"], 0, "It is the defensive shape maintained while attacking.")],
     "related_glossary_ids": ["transition", "rest-defence"]},
    {"id": "set-pieces", "level": 3, "order": 7, "title": "Set pieces",
     "summary": "Corners, free kicks and throw-ins as planned weapons.",
     "body_markdown": """A large share of goals in professional football come from **set pieces**. Teams rehearse routines for corners, free kicks and long throw-ins: decoy runs, blocking defenders and targeting a specific zone.

Defending set pieces uses either **zonal marking** (each defender guards an area), **man-marking**, or a hybrid.""",
     "quiz": [Q("What is zonal marking?", ["Defenders guard areas rather than specific players", "Defenders follow one attacker everywhere", "Marking only the goalkeeper"], 0, "Each defender is responsible for a zone.")],
     "related_glossary_ids": ["corner", "free-kick"]},
    {"id": "modern-roles", "level": 3, "order": 8, "title": "Modern roles: false nine, inverted full-back and more",
     "summary": "Named roles that changed how positions work.",
     "body_markdown": """- **False nine**: a striker who drops into midfield to drag a centre-back out of position.
- **Inverted full-back**: a full-back who moves inside into midfield during build-up.
- **Sweeper keeper**: a goalkeeper who plays high and acts as an extra passer.
- **Deep-lying playmaker**: a midfielder who dictates tempo from deep.
- **Target man**: a striker who holds up the ball and wins aerial duels.
- **Trequartista**: a free-roaming creator behind the strikers.

These roles are descriptions of **behaviour**, not formal positions, and players switch between them during a match.""",
     "quiz": [Q("What does an inverted full-back do?", ["Moves into midfield during build-up", "Plays upside down", "Only defends"], 0, "They tuck inside to help control possession.")],
     "related_glossary_ids": ["false-nine", "inverted-full-back", "sweeper-keeper", "target-man", "trequartista", "deep-lying-playmaker"]},

    # ---------------------------------------------------------------- LEVEL 4: FOOTBALL WORLD
    {"id": "how-leagues-work", "level": 4, "order": 1, "title": "How leagues work",
     "summary": "Tables, points and tie-breakers.",
     "body_markdown": """In a league, every team plays each other **home and away**. Points decide the table: **3 for a win, 1 for a draw**.

If teams are level on points, tie-breakers apply. These vary by competition: in the Premier League it is **goal difference** then goals scored; in La Liga it is **head-to-head results** first.

League systems are organised in **tiers**: for example, England's Premier League sits above the EFL Championship, League One and League Two.""",
     "quiz": [Q("In the Premier League, which tie-breaker comes first when points are level?", ["Goal difference", "Alphabetical order", "Fewest yellow cards"], 0, "Goal difference is first, then goals scored.")],
     "related_glossary_ids": ["goal-difference"]},
    {"id": "promotion-and-relegation", "level": 4, "order": 2, "title": "Promotion and relegation",
     "summary": "How clubs move between divisions.",
     "body_markdown": """Most countries use an **open pyramid**: the best clubs in a lower division are **promoted** to the division above, and the worst clubs in the top division are **relegated**.

This creates stakes at the bottom of the table as well as the top, and gives small clubs the chance, however unlikely, to reach the top flight. Some leagues are **closed** instead: Major League Soccer in the USA uses a franchise model with no relegation, and India's Indian Super League has historically operated without it too.""",
     "quiz": [Q("What happens to the bottom clubs in an open league system?", ["They are relegated to a lower division", "They win a prize", "They are banned"], 0, "They drop down a tier.")],
     "related_glossary_ids": ["relegation"]},
    {"id": "cups-and-knockouts", "level": 4, "order": 3, "title": "Cups and knockout football",
     "summary": "Why cup competitions produce upsets.",
     "body_markdown": """In a **knockout** competition, lose and you are out. Domestic cups such as the **FA Cup** mix teams from all levels, so a tiny non-league club can draw a giant.

Single-match ties give underdogs a real chance, creating **"giant-killings"**, while two-leg ties favour the stronger squad over time.""",
     "quiz": [Q("What is a giant-killing?", ["A small team beating a much bigger team", "A foul", "A transfer"], 0, "It is when a lower-ranked team eliminates a much stronger one.")],
     "related_glossary_ids": ["aggregate"]},
    {"id": "champions-league", "level": 4, "order": 4, "title": "The UEFA Champions League",
     "summary": "Europe's top club tournament and its modern format.",
     "body_markdown": """The **Champions League** brings together the best clubs in Europe, qualified through their domestic league positions (and the previous winners).

Since the **2024-25 season**, the competition has used a **league phase** of 36 teams, each playing eight different opponents, instead of the older group stage. The top eight advance directly to the round of 16; teams ranked 9th to 24th play a knockout play-off round for the remaining places. The final is a single match.

It began in **1955** as the **European Cup**, open only to national champions, and was rebranded in **1992**. Real Madrid have won it a record 15 times as of 2025.""",
     "quiz": [Q("How many teams are in the Champions League league phase since 2024-25?", ["16", "32", "36"], 2, "The league phase has 36 teams.")],
     "related_glossary_ids": ["aggregate"]},
    {"id": "international-football", "level": 4, "order": 5, "title": "International football",
     "summary": "World Cups, continental championships and qualifying.",
     "body_markdown": """National teams compete in **qualifiers** and **final tournaments**. The biggest is the **FIFA World Cup**, held every four years. The 2026 edition in the USA, Canada and Mexico was the first with **48 teams**.

Each continent has its own championship: the UEFA European Championship, Copa América (South America), the Africa Cup of Nations, the AFC Asian Cup and the CONCACAF Gold Cup.

Players must represent a country they are eligible for through birth, parentage or residency, and can usually switch only under strict rules.""",
     "quiz": [Q("How often is the FIFA World Cup held?", ["Every year", "Every two years", "Every four years"], 2, "Every four years.")],
     "related_glossary_ids": []},
    {"id": "transfers-and-contracts", "level": 4, "order": 6, "title": "Transfers, contracts and loans",
     "summary": "How players move between clubs.",
     "body_markdown": """Players are signed to **contracts**. To buy a player under contract, a club pays a **transfer fee** to their current club. A player at the end of their contract is a **free agent** (after the 1995 **Bosman ruling**, out-of-contract EU players can move without a fee).

A **loan** is a temporary move, sometimes with an option to buy. Transfers happen in **transfer windows**, typically summer and January.""",
     "quiz": [Q("What is a free agent?", ["A player whose contract has ended", "A player who pays no tax", "A fan"], 0, "Their contract has expired, so no fee is required.")],
     "related_glossary_ids": ["transfer-window", "free-agent", "loan"]},
    {"id": "club-culture", "level": 4, "order": 7, "title": "Club culture: ultras, derbies and traditions",
     "summary": "The identity side of football.",
     "body_markdown": """Football is about **identity** as much as results. Clubs are tied to cities, communities and histories.

- A **derby** is a match between local rivals, such as the **North London Derby** or **El Clásico**.
- **Ultras** are organised supporter groups that create choreographies, banners and chants; common in Italy, Argentina, Turkey and, increasingly, India.
- **Anthems** and **traditions** (like "You'll Never Walk Alone" at Liverpool) become part of the matchday ritual.""",
     "quiz": [Q("What is a derby?", ["A match between local rivals", "A type of cup", "A kind of formation"], 0, "It's a fixture between teams from the same area.")],
     "related_glossary_ids": ["derby", "ultras"]},
    {"id": "stats-for-beginners", "level": 4, "order": 8, "title": "Statistics for beginners: xG and more",
     "summary": "What the numbers actually mean.",
     "body_markdown": """Beyond goals and assists, analysts use stats to measure how a team plays:

- **Expected goals (xG)** estimates the probability of a shot becoming a goal, using factors like distance and angle. A shot with 0.5 xG is expected to score half the time.
- **Expected assists (xA)** measures the quality of chances a pass creates.
- **Possession** is the share of time a team has the ball, not a guarantee of winning.
- **Clean sheet** is a match without conceding a goal.

Numbers help, but small samples are noisy. One match's xG can differ from the scoreline simply by luck.""",
     "quiz": [Q("What does xG estimate?", ["The probability a shot scores", "The number of fouls", "Team possession"], 0, "xG is the likelihood that a given shot becomes a goal.")],
     "related_glossary_ids": ["xg", "xa", "clean-sheet"]},
]
