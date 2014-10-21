(function() {
  var out = document.querySelector('#output');
  var url = window.URL || window.webkitURL;
  var objURL = url.createObjectURL || false;
  var fileinput = document.querySelector('#getfile');
  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  var str = '';
  var i = 0;

  fileinput.addEventListener('change', function(e) {
    i = 0;
    var file = e.target.files[0];
    EXIF.getData(file, function() {
      str = '<ul>';
      var data = EXIF.getAllTags(this);
      for (i in data) {
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
  });
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
    out.innerHTML += '<a href="'+c.toDataURL('image/jpeg', 0.9)+'" '+
    'download="'+name.split('.')[0]+'-cleaned.jpg'+'">Download clean image</a>';
  }
})();