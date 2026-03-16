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
// SAFE DOM HELPER - never returns null
// ========================================
function getEl(id) {
  const e = document.getElementById(id);
  if (!e) console.warn('Element not found: ' + id);
  return e;
}

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
  { clue: "This 2011 Carly Rae Jepsen pop hit went viral after members of the US Olympic swim team lip-synced to it. The chorus asks someone to call.", answer: { title: "Call Me Maybe", artist: "Carly Rae Jepsen" }, wrong: [{ title: "Telephone", artist: "Lady Gaga" }, { title: "Party in the U.S.A.", artist: "Miley Cyrus" }, { title: "Dynamite", artist: "Taio Cruz" }] },
  { clue: "Bob Marley's 1977 reggae anthem about unity and hope became an international symbol of peace. It was performed at the One Love Peace Concert in Jamaica.", answer: { title: "One Love", artist: "Bob Marley" }, wrong: [{ title: "No Woman No Cry", artist: "Bob Marley" }, { title: "Redemption Song", artist: "Bob Marley" }, { title: "Buffalo Soldier", artist: "Bob Marley" }] },
  { clue: "This 2014 Meghan Trainor debut single promotes body positivity and features a retro doo-wop style. It spent eight weeks at number one.", answer: { title: "All About That Bass", artist: "Meghan Trainor" }, wrong: [{ title: "Shake It Off", artist: "Taylor Swift" }, { title: "Happy", artist: "Pharrell Williams" }, { title: "Lips Are Movin", artist: "Meghan Trainor" }] },
  { clue: "Stevie Wonder's 1972 funk classic was the first of his self-produced albums to reach number one. The title track is about irrational belief.", answer: { title: "Superstition", artist: "Stevie Wonder" }, wrong: [{ title: "Sir Duke", artist: "Stevie Wonder" }, { title: "I Wish", artist: "Stevie Wonder" }, { title: "Signed, Sealed, Delivered", artist: "Stevie Wonder" }] },
  { clue: "This 1991 Bryan Adams power ballad from the Robin Hood: Prince of Thieves soundtrack spent a then-record 16 consecutive weeks at number one in the US.", answer: { title: "(Everything I Do) I Do It for You", artist: "Bryan Adams" }, wrong: [{ title: "I Will Always Love You", artist: "Whitney Houston" }, { title: "My Heart Will Go On", artist: "Celine Dion" }, { title: "Power of Love", artist: "Huey Lewis" }] },
  { clue: "Radiohead's 1992 debut single about feeling out of place became an alt-rock anthem despite the band later expressing frustration about its popularity overshadowing their other work.", answer: { title: "Creep", artist: "Radiohead" }, wrong: [{ title: "Paranoid Android", artist: "Radiohead" }, { title: "Karma Police", artist: "Radiohead" }, { title: "Loser", artist: "Beck" }] },
  { clue: "This 2004 Green Day rock opera single criticized American media culture. The album of the same name won the Grammy for Best Rock Album.", answer: { title: "American Idiot", artist: "Green Day" }, wrong: [{ title: "Boulevard of Broken Dreams", artist: "Green Day" }, { title: "Basket Case", artist: "Green Day" }, { title: "Welcome to the Black Parade", artist: "My Chemical Romance" }] },
  { clue: "Daft Punk's 2013 collaboration with Pharrell and Nile Rodgers blends French house with disco and funk. It won Record of the Year and Album of the Year at the Grammys.", answer: { title: "Get Lucky", artist: "Daft Punk" }, wrong: [{ title: "Uptown Funk", artist: "Mark Ronson" }, { title: "Blurred Lines", artist: "Robin Thicke" }, { title: "Around the World", artist: "Daft Punk" }] },
  { clue: "This 1980 John Lennon ballad about his son Sean was released just weeks before his assassination. It became his best-selling solo single.", answer: { title: "(Just Like) Starting Over", artist: "John Lennon" }, wrong: [{ title: "Imagine", artist: "John Lennon" }, { title: "Woman", artist: "John Lennon" }, { title: "Let It Be", artist: "The Beatles" }] },
  { clue: "Beyonce's 2008 empowerment anthem features a famous choreographed dance and the instruction to put a ring on it. It won Song of the Year at the Grammys.", answer: { title: "Single Ladies (Put a Ring on It)", artist: "Beyonce" }, wrong: [{ title: "Crazy in Love", artist: "Beyonce" }, { title: "Halo", artist: "Beyonce" }, { title: "Irreplaceable", artist: "Beyonce" }] },
  { clue: "This 1975 Bruce Springsteen anthem about escaping small-town life features a saxophone solo by Clarence Clemons and became his signature concert closer.", answer: { title: "Born to Run", artist: "Bruce Springsteen" }, wrong: [{ title: "Thunder Road", artist: "Bruce Springsteen" }, { title: "Dancing in the Dark", artist: "Bruce Springsteen" }, { title: "Born in the U.S.A.", artist: "Bruce Springsteen" }] },
  { clue: "Billie Eilish recorded this whispery 2019 hit in her brother's bedroom. It became the first James Bond theme to win an Academy Award and topped charts worldwide.", answer: { title: "Bad Guy", artist: "Billie Eilish" }, wrong: [{ title: "Ocean Eyes", artist: "Billie Eilish" }, { title: "Lovely", artist: "Billie Eilish" }, { title: "drivers license", artist: "Olivia Rodrigo" }] },
  { clue: "This 1969 Rolling Stones song was inspired by a Hells Angels-related incident. Its opening guitar riff is one of the most recognizable in rock history.", answer: { title: "Gimme Shelter", artist: "The Rolling Stones" }, wrong: [{ title: "Paint It Black", artist: "The Rolling Stones" }, { title: "Sympathy for the Devil", artist: "The Rolling Stones" }, { title: "Satisfaction", artist: "The Rolling Stones" }] },
  { clue: "Taylor Swift's 2014 pop crossover anthem about ignoring critics became one of the best-selling singles ever. Its music video features celebrity cameos dancing.", answer: { title: "Shake It Off", artist: "Taylor Swift" }, wrong: [{ title: "Blank Space", artist: "Taylor Swift" }, { title: "Bad Blood", artist: "Taylor Swift" }, { title: "22", artist: "Taylor Swift" }] },
  { clue: "This 1972 Eagles classic, later rerecorded in 1977, is one of the best-selling singles in US history. Its lyrics describe a mysterious desert hotel you can never leave.", answer: { title: "Hotel California", artist: "Eagles" }, wrong: [{ title: "Desperado", artist: "Eagles" }, { title: "Take It Easy", artist: "Eagles" }, { title: "Stairway to Heaven", artist: "Led Zeppelin" }] },
  { clue: "Sia's 2014 hit features a music video with dancer Maddie Ziegler in a blonde wig. The powerful vocal performance was recorded in just one take.", answer: { title: "Chandelier", artist: "Sia" }, wrong: [{ title: "Elastic Heart", artist: "Sia" }, { title: "Cheap Thrills", artist: "Sia" }, { title: "Titanium", artist: "David Guetta ft. Sia" }] },
  { clue: "This 1986 Peter Gabriel art-pop hit features stop-motion music video animation that was groundbreaking for its time. It won nine MTV Video Music Awards.", answer: { title: "Sledgehammer", artist: "Peter Gabriel" }, wrong: [{ title: "In Your Eyes", artist: "Peter Gabriel" }, { title: "Take My Breath Away", artist: "Berlin" }, { title: "Everybody Wants to Rule the World", artist: "Tears for Fears" }] },
  { clue: "Kendrick Lamar's 2017 anthem was featured in the Black Panther soundtrack. Its chorus about DNA and loyalty became a cultural touchstone.", answer: { title: "HUMBLE.", artist: "Kendrick Lamar" }, wrong: [{ title: "Alright", artist: "Kendrick Lamar" }, { title: "DNA.", artist: "Kendrick Lamar" }, { title: "All The Stars", artist: "Kendrick Lamar & SZA" }] },
  { clue: "This 1979 Blondie hit was one of the first songs to incorporate rap into mainstream pop music. It was partially inspired by Fab Five Freddy and the NYC hip-hop scene.", answer: { title: "Rapture", artist: "Blondie" }, wrong: [{ title: "Heart of Glass", artist: "Blondie" }, { title: "Call Me", artist: "Blondie" }, { title: "The Message", artist: "Grandmaster Flash" }] },
  { clue: "Ed Sheeran's 2017 romantic pop hit became one of the best-selling digital singles ever. It was written for his future wife Cherry Seaborn.", answer: { title: "Shape of You", artist: "Ed Sheeran" }, wrong: [{ title: "Thinking Out Loud", artist: "Ed Sheeran" }, { title: "Perfect", artist: "Ed Sheeran" }, { title: "Photograph", artist: "Ed Sheeran" }] },
  { clue: "This 2010 Cee Lo Green soul track became a viral sensation due to its explicit original title. The clean version was renamed Forget You.", answer: { title: "Forget You", artist: "Cee Lo Green" }, wrong: [{ title: "Happy", artist: "Pharrell Williams" }, { title: "Grenade", artist: "Bruno Mars" }, { title: "Pumped Up Kicks", artist: "Foster the People" }] },
  { clue: "Amy Winehouse's 2006 soul hit about refusing to enter rehabilitation won her a Grammy. Tragically, the song's subject matter foreshadowed her real-life struggles.", answer: { title: "Rehab", artist: "Amy Winehouse" }, wrong: [{ title: "Back to Black", artist: "Amy Winehouse" }, { title: "Valerie", artist: "Amy Winehouse" }, { title: "Respect", artist: "Aretha Franklin" }] },
  { clue: "This 1982 Toto rock ballad was inspired by the band's impressions of Africa from TV documentaries. Its distinctive keyboard riff has made it a beloved internet meme.", answer: { title: "Africa", artist: "Toto" }, wrong: [{ title: "Rosanna", artist: "Toto" }, { title: "Don't Stop Believin'", artist: "Journey" }, { title: "Take On Me", artist: "a-ha" }] },
  { clue: "Post Malone's 2018 melancholy hip-hop hit samples Fleetwood Mac's Dreams riff and features Swae Lee. It spent three weeks at number one.", answer: { title: "Sunflower", artist: "Post Malone & Swae Lee" }, wrong: [{ title: "Circles", artist: "Post Malone" }, { title: "Rockstar", artist: "Post Malone" }, { title: "Congratulations", artist: "Post Malone" }] },
  { clue: "This 1997 Chumbawamba one-hit wonder about resilience and drinking became an anthem at sports events worldwide. The chorus is about getting knocked down.", answer: { title: "Tubthumping", artist: "Chumbawamba" }, wrong: [{ title: "MMMBop", artist: "Hanson" }, { title: "Closing Time", artist: "Semisonic" }, { title: "Semi-Charmed Life", artist: "Third Eye Blind" }] },
  { clue: "Lil Nas X's 2019 country-rap hybrid broke records for the longest run at number one on the Billboard Hot 100 at 19 weeks, despite initial genre controversy.", answer: { title: "Old Town Road", artist: "Lil Nas X" }, wrong: [{ title: "Panini", artist: "Lil Nas X" }, { title: "Mo Bamba", artist: "Sheck Wes" }, { title: "Sicko Mode", artist: "Travis Scott" }] },
  { clue: "This 1967 Aretha Franklin cover of an Otis Redding song became a feminist anthem. She changed the arrangement and added the iconic R-E-S-P-E-C-T spelling.", answer: { title: "Respect", artist: "Aretha Franklin" }, wrong: [{ title: "Natural Woman", artist: "Aretha Franklin" }, { title: "Think", artist: "Aretha Franklin" }, { title: "Chain of Fools", artist: "Aretha Franklin" }] },
  { clue: "Drake's 2015 dancehall-influenced hit features the phrase 'You used to call me on my cell phone.' It spent a then-record three non-consecutive runs at number one.", answer: { title: "Hotline Bling", artist: "Drake" }, wrong: [{ title: "One Dance", artist: "Drake" }, { title: "God's Plan", artist: "Drake" }, { title: "In My Feelings", artist: "Drake" }] },
  { clue: "This 1987 U2 anthem was inspired by Martin Luther King Jr. and the ongoing conflicts in Northern Ireland. It won Grammy Awards for Song and Record of the Year.", answer: { title: "Where the Streets Have No Name", artist: "U2" }, wrong: [{ title: "With or Without You", artist: "U2" }, { title: "One", artist: "U2" }, { title: "Beautiful Day", artist: "U2" }] },
  { clue: "Rihanna's 2007 pop hit features a catchy repeated title that mimics the sound of a rain shower. It reached number one in 13 countries.", answer: { title: "Umbrella", artist: "Rihanna" }, wrong: [{ title: "We Found Love", artist: "Rihanna" }, { title: "Diamonds", artist: "Rihanna" }, { title: "Only Girl", artist: "Rihanna" }] },
  { clue: "This 1983 David Bowie hit was co-produced with Nile Rodgers and became his biggest-selling single. It features a distinctive funk guitar riff and dance-pop style.", answer: { title: "Let's Dance", artist: "David Bowie" }, wrong: [{ title: "Heroes", artist: "David Bowie" }, { title: "Space Oddity", artist: "David Bowie" }, { title: "Under Pressure", artist: "Queen & David Bowie" }] },
];

