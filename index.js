var request = require('request');
var cheerio = require('cheerio');

var urlmain = "http://www.maisonsdumonde.com";

var urlPages =
["?noFavourite=true&noMea=false&search=&facets%5Bdimensions%5D%5Bminwidth%5D=&facets%5Bdimensions%5D%5Bmaxwidth%5D=&facets%5Bdimensions%5D%5Bminheight%5D=&facets%5Bdimensions%5D%5Bmaxheight%5D=&facets%5Bdimensions%5D%5Bmindepth%5D=&facets%5Bdimensions%5D%5Bmaxdepth%5D=&facets%5Bprices%5D%5Bupdated%5D=",
"&facets%5Bprices%5D%5Bminprice%5D=",
"&facets%5Bprices%5D%5Bmaxprice%5D=",
"&page="];

requestHTML(urlmain)
.then(function(html) {
  var list1523 = [];
  list = CategorieList(html);
  console.log(list);
  for(var i = 1; i < list.length; i++){

    console.log("url : " + list[i]);
    GetArticles(list[i]);
  }
});

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

function CategorieList(html) {
  var CatList = new Array();
  var $ = cheerio.load(html);
  $("ul[class='sub-3 layer-mobile'] a").each(function(i, element){
    var link = $(this).attr('href');
    var type = link.split("/")[3];
    //TODO remove certain url ? housse fauteils, matelas ect... ???
    if(type == "categorie" || type == "meubles" && !(link in CatList)) CatList.push(link);
  });
  return CatList;
}

function articleListing(minPrice, maxPrice, updated, page, url){
  var Pageurl = urlmain + url + urlPages[0] + updated + urlPages[1] + minPrice + urlPages[2] + maxPrice + urlPages[3] + page;

  requestHTML(Pageurl).then(function(html){
    var $ = cheerio.load(html);
    var buttons = $("section[id='results'] article a.btns");

    if(buttons.length > 0){
      buttons.each(function(){
        getArticle($(this).attr('href'));
      });
      articleListing(minPrice, maxPrice, updated, page, url);
      console.log("Pageurl : " + Pageurl);
    }
  });
}

function GetArticles(url){
  requestHTML(urlmain + url).then(function(html){
    var $ = cheerio.load(html);
    var articles = new Array();
    var minPrice = $("input[id='facets_prices_minprice']").attr('value');
    var maxPrice = $("input[id='facets_prices_maxprice']").attr('value');
    var updated = $("input[id='facets_prices_updated']").attr('value');

    var page = 0;

    articleListing(minPrice, maxPrice, updated, page, url);
  })
}

function getArticle(url){
  requestHTML(urlmain + url).then(function(html){
    var $ = cheerio.load(html);
    var name =$("h1[class='name-product']").text();
    var price = $("span[class='product-price']").text();
    var ref = $("#description").children("p").eq(0).text();
    var size = $("#description").children("p").eq(1).text();
    var description = $("#description").children("p").eq(2).text();
    var img = new Array();
    $("div[class='carouselcontent'] img").each(function(i, element){
      img.push(urlmain + $(this).attr('data-src'));
    });
    if(img == []) {
      $("div[class='carouselcontent hasVideo'] img").each(function(i, element){
        img.push(urlmain + $(this).attr('data-src'));
      });
    }
    var metadata = {
      url: urlmain + url,
      name: name,
      price: price,
      ref: ref,
      size: size,
      description: description,
      img: img
    };
    console.log(metadata);
  })
}
