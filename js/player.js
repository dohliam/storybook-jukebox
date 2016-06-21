function pad_num(n) {
  num_string = "";
  if (n < 10) {
    num_string = "0" + n.toString();
  } else {
    num_string = n.toString();
  }
  return num_string
}

function get_p(page, track) {
  stories = window[window.json];
  idx = stories[track].n;
  text = stories[track].t;
  trans_text = stories[track].b;
  attribution = stories[track].a;

  chapters = text.split("@");
  trans_chapters = trans_text.split("@");
  trans_chapter_text = trans_chapters[page];

  len = chapters.length;

  title = chapters[0].replace(/#.*/, "");
  trans_title = trans_chapters[0];

  page_number = pad_num(page + 1);

  chapter_text = "<center><strong>" + title + "</strong></center>";
  if (page != 0) {
    chapter_text = chapters[page];
  }
  p = [idx, title, page_number, chapter_text, attribution, trans_title, trans_chapter_text, len];
  return p;
}


function load_player(page, track) {
  stories = window[window.json];
  idx = stories[track].n;
  text = stories[track].t;
  trans_text = stories[track].b;
  attribution = stories[track].a;

  chapters = text.split("@");
  trans_chapters = trans_text.split("@");
  trans_chapter_text = trans_chapters[track];

  len = chapters.length;

  title = chapters[0].replace(/#.*/, "");
  trans_title = trans_chapters[0];

  chapter_text = "<center><strong>" + title + "</strong></center>";
  page_number = pad_num(page + 1);
  p = [idx, title, page_number, chapter_text, attribution, trans_title, trans_chapter_text, len];
  create_player(p, page, track);
  play_audio(page, track);
}

function create_player(p, page, track) {
  idx = p[0];
  title = p[1];
  page_number = p[2];
  chapter_text = p[3];
  attribution = p[4];

  image = '<img src="https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/' + idx + '/' + page_number + '.jpg" />\n\n';

  title_format = format_title(title);
  audio_basename = 'https://raw.githubusercontent.com/global-asp/gasp-audio/master/' + lang + '/' + idx + '_' + title_format;
  mp3 = audio_basename + '/mp3/' + page_number + '.mp3';
  ogg = audio_basename + '/ogg/' + page_number + '.ogg';
  audio_track = "        <audio autoplay id='audio' onended='play_next_chapter(" + page + "," + track + ")'><source src='" + ogg + "' type='audio/ogg'><source src='" + mp3 + "' type='audio/mpeg'></audio>";

  title_div = document.getElementById("title_div");
  image_div = document.getElementById("image_div");
  audio_div = document.getElementById("audio_item");
  text_div = document.getElementById("story_text");

  sw = "switch_lang(" + page + "," + track + ")";

  title_div.setAttribute("onclick", sw);
  text_div.setAttribute("onclick", sw);

  media_controls(page, track);
  show_lang(p);
  image_div.innerHTML = image;
  audio_div.innerHTML = audio_track;
}

function play_audio(page, track) {
  p = get_p(page, track);
  lang = window.lang;
  idx = p[0];
  title = p[1];
  page_number = p[2];

  title_format = format_title(title);

  audio_basename = 'https://raw.githubusercontent.com/global-asp/gasp-audio/master/' + lang + '/' + idx + '_' + title_format;
  mp3 = audio_basename + '/mp3/' + page_number + '.mp3';
  ogg = audio_basename + '/ogg/' + page_number + '.ogg';

  audio_div = document.getElementById("audio_item");
  controls = "        <audio autoplay id='audio' onended='play_next_chapter(" + page + "," + track + ")'><source src='" + ogg + "' type='audio/ogg'><source src='" + mp3 + "' type='audio/mpeg'></audio>";
  audio_div.innerHTML = controls;
}

function format_title(title) {
  title_format = title.toLowerCase().replace(/\s/g, "-").replace(/[\?؟？¿\!！¡,\(\)']/g, "");
  return title_format;
}

function play_next_chapter(page, track) {
  p = get_p(page, track);

  idx = p[0];
  title = p[1];
  attribution = p[4];
  len = p[7];

  page = page + 1;

  if (page > len - 1) {
    play_next_story(track);
  } else {
    p = get_p(page, track);
    chapter_text = p[3];
    if (chapter_text == "%None%") {
      p[3] = "";
      setTimeout(create_player(p, page, track), 3000);
    } else {
      create_player(p, page, track);
    }
  }
}

function play_previous_chapter(page, track) {
  p = get_p(page, track);

  idx = p[0];
  title = p[1];
  attribution = p[4];

  if (page - 1 < 0) {
    play_previous_story(track);
  } else {
    page = page - 1;
    p = get_p(page, track);
    create_player(p, page, track);
  }
}

function play_next_story(track) {
  stories = window[window.json];
  track = track + 1;
  if (track > stories.length - 1) {
    track = 0;
  }
  load_player(0, track);
}

function play_previous_story(track) {
  stories = window[window.json];
  track = track - 1;
  if (track < 0) {
    track = window.stories.length - 1;
  }
  load_player(0, track);
}

function switch_lang(page, track) {
  p = get_p(page, track);
  h = window.switched;
  if (h) {
    window.switched = false;
  } else {
    window.switched = true;
  }
  show_lang(p);
}

function show_lang(p) {
  title = p[1];
  page_number = p[2];
  chapter_text = p[3];
  trans_title = p[5];
  trans_chapter_text = p[6];

  story_text = document.getElementById("story_text");
  title_div = document.getElementById("title_div");

  trans_header = "        <h2>" + title + "</h2>\n\n";

  n = parseInt(page_number) - 1;

  h = window.switched;
  if (h) {
    header = "        <h2>" + trans_title + "</h2>\n\n";
    title_div.innerHTML = header;
    story_text.innerHTML = trans_chapter_text;
  } else {
    header = "        <h2>" + title.replace(/#/, "<br>") + "</h2>\n\n";
    title_div.innerHTML = header;
    story_text.innerHTML = chapter_text;
  }
}

function play_random(page, track) {
  stories = window[window.json];
  rand = Math.floor(Math.random() * window.stories.length + 1);

  s = rand;
  if (s > window.stories.length - 1) {
    s = 0;
  }
  window.current_track = s;
  load_player(page, track);
}

function media_controls(page, track) {
  controls_div = document.getElementById("media_controls");

  media_buttons = '    <div id="control_buttons">\n      <button onclick="play_previous_story(' + track + ')" accesskey="h"><img src="img/previous_story.svg" title="Listen to previous story"></button>\n      <button onclick="play_previous_chapter(' + page + ',' + track + ')" accesskey="j"><img src="img/previous_chapter.svg" title="Skip to previous chapter"></button>\n      <button onclick="play_pause()" accesskey="p"><img src="img/play_pause.svg" title="Pause/resume playback"></button>\n      <button onclick="audio_stop()" accesskey="x"><img src="img/stop.svg" title="Stop playback"></button>\n      <button onclick="play_next_chapter(' + page + ',' + track + ')" accesskey="k"><img src="img/next_chapter.svg" title="Skip to next chapter"></button>\n      <button onclick="play_next_story(' + track + ')" accesskey="l"><img src="img/next_story.svg" title="Listen to next story"></button>\n    </div>';

  controls_div.innerHTML = media_buttons;

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

function load_lang(lang) {
  wl = 'js/json-' + lang + '.js';
  if (fileadded != wl) {
    var wlsrc = document.createElement('script');
    wlsrc.setAttribute("type","text/javascript");
    wlsrc.setAttribute("src", wl);
    document.getElementsByTagName("head")[0].appendChild(wlsrc);
    fileadded = wl;
  }
}

function show_attribution() {
  audio_stop();
  attribution = window.p[4];

  title = window.p[1];
  reader = attribution[0];
  text = attribution[1];
  illustration = attribution[2];
  translation = attribution[3];
  license = attribution[4];
  if (license == "n") {
    license = "CC-BY-NC";
  } else {
    license = "CC-BY";
  }

  a_div = document.getElementById("attribution");
  format_attribution = "<h2>" + title + "</h2>\n<p><b>Read by: " + reader + "</b></p>\n<ul>\n<li>Author: " + text + "</li>\n<li>Illustrator: " + illustration + "</li>\n<li>Translator: " + translation + "</li>\n<li>License: " + license + "</li></ul>";
  a_div.innerHTML = format_attribution;
}
