import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ========================================
// CONFIG
// ========================================
const SUPABASE_URL = 'https://xhhmxabftbyxrirvvihn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NZHoIxqqpSvVBP8MrLHCYA_gmg1AbN-';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TB_USERS = 'uNMexs7BYTXQ2_song-lyric-guesser_app_users';
const TB_SCORES = 'uNMexs7BYTXQ2_song-lyric-guesser_scores';
const TB_HISTORY = 'uNMexs7BYTXQ2_song-lyric-guesser_game_history';

// ========================================
// DOM REFERENCES (cached once)
// ========================================
const $ = id => document.getElementById(id);

const el = {
  // screens
  loading: $('screen-loading'),
  signup: $('screen-signup'),
  checkemail: $('screen-checkemail'),
  signin: $('screen-signin'),
  app: $('screen-app'),
  // auth
  signupForm: $('signup-form'),
  signupUser: $('signup-username'),
  signupEmail: $('signup-email'),
  signupPass: $('signup-password'),
  signupErr: $('signup-error'),
  signinForm: $('signin-form'),
  signinEmail: $('signin-email'),
  signinPass: $('signin-password'),
  signinErr: $('signin-error'),
  confirmAddr: $('confirm-email-addr'),
  linkSignin: $('link-signin'),
  linkSignup: $('link-signup'),
  btnGoSignin: $('btn-go-signin'),
  // nav
  navUser: $('nav-user'),
  btnLogout: $('btn-logout'),
  // panels
  panelPlay: $('panel-play'),
  panelRank: $('panel-rank'),
  panelStats: $('panel-stats'),
  // views
  viewMenu: $('view-menu'),
  viewGame: $('view-game'),
  viewFeedback: $('view-feedback'),
  viewOver: $('view-over'),
  // menu
  btnStart: $('btn-start'),
  msPlayed: $('ms-played'),
  msPts: $('ms-pts'),
  msStreak: $('ms-streak'),
  // game
  hudRound: $('hud-round'),
  hudScore: $('hud-score'),
  hudStreak: $('hud-streak'),
  timerFill: $('timer-fill'),
  timerSec: $('timer-sec'),
  clueText: $('clue-text'),
  choices: $('choices'),
  // feedback
  fbIcon: $('fb-icon'),
  fbTitle: $('fb-title'),
  fbDetail: $('fb-detail'),
  fbPoints: $('fb-points'),
  btnNext: $('btn-next'),
  // over
  overPts: $('over-pts'),
  overCorrect: $('over-correct'),
  overStreak: $('over-streak'),
  overAvg: $('over-avg'),
  btnAgain: $('btn-again'),
  // rankings
  lbList: $('lb-list'),
  // stats
  stPlayed: $('st-played'),
  stPts: $('st-pts'),
  stAcc: $('st-acc'),
  stStreak: $('st-streak'),
};

// ========================================
// STATE
// ========================================
let currentUser = null;
let username = '';
let round = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let correctCount = 0;
let totalTime = 0;
let timerInterval = null;
let timeLeft = 15;
let answered = false;
let roundQuestions = [];
let currentSort = 'total_points';

const TOTAL_ROUNDS = 10;
const ROUND_TIME = 15;