// ========================================
// UTILITY
// ========================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const target = getEl(id);
  if (target) target.classList.remove('hidden');
}

function showView(viewId) {
  const views = ['view-menu', 'view-game', 'view-feedback', 'view-over'];
  views.forEach(v => {
    const ve = getEl(v);
    if (ve) ve.classList.add('hidden');
  });
  const target = getEl(viewId);
  if (target) target.classList.remove('hidden');
}

function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const panel = getEl('panel-' + panelId);
  if (panel) panel.classList.add('active');
  const tab = document.querySelector('.tab[data-t="' + panelId + '"]');
  if (tab) tab.classList.add('active');
}

// ========================================
// INIT - waits for DOM
// ========================================
try {
  setTimeout(function() {
    var ls = getEl('screen-loading');
    if (ls) ls.classList.add('hidden');
    initAuth();
  }, 1800);
} catch(e) { console.error('Init error:', e); }

async function initAuth() {
  try {
    var result = await supabase.auth.getUser();
    var user = result.data && result.data.user;
    if (user) {
      currentUser = user;
      await ensureAppUser(user);
      showApp();
    } else {
      showScreen('screen-signup');
    }
  } catch(e) {
    console.error('Auth check error:', e);
    showScreen('screen-signup');
  }
}

// ========================================
// AUTH
// ========================================
function showAuthScreen(name) {
  showScreen('screen-' + name);
}

