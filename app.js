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
// SONG DATABASE (50 songs - factual clues)
// ========================================
const SONG_DATABASE = [
  {
    clue: "This 1977 Bee Gees disco anthem was written for the Saturday Night Fever soundtrack and became one of the best-selling singles of all time.",
    answer: { title: "Stayin' Alive", artist: "Bee Gees" },
    wrong: [
      { title: "Disco Inferno", artist: "The Trammps" },
      { title: "Le Freak", artist: "Chic" },
      { title: "I Will Survive", artist: "Gloria Gaynor" }
    ]
  },
  {
    clue: "Queen's 1975 rock opera masterpiece features operatic sections, a piano ballad intro, and a hard rock finale. It held the UK number one spot for nine weeks.",
    answer: { title: "Bohemian Rhapsody", artist: "Queen" },
    wrong: [
      { title: "Stairway to Heaven", artist: "Led Zeppelin" },
      { title: "Hotel California", artist: "Eagles" },
      { title: "November Rain", artist: "Guns N' Roses" }
    ]
  },
  {
    clue: "Michael Jackson's 1982 hit features a spoken-word horror monologue by Vincent Price and a groundbreaking zombie dance music video directed by John Landis.",
    answer: { title: "Thriller", artist: "Michael Jackson" },
    wrong: [
      { title: "Ghostbusters", artist: "Ray Parker Jr." },
      { title: "Superstition", artist: "Stevie Wonder" },
      { title: "Beat It", artist: "Michael Jackson" }
    ]
  },
  {
    clue: "This 2015 Bruno Mars and Mark Ronson collaboration pays tribute to 1980s funk and features a bass line inspired by Zapp & Roger.",
    answer: { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
    wrong: [
      { title: "Happy", artist: "Pharrell Williams" },
      { title: "Get Lucky", artist: "Daft Punk" },
      { title: "Treasure", artist: "Bruno Mars" }
    ]
  },
  {
    clue: "Nirvana's 1991 grunge anthem from the Nevermind album is credited with bringing alternative rock into the mainstream and ending the hair metal era.",
    answer: { title: "Smells Like Teen Spirit", artist: "Nirvana" },
    wrong: [
      { title: "Alive", artist: "Pearl Jam" },
      { title: "Black Hole Sun", artist: "Soundgarden" },
      { title: "Creep", artist: "Radiohead" }
    ]
  },
  {
    clue: "Adele's 2011 breakup ballad won six Grammy Awards and spent years on the charts. The title references her age when the relationship began.",
    answer: { title: "Rolling in the Deep", artist: "Adele" },
    wrong: [
      { title: "Someone Like You", artist: "Adele" },
      { title: "Stay", artist: "Rihanna" },
      { title: "Jar of Hearts", artist: "Christina Perri" }
    ]
  },
  {
    clue: "This 1985 charity single was written by Michael Jackson and Lionel Richie and recorded by a supergroup of 46 artists to raise funds for African famine relief.",
    answer: { title: "We Are the World", artist: "USA for Africa" },
    wrong: [
      { title: "Do They Know It's Christmas?", artist: "Band Aid" },
      { title: "Heal the World", artist: "Michael Jackson" },
      { title: "Imagine", artist: "John Lennon" }
    ]
  },
  {
    clue: "The Weeknd's 2019 synth-pop hit features an iconic synthesizer riff and a music video set in Las Vegas. It spent a record 57 weeks in the Billboard top 10.",
    answer: { title: "Blinding Lights", artist: "The Weeknd" },
    wrong: [
      { title: "Starboy", artist: "The Weeknd" },
      { title: "Save Your Tears", artist: "The Weeknd" },
      { title: "Levitating", artist: "Dua Lipa" }
    ]
  },
  {
    clue: "Whitney Houston's 1992 power ballad from The Bodyguard soundtrack became one of the best-selling singles ever. It was originally written by Dolly Parton in 1973.",
    answer: { title: "I Will Always Love You", artist: "Whitney Houston" },
    wrong: [
      { title: "Greatest Love of All", artist: "Whitney Houston" },
      { title: "My Heart Will Go On", artist: "Celine Dion" },
      { title: "Unchained Melody", artist: "Righteous Brothers" }
    ]
  },
  {
    clue: "This 2017 Luis Fonsi and Daddy Yankee reggaeton hit became the first Spanish-language song to reach number one on the Billboard Hot 100 since Macarena.",
    answer: { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
    wrong: [
      { title: "Bailando", artist: "Enrique Iglesias" },
      { title: "Mi Gente", artist: "J Balvin" },
      { title: "Shakira: Hips Don't Lie", artist: "Shakira" }
    ]
  },
  {
    clue: "Led Zeppelin's 1971 epic is one of the most requested songs in radio history despite never being released as a single. It builds from acoustic folk to hard rock.",
    answer: { title: "Stairway to Heaven", artist: "Led Zeppelin" },
    wrong: [
      { title: "Free Bird", artist: "Lynyrd Skynyrd" },
      { title: "Comfortably Numb", artist: "Pink Floyd" },
      { title: "Bohemian Rhapsody", artist: "Queen" }
    ]
  },
  {
    clue: "This 2003 Outkast hit blends funk, rock, and hip-hop. Its 'shake it like a Polaroid picture' lyric prompted Polaroid to issue a statement about their cameras.",
    answer: { title: "Hey Ya!", artist: "Outkast" },
    wrong: [
      { title: "Crazy in Love", artist: "Beyonce" },
      { title: "Yeah!", artist: "Usher" },
      { title: "In Da Club", artist: "50 Cent" }
    ]
  },
  {
    clue: "Dolly Parton wrote this 1973 country classic about a beautiful woman she feared would steal her husband. It was famously covered by Whitney Houston for a film.",
    answer: { title: "Jolene", artist: "Dolly Parton" },
    wrong: [
      { title: "9 to 5", artist: "Dolly Parton" },
      { title: "Stand By Your Man", artist: "Tammy Wynette" },
      { title: "Crazy", artist: "Patsy Cline" }
    ]
  },
  {
    clue: "Eminem's 2000 track tells the story of an obsessed fan who writes increasingly disturbing letters. The fan's name became slang for overly devoted followers.",
    answer: { title: "Stan", artist: "Eminem" },
    wrong: [
      { title: "Lose Yourself", artist: "Eminem" },
      { title: "The Real Slim Shady", artist: "Eminem" },
      { title: "Changes", artist: "2Pac" }
    ]
  },
  {
    clue: "This 1984 Prince song was the lead single from the Purple Rain album and soundtrack. It features a synthesizer-driven arrangement and themes of apocalyptic celebration.",
    answer: { title: "When Doves Cry", artist: "Prince" },
    wrong: [
      { title: "Purple Rain", artist: "Prince" },
      { title: "Kiss", artist: "Prince" },
      { title: "1999", artist: "Prince" }
    ]
  },
  {
    clue: "Released in 1994, this TLC hit addresses themes of safe relationships and became the best-selling single by an American girl group at the time.",
    answer: { title: "Waterfalls", artist: "TLC" },
    wrong: [
      { title: "No Scrubs", artist: "TLC" },
      { title: "Wannabe", artist: "Spice Girls" },
      { title: "Bills, Bills, Bills", artist: "Destiny's Child" }
    ]
  },
  {
    clue: "Fleetwood Mac's 1977 song from the Rumours album was written by Lindsey Buckingham about his breakup with Stevie Nicks while they continued working together.",
    answer: { title: "Go Your Own Way", artist: "Fleetwood Mac" },
    wrong: [
      { title: "Dreams", artist: "Fleetwood Mac" },
      { title: "The Chain", artist: "Fleetwood Mac" },
      { title: "Don't Stop", artist: "Fleetwood Mac" }
    ]
  },
  {
    clue: "This 2012 Gotye song about a failed relationship features Kimbra on vocals and won three Grammy Awards including Record of the Year.",
    answer: { title: "Somebody That I Used to Know", artist: "Gotye" },
    wrong: [
      { title: "Royals", artist: "Lorde" },
      { title: "Pumped Up Kicks", artist: "Foster the People" },
      { title: "Ho Hey", artist: "The Lumineers" }
    ]
  },
  {
    clue: "Elvis Presley's 1956 rock and roll classic was considered scandalous at the time for its suggestive dancing, leading TV cameras to only film him from the waist up.",
    answer: { title: "Hound Dog", artist: "Elvis Presley" },
    wrong: [
      { title: "Jailhouse Rock", artist: "Elvis Presley" },
      { title: "Johnny B. Goode", artist: "Chuck Berry" },
      { title: "Tutti Frutti", artist: "Little Richard" }
    ]
  },
  {
    clue: "Bob Marley's 1977 reggae anthem about resilience and survival became an international symbol of resistance and freedom across the developing world.",
    answer: { title: "Jamming", artist: "Bob Marley" },
    wrong: [
      { title: "One Love", artist: "Bob Marley" },
      { title: "No Woman, No Cry", artist: "Bob Marley" },
      { title: "Buffalo Soldier", artist: "Bob Marley" }
    ]
  },
  {
    clue: "Beyonce's 2008 up-tempo track became an anthem for female independence. Its music video features one of the most iconic choreographies in pop music history.",
    answer: { title: "Single Ladies (Put a Ring on It)", artist: "Beyonce" },
    wrong: [
      { title: "Crazy in Love", artist: "Beyonce" },
      { title: "Halo", artist: "Beyonce" },
      { title: "Irreplaceable", artist: "Beyonce" }
    ]
  },
  {
    clue: "This 1980 John Lennon song was released just weeks before his death and is considered one of the greatest songs ever written. It imagines a world without borders or religion.",
    answer: { title: "Imagine", artist: "John Lennon" },
    wrong: [
      { title: "Let It Be", artist: "The Beatles" },
      { title: "What a Wonderful World", artist: "Louis Armstrong" },
      { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" }
    ]
  },
  {
    clue: "Daft Punk's 2013 collaboration with Pharrell Williams and Nile Rodgers brought disco-funk back to mainstream pop and won Record of the Year at the Grammys.",
    answer: { title: "Get Lucky", artist: "Daft Punk" },
    wrong: [
      { title: "Blurred Lines", artist: "Robin Thicke" },
      { title: "Happy", artist: "Pharrell Williams" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" }
    ]
  },
  {
    clue: "This 1997 Radiohead track opens their OK Computer album with anxious lyrics about modern life and features Thom Yorke's falsetto over cascading guitar arpeggios.",
    answer: { title: "Paranoid Android", artist: "Radiohead" },
    wrong: [
      { title: "Creep", artist: "Radiohead" },
      { title: "Karma Police", artist: "Radiohead" },
      { title: "No Surprises", artist: "Radiohead" }
    ]
  },
  {
    clue: "Taylor Swift's 2014 pop anthem about ignoring critics became her first number-one single on the Hot 100 and marked her full transition from country to pop music.",
    answer: { title: "Shake It Off", artist: "Taylor Swift" },
    wrong: [
      { title: "Blank Space", artist: "Taylor Swift" },
      { title: "Bad Blood", artist: "Taylor Swift" },
      { title: "22", artist: "Taylor Swift" }
    ]
  },
  {
    clue: "This 1969 Rolling Stones song was inspired by events at a Hells Angels-guarded concert. It is noted for its dark, ominous lyrics and samba-influenced percussion.",
    answer: { title: "Gimme Shelter", artist: "The Rolling Stones" },
    wrong: [
      { title: "Sympathy for the Devil", artist: "The Rolling Stones" },
      { title: "Paint It Black", artist: "The Rolling Stones" },
      { title: "Satisfaction", artist: "The Rolling Stones" }
    ]
  },
  {
    clue: "Billie Eilish recorded this 2019 Grammy-winning song with her brother Finneas in their childhood bedroom. It became the first Bond theme to win an Oscar.",
    answer: { title: "Bad Guy", artist: "Billie Eilish" },
    wrong: [
      { title: "Ocean Eyes", artist: "Billie Eilish" },
      { title: "Lovely", artist: "Billie Eilish" },
      { title: "Bury a Friend", artist: "Billie Eilish" }
    ]
  },
  {
    clue: "This 2004 Green Day rock opera single criticizes media manipulation and became an anthem of political protest during the Iraq War era.",
    answer: { title: "American Idiot", artist: "Green Day" },
    wrong: [
      { title: "Boulevard of Broken Dreams", artist: "Green Day" },
      { title: "Holiday", artist: "Green Day" },
      { title: "Basket Case", artist: "Green Day" }
    ]
  },
  {
    clue: "Drake's 2015 hit blends hip-hop with Caribbean dancehall rhythms and was partly inspired by the TV show Catfish. It topped charts worldwide for months.",
    answer: { title: "Hotline Bling", artist: "Drake" },
    wrong: [
      { title: "One Dance", artist: "Drake" },
      { title: "God's Plan", artist: "Drake" },
      { title: "In My Feelings", artist: "Drake" }
    ]
  },
  {
    clue: "Aretha Franklin's 1967 cover of an Otis Redding song became a feminist and civil rights anthem. She changed the spelling in her iconic version.",
    answer: { title: "Respect", artist: "Aretha Franklin" },
    wrong: [
      { title: "Think", artist: "Aretha Franklin" },
      { title: "Chain of Fools", artist: "Aretha Franklin" },
      { title: "(Sittin' On) The Dock of the Bay", artist: "Otis Redding" }
    ]
  },
  {
    clue: "This 2019 Lil Nas X country-trap crossover was initially removed from Billboard's country chart, sparking a genre debate. A Billy Ray Cyrus remix went viral.",
    answer: { title: "Old Town Road", artist: "Lil Nas X" },
    wrong: [
      { title: "Panini", artist: "Lil Nas X" },
      { title: "Sunflower", artist: "Post Malone" },
      { title: "Mo Bamba", artist: "Sheck Wes" }
    ]
  },
  {
    clue: "David Bowie's 1969 single was released to coincide with the Apollo 11 moon landing and tells the story of an astronaut named Major Tom who becomes lost in space.",
    answer: { title: "Space Oddity", artist: "David Bowie" },
    wrong: [
      { title: "Starman", artist: "David Bowie" },
      { title: "Life on Mars?", artist: "David Bowie" },
      { title: "Rocket Man", artist: "Elton John" }
    ]
  },
  {
    clue: "This 1991 R.E.M. song uses a mandolin riff and was inspired by a dream Michael Stipe had. Its title references losing one's religion as a Southern expression for being upset.",
    answer: { title: "Losing My Religion", artist: "R.E.M." },
    wrong: [
      { title: "Everybody Hurts", artist: "R.E.M." },
      { title: "Man on the Moon", artist: "R.E.M." },
      { title: "Shiny Happy People", artist: "R.E.M." }
    ]
  },
  {
    clue: "Rihanna's 2007 pop anthem with its unforgettable 'ella, ella' hook was produced by Jay-Z and became a worldwide chart-topping hit during a rainy New York session.",
    answer: { title: "Umbrella", artist: "Rihanna" },
    wrong: [
      { title: "We Found Love", artist: "Rihanna" },
      { title: "Diamonds", artist: "Rihanna" },
      { title: "Don't Stop the Music", artist: "Rihanna" }
    ]
  },
  {
    clue: "This 1976 Eagles classic was inspired by the excess of the California music industry. Don Henley described it as a journey from innocence to experience.",
    answer: { title: "Hotel California", artist: "Eagles" },
    wrong: [
      { title: "Take It Easy", artist: "Eagles" },
      { title: "Desperado", artist: "Eagles" },
      { title: "Free Bird", artist: "Lynyrd Skynyrd" }
    ]
  },
  {
    clue: "Kendrick Lamar's 2017 Pulitzer Prize-winning album features this single with a music video set in a DNA testing facility, exploring themes of heritage and identity.",
    answer: { title: "DNA.", artist: "Kendrick Lamar" },
    wrong: [
      { title: "HUMBLE.", artist: "Kendrick Lamar" },
      { title: "Alright", artist: "Kendrick Lamar" },
      { title: "LOYALTY.", artist: "Kendrick Lamar" }
    ]
  },
  {
    clue: "Stevie Wonder's 1972 funk classic features a signature clavinet riff and was inspired by his belief that superstition is irrational but deeply human.",
    answer: { title: "Superstition", artist: "Stevie Wonder" },
    wrong: [
      { title: "Sir Duke", artist: "Stevie Wonder" },
      { title: "Isn't She Lovely", artist: "Stevie Wonder" },
      { title: "Higher Ground", artist: "Stevie Wonder" }
    ]
  },
  {
    clue: "This 2011 Carly Rae Jepsen pop earworm went viral when Justin Bieber tweeted about it. Its simple hook made it one of the catchiest songs of the decade.",
    answer: { title: "Call Me Maybe", artist: "Carly Rae Jepsen" },
    wrong: [
      { title: "Somebody That I Used to Know", artist: "Gotye" },
      { title: "We Are Young", artist: "fun." },
      { title: "Payphone", artist: "Maroon 5" }
    ]
  },
  {
    clue: "AC/DC's 1980 hard rock anthem was the lead single from Back in Black, their first album with new vocalist Brian Johnson after Bon Scott's passing.",
    answer: { title: "Back in Black", artist: "AC/DC" },
    wrong: [
      { title: "Highway to Hell", artist: "AC/DC" },
      { title: "Thunderstruck", artist: "AC/DC" },
      { title: "You Shook Me All Night Long", artist: "AC/DC" }
    ]
  },
  {
    clue: "Lady Gaga's 2009 electro-pop hit references Alfred Hitchcock and features a catchy telephone-inspired hook. Its music video set new standards for pop visual storytelling.",
    answer: { title: "Poker Face", artist: "Lady Gaga" },
    wrong: [
      { title: "Bad Romance", artist: "Lady Gaga" },
      { title: "Just Dance", artist: "Lady Gaga" },
      { title: "Born This Way", artist: "Lady Gaga" }
    ]
  },
  {
    clue: "This 1975 Bruce Springsteen anthem about escape from small-town life became a defining song of working-class American rock and a concert staple for decades.",
    answer: { title: "Born to Run", artist: "Bruce Springsteen" },
    wrong: [
      { title: "Thunder Road", artist: "Bruce Springsteen" },
      { title: "Dancing in the Dark", artist: "Bruce Springsteen" },
      { title: "Glory Days", artist: "Bruce Springsteen" }
    ]
  },
  {
    clue: "SZA's 2017 R&B hit about a complicated on-and-off relationship became a sleeper hit, eventually reaching platinum status and becoming a defining song of modern R&B.",
    answer: { title: "Love Galore", artist: "SZA" },
    wrong: [
      { title: "Good Days", artist: "SZA" },
      { title: "Kiss Me More", artist: "Doja Cat ft. SZA" },
      { title: "The Weekend", artist: "SZA" }
    ]
  },
  {
    clue: "This 1979 The Clash punk anthem questions whether the narrator should remain in a difficult situation. It became a punk rock standard and political rallying cry.",
    answer: { title: "Should I Stay or Should I Go", artist: "The Clash" },
    wrong: [
      { title: "London Calling", artist: "The Clash" },
      { title: "Rock the Casbah", artist: "The Clash" },
      { title: "Anarchy in the U.K.", artist: "Sex Pistols" }
    ]
  },
  {
    clue: "Ed Sheeran's 2017 tropical-pop love song was written on a marimba and became the fastest song to reach one billion Spotify streams at the time.",
    answer: { title: "Shape of You", artist: "Ed Sheeran" },
    wrong: [
      { title: "Thinking Out Loud", artist: "Ed Sheeran" },
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "Photograph", artist: "Ed Sheeran" }
    ]
  },
  {
    clue: "This 1987 U2 rock anthem was inspired by the Troubles in Northern Ireland. Its opening guitar riff is one of the most recognizable in rock history.",
    answer: { title: "Where the Streets Have No Name", artist: "U2" },
    wrong: [
      { title: "With or Without You", artist: "U2" },
      { title: "One", artist: "U2" },
      { title: "Sunday Bloody Sunday", artist: "U2" }
    ]
  },
  {
    clue: "Pharrell Williams' 2013 feel-good anthem was featured in the Despicable Me 2 soundtrack and became a global phenomenon, inspiring dance videos worldwide.",
    answer: { title: "Happy", artist: "Pharrell Williams" },
    wrong: [
      { title: "Get Lucky", artist: "Daft Punk" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" }
    ]
  },
  {
    clue: "This 2003 Beyonce and Jay-Z collaboration marked the beginning of music's most powerful couple. Its horn section and Beyonce's 'uh oh' hook dominated summer radio.",
    answer: { title: "Crazy in Love", artist: "Beyonce ft. Jay-Z" },
    wrong: [
      { title: "Single Ladies", artist: "Beyonce" },
      { title: "Baby Boy", artist: "Beyonce" },
      { title: "Drunk in Love", artist: "Beyonce ft. Jay-Z" }
    ]
  },
  {
    clue: "Amy Winehouse's 2006 jazz-soul single about refusing to enter rehabilitation was darkly prophetic. It won her a Grammy and became her signature song.",
    answer: { title: "Rehab", artist: "Amy Winehouse" },
    wrong: [
      { title: "Back to Black", artist: "Amy Winehouse" },
      { title: "Valerie", artist: "Amy Winehouse" },
      { title: "Love Is a Losing Game", artist: "Amy Winehouse" }
    ]
  },
  {
    clue: "Post Malone's 2018 hit blends hip-hop with rock guitar and introspective themes. It spent months in the top 5 and cemented his genre-blending style.",
    answer: { title: "Rockstar", artist: "Post Malone ft. 21 Savage" },
    wrong: [
      { title: "Circles", artist: "Post Malone" },
      { title: "Sunflower", artist: "Post Malone" },
      { title: "Congratulations", artist: "Post Malone" }
    ]
  },
  {
    clue: "This 1983 Eurythmics synth-pop classic opens with that unforgettable synth riff. Annie Lennox's androgynous look in the video challenged gender norms in pop music.",
    answer: { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics" },
    wrong: [
      { title: "Take On Me", artist: "a-ha" },
      { title: "Tainted Love", artist: "Soft Cell" },
      { title: "Blue Monday", artist: "New Order" }
    ]
  }
];

// ========================================
// STATE
// ========================================
let currentUser = null;
let currentUsername = '';
let currentTab = 'play';
let gameState = null;
let timerInterval = null;
let leaderboardSort = 'total_points';

const DIFFICULTY = {
  normal: { label: 'Normal', time: 15 },
  hard: { label: 'Hard', time: 10 },
  blitz: { label: 'Blitz', time: 5 }
};

const BASE_POINTS = 100;
const STREAK_BONUS = 25;
const TIME_BONUS_MULTIPLIER = 10;
const ROUNDS_PER_GAME = 10;

// ========================================
// INIT
// ========================================
try {
  window.addEventListener('DOMContentLoaded', () => {
    try {
      bindAllEvents();
      setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        if (ls) ls.classList.add('hidden');
        initAuth();
      }, 2000);
    } catch(e) { console.error('DOMContentLoaded error:', e.message, e.stack); }
  });
} catch(e) { console.error('Bootstrap error:', e.message, e.stack); }

// ========================================
// EVENT BINDINGS
// ========================================
function bindAllEvents() {
  try {
    // Auth
    document.getElementById('signup-form').addEventListener('submit', handleSignUp);
    document.getElementById('signin-form').addEventListener('submit', handleSignIn);
    document.getElementById('go-signin').addEventListener('click', (e) => { e.preventDefault(); showAuth('signin'); });
    document.getElementById('go-signup').addEventListener('click', (e) => { e.preventDefault(); showAuth('signup'); });
    document.getElementById('go-signin-from-email').addEventListener('click', () => showAuth('signin'));
    document.getElementById('btn-logout').addEventListener('click', handleLogout);

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Difficulty
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => startGame(btn.dataset.diff));
    });

    // Leaderboard sort
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        leaderboardSort = btn.dataset.sort;
        loadLeaderboard();
      });
    });
  } catch(e) { console.error('Bind events error:', e.message, e.stack); }
}

