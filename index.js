var
    fs      = require('fs')
  , request = require('request')
  , cheerio = require('cheerio')
  , path    = require('path')

var getpaths = {
  us: function(name) {
    return 'https://patentimages.storage.googleapis.com/pdfs/' + name + ".pdf";
  }
}

var pullpath = function(name) {
  return 'https://www.google.com/patents/' + name;
}

module.exports.get = get = function (name, outpath) {

  var url;

  if(typeof outpath === typeof function() { }) {
    cb = outpath; outpath = null;
  }

  outpath = outpath ? path.normalize(outpath) : process.cwd();
  outpath = path.join(outpath, name + '.pdf');

  var code = name.substring(0, 2);

  if( code === 'US' ) {
    url = getpaths.us(name);
    request.get(url).pipe(fs.createWriteStream(outpath));
  } else {
    url = pullpath(name);
    request.get(url, function(err, resp, body) {
      var
          $ = cheerio.load(body)
        , link = $('#appbar-download-pdf-link').attr('href');

      if(link) {
        link = link.substring(0, 2) === '//' ? 'http:' + link : link;
        request.get(link).pipe(fs.createWriteStream(outpath));
      } else {
        console.log('Did not find ' + name);
      }
    });
  }

  console.log('Getting ' + name + ' from ' + url);
  if(url) {
  }
};

module.exports.pull = function (name, outpath, prior_art_folder_name) {

  outpath = outpath ? path.normalize(outpath) : process.cwd();
  get(name, outpath);

  var url = pullpath(name)
    , prior_art_path = path.join(outpath, prior_art_folder_name || 'prior_art_patents');

  console.log('Making ' + prior_art_path);
  fs.mkdirSync(prior_art_path);

  console.log('Getting ' + url);
  request.get(url, function(err, resp, body) {
    var
        $ = cheerio.load(body)
      , links = $('#backward-citations')
                      .parent()
                      .find('.patent-data-table')
                      .find('a');

    links.each(function(index, element) {
      var id = $(element).text();
      console.log(id);
      get(id, prior_art_path);
    })
  });
};