// ========================================
// SONG DATABASE (50 songs)
// ========================================
const SONGS = [
  { clue: "This 1977 Bee Gees disco anthem was written for the Saturday Night Fever soundtrack and became one of the best-selling singles of all time.", answer: { title: "Stayin' Alive", artist: "Bee Gees" }, wrong: [{ title: "Disco Inferno", artist: "The Trammps" }, { title: "Le Freak", artist: "Chic" }, { title: "I Will Survive", artist: "Gloria Gaynor" }] },
  { clue: "Queen's 1975 rock opera masterpiece features operatic sections, a piano ballad intro, and a hard rock finale. It held the UK number one spot for nine weeks.", answer: { title: "Bohemian Rhapsody", artist: "Queen" }, wrong: [{ title: "Stairway to Heaven", artist: "Led Zeppelin" }, { title: "Hotel California", artist: "Eagles" }, { title: "November Rain", artist: "Guns N' Roses" }] },
  { clue: "Michael Jackson's 1982 hit features a spoken-word horror monologue by Vincent Price and a groundbreaking zombie dance music video directed by John Landis.", answer: { title: "Thriller", artist: "Michael Jackson" }, wrong: [{ title: "Ghostbusters", artist: "Ray Parker Jr." }, { title: "Superstition", artist: "Stevie Wonder" }, { title: "Beat It", artist: "Michael Jackson" }] },
  { clue: "This 2015 Bruno Mars and Mark Ronson collaboration pays tribute to 1980s funk and features a bass line inspired by Zapp & Roger.", answer: { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" }, wrong: [{ title: "Happy", artist: "Pharrell Williams" }, { title: "Get Lucky", artist: "Daft Punk" }, { title: "Treasure", artist: "Bruno Mars" }] },
  { clue: "Nirvana's 1991 grunge anthem from the Nevermind album is credited with bringing alternative rock into the mainstream and ending the hair metal era.", answer: { title: "Smells Like Teen Spirit", artist: "Nirvana" }, wrong: [{ title: "Alive", artist: "Pearl Jam" }, { title: "Black Hole Sun", artist: "Soundgarden" }, { title: "Creep", artist: "Radiohead" }] },
  { clue: "Adele's 2011 breakup ballad won six Grammy Awards and spent years on the charts. The title references her age when the relationship began.", answer: { title: "Rolling in the Deep", artist: "Adele" }, wrong: [{ title: "Someone Like You", artist: "Adele" }, { title: "Stay", artist: "Rihanna" }, { title: "Jar of Hearts", artist: "Christina Perri" }] },
  { clue: "This 1985 charity single was written by Michael Jackson and Lionel Richie and recorded by a supergroup of 46 artists to raise funds for African famine relief.", answer: { title: "We Are the World", artist: "USA for Africa" }, wrong: [{ title: "Do They Know It's Christmas?", artist: "Band Aid" }, { title: "Heal the World", artist: "Michael Jackson" }, { title: "Imagine", artist: "John Lennon" }] },
  { clue: "The Weeknd's 2019 synth-pop hit features an iconic synthesizer riff and a music video set in Las Vegas. It spent a record 57 weeks in the Billboard top 10.", answer: { title: "Blinding Lights", artist: "The Weeknd" }, wrong: [{ title: "Starboy", artist: "The Weeknd" }, { title: "Save Your Tears", artist: "The Weeknd" }, { title: "Levitating", artist: "Dua Lipa" }] },
  { clue: "Whitney Houston's 1992 power ballad from The Bodyguard soundtrack became one of the best-selling singles ever. It was originally written by Dolly Parton in 1973.", answer: { title: "I Will Always Love You", artist: "Whitney Houston" }, wrong: [{ title: "Greatest Love of All", artist: "Whitney Houston" }, { title: "My Heart Will Go On", artist: "Celine Dion" }, { title: "Unchained Melody", artist: "Righteous Brothers" }] },
  { clue: "This 2017 Luis Fonsi and Daddy Yankee reggaeton hit became the first Spanish-language song to reach number one on the Billboard Hot 100 since Macarena.", answer: { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" }, wrong: [{ title: "Bailando", artist: "Enrique Iglesias" }, { title: "Mi Gente", artist: "J Balvin" }, { title: "Hips Don't Lie", artist: "Shakira" }] },
  { clue: "Led Zeppelin's 1971 epic is one of the most requested songs in radio history despite never being released as a single. It builds from acoustic folk to hard rock.", answer: { title: "Stairway to Heaven", artist: "Led Zeppelin" }, wrong: [{ title: "Free Bird", artist: "Lynyrd Skynyrd" }, { title: "Comfortably Numb", artist: "Pink Floyd" }, { title: "Bohemian Rhapsody", artist: "Queen" }] },
  { clue: "This 2003 Outkast hit blends funk, rock, and hip-hop. Its famous lyric prompted Polaroid to issue a statement about their cameras.", answer: { title: "Hey Ya!", artist: "Outkast" }, wrong: [{ title: "Crazy in Love", artist: "Beyonce" }, { title: "Yeah!", artist: "Usher" }, { title: "In Da Club", artist: "50 Cent" }] },
  { clue: "Dolly Parton wrote this 1973 country classic about a beautiful woman she feared would steal her husband. It was famously covered by Whitney Houston for a film.", answer: { title: "Jolene", artist: "Dolly Parton" }, wrong: [{ title: "9 to 5", artist: "Dolly Parton" }, { title: "Stand By Your Man", artist: "Tammy Wynette" }, { title: "Crazy", artist: "Patsy Cline" }] },
  { clue: "Eminem's 2000 track tells the story of an obsessed fan who writes increasingly disturbing letters. The fan's name became slang for overly devoted followers.", answer: { title: "Stan", artist: "Eminem" }, wrong: [{ title: "Lose Yourself", artist: "Eminem" }, { title: "The Real Slim Shady", artist: "Eminem" }, { title: "Changes", artist: "2Pac" }] },
  { clue: "This 1984 Prince song was the lead single from the Purple Rain album. It features a synthesizer-driven arrangement and themes of apocalyptic celebration.", answer: { title: "When Doves Cry", artist: "Prince" }, wrong: [{ title: "Purple Rain", artist: "Prince" }, { title: "Kiss", artist: "Prince" }, { title: "1999", artist: "Prince" }] },
  { clue: "Released in 1994, this TLC hit addresses themes of safe relationships and became the best-selling single by an American girl group at the time.", answer: { title: "Waterfalls", artist: "TLC" }, wrong: [{ title: "No Scrubs", artist: "TLC" }, { title: "Wannabe", artist: "Spice Girls" }, { title: "Bills, Bills, Bills", artist: "Destiny's Child" }] },
  { clue: "Fleetwood Mac's 1977 song from the Rumours album was written by Lindsey Buckingham about his breakup with Stevie Nicks while they continued working together.", answer: { title: "Go Your Own Way", artist: "Fleetwood Mac" }, wrong: [{ title: "Dreams", artist: "Fleetwood Mac" }, { title: "The Chain", artist: "Fleetwood Mac" }, { title: "Don't Stop", artist: "Fleetwood Mac" }] },
  { clue: "This 2012 Gotye song about a failed relationship features Kimbra on vocals and won three Grammy Awards including Record of the Year.", answer: { title: "Somebody That I Used to Know", artist: "Gotye" }, wrong: [{ title: "Royals", artist: "Lorde" }, { title: "Pumped Up Kicks", artist: "Foster the People" }, { title: "Ho Hey", artist: "The Lumineers" }] },
  { clue: "Elvis Presley's 1956 rock and roll classic was considered scandalous for its suggestive dancing, leading TV cameras to only film him from the waist up.", answer: { title: "Hound Dog", artist: "Elvis Presley" }, wrong: [{ title: "Jailhouse Rock", artist: "Elvis Presley" }, { title: "Johnny B. Goode", artist: "Chuck Berry" }, { title: "Tutti Frutti", artist: "Little Richard" }] },
  { clue: "Bob Marley's 1977 reggae anthem about resilience became an international symbol of resistance and freedom across the developing world.", answer: { title: "Jamming", artist: "Bob Marley" }, wrong: [{ title: "One Love", artist: "Bob Marley" }, { title: "No Woman, No Cry", artist: "Bob Marley" }, { title: "Buffalo Soldier", artist: "Bob Marley" }] },
  { clue: "Beyonce's 2008 up-tempo track became an anthem for female independence. Its music video features one of the most iconic choreographies in pop history.", answer: { title: "Single Ladies", artist: "Beyonce" }, wrong: [{ title: "Crazy in Love", artist: "Beyonce" }, { title: "Halo", artist: "Beyonce" }, { title: "Irreplaceable", artist: "Beyonce" }] },
  { clue: "This 1980 John Lennon song was released just weeks before his death. It imagines a world without borders or religion and is considered one of the greatest songs ever.", answer: { title: "Imagine", artist: "John Lennon" }, wrong: [{ title: "Let It Be", artist: "The Beatles" }, { title: "What a Wonderful World", artist: "Louis Armstrong" }, { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" }] },
  { clue: "Daft Punk's 2013 collaboration with Pharrell Williams and Nile Rodgers became the song of the summer with its disco-funk groove and won Record of the Year.", answer: { title: "Get Lucky", artist: "Daft Punk" }, wrong: [{ title: "Around the World", artist: "Daft Punk" }, { title: "Happy", artist: "Pharrell Williams" }, { title: "Uptown Funk", artist: "Bruno Mars" }] },
  { clue: "This 1975 Bruce Springsteen anthem about escaping small-town life became one of rock's greatest songs. The title character waits on the highway.", answer: { title: "Born to Run", artist: "Bruce Springsteen" }, wrong: [{ title: "Thunder Road", artist: "Bruce Springsteen" }, { title: "Dancing in the Dark", artist: "Bruce Springsteen" }, { title: "American Pie", artist: "Don McLean" }] },
  { clue: "Released in 2011, this Gotye and Kimbra duet spent eight weeks at number one in the US and became one of the most viral hits of the early streaming era.", answer: { title: "Somebody That I Used to Know", artist: "Gotye" }, wrong: [{ title: "Call Me Maybe", artist: "Carly Rae Jepsen" }, { title: "We Found Love", artist: "Rihanna" }, { title: "Moves Like Jagger", artist: "Maroon 5" }] },
  { clue: "Taylor Swift's 2014 pop anthem marked her transition from country to pop and became the first song to sell over one million digital copies in a single week.", answer: { title: "Shake It Off", artist: "Taylor Swift" }, wrong: [{ title: "Blank Space", artist: "Taylor Swift" }, { title: "Bad Blood", artist: "Taylor Swift" }, { title: "Roar", artist: "Katy Perry" }] },
  { clue: "A-ha's 1985 synth-pop hit is famous for its groundbreaking pencil-sketch animation music video that blended live action with rotoscoping.", answer: { title: "Take On Me", artist: "A-ha" }, wrong: [{ title: "Everybody Wants to Rule the World", artist: "Tears for Fears" }, { title: "Don't You (Forget About Me)", artist: "Simple Minds" }, { title: "Tainted Love", artist: "Soft Cell" }] },
  { clue: "This 1994 Coolio song samples Stevie Wonder's Pastime Paradise and won the Grammy for Best Rap Solo Performance. It was featured in the movie Dangerous Minds.", answer: { title: "Gangsta's Paradise", artist: "Coolio" }, wrong: [{ title: "California Love", artist: "2Pac" }, { title: "Nuthin' but a 'G' Thang", artist: "Dr. Dre" }, { title: "Jump Around", artist: "House of Pain" }] },
  { clue: "Pharrell's 2013 feel-good anthem was featured in Despicable Me 2 and spent 10 weeks at number one on the Billboard Hot 100.", answer: { title: "Happy", artist: "Pharrell Williams" }, wrong: [{ title: "Get Lucky", artist: "Daft Punk" }, { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" }, { title: "Uptown Funk", artist: "Bruno Mars" }] },
  { clue: "The Eagles' 1977 classic about a mysterious luxury hotel became one of the greatest rock songs ever. Its guitar solo is considered one of the best of all time.", answer: { title: "Hotel California", artist: "Eagles" }, wrong: [{ title: "Stairway to Heaven", artist: "Led Zeppelin" }, { title: "Bohemian Rhapsody", artist: "Queen" }, { title: "Free Bird", artist: "Lynyrd Skynyrd" }] },
  { clue: "Billie Eilish's 2019 James Bond theme was written with her brother Finneas and won the Academy Award for Best Original Song. She was the youngest Bond theme artist.", answer: { title: "No Time to Die", artist: "Billie Eilish" }, wrong: [{ title: "Bad Guy", artist: "Billie Eilish" }, { title: "Skyfall", artist: "Adele" }, { title: "Writing's on the Wall", artist: "Sam Smith" }] },
  { clue: "Drake's 2018 dancehall-influenced track features a viral dance challenge that took over social media and became the first song to debut at number one on the Hot 100.", answer: { title: "In My Feelings", artist: "Drake" }, wrong: [{ title: "God's Plan", artist: "Drake" }, { title: "Hotline Bling", artist: "Drake" }, { title: "One Dance", artist: "Drake" }] },
  { clue: "This 2019 Lil Nas X country-trap crossover broke the record for most weeks at number one on the Billboard Hot 100 and sparked a genre debate.", answer: { title: "Old Town Road", artist: "Lil Nas X" }, wrong: [{ title: "Sunflower", artist: "Post Malone" }, { title: "Bad Guy", artist: "Billie Eilish" }, { title: "Sicko Mode", artist: "Travis Scott" }] },
  { clue: "Ed Sheeran's 2017 romantic ballad was written for his future wife Cherry Seaborn and became the most-streamed song on Spotify at the time.", answer: { title: "Shape of You", artist: "Ed Sheeran" }, wrong: [{ title: "Perfect", artist: "Ed Sheeran" }, { title: "Thinking Out Loud", artist: "Ed Sheeran" }, { title: "Love Yourself", artist: "Justin Bieber" }] },
  { clue: "Rihanna's 2007 hit with its dark electropop production became a defining song of the late 2000s and won the Grammy for Best Dance Recording.", answer: { title: "Umbrella", artist: "Rihanna" }, wrong: [{ title: "Disturbia", artist: "Rihanna" }, { title: "We Found Love", artist: "Rihanna" }, { title: "SOS", artist: "Rihanna" }] },
  { clue: "Marvin Gaye's 1971 politically charged album title track addressed the Vietnam War and social injustice. Motown initially refused to release it.", answer: { title: "What's Going On", artist: "Marvin Gaye" }, wrong: [{ title: "Let's Get It On", artist: "Marvin Gaye" }, { title: "A Change Is Gonna Come", artist: "Sam Cooke" }, { title: "Respect", artist: "Aretha Franklin" }] },
  { clue: "Stevie Wonder's 1972 funk classic features a clavinet riff that is one of the most recognizable in music history. It was inspired by his daughter Aisha.", answer: { title: "Superstition", artist: "Stevie Wonder" }, wrong: [{ title: "Sir Duke", artist: "Stevie Wonder" }, { title: "Isn't She Lovely", artist: "Stevie Wonder" }, { title: "I Wish", artist: "Stevie Wonder" }] },
  { clue: "Aretha Franklin's 1967 version of this Otis Redding song became a feminist anthem and is ranked as one of the greatest songs of all time by Rolling Stone.", answer: { title: "Respect", artist: "Aretha Franklin" }, wrong: [{ title: "Natural Woman", artist: "Aretha Franklin" }, { title: "Think", artist: "Aretha Franklin" }, { title: "I Say a Little Prayer", artist: "Aretha Franklin" }] },
  { clue: "This 2010 Cee Lo Green soul song uses a more explicit title in its original version. It became a viral sensation and earned a Grammy nomination.", answer: { title: "Forget You", artist: "Cee Lo Green" }, wrong: [{ title: "Happy", artist: "Pharrell Williams" }, { title: "Treasure", artist: "Bruno Mars" }, { title: "Valerie", artist: "Mark Ronson ft. Amy Winehouse" }] },
  { clue: "Green Day's 2004 rock opera single criticizes media manipulation and American politics. The album American Idiot later became a hit Broadway musical.", answer: { title: "Boulevard of Broken Dreams", artist: "Green Day" }, wrong: [{ title: "American Idiot", artist: "Green Day" }, { title: "Welcome to the Black Parade", artist: "My Chemical Romance" }, { title: "Mr. Brightside", artist: "The Killers" }] },
  { clue: "The Killers' 2003 debut single has spent more time on the UK charts than any other song in history, re-entering the charts almost every year.", answer: { title: "Mr. Brightside", artist: "The Killers" }, wrong: [{ title: "Somebody Told Me", artist: "The Killers" }, { title: "Boulevard of Broken Dreams", artist: "Green Day" }, { title: "Take Me Out", artist: "Franz Ferdinand" }] },
  { clue: "Amy Winehouse's 2006 song about refusing to enter rehabilitation won the Grammy for Record of the Year. Its raw honesty made it her signature track.", answer: { title: "Rehab", artist: "Amy Winehouse" }, wrong: [{ title: "Back to Black", artist: "Amy Winehouse" }, { title: "Valerie", artist: "Amy Winehouse" }, { title: "You Know I'm No Good", artist: "Amy Winehouse" }] },
  { clue: "Post Malone's 2019 collaboration with Swae Lee was featured in Spider-Man: Into the Spider-Verse and blends hip-hop with dreamy pop production.", answer: { title: "Sunflower", artist: "Post Malone & Swae Lee" }, wrong: [{ title: "Circles", artist: "Post Malone" }, { title: "Rockstar", artist: "Post Malone" }, { title: "Congratulations", artist: "Post Malone" }] },
  { clue: "Kendrick Lamar's 2017 track features a kung fu-inspired music video and won the Pulitzer Prize as part of the DAMN album -- the first non-jazz or classical work to do so.", answer: { title: "HUMBLE.", artist: "Kendrick Lamar" }, wrong: [{ title: "Alright", artist: "Kendrick Lamar" }, { title: "DNA.", artist: "Kendrick Lamar" }, { title: "SICKO MODE", artist: "Travis Scott" }] },
  { clue: "Lady Gaga's 2009 dance-pop anthem features a catchy telephone-inspired hook and was one of the first songs to reach one billion views on YouTube.", answer: { title: "Poker Face", artist: "Lady Gaga" }, wrong: [{ title: "Bad Romance", artist: "Lady Gaga" }, { title: "Just Dance", artist: "Lady Gaga" }, { title: "Born This Way", artist: "Lady Gaga" }] },
  { clue: "The Chainsmokers and Halsey's 2016 indie-pop crossover hit about two young lovers who can't be together topped charts in over 20 countries.", answer: { title: "Closer", artist: "The Chainsmokers ft. Halsey" }, wrong: [{ title: "Something Just Like This", artist: "The Chainsmokers" }, { title: "Don't Let Me Down", artist: "The Chainsmokers" }, { title: "Roses", artist: "The Chainsmokers" }] },
  { clue: "Toto's 1982 soft rock classic about a man longing for a continent won the Record of the Year Grammy and experienced a massive revival via internet memes in the 2010s.", answer: { title: "Africa", artist: "Toto" }, wrong: [{ title: "Rosanna", artist: "Toto" }, { title: "Everybody Wants to Rule the World", artist: "Tears for Fears" }, { title: "Eye of the Tiger", artist: "Survivor" }] },
  { clue: "Cardi B's 2018 debut single made her the first female rapper to top the Hot 100 as a solo artist since Lauryn Hill in 1998. It samples a classic Peter Rodgers funk beat.", answer: { title: "Bodak Yellow", artist: "Cardi B" }, wrong: [{ title: "I Like It", artist: "Cardi B" }, { title: "WAP", artist: "Cardi B" }, { title: "Money", artist: "Cardi B" }] },
  { clue: "Journey's 1981 power ballad has become the most-downloaded song from the 20th century on iTunes and is a staple at sporting events and karaoke bars worldwide.", answer: { title: "Don't Stop Believin'", artist: "Journey" }, wrong: [{ title: "Eye of the Tiger", artist: "Survivor" }, { title: "Livin' on a Prayer", artist: "Bon Jovi" }, { title: "Africa", artist: "Toto" }] },
  { clue: "Dua Lipa's 2020 disco-pop anthem features a roller-skating music video and became one of the longest-running top 10 hits, boosted by a DaBaby remix.", answer: { title: "Levitating", artist: "Dua Lipa" }, wrong: [{ title: "Don't Start Now", artist: "Dua Lipa" }, { title: "Physical", artist: "Dua Lipa" }, { title: "Blinding Lights", artist: "The Weeknd" }] },
];

// ========================================
// HELPERS
// ========================================
function show(elem) { if (elem) elem.classList.remove('hidden'); }
function hide(elem) { if (elem) elem.classList.add('hidden'); }

function showScreen(name) {
  [el.loading, el.signup, el.checkemail, el.signin, el.app].forEach(s => hide(s));
  const target = { loading: el.loading, signup: el.signup, checkemail: el.checkemail, signin: el.signin, app: el.app }[name];
  if (target) show(target);
}

function showView(name) {
  [el.viewMenu, el.viewGame, el.viewFeedback, el.viewOver].forEach(v => hide(v));
  const target = { menu: el.viewMenu, game: el.viewGame, feedback: el.viewFeedback, over: el.viewOver }[name];
  if (target) show(target);
}

function showPanel(name) {
  [el.panelPlay, el.panelRank, el.panelStats].forEach(p => { if (p) p.classList.remove('active'); });
  const target = { play: el.panelPlay, rank: el.panelRank, stats: el.panelStats }[name];
  if (target) target.classList.add('active');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let toastWrap;
function toast(msg, type = 'info') {
  if (!toastWrap) {
    toastWrap = document.createElement('div');
    toastWrap.className = 'toast-wrap';
    document.body.appendChild(toastWrap);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  toastWrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(100%)';
    t.style.transition = 'all .3s';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ========================================
// INIT
// ========================================
try {
  setTimeout(() => {
    hide(el.loading);
    initAuth();
  }, 1800);
} catch (e) {
  console.error('Init error:', e);
}

async function initAuth() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      currentUser = user;
      await ensureAppUser(user);
      enterApp();
    } else {
      showScreen('signup');
    }
  } catch (e) {
    console.error('Auth check:', e);
    showScreen('signup');
  }
}

// ========================================
// AUTH
// ========================================
async function ensureAppUser(user, displayName) {
  try {
    const { data: existing } = await supabase.from(TB_USERS).select('*').eq('user_id', user.id).maybeSingle();
    if (!existing) {
      const name = displayName || user.user_metadata?.display_name || user.email.split('@')[0];
      await supabase.from(TB_USERS).insert({ user_id: user.id, email: user.email, display_name: name });
      username = name;
      // Also ensure score row
      await supabase.from(TB_SCORES).insert({ user_id: user.id, username: name, total_points: 0, games_played: 0, best_streak: 0, total_correct: 0, total_questions: 0 });
    } else {
      username = existing.display_name || user.email.split('@')[0];
    }
  } catch (e) {
    console.error('ensureAppUser:', e);
    username = user.email.split('@')[0];
  }
}

// Sign Up
el.signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = el.signupUser.value.trim();
  const email = el.signupEmail.value.trim();
  const pass = el.signupPass.value;
  hide(el.signupErr);

  try {
    const { data, error } = await supabase.auth.signUp({
      email, password: pass,
      options: {
        emailRedirectTo: 'https://sling-gogiapp.web.app/email-confirmed.html',
        data: { display_name: name }
      }
    });
    if (error) {
      if (error.message.includes('already') || error.message.includes('registered')) {
        const { data: sd, error: se } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (se) { showErr(el.signupErr, 'Incorrect password for existing account.'); return; }
        currentUser = sd.user;
        await ensureAppUser(sd.user, name);
        enterApp();
        return;
      }
      showErr(el.signupErr, error.message);
      return;
    }
    el.confirmAddr.textContent = email;
    username = name;
    showScreen('checkemail');
  } catch (e) {
    showErr(el.signupErr, 'Something went wrong.');
  }
});

// Sign In
el.signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = el.signinEmail.value.trim();
  const pass = el.signinPass.value;
  hide(el.signinErr);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (error.message.includes('not confirmed') || error.message.includes('Email not confirmed')) {
        showErr(el.signinErr, 'Please check your email and click the confirmation link first.');
      } else {
        showErr(el.signinErr, error.message);
      }
      return;
    }
    currentUser = data.user;
    await ensureAppUser(data.user);
    enterApp();
  } catch (e) {
    showErr(el.signinErr, 'Something went wrong.');
  }
});

function showErr(elem, msg) {
  if (elem) { elem.textContent = msg; show(elem); }
}

// Nav links
el.linkSignin.addEventListener('click', (e) => { e.preventDefault(); showScreen('signin'); });
el.linkSignup.addEventListener('click', (e) => { e.preventDefault(); showScreen('signup'); });
el.btnGoSignin.addEventListener('click', () => showScreen('signin'));

// Logout
el.btnLogout.addEventListener('click', async () => {
  try {
    clearTimer();
    await supabase.auth.signOut();
    currentUser = null;
    username = '';
    showScreen('signin');
    toast('Logged out', 'success');
  } catch (e) {
    toast('Logout failed', 'error');
  }
});

// ========================================
// ENTER APP
// ========================================
function enterApp() {
  showScreen('app');
  el.navUser.textContent = username;
  showPanel('play');
  showView('menu');
  loadMyStats();
  loadRankings();
}

// ========================================
// TABS
// ========================================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const t = tab.dataset.t;
    showPanel(t);
    if (t === 'rank') loadRankings();
    if (t === 'stats') loadMyStats();
  });
});