// ========================================
// AUTH
// ========================================
async function initAuth() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      currentUser = user;
      await ensureAppUser(user);
      showApp();
    } else {
      showAuth('signup');
    }
  } catch(e) {
    console.error('Auth check error:', e);
    showAuth('signup');
  }
}

function showAuth(screen) {
  document.getElementById('auth-container').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('signup-screen').classList.add('hidden');
  document.getElementById('signin-screen').classList.add('hidden');
  document.getElementById('checkemail-screen').classList.add('hidden');
  document.getElementById(screen + '-screen').classList.remove('hidden');
}

async function handleSignUp(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  errEl.classList.add('hidden');

  if (!username || username.length < 2) {
    errEl.textContent = 'Username must be at least 2 characters.';
    errEl.classList.remove('hidden');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: 'https://sling-gogiapp.web.app/email-confirmed.html',
        data: { display_name: username }
      }
    });

    if (error) {
      if (error.message.includes('already') || error.message.includes('registered')) {
        const { data: sid, error: sie } = await supabase.auth.signInWithPassword({ email, password });
        if (sie) {
          errEl.textContent = 'Incorrect password for existing account.';
          errEl.classList.remove('hidden');
          return;
        }
        currentUser = sid.user;
        await ensureAppUser(sid.user, username);
        showApp();
        return;
      }
      errEl.textContent = error.message;
      errEl.classList.remove('hidden');
      return;
    }

    document.getElementById('confirm-email').textContent = email;
    showAuth('checkemail');
  } catch(e) {
    errEl.textContent = 'Something went wrong. Try again.';
    errEl.classList.remove('hidden');
  }
}

