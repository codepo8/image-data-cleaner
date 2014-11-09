(function(){

  var out = document.querySelector('#output');
  var url = window.URL || window.webkitURL;
  var objURL = url.createObjectURL || false;
  var fileinput = document.querySelector('#getfile');
  var app = document.querySelector('#app');

  app.addEventListener('dragover', function(ev) {
    document.body.classList.add('dragdrop');
    ev.preventDefault();
  }, false );
  app.addEventListener('drop', getfile, false);
  fileinput.addEventListener('change', getfile, false);

  function getfile(e) {
    document.body.classList.remove('dragdrop');
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    EXIF.getData(file, function() {
      var data = EXIF.getAllTags(this);
      if (data.GPSLongitude) {
        var lon = convertDMS(
          data.GPSLongitude[0],
          data.GPSLongitude[1],
          data.GPSLongitude[2],
          data.GPSLongitudeRef
        );
        var lat = convertDMS(
          data.GPSLatitude[0],
          data.GPSLatitude[1],
          data.GPSLatitude[2],
          data.GPSLatitudeRef
        );
        var img = new Image();
        var url = 'http://geomap.nagvis.org/'+
                  '?module=map&&width=400&height=400&center='+
                   lon+','+lat+'&zoom=15';
        out.innerHTML = '<img src="' + url + '"><p>'+
                        '<a href="https://www.google.co.uk/maps/@' +
                         lat + ',' + lon + ',17z">'+
                         'View on Google Maps</a>'+
                         '<a href="index.html">Remove data</a>' +
                         '</p>';
      } else {
        out.innerHTML = '<p><strong>No Map data in this image!</strong></p>';
      }

    });
    e.preventDefault();
  }

  function convertDMS(d,m,s,dir) {
    d = d-0;
    m = m-0;
    var sign = (dir === 'W' || dir === 'S') ? -1 : 1;
    return (((s / 60 + m) / 60) + d) * sign;
  }

})();