// ========================================
// GAME
// ========================================
el.btnStart.addEventListener('click', startGame);
el.btnAgain.addEventListener('click', startGame);
el.btnNext.addEventListener('click', nextRound);

function startGame() {
  round = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  correctCount = 0;
  totalTime = 0;
  // Pick 10 random songs
  roundQuestions = shuffle(SONGS).slice(0, TOTAL_ROUNDS);
  showView('game');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) {
    endGame();
    return;
  }
  const q = roundQuestions[round];
  round++;
  answered = false;

  // Update HUD
  el.hudRound.textContent = `${round}/${TOTAL_ROUNDS}`;
  el.hudScore.textContent = score;
  el.hudStreak.textContent = streak;

  // Clue
  el.clueText.textContent = q.clue;

  // Shuffle choices
  const options = shuffle([q.answer, ...q.wrong]);
  const letters = ['A', 'B', 'C', 'D'];
  el.choices.innerHTML = options.map((opt, i) => `
    <button class="choice-btn" data-idx="${i}">
      <span class="opt-letter">${letters[i]}</span>
      <span class="opt-text">
        <span class="song-title">${esc(opt.title)}</span>
        <span class="song-artist">${esc(opt.artist)}</span>
      </span>
    </button>
  `).join('');

  // Store correct index
  const correctIdx = options.indexOf(q.answer);

  // Wire up choice buttons
  el.choices.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      clearTimer();
      const picked = parseInt(btn.dataset.idx);
      handleAnswer(picked, correctIdx, options);
    });
  });

  showView('game');
  startTimer();
}

