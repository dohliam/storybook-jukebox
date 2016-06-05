function pad_num(n) {
  num_string = "";
  if (n < 10) {
    num_string = "0" + n.toString();
  } else {
    num_string = n.toString();
  }
  return num_string
}

function load_player(s) {
  idx = window.stories[s].n;
  text = window.stories[s].t;
  trans_text = window.stories[s].b;
  attribution = window.stories[s].a;

  window.chapters = text.split("@");
  window.trans_chapters = trans_text.split("@");

  title = window.chapters[0].replace(/#.*/, "");

  chapter_text = "<center><strong>" + title + "</strong></center>";
  page_number = pad_num(1);
  p = [idx, title, page_number, chapter_text, attribution]
  window.p = p;
  create_player(p);
}

function create_player(p) {
  idx = p[0];
  title = p[1];
  page_number = p[2];
  chapter_text = p[3];
  attribution = p[4];

  image = '<img src="https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/' + idx + '/' + page_number + '.jpg" />\n\n';

  title_format = title.toLowerCase().replace(/\s/g, "-").replace(/[\?\!,\(\)'؟]/g, "");
  mp3 = 'https://raw.githubusercontent.com/global-asp/gasp-audio/master/' + lang + '/' + idx + '_' + title_format + '/mp3/' + page_number + '.mp3';
  controls = "        <audio autoplay id='audio' onended='play_next_chapter()'><source src='" + mp3 + "' type='audio/mpeg'></audio>";

  title_div = document.getElementById("title_div");
  image_div = document.getElementById("image_div");
  audio_div = document.getElementById("audio_item");
  text_div = document.getElementById("story_text");

  show_lang();
  image_div.innerHTML = image;
  audio_div.innerHTML = controls;
  media_controls();
}

function play_next_chapter() {
  p = window.p;
  n = parseInt(p[2]);

  idx = p[0];
  title = p[1];
  attribution = p[4];

  if (n + 1 > window.chapters.length) {
    play_next();
  } else {
    page_number = pad_num(n + 1);
    chapter_text = window.chapters[n];
    if (chapter_text == "%None%") {
      chapter_text = "";
      p = [idx, title, page_number, chapter_text, attribution];
      window.p = p;
      setTimeout(create_player(p), 3000);
    } else {
      p = [idx, title, page_number, chapter_text, attribution];
      window.p = p;
      create_player(p);
    }
  }
}

function play_previous_chapter() {
  p = window.p;
  n = parseInt(p[2]);

  idx = p[0];
  title = p[1];
  attribution = p[4];

  if (n - 1 < 1) {
    play_previous();
  } else {
    page_number = pad_num(n - 1);
    chapter_text = window.chapters[n];
    p = [idx, title, page_number, chapter_text, attribution];
    window.p = p;
    create_player(p);
  }
}

function play_next() {
  s = window.current_track + 1;
  if (s > window.stories.length - 1) {
    s = 0;
  }
  window.current_track = s;
  load_player(s);
}

function play_previous() {
  s = window.current_track - 1;
  if (s < 0) {
    s = window.stories.length - 1;
  }
  window.current_track = s;
  load_player(s);
}

function switch_lang() {
  h = window.switched;
  if (h) {
    window.switched = false;
  } else {
    window.switched = true;
  }
  show_lang();
}

function show_lang() {
  s = window.current_track;
  title = window.chapters[0].replace(/#.*/, "");

  story_text = document.getElementById("story_text");
  title_div = document.getElementById("title_div");

  trans_chapters = window.trans_chapters;

  trans_header = "        <h2>" + title + "</h2>\n\n";

  p = window.p;

  page_number = p[2];
  chapter_text = p[3];

  n = parseInt(page_number) - 1;

  h = window.switched;
  if (h) {
    header = "        <h2>" + trans_chapters[0] + "</h2>\n\n";
    title_div.innerHTML = header;
    story_text.innerHTML = trans_chapters[n];
  } else {
    header = "        <h2>" + title.replace(/#/, "<br>") + "</h2>\n\n";
    title_div.innerHTML = header;
    story_text.innerHTML = chapter_text;
  }
}

function play_random() {
  rand = Math.floor(Math.random() * window.stories.length + 1);

  s = rand;
  if (s > window.stories.length - 1) {
    s = 0;
  }
  window.current_track = s;
  load_player(s);
}

function media_controls() {
  audio_item = document.getElementById("audio_item");

  media_buttons = '    <div id="control_buttons">\n      <button onclick="play_previous()" accesskey="h"><img src="img/previous_story.svg" title="Listen to previous story"></button>\n      <button onclick="play_previous_chapter()" accesskey="j"><img src="img/previous_chapter.svg" title="Skip to previous chapter"></button>\n      <button onclick="play_pause()" accesskey="p"><img src="img/play_pause.svg" title="Pause/resume playback"></button>\n      <button onclick="audio_stop()" accesskey="x"><img src="img/stop.svg" title="Stop playback"></button>\n      <button onclick="play_next_chapter()" accesskey="k"><img src="img/next_chapter.svg" title="Skip to next chapter"></button>\n      <button onclick="play_next()" accesskey="l"><img src="img/next_story.svg" title="Listen to next story"></button>\n    </div>';

  audio_item.innerHTML = audio_item.innerHTML + "\n" + media_buttons;

}

function play_pause() {
  if (window.audio.paused) {
    window.audio.play();
  } else {
    window.audio.pause();
  }
}

function audio_stop() {
  window.audio.pause();
  window.audio.currentTime = 0;
}

function load_page() {
  window.current_track = 0;
  window.switched = false;
  quick_api();
}

function quick_api() {
  var geturl = location.href;
  lang = "no";
  if (/\?/.test(geturl) == true) {
    lang = /\?([a-z]+)/.exec(geturl)[1];
  }
  load_lang(lang);
}

function load_lang() {
  wl = 'js/json-' + lang + '.js';
  if (fileadded != wl) {
    var wlsrc = document.createElement('script');
    wlsrc.setAttribute("type","text/javascript");
    wlsrc.setAttribute("src", wl);
    document.getElementsByTagName("head")[0].appendChild(wlsrc);
    fileadded = wl;
  }
}