document.addEventListener('DOMContentLoaded', function() {
  // Sign Up
  var signupForm = getEl('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var nameVal = getEl('signup-username').value.trim();
      var emailVal = getEl('signup-email').value.trim();
      var passVal = getEl('signup-password').value;
      var errEl = getEl('signup-error');
      if (errEl) errEl.classList.add('hidden');

      try {
        var res = await supabase.auth.signUp({
          email: emailVal,
          password: passVal,
          options: {
            emailRedirectTo: 'https://sling-gogiapp.web.app/email-confirmed.html',
            data: { display_name: nameVal }
          }
        });

        if (res.error) {
          if (res.error.message.indexOf('already') !== -1 || res.error.message.indexOf('registered') !== -1) {
            var signInRes = await supabase.auth.signInWithPassword({ email: emailVal, password: passVal });
            if (signInRes.error) {
              if (errEl) { errEl.textContent = 'Incorrect password for existing account.'; errEl.classList.remove('hidden'); }
              return;
            }
            currentUser = signInRes.data.user;
            username = nameVal;
            await ensureAppUser(signInRes.data.user, nameVal);
            showApp();
            return;
          }
          if (errEl) { errEl.textContent = res.error.message; errEl.classList.remove('hidden'); }
          return;
        }

        username = nameVal;
        var confirmEl = getEl('confirm-email-addr');
        if (confirmEl) confirmEl.textContent = emailVal;
        showAuthScreen('checkemail');
      } catch(err) {
        if (errEl) { errEl.textContent = 'Something went wrong. Try again.'; errEl.classList.remove('hidden'); }
      }
    });
  }

  // Sign In
  var signinForm = getEl('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var emailVal = getEl('signin-email').value.trim();
      var passVal = getEl('signin-password').value;
      var errEl = getEl('signin-error');
      if (errEl) errEl.classList.add('hidden');

      try {
        var res = await supabase.auth.signInWithPassword({ email: emailVal, password: passVal });
        if (res.error) {
          if (res.error.message.indexOf('not confirmed') !== -1 || res.error.message.indexOf('Email not confirmed') !== -1) {
            if (errEl) { errEl.textContent = 'Please check your email and click the confirmation link first.'; errEl.classList.remove('hidden'); }
          } else {
            if (errEl) { errEl.textContent = res.error.message; errEl.classList.remove('hidden'); }
          }
          return;
        }
        currentUser = res.data.user;
        await ensureAppUser(res.data.user);
        showApp();
      } catch(err) {
        if (errEl) { errEl.textContent = 'Something went wrong. Try again.'; errEl.classList.remove('hidden'); }
      }
    });
  }

  // Auth navigation links
  var linkSignin = getEl('link-signin');
  if (linkSignin) linkSignin.addEventListener('click', function(e) { e.preventDefault(); showAuthScreen('signin'); });

  var linkSignup = getEl('link-signup');
  if (linkSignup) linkSignup.addEventListener('click', function(e) { e.preventDefault(); showAuthScreen('signup'); });

  var btnGoSignin = getEl('btn-go-signin');
  if (btnGoSignin) btnGoSignin.addEventListener('click', function() { showAuthScreen('signin'); });

  // Logout
  var btnLogout = getEl('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async function() {
      try {
        await supabase.auth.signOut();
        currentUser = null;
        username = '';
        if (timerInterval) clearInterval(timerInterval);
        showAuthScreen('signin');
      } catch(e) {
        console.error('Logout error:', e);
      }
    });
  }

  // Tabs
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var t = this.getAttribute('data-t');
      showPanel(t);
      if (t === 'rank') loadLeaderboard();
      if (t === 'stats') loadStats();
    });
  });

  // Start game button
  var btnStart = getEl('btn-start');
  if (btnStart) {
    btnStart.addEventListener('click', function() {
      this.classList.add('btn-pressed');
      startGame();
    });
  }

  // Next round button
  var btnNext = getEl('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', function() {
      this.classList.add('btn-pressed');
      nextRound();
    });
  }

  // Play again button
  var btnAgain = getEl('btn-again');
  if (btnAgain) {
    btnAgain.addEventListener('click', function() {
      this.classList.add('btn-pressed');
      startGame();
    });
  }

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.sort-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentSort = this.getAttribute('data-s');
      loadLeaderboard();
    });
  });
});