async function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  const errEl = document.getElementById('signin-error');
  errEl.classList.add('hidden');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('not confirmed') || error.message.includes('Email not confirmed')) {
        errEl.textContent = 'Please check your email and click the confirmation link first.';
      } else {
        errEl.textContent = error.message;
      }
      errEl.classList.remove('hidden');
      return;
    }
    currentUser = data.user;
    await ensureAppUser(data.user);
    showApp();
  } catch(e) {
    errEl.textContent = 'Something went wrong. Try again.';
    errEl.classList.remove('hidden');
  }
}

async function ensureAppUser(user, username) {
  try {
    const { data: existing } = await supabase.from(TB_USERS).select('*').eq('user_id', user.id).maybeSingle();
    if (!existing) {
      const name = username || user.user_metadata?.display_name || user.email.split('@')[0];
      await supabase.from(TB_USERS).insert({ email: user.email, username: name });
      currentUsername = name;
    } else {
      currentUsername = existing.username || user.email.split('@')[0];
    }
  } catch(e) {
    console.error('ensureAppUser error:', e);
    currentUsername = user.email.split('@')[0];
  }
}

async function handleLogout() {
  try {
    if (timerInterval) clearInterval(timerInterval);
    await supabase.auth.signOut();
    currentUser = null;
    currentUsername = '';
    gameState = null;
    showAuth('signin');
    showToast('Logged out', 'success');
  } catch(e) {
    console.error('Logout error:', e);
    showToast('Logout failed', 'error');
  }
}

