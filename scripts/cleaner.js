(function() {
  var out = document.querySelector('#output');
  var url = window.URL || window.webkitURL;
  var objURL = url.createObjectURL || false;
  var fileinput = document.querySelector('#getfile');
  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  var str = '';
  var i = 0;
  var app = document.querySelector('#app');

  app.addEventListener('dragover', function(ev) {
    document.body.classList.add('dragdrop');
    ev.preventDefault();
  }, false );
  app.addEventListener('drop', getfile, false);
  fileinput.addEventListener('change', getfile, false);

  function getfile(e) {
    document.body.classList.remove('dragdrop');
    i = 0;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    EXIF.getData(file, function() {
      str = '<ul>';
      var data = EXIF.getAllTags(this);
      for (var i in data) {
        if (i === 'MakerNote') { continue; }
        disp = data[i];
        str += '<li>'+i+': '+disp+'</li>';
      }
      out.innerHTML = str + '</ul>';
      if (i !== 0) {
        if(objURL) {
          loadImage(url.createObjectURL(file),file.name);
        } else {
          var reader = new FileReader();
          reader.readAsDataURL( file );
          reader.onload = function ( ev ) {
            loadImage(ev.target.result,file.name);
          };
        }
      } else {
        output.innerHTML = 'Image is already clean!';
      }
    });
    e.preventDefault();
  }

  function loadImage(file, name) {
    var img = new Image();
    img.src = file;
    img.onload = function() {
      imagetocanvas(this, img.naturalWidth, img.naturalHeight, name);
    };
  }
  function imagetocanvas(img, w, h, name) {
    c.width = w;
    c.height = h;
    cx.drawImage(img, 0, 0, w, h);
    var dlname = name.replace(/\.([^\.]+)$/,'-cleaned.jpg');
    out.innerHTML += '<a href="'+c.toDataURL('image/jpeg', 0.9)+'" '+
    'download="' + dlname + '">Download clean image</a>';
  }
})();