function handleAnswer(picked, correctIdx, options) {
  const isCorrect = picked === correctIdx;
  const timeTaken = ROUND_TIME - timeLeft;
  totalTime += timeTaken;

  // Highlight buttons
  el.choices.querySelectorAll('.choice-btn').forEach(btn => {
    const idx = parseInt(btn.dataset.idx);
    if (idx === correctIdx) btn.classList.add('correct');
    else if (idx === picked && !isCorrect) btn.classList.add('wrong');
    btn.classList.add('disabled');
  });

  let pts = 0;
  if (isCorrect) {
    correctCount++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    // Points: base 100 + time bonus (up to 50) + streak bonus
    const timeBonus = Math.round((timeLeft / ROUND_TIME) * 50);
    const streakBonus = Math.min(streak * 10, 50);
    pts = 100 + timeBonus + streakBonus;
    score += pts;
  } else {
    streak = 0;
  }

  // Show feedback after a brief delay to see colors
  setTimeout(() => {
    if (isCorrect) {
      el.fbIcon.innerHTML = '<i class="fas fa-check-circle" style="color:var(--success)"></i>';
      el.fbTitle.textContent = 'Correct!';
      el.fbDetail.textContent = `${options[correctIdx].title} by ${options[correctIdx].artist}`;
      el.fbPoints.textContent = `+${pts} points`;
    } else {
      el.fbIcon.innerHTML = '<i class="fas fa-times-circle" style="color:var(--danger)"></i>';
      el.fbTitle.textContent = 'Wrong!';
      el.fbDetail.textContent = `It was: ${options[correctIdx].title} by ${options[correctIdx].artist}`;
      el.fbPoints.textContent = '+0 points';
    }
    el.btnNext.textContent = round >= TOTAL_ROUNDS ? 'See Results' : 'Next Round';
    showView('feedback');
  }, 800);
}