// ========================================
// MAIN APP
// ========================================
function showApp() {
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('username-display').textContent = currentUsername;
  switchTab('play');
  loadLeaderboard();
  loadMyStats();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
  if (btn) btn.classList.add('active');
  const panel = document.getElementById('tab-' + tab);
  if (panel) panel.classList.add('active');

  if (tab === 'rankings') loadLeaderboard();
  if (tab === 'stats') loadMyStats();
}

// ========================================
// GAME ENGINE
// ========================================
function startGame(difficulty) {
  const diff = DIFFICULTY[difficulty] || DIFFICULTY.normal;

  // Shuffle and pick 10 songs
  const shuffled = [...SONG_DATABASE].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, ROUNDS_PER_GAME).map(song => {
    const choices = [song.answer, ...song.wrong].sort(() => Math.random() - 0.5);
    return { clue: song.clue, answer: song.answer, choices, timeLimit: diff.time };
  });

  gameState = {
    difficulty: difficulty,
    diffLabel: diff.label,
    questions: questions,
    round: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    totalTimeMs: 0,
    timeLeft: 0,
    answered: false,
    results: []
  };

  // Show game area, hide menu
  document.getElementById('play-menu').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
  document.getElementById('game-over').classList.add('hidden');

  loadRound();
}

function loadRound() {
  if (!gameState || gameState.round >= gameState.questions.length) {
    endGame();
    return;
  }

  const q = gameState.questions[gameState.round];
  gameState.answered = false;
  gameState.timeLeft = q.timeLimit;
  gameState.roundStartTime = Date.now();

  // Update HUD
  document.getElementById('hud-round').textContent = (gameState.round + 1) + '/' + ROUNDS_PER_GAME;
  document.getElementById('hud-score').textContent = gameState.score;
  document.getElementById('hud-streak').textContent = gameState.streak + 'x';
  document.getElementById('hud-diff').textContent = gameState.diffLabel;

  // Set clue
  document.getElementById('clue-text').textContent = q.clue;

  // Timer
  updateTimerDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(timerTick, 100);

  // Choices
  const choicesEl = document.getElementById('choices-grid');
  choicesEl.innerHTML = q.choices.map((c, i) => 
    '<button class="choice-btn" onclick="window._selectChoice(' + i + ')">' +
      '<span class="choice-title">' + escHtml(c.title) + '</span>' +
      '<span class="choice-artist">' + escHtml(c.artist) + '</span>' +
    '</button>'
  ).join('');

  // Hide feedback
  document.getElementById('feedback-bar').classList.add('hidden');
  document.getElementById('feedback-bar').className = 'feedback-bar hidden';
}

