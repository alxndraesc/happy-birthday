/* ==========================================================================
   WONA OS — CONFIG. This is the ONLY file you need to edit.
   Search for "TODO" to find every placeholder.

   FOLDERS (put these next to index.html):
     images/   -> photos        e.g. images/wona.jpg
     audio/    -> song clips    e.g. audio/dorothea.mp3
   ========================================================================== */
const CONFIG = {

  /* ---------- 1. BASICS ---------- */
  age: 23,                              // she becomes "Wona OS 23.0"
  password: "wona",                     // TODO: not case sensitive
  passwordHint: "we call her who?", // TODO

  /* ---------- 2. TIMING (milliseconds) ---------- */
  timing: {
    updatePopupDelay: 2200,    // pause on the home screen before the update popup
    tapsBeforeMemories: 4,     // taps on icons/widgets before the memories popup shows up
    memoriesFallback: 50000,   // ...or this long after the update popup is closed
    messageDelay: 6000,        // quiet time after "Keep forever" before the message notification
    typingDelay: 700           // delay between your chat bubbles
  },

  /* ---------- 3. PROFILE (first popup, with the password box) ---------- */
  profile: {
    photo: "images/profile.jpg",                 // TODO: e.g. "images/wona.jpg"  (empty = "YOUR PHOTO" placeholder)
    name: "JONALYN",
    title: "Class: Unapologetic Queen",
    facts: [                   // [label, value] rows
      ["Known alias", "Wona, my Dorothea"],
      ["Specialty", "Speaking her mind"],
      ["Swiftie credentials", "Long-lost daughter"],
      ["Friendship", "Lifetime membership"]
    ],
    stats: [                   // [label, 0-100]
      ["PUNCTUALITY", 23],
      ["OPINIONS", 100],
      ["OOTDS", 90]
    ]
  },

  /* ---------- 4. MUSIC PLAYER WIDGET ---------- */
  // src = path to the clip. Leave "" for a decorative-only song (fake progress bar).
  // The arrow buttons change songs; the list under the player is just for show.
  // Optional per song: start: 53, end: 110 (seconds) to play only a clip.
  songs: [
    { title: "New Romantics",      artist: "Taylor Swift", src: "audio/New_Romantics.mp3" },
    {title: "Bejeweled", artist: "Taylor Swift",     src: "audio/Bejeweled.mp3" }, // TODO: e.g. "audio/dorothea.mp3"
    { title: "dorothea", artist: "Taylor Swift",     src: "audio/dorothea.mp3" }  // TODO
  ],

  /* ---------- 5. REMINDERS WIDGET ---------- */
  // [text, alreadyChecked]. She can tap to check/uncheck.
  reminders: [
    ["LANY CONCERT 2026! 🎶", false],
    ["ATE DUTIES", false],
    ["DATE WITH THE GIRLS 🥰✨", true],
    ["DATE WITH BEBU ❤️", false]     // TODO
  ],

  /* ---------- 6. DESKTOP ICONS (decorative) ---------- */
  // [sprite, label, text shown in the little window when she taps it]
  // Sprites available: computer camera cd globe clock star trash chat heart folder envelope
  // An icon labeled "Messages" opens the Messages app instead of a little window.
  desktopIcons: [
    ["computer", "Wona 22.0",          "Wona 22.0 is outdated. Update Now."],
    ["camera",   "Instagram",        "You were tagged in 230 posts."],
    ["cd",       "Spotify",          "Spotify wrapped, Most Played Artist: Taylor Swift."],
    ["globe",    "Internet",         "Currently on explore and discovery mode"],
    ["clock",    "Late.exe",         "Late.exe has stopped responding (as usual)."],
    ["star",     "Taylor's Version", "Begin Again, Taylor's Version"],
    ["trash",    "Bad Takes",        "Cannot be emptied. There are too many."],
    ["chat",     "Messages",       "No new messages. (Yet.)"]
  ],

  /* ---------- 7. MEMORY PHOTO PILE ---------- */
  // image = path to a photo, e.g. "images/memory-01.jpg". Empty = placeholder.
  memories: [
    { title: "",   image: "images/memo1.jpg" },   // TODO
    { title: "",   image: "images/memo2.jpg" },   // TODO
    { title: "",   image: "images/memo3.jpg" },
    { title: "",   image: "images/memo4.jpg" },
    { title: "",   image: "images/memo5.jpg" },
    { title: "", image: "images/memo6.jpg" }    // TODO
  ],

  /* ---------- 8. MESSAGES APP ---------- */
  // Names used for chat labels. "wona" is HER (her bubbles sit on the right).
  people: { wona: "Wona", janna: "Janna", you: "Kayla" },   // TODO: your name

  // Her phone shows three conversations, in this order. Yours is first and highlighted.
  conversations: [
    {
      id: "you", name: "Kayla", priority: true,           // TODO: your name
      // `history` = the earlier conversation, shown instantly. Anyone can talk here.
      history: [
        { from: "you",  text: "Nasa concert ka na??" },
        { from: "wona", text: "Yesssss!!!" },
      ],
      // `live` = your NEW messages. They appear one by one (only you, no replies from her),
      // then your birthday letter (section 9) comes last.
      live: ["what time is it?", "3..", "2..", "1.."]
    },
    {
      id: "janna", name: "Janna",
      messages: [                                              // TODO: real chat with Janna
        { from: "janna", text: "Hain ka na?" },
        { from: "wona",  text: "baka malelate ako.." },
        { from: "janna", text: "ahhhh oki" },
        { from: "janna", text: "sige" },
        { from: "wona", text: "sorry naaa.." }
      ]
    },
    {
      id: "gc", name: "DA-POWERPUFF-GALS 🩷💙💚", group: true,        // TODO: group name
      messages: [                                              // TODO: real inside jokes
        { from: "janna", text: "huy, mus ma dagat" },
        { from: "you",   text: "oo, dagat naman kita" },
        { from: "janna", text: "go akooo" },
        { from: "you", text: "hahaha, hain na si jona" },
        { from: "you", text: "jonaaa" },
        { from: "you", text: "online ba?" },
        { from: "janna", text: "bebe time naman ada." }
      ]
    }
  ],

  /* ---------- 9. YOUR BIRTHDAY LETTER ---------- */
  // Each line is its own paragraph. It appears at the end of YOUR conversation.
  birthdayLetter: [
    "Dear Wonababeee,",
    "First of all, hope you like?? I realize di ko pa eto nagagawa for you... maybe it's timing on my part, pero I hope makabawi na eto for you. Ineffort ko ya ha! 😤😜",
    "Aram ko 'no to sappy messages' ka na, no drama. But ako ba eto kung di ako mamessage, sige no drama basta daghan sasabihon ko. It dawned on my just recently na it's been 10 years of me knowing youu. Napaisip ako 10? WHATTT!? I can't imagine it being that long, and maybe its because of how much fun we've spent, and at ease I have been since naging friends kita (us 3 forever). Yes there were good days, and nakakaines days, pero I swear I won't ever not want you in my life. ",
    "In those 10 years, you have been so brave to face so much and I really admire you sa part na yan. Being an Ate myself I don't think I am on the same level as you, and that's because you go with it, and never look back. And sana all nalang talaga. Char I know we are different in many ways. But even so, I love how our friendship works, and we get each other.",
    "We have so much more to experience in this life, and alam ko you have plans, and I am always rooting for you. Ate's gonna make it, para kina Roi. I wish you nothing but the best, Wona! 😚",
    "Enjoy today queen! SANA NASA CONCERT KA TALAGA!! di ko talaga ya hahalion, maski di ka natuloy yaa yun HAHAHHA.",
    "Love you, Wona! so much!!! 🩷✨",
    "xoxo Kaylaaaa"
  ]
};