async function ensureAppUser(user, displayName) {
  try {
    var res = await supabase.from(TB_USERS).select('*').eq('user_id', user.id).maybeSingle();
    if (!res.data) {
      var name = displayName || username || (user.user_metadata && user.user_metadata.display_name) || user.email.split('@')[0];
      await supabase.from(TB_USERS).insert({
        user_id: user.id,
        email: user.email,
        username: name
      });
      username = name;
    } else {
      username = res.data.username || user.email.split('@')[0];
    }
  } catch(e) {
    console.error('ensureAppUser error:', e);
    username = user.email.split('@')[0];
  }
}

// ========================================
// SHOW APP
// ========================================
function showApp() {
  showScreen('screen-app');
  var navUser = getEl('nav-user');
  if (navUser) navUser.textContent = username;
  showView('view-menu');
  loadMenuStats();
  loadLeaderboard();
  loadStats();
}

async function loadMenuStats() {
  try {
    if (!currentUser) return;
    var res = await supabase.from(TB_SCORES).select('*').eq('user_id', currentUser.id).maybeSingle();
    var d = res.data;
    if (d) {
      var msPlayed = getEl('ms-played');
      var msPts = getEl('ms-pts');
      var msStreak = getEl('ms-streak');
      if (msPlayed) msPlayed.textContent = d.games_played || 0;
      if (msPts) msPts.textContent = d.total_points || 0;
      if (msStreak) msStreak.textContent = d.best_streak || 0;
    }
  } catch(e) { console.error('loadMenuStats error:', e); }
}