function timerTick() {
  if (!gameState || gameState.answered) return;
  gameState.timeLeft -= 0.1;
  if (gameState.timeLeft <= 0) {
    gameState.timeLeft = 0;
    clearInterval(timerInterval);
    handleAnswer(-1); // time out
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const pct = (gameState.timeLeft / gameState.questions[gameState.round].timeLimit) * 100;
  const ring = document.getElementById('timer-ring');
  const text = document.getElementById('timer-text');
  if (ring) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference * (1 - pct / 100);
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;
    // Color
    if (pct > 50) ring.style.stroke = 'var(--cyan)';
    else if (pct > 25) ring.style.stroke = 'var(--gold)';
    else ring.style.stroke = 'var(--pink)';
  }
  if (text) text.textContent = Math.ceil(gameState.timeLeft);
}

window._selectChoice = function(index) {
  if (!gameState || gameState.answered) return;
  handleAnswer(index);
};

function handleAnswer(choiceIndex) {
  gameState.answered = true;
  if (timerInterval) clearInterval(timerInterval);

  const q = gameState.questions[gameState.round];
  const timeTaken = Date.now() - gameState.roundStartTime;
  let isCorrect = false;
  let pointsEarned = 0;

  if (choiceIndex >= 0) {
    const chosen = q.choices[choiceIndex];
    isCorrect = (chosen.title === q.answer.title && chosen.artist === q.answer.artist);
  }

  if (isCorrect) {
    gameState.correct++;
    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) gameState.bestStreak = gameState.streak;
    const timeBonus = Math.round(gameState.timeLeft * TIME_BONUS_MULTIPLIER);
    const streakBonus = (gameState.streak - 1) * STREAK_BONUS;
    pointsEarned = BASE_POINTS + timeBonus + streakBonus;
    gameState.score += pointsEarned;
  } else {
    gameState.streak = 0;
  }

  gameState.totalTimeMs += timeTaken;
  gameState.results.push({
    song: q.answer.title + ' - ' + q.answer.artist,
    correct: isCorrect,
    time: timeTaken,
    points: pointsEarned
  });

  // Update HUD
  document.getElementById('hud-score').textContent = gameState.score;
  document.getElementById('hud-streak').textContent = gameState.streak + 'x';

  // Highlight choices
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    const c = q.choices[i];
    if (c.title === q.answer.title && c.artist === q.answer.artist) {
      btn.classList.add('correct');
    } else if (i === choiceIndex) {
      btn.classList.add('wrong');
    }
  });

  // Feedback bar
  const fb = document.getElementById('feedback-bar');
  fb.classList.remove('hidden', 'correct', 'wrong', 'timeout');
  if (choiceIndex < 0) {
    fb.classList.add('timeout');
    fb.innerHTML = '<i class="fas fa-clock"></i> Time\'s up! It was: ' + escHtml(q.answer.title) + ' - ' + escHtml(q.answer.artist);
  } else if (isCorrect) {
    fb.classList.add('correct');
    fb.innerHTML = '<i class="fas fa-check-circle"></i> Correct! +' + pointsEarned + ' points';
  } else {
    fb.classList.add('wrong');
    fb.innerHTML = '<i class="fas fa-times-circle"></i> Wrong! It was: ' + escHtml(q.answer.title) + ' - ' + escHtml(q.answer.artist);
  }

  // Next round after delay
  setTimeout(() => {
    gameState.round++;
    loadRound();
  }, 2000);
}

