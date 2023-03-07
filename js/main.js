const regexChecker = new RegExp(
    /(?:http?s?:\/\/)?(?:www.)?(?:m.)?(?:music.)?youtu(?:\.?be)(?:\.com)?(?:(?:\w*.?:\/\/)?\w*.?\w*-?.?\w*\/(?:embed|e|v|watch|.*\/)?\??(?:feature=\w*\.?\w*)?&?(?:v=)?\/?)([\w\d_-]{11})(?:\S+)?/g
  );
  const youtubeVideoID =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  
  async function downloadVideo() {
    $("#downloadTable tbody tr").remove();
    const link = document.getElementById("youtubeVideoLINK").value;
    if (link.length < 10 || regexChecker.test(link) == false) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid YouTube URL!",
      });
    }
  
    const getVideoId = link.match(youtubeVideoID);
    console.log(getVideoId[1]);
    if (typeof getVideoId[1] !== "string" || validVideoId(getVideoId[1])) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid YouTube URL!",
      });
    }
  
    const body = `{"url": "https://www.youtube.com/watch?v=${getVideoId[1]}"}`;
    let rowIdx = 1;
  
    const response = await fetch("https://save-from.net/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  
    const text = await response.text();
    const data = JSON.parse(text);
    let urls = data.url;
  
    let videos = urls.filter((u) => u.audio == false);
    let audios = urls.filter((u) => u.audio == true);
  
    let noAudioVideos = videos.filter(
      (url) => url.attr.class.toLowerCase() == "no-audio"
    );
    let audioVideos = videos.filter((url) => !noAudioVideos.includes(url));
  
    audioVideos.sort((a, b) => {
      if (a.qualityNumber > b.qualityNumber) return -1;
      if (a.qualityNumber < b.qualityNumber) return 1;
      return 0;
    });
    noAudioVideos.sort((a, b) => {
      if (a.qualityNumber > b.qualityNumber) return -1;
      if (a.qualityNumber < b.qualityNumber) return 1;
      return 0;
    });
  
    audioVideos.forEach((url) => {
      $("#downloadTable").append(`<tr><th scope="row">${
        (rowIdx + 1, rowIdx++)
      }</th>
      <td>${url.name}</td>
      <td>${url.subname}p</td>
      <td>${
        url.filesize ? Math.round(url.filesize / 1024 / 1024) + " MB" : "UNKNOWN"
      }</td>
      <td><a type="button" class="btn btn-success ripple-surface" href="${
        url.url
      }">Download</a></td></tr>`);
    });
  
    noAudioVideos.forEach((url) => {
      $("#downloadTable").append(`<tr><th scope="row">${
        (rowIdx + 1, rowIdx++)
      }</th>
      <td>${url.name} (No Audio)</td>
      <td>${url.subname}p</td>
      <td>${
        url.filesize ? Math.round(url.filesize / 1024 / 1024) + " MB" : "UNKNOWN"
      }</td>
      <td><a type="button" class="btn btn-success ripple-surface" href="${
        url.url
      }">Download</a></td></tr>`);
    });
  }
  
  async function downloadAudio() {
    $("#downloadTable tbody tr").remove();
    const link = document.getElementById("youtubeVideoLINK").value;
    if (link.length < 10 || regexChecker.test(link) == false) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid YouTube URL!",
      });
    }
  
    const getVideoId = link.match(youtubeVideoID);
    console.log(getVideoId[1]);
    if (typeof getVideoId[1] !== "string" || validVideoId(getVideoId[1])) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid YouTube URL!",
      });
    }
  
    const body = `{"url": "https://www.youtube.com/watch?v=${getVideoId[1]}"}`;
    let rowIdx = 0;
  
    const response = await fetch("https://save-from.net/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  
    const text = await response.text();
    const data = JSON.parse(text);
    let urls = data.url;
    if (typeof urls == "object") urls.shift();
  
    let audios = urls.filter((u) => u.audio == true);
  
    audios.sort((a, b) => {
      if (a.qualityNumber > b.qualityNumber) return -1;
      if (a.qualityNumber < b.qualityNumber) return 1;
      return 0;
    });
  
    audios.forEach((url) => {
      $("#downloadTable").append(`<tr><th scope="row">${
        (rowIdx + 1, rowIdx++)
      }</th>
      <td>${url.ext.toUpperCase()}</td>
      <td>${url.subname} kbps</td>
      <td>${
        url.filesize ? Math.round(url.filesize / 1024 / 1024) + " MB" : "UNKNOWN"
      }</td>
      <td><a type="button" class="btn btn-success ripple-surface" href="${
        url.url
      }">Download</a></td></tr>`);
    });
  }
  
  function validVideoId(id) {
    var status;
    var img = new Image();
    img.src = "http://img.youtube.com/vi/" + id + "/mqdefault.jpg";
    img.onload = function () {
      status = checkThumbnail(this.width);
    };
  
    return status;
  }
  
  function checkThumbnail(width) {
    if (width === 120) {
      return false;
    } else {
      return true;
    }
  }
  
