var request = require('request');
var cheerio = require('cheerio');

var urlmain = "http://www.maisonsdumonde.com";

request('http://www.maisonsdumonde.com/FR/fr/meubles/canapes-droits-20b2dff5c48607368137c32bfbafc519.htm', function(error, response, html){
  if(!error && response.statusCode == 200){
    //console.log(html);


    var $ = cheerio.load(html);

    $("article").each(function(i, element){
      var article =  $(this);
      var url = article.children("a.btns").attr('href');
      loadata(url);
    });
  }
  console.log(error);

});

function loadata(url) {
  request(urlmain + url, function(error, response, html){
    console.log(urlmain + url);
    if(!error && response.statusCode == 200){
      //console.log(html);
      var $ = cheerio.load(html);
      var description = $('#description');
      var ref = $(description).children("p").eq(0);
      var size = $(description).children("p").eq(1);
      //var $ = cheerio.load('<div id="description">...</div>');
      //var description = $("div.bloc-description");
      console.log(ref.text());
      console.log(size.text());
    }
  });
}