// ========================================
// END GAME
// ========================================
async function endGame() {
  if (timerInterval) clearInterval(timerInterval);

  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('game-over').classList.remove('hidden');

  const accuracy = gameState.questions.length > 0 ? Math.round((gameState.correct / gameState.questions.length) * 100) : 0;
  const avgTime = gameState.correct > 0 ? Math.round(gameState.totalTimeMs / gameState.questions.length) : 0;

  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('final-correct').textContent = gameState.correct + '/' + ROUNDS_PER_GAME;
  document.getElementById('final-streak').textContent = gameState.bestStreak;
  document.getElementById('final-accuracy').textContent = accuracy + '%';

  // Results list
  const listEl = document.getElementById('results-list');
  listEl.innerHTML = gameState.results.map((r, i) => 
    '<div class="result-row ' + (r.correct ? 'correct' : 'wrong') + '">' +
      '<span class="result-num">' + (i + 1) + '</span>' +
      '<span class="result-song">' + escHtml(r.song) + '</span>' +
      '<span class="result-points">' + (r.correct ? '+' + r.points : 'X') + '</span>' +
    '</div>'
  ).join('');

  // Play again button
  document.getElementById('btn-play-again').onclick = () => {
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('play-menu').classList.remove('hidden');
  };

  // Save score
  try {
    // Insert game history
    for (const r of gameState.results) {
      const parts = r.song.split(' - ');
      await supabase.from(TB_HISTORY).insert({
        username: currentUsername,
        song_title: parts[0] || '',
        artist: parts[1] || '',
        was_correct: r.correct,
        time_ms: r.time,
        points_earned: r.points
      });
    }

    // Upsert aggregate score
    const { data: existing } = await supabase.from(TB_SCORES)
      .select('*').eq('user_id', currentUser.id).maybeSingle();

    if (existing) {
      const newTotal = (existing.total_points || 0) + gameState.score;
      const newGames = (existing.games_played || 0) + 1;
      const newCorrect = (existing.correct_answers || 0) + gameState.correct;
      const newBestStreak = Math.max(existing.best_streak || 0, gameState.bestStreak);
      const newAvgTime = Math.round(((existing.avg_time_ms || 0) * (existing.games_played || 0) + avgTime) / newGames);

      await supabase.from(TB_SCORES).update({
        total_points: newTotal,
        games_played: newGames,
        correct_answers: newCorrect,
        best_streak: newBestStreak,
        avg_time_ms: newAvgTime
      }).eq('id', existing.id);
    } else {
      await supabase.from(TB_SCORES).insert({
        username: currentUsername,
        total_points: gameState.score,
        games_played: 1,
        correct_answers: gameState.correct,
        best_streak: gameState.bestStreak,
        avg_time_ms: avgTime
      });
    }

    showToast('Score saved!', 'success');
  } catch(e) {
    console.error('Save score error:', e);
    showToast('Could not save score', 'error');
  }
}