function timeUp() {
  if (answered) return;
  answered = true;
  clearTimer();
  totalTime += ROUND_TIME;
  streak = 0;

  // Show correct answer
  const q = roundQuestions[round - 1];
  const btns = el.choices.querySelectorAll('.choice-btn');
  btns.forEach(btn => {
    btn.classList.add('disabled');
    // Find correct by matching title text
    const titleEl = btn.querySelector('.song-title');
    if (titleEl && titleEl.textContent === q.answer.title) {
      btn.classList.add('correct');
    }
  });

  setTimeout(() => {
    el.fbIcon.innerHTML = '<i class="fas fa-hourglass-end" style="color:var(--accent)"></i>';
    el.fbTitle.textContent = "Time's Up!";
    el.fbDetail.textContent = `It was: ${q.answer.title} by ${q.answer.artist}`;
    el.fbPoints.textContent = '+0 points';
    el.btnNext.textContent = round >= TOTAL_ROUNDS ? 'See Results' : 'Next Round';
    showView('feedback');
  }, 800);
}

// ========================================
// TIMER
// ========================================
function startTimer() {
  timeLeft = ROUND_TIME;
  el.timerFill.style.width = '100%';
  el.timerFill.classList.remove('danger');
  el.timerSec.textContent = timeLeft;

  clearTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) timeLeft = 0;
    const pct = (timeLeft / ROUND_TIME) * 100;
    el.timerFill.style.width = pct + '%';
    el.timerSec.textContent = timeLeft;

    if (timeLeft <= 5) el.timerFill.classList.add('danger');

    if (timeLeft <= 0) {
      clearTimer();
      timeUp();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ========================================
// END GAME
// ========================================
async function endGame() {
  clearTimer();
  el.overPts.textContent = score;
  el.overCorrect.textContent = correctCount;
  el.overStreak.textContent = bestStreak;
  el.overAvg.textContent = correctCount > 0 ? (totalTime / correctCount).toFixed(1) : '0';
  showView('over');

  // Save to Supabase
  try {
    if (!currentUser) return;

    // Save game history
    await supabase.from(TB_HISTORY).insert({
      user_id: currentUser.id,
      username: username,
      score: score,
      correct_answers: correctCount,
      total_questions: TOTAL_ROUNDS,
      best_streak: bestStreak
    });

    // Update cumulative scores
    const { data: existing } = await supabase.from(TB_SCORES).select('*').eq('user_id', currentUser.id).maybeSingle();
    if (existing) {
      await supabase.from(TB_SCORES).update({
        total_points: existing.total_points + score,
        games_played: existing.games_played + 1,
        best_streak: Math.max(existing.best_streak, bestStreak),
        total_correct: existing.total_correct + correctCount,
        total_questions: existing.total_questions + TOTAL_ROUNDS,
        username: username
      }).eq('user_id', currentUser.id);
    } else {
      await supabase.from(TB_SCORES).insert({
        user_id: currentUser.id,
        username: username,
        total_points: score,
        games_played: 1,
        best_streak: bestStreak,
        total_correct: correctCount,
        total_questions: TOTAL_ROUNDS
      });
    }

    toast('Score saved!', 'success');
  } catch (e) {
    console.error('Save score error:', e);
  }
}

// ========================================
// RANKINGS
// ========================================
document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.s;
    loadRankings();
  });
});

