var request = require('request');
var cheerio = require('cheerio');

var urlmain = "http://www.maisonsdumonde.com";
var urlPages =
["?noFavourite=true&noMea=false&search=&facets%5Bdimensions%5D%5Bminwidth%5D=&facets%5Bdimensions%5D%5Bmaxwidth%5D=&facets%5Bdimensions%5D%5Bminheight%5D=&facets%5Bdimensions%5D%5Bmaxheight%5D=&facets%5Bdimensions%5D%5Bmindepth%5D=&facets%5Bdimensions%5D%5Bmaxdepth%5D=&facets%5Bprices%5D%5Bupdated%5D=",
"&facets%5Bprices%5D%5Bminprice%5D=",
"&facets%5Bprices%5D%5Bmaxprice%5D=",
"&page="];

var urlList = new Array();
/*
requestHTML(urlmain)
.then(function(html) {urlListing(html).then(console.log("test"))
}
);*/

function requestHTML(url) {
  return new Promise(function(resolve, reject){
    request(url, function(error, response, html){
      if(!error && response.statusCode == 200){
        resolve(html);
      }
      reject(error);
    });
  })
}

function urlListing(html) {
  return new Promise(function(resolve, reject){
    var $ = cheerio.load(html);
    $("ul[class='sub-3 layer-mobile'] a").each(function(i, element){
      var link = $(this).attr('href');
      var type = link.split("/")[3];
      //TODO remove certain url ? housse fauteils, matelas ect... ???
      if(type == "categorie" || type == "meubles" && !(link in urlList)) urlList.push(link);
    });
    console.log(urlList);
    resolve(urlList);
  })
}

/*
function ParsePage(url){
  return new Promise(function(resolve, reject){
    requestHTML(urlMain + url).then(function(html){
    var $ = cheerio.load(html);
    if($("div.more-product").html() != null){

      var minPrice = $("input[id='facets_prices_minprice']").attr('value');
      var maxPrice = $("input[id='facets_prices_maxprice']").attr('value');
      var updated = $("input[id='facets_prices_updated']").attr('value');
      console.log(minPrice);
      console.log(maxPrice);
      console.log(updated);
    } else
    })
  })
}*/
getArticle("/FR/fr/produits/fiche/paravent-imprime-en-bois-l-120-cm-sea-side-116151.htm");
function getArticle(url){
    requestHTML(urlmain + url).then(function(html){
      return new Promise(function(resolve, reject){

      var $ = cheerio.load(html);
      var price = $("span[class='product-price']").text();
      var ref = $("#description").children("p").eq(0).text();
      var size = $("#description").children("p").eq(1).text();
      var description = $("#description").children("p").eq(2).text();
      var img = new Array();
      $("div[class='carouselcontent'] img").each(function(i, element){
        img.push(urlmain + $(this).attr('data-src'));
      });
      var metadata = {
        url: urlmain + url,
        price: price,
        ref: ref,
        size: size,
        description: description,
        img: img
      };
      console.log(metadata);
      setTimeout(function(){ resolve(); }, Math.random()*1000);

    })
  })
}

/*
requestHTML(urlmain).then(function(html){
var $ = cheerio.load(html);
$("ul[class='sub-3 layer-mobile'] a").each(function(i, element){
var link = $(this).attr('href');
var type = link.split("/")[3];
//TODO remove certain url ? housse fauteils, matelas ect... ???
if(type == "categorie" || type == "meubles" && !(link in urlList)) urlList.push(link);
});
console.log(urlList);
})*/

/*
request(urlmain, function(error, response, html){
if(!error && response.statusCode == 200){

var $ = cheerio.load(html);

$("ul[class='sub-3 layer-mobile'] a").each(function(i, element){
var link = $(this).attr('href');
var type = link.split("/")[3];
//TODO remove certain url ? housse fauteils, matelas ect... ???
if(type == "categorie" || type == "meubles" && !(link in urlList)) urlList.push(link);
});

//TODO add enfants ??? other links ?
$("li[class='col-sm-12 col-md-4'] a").each(function(i, element){
var link = $(this).attr('href');
var type = link.split("/")[3];
if(type == "categorie" || type == "meubles" ) urlList.push(link);
});

//console.log(urlList);
} else   console.log(error);
});*/

/*
request('http://www.maisonsdumonde.com/FR/fr/meubles/canapes-fixes-20b2dff5c48607368137c32bfbafc519.htm', function(error, response, html){
if(!error && response.statusCode == 200){
var $ = cheerio.load(html);
var nbMaxPages = 0;
console.log($("script.runscript").html());
if($("div.more-product").html() != null){
var minPrice = $("input[id='facets_prices_minprice']").attr('value');
var maxPrice = $("input[id='facets_prices_maxprice']").attr('value');
var updated = $("input[id='facets_prices_updated']").attr('value');
console.log(minPrice);
console.log(maxPrice);
console.log(updated);
}
}
});*/

function getPages(url){
  if($("div.more-product").html() == null){
    return url;
  }
  console.log($("div.more-product").html());
}

function scrapArticle(url) {
  return new Promise(function(resolve, reject){

  })
}



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