// ========================================
// LEADERBOARD
// ========================================
async function loadLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  if (!container) return;
  container.innerHTML = '<div class="loading-text"><i class="fas fa-spinner fa-spin"></i> Loading rankings...</div>';

  try {
    const { data, error } = await supabase.from(TB_SCORES)
      .select('*')
      .order(leaderboardSort, { ascending: false })
      .limit(50);

    if (error) throw error;
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty-text"><i class="fas fa-trophy"></i><p>No scores yet. Be the first!</p></div>';
      return;
    }

    container.innerHTML = data.map((row, i) => {
      const medal = i === 0 ? '<i class="fas fa-crown" style="color:var(--gold)"></i>' :
                    i === 1 ? '<i class="fas fa-medal" style="color:#c0c0c0"></i>' :
                    i === 2 ? '<i class="fas fa-medal" style="color:#cd7f32"></i>' :
                    '<span class="rank-num">' + (i + 1) + '</span>';
      const accuracy = row.games_played > 0 ? Math.round((row.correct_answers / (row.games_played * ROUNDS_PER_GAME)) * 100) : 0;
      return '<div class="lb-row' + (row.user_id === currentUser?.id ? ' me' : '') + '">' +
        '<div class="lb-rank">' + medal + '</div>' +
        '<div class="lb-info">' +
          '<div class="lb-name">' + escHtml(row.username || 'Unknown') + '</div>' +
          '<div class="lb-meta">' + row.games_played + ' games | ' + accuracy + '% accuracy</div>' +
        '</div>' +
        '<div class="lb-score">' + (row.total_points || 0).toLocaleString() + '</div>' +
      '</div>';
    }).join('');
  } catch(e) {
    console.error('Leaderboard error:', e);
    container.innerHTML = '<div class="empty-text"><p>Failed to load rankings</p></div>';
  }
}