// ========================================
// GAME LOGIC
// ========================================
function startGame() {
  round = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  correctCount = 0;
  totalTime = 0;
  roundQuestions = shuffle(SONGS).slice(0, TOTAL_ROUNDS);
  showView('view-game');
  loadRound();
}

function loadRound() {
  answered = false;
  timeLeft = ROUND_TIME;

  var hudRound = getEl('hud-round');
  var hudScore = getEl('hud-score');
  var hudStreak = getEl('hud-streak');
  var timerFill = getEl('timer-fill');
  var timerSec = getEl('timer-sec');
  var clueText = getEl('clue-text');
  var choices = getEl('choices');

  if (hudRound) hudRound.textContent = (round + 1) + '/' + TOTAL_ROUNDS;
  if (hudScore) hudScore.textContent = score;
  if (hudStreak) hudStreak.textContent = streak;

  if (timerFill) {
    timerFill.style.transition = 'none';
    timerFill.style.width = '100%';
    timerFill.classList.remove('danger');
    // Force reflow then animate
    void timerFill.offsetWidth;
    timerFill.style.transition = 'width 1s linear';
  }
  if (timerSec) timerSec.textContent = ROUND_TIME;

  var q = roundQuestions[round];
  if (clueText) clueText.textContent = q.clue;

  // Build choices
  var options = shuffle([q.answer, ...q.wrong]);
  var letters = ['A', 'B', 'C', 'D'];
  if (choices) {
    choices.innerHTML = options.map(function(opt, i) {
      return '<button class="choice-btn" data-correct="' + (opt === q.answer ? '1' : '0') + '">' +
        '<span class="opt-letter">' + letters[i] + '</span>' +
        '<span class="opt-text"><span class="song-title">' + escHtml(opt.title) + '</span>' +
        '<span class="song-artist">' + escHtml(opt.artist) + '</span></span></button>';
    }).join('');

    // Attach click handlers directly
    choices.querySelectorAll('.choice-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (answered) return;
        handleAnswer(this);
      });
    });
  }

  // Start timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    timeLeft--;
    var tf = getEl('timer-fill');
    var ts = getEl('timer-sec');
    if (ts) ts.textContent = timeLeft;
    if (tf) {
      var pct = (timeLeft / ROUND_TIME) * 100;
      tf.style.width = pct + '%';
      if (timeLeft <= 5) tf.classList.add('danger');
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function handleAnswer(btn) {
  answered = true;
  if (timerInterval) clearInterval(timerInterval);
  var timeTaken = ROUND_TIME - timeLeft;
  totalTime += timeTaken;

  var isCorrect = btn.getAttribute('data-correct') === '1';
  var choices = getEl('choices');

  // Instantly show correct/wrong on all buttons
  if (choices) {
    choices.querySelectorAll('.choice-btn').forEach(function(b) {
      b.disabled = true;
      if (b.getAttribute('data-correct') === '1') {
        b.classList.add('correct');
      } else if (b === btn && !isCorrect) {
        b.classList.add('wrong');
      }
    });
  }

  var points = 0;
  if (isCorrect) {
    correctCount++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    var timeBonus = Math.round((timeLeft / ROUND_TIME) * 150);
    var streakBonus = (streak - 1) * 25;
    points = 100 + timeBonus + streakBonus;
    score += points;
  } else {
    streak = 0;
  }

  // Short delay then show feedback
  setTimeout(function() {
    showFeedback(isCorrect, points, roundQuestions[round]);
  }, 600);
}

function handleTimeout() {
  answered = true;
  streak = 0;
  totalTime += ROUND_TIME;
  var choices = getEl('choices');
  if (choices) {
    choices.querySelectorAll('.choice-btn').forEach(function(b) {
      b.disabled = true;
      if (b.getAttribute('data-correct') === '1') b.classList.add('correct');
    });
  }
  setTimeout(function() {
    showFeedback(false, 0, roundQuestions[round]);
  }, 600);
}

function showFeedback(isCorrect, points, q) {
  showView('view-feedback');
  var fbIcon = getEl('fb-icon');
  var fbTitle = getEl('fb-title');
  var fbDetail = getEl('fb-detail');
  var fbPoints = getEl('fb-points');
  var btnNext = getEl('btn-next');

  if (fbIcon) fbIcon.innerHTML = isCorrect
    ? '<i class="fas fa-check-circle" style="color:var(--success);font-size:64px"></i>'
    : '<i class="fas fa-times-circle" style="color:var(--danger);font-size:64px"></i>';

  if (fbTitle) fbTitle.textContent = isCorrect ? 'Correct!' : 'Wrong!';
  if (fbDetail) fbDetail.textContent = q.answer.title + ' by ' + q.answer.artist;
  if (fbPoints) fbPoints.textContent = isCorrect ? '+' + points + ' pts' : '0 pts';

  if (btnNext) {
    btnNext.textContent = (round + 1 >= TOTAL_ROUNDS) ? 'See Results' : 'Next Round';
    btnNext.classList.remove('btn-pressed');
  }
}

function nextRound() {
  round++;
  if (round >= TOTAL_ROUNDS) {
    showGameOver();
  } else {
    showView('view-game');
    loadRound();
  }
}

async function showGameOver() {
  showView('view-over');
  var overPts = getEl('over-pts');
  var overCorrect = getEl('over-correct');
  var overStreak = getEl('over-streak');
  var overAvg = getEl('over-avg');

  if (overPts) overPts.textContent = score;
  if (overCorrect) overCorrect.textContent = correctCount;
  if (overStreak) overStreak.textContent = bestStreak;
  if (overAvg) overAvg.textContent = correctCount > 0 ? (totalTime / correctCount).toFixed(1) : '0';

  var btnAgain = getEl('btn-again');
  if (btnAgain) btnAgain.classList.remove('btn-pressed');

  // Save score to Supabase
  try {
    if (!currentUser) return;

    // Update scores table
    var scRes = await supabase.from(TB_SCORES).select('*').eq('user_id', currentUser.id).maybeSingle();
    if (scRes.data) {
      var existing = scRes.data;
      await supabase.from(TB_SCORES).update({
        total_points: (existing.total_points || 0) + score,
        games_played: (existing.games_played || 0) + 1,
        best_streak: Math.max(existing.best_streak || 0, bestStreak),
        total_correct: (existing.total_correct || 0) + correctCount,
        total_rounds: (existing.total_rounds || 0) + TOTAL_ROUNDS
      }).eq('user_id', currentUser.id);
    } else {
      await supabase.from(TB_SCORES).insert({
        username: username,
        total_points: score,
        games_played: 1,
        best_streak: bestStreak,
        total_correct: correctCount,
        total_rounds: TOTAL_ROUNDS
      });
    }

    // Insert game history
    await supabase.from(TB_HISTORY).insert({
      score: score,
      correct_answers: correctCount,
      best_streak: bestStreak,
      avg_time: correctCount > 0 ? parseFloat((totalTime / correctCount).toFixed(1)) : 0
    });
  } catch(e) {
    console.error('Save score error:', e);
  }
}

// ========================================
// LEADERBOARD
// ========================================
async function loadLeaderboard() {
  try {
    var lbList = getEl('lb-list');
    if (!lbList) return;

    var res = await supabase.from(TB_SCORES).select('*').order(currentSort, { ascending: false }).limit(50);
    var data = res.data || [];

    if (!data.length) {
      lbList.innerHTML = '<div class="lb-empty"><i class="fas fa-trophy"></i><p>No scores yet. Be the first!</p></div>';
      return;
    }

    lbList.innerHTML = data.map(function(row, i) {
      var medal = i === 0 ? '<i class="fas fa-crown" style="color:#ffd700"></i> ' :
                  i === 1 ? '<i class="fas fa-medal" style="color:#c0c0c0"></i> ' :
                  i === 2 ? '<i class="fas fa-medal" style="color:#cd7f32"></i> ' : '';
      var isMe = currentUser && row.user_id === currentUser.id;
      return '<div class="lb-row' + (isMe ? ' lb-me' : '') + '">' +
        '<span class="lb-rank">' + medal + (i + 1) + '</span>' +
        '<span class="lb-name">' + escHtml(row.username || 'Player') + '</span>' +
        '<span class="lb-val">' + (row[currentSort] || 0) + '</span>' +
        '</div>';
    }).join('');
  } catch(e) {
    console.error('Leaderboard error:', e);
  }
}

// ========================================
// STATS
// ========================================
async function loadStats() {
  try {
    if (!currentUser) return;
    var res = await supabase.from(TB_SCORES).select('*').eq('user_id', currentUser.id).maybeSingle();
    var d = res.data;

    var stPlayed = getEl('st-played');
    var stPts = getEl('st-pts');
    var stAcc = getEl('st-acc');
    var stStreak = getEl('st-streak');

    if (d) {
      if (stPlayed) stPlayed.textContent = d.games_played || 0;
      if (stPts) stPts.textContent = d.total_points || 0;
      var acc = d.total_rounds > 0 ? Math.round((d.total_correct / d.total_rounds) * 100) : 0;
      if (stAcc) stAcc.textContent = acc + '%';
      if (stStreak) stStreak.textContent = d.best_streak || 0;
    } else {
      if (stPlayed) stPlayed.textContent = '0';
      if (stPts) stPts.textContent = '0';
      if (stAcc) stAcc.textContent = '0%';
      if (stStreak) stStreak.textContent = '0';
    }
  } catch(e) {
    console.error('Stats error:', e);
  }
}