async function loadRankings() {
  try {
    const { data, error } = await supabase.from(TB_SCORES)
      .select('username, total_points, best_streak, games_played')
      .order(currentSort, { ascending: false })
      .limit(50);

    if (error) throw error;
    if (!data || data.length === 0) {
      el.lbList.innerHTML = '<div class="lb-empty"><p>No rankings yet. Be the first to play!</p></div>';
      return;
    }

    el.lbList.innerHTML = data.map((row, i) => {
      const val = currentSort === 'total_points' ? row.total_points :
                  currentSort === 'best_streak' ? row.best_streak : row.games_played;
      return `
        <div class="lb-row">
          <div class="lb-rank">${i + 1}</div>
          <div class="lb-name">${esc(row.username || 'Anonymous')}</div>
          <div class="lb-val">${val.toLocaleString()}</div>
        </div>`;
    }).join('');
  } catch (e) {
    console.error('Rankings error:', e);
    el.lbList.innerHTML = '<div class="lb-empty"><p>Could not load rankings.</p></div>';
  }
}

// ========================================
// STATS
// ========================================
async function loadMyStats() {
  try {
    if (!currentUser) return;
    const { data } = await supabase.from(TB_SCORES).select('*').eq('user_id', currentUser.id).maybeSingle();
    if (data) {
      el.stPlayed.textContent = data.games_played || 0;
      el.stPts.textContent = (data.total_points || 0).toLocaleString();
      el.stStreak.textContent = data.best_streak || 0;
      const acc = data.total_questions > 0 ? Math.round((data.total_correct / data.total_questions) * 100) : 0;
      el.stAcc.textContent = acc + '%';

      // Also update menu mini-stats
      el.msPlayed.textContent = data.games_played || 0;
      el.msPts.textContent = (data.total_points || 0).toLocaleString();
      el.msStreak.textContent = data.best_streak || 0;
    }
  } catch (e) {
    console.error('Stats error:', e);
  }
}

// ========================================
// UTILS
// ========================================
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