// ========================================
// MY STATS
// ========================================
async function loadMyStats() {
  if (!currentUser) return;

  try {
    // Get aggregate stats
    const { data: stats } = await supabase.from(TB_SCORES)
      .select('*').eq('user_id', currentUser.id).maybeSingle();

    const totalPts = stats?.total_points || 0;
    const gamesPlayed = stats?.games_played || 0;
    const correctAns = stats?.correct_answers || 0;
    const bestStreak = stats?.best_streak || 0;
    const totalQ = gamesPlayed * ROUNDS_PER_GAME;
    const accuracy = totalQ > 0 ? Math.round((correctAns / totalQ) * 100) : 0;

    document.getElementById('stat-total-points').textContent = totalPts.toLocaleString();
    document.getElementById('stat-games').textContent = gamesPlayed;
    document.getElementById('stat-accuracy').textContent = accuracy + '%';
    document.getElementById('stat-streak').textContent = bestStreak;

    // Recent history
    const { data: history } = await supabase.from(TB_HISTORY)
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(20);

    const histEl = document.getElementById('history-list');
    if (!history || history.length === 0) {
      histEl.innerHTML = '<div class="empty-text"><p>No game history yet. Play a round!</p></div>';
      return;
    }

    histEl.innerHTML = history.map(h => 
      '<div class="history-row ' + (h.was_correct ? 'correct' : 'wrong') + '">' +
        '<div class="history-icon"><i class="fas fa-' + (h.was_correct ? 'check' : 'times') + '"></i></div>' +
        '<div class="history-info">' +
          '<div class="history-song">' + escHtml(h.song_title || '') + '</div>' +
          '<div class="history-artist">' + escHtml(h.artist || '') + '</div>' +
        '</div>' +
        '<div class="history-points">' + (h.was_correct ? '+' + h.points_earned : '0') + '</div>' +
      '</div>'
    ).join('');
  } catch(e) {
    console.error('Load stats error:', e);
  }
}

// ========================================
// UTILITIES
// ========================================
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

let toastContainer;
function showToast(msg, type) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const t = document.createElement('div');
  t.className = 'toast toast-' + (type || 'info');
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(100%)';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}
