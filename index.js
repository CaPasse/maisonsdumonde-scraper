var request = require('request');
var cheerio = require('cheerio');

var lang = "fr-be";
var urlmain = "http://www.maisonsdumonde.com";
var urlPages =
["?noFavourite=true&noMea=false&search=&facets%5Bdimensions%5D%5Bminwidth%5D=&facets%5Bdimensions%5D%5Bmaxwidth%5D=&facets%5Bdimensions%5D%5Bminheight%5D=&facets%5Bdimensions%5D%5Bmaxheight%5D=&facets%5Bdimensions%5D%5Bmindepth%5D=&facets%5Bdimensions%5D%5Bmaxdepth%5D=&facets%5Bprices%5D%5Bupdated%5D=",
"&facets%5Bprices%5D%5Bminprice%5D=",
"&facets%5Bprices%5D%5Bmaxprice%5D=",
"&page="];

requestHTML(urlmain).then(function(html){
  ProcessList(CategorieList(html), GetArticles);
});

function requestHTML(url){
  return new Promise(function(resolve,reject){
    request(url, function(error, response, html){
      if(!error && response.statusCode == 200) resolve(html);
      else reject(error);
    })
  })
}

function CategorieList(html){
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

function GetArticles(url){
  return new Promise(function(resolve,reject){
    requestHTML(urlmain + url).then(function(html){
      var $ = cheerio.load(html);
      var linkLang = $('link[rel="alternate"][hreflang="'+lang+'"]').attr('href');
      var minPrice = $("input[id='facets_prices_minprice']").attr('value');
      var maxPrice = $("input[id='facets_prices_maxprice']").attr('value');
      var updated = $("input[id='facets_prices_updated']").attr('value');
      var Pageurl = linkLang + urlPages[0] + updated + urlPages[1] + minPrice + urlPages[2] + maxPrice + urlPages[3];
      GetArticlesLink(Pageurl, 0).then(function(articlesLinks){
        ProcessList(articlesLinks, getArticle).then(function() {resolve()});
      })
    })
  })
}

function GetArticlesLink(url, page){
  var articlesLinks = [];
  return new Promise(function(resolve,reject){
    requestHTML(url + page).then(function(html){
      var $ = cheerio.load(html);
      var buttons = $("section[id='results'] article a.btns");
      if(buttons.length > 0){
        buttons.each(function(){
          articlesLinks.push($(this).attr('href'));
        });
        GetArticlesLink(url, page + 1).then(function(articlesLinks_son) {
          articlesLinks = articlesLinks.concat(articlesLinks_son);
          resolve(articlesLinks);
        })
      } else resolve(articlesLinks);
    })
  })
}

function getArticle(url){
  return new Promise(function(resolve,reject){
    requestHTML(urlmain + url).then(function(html){
      var $ = cheerio.load(html);
      var name =$("h1[class='name-product']").text();
      var price = $("span[class='product-price']").text();
      var ref = $("#description").children("p").eq(0).text();
      var size = $("#description").children("p").eq(1).text();
      var description = $("#description").children("p").eq(2).text();
      if (description == '') description = $("#description").children("p").eq(3).text();
      var img = $('div[class="picture"] a').attr('href');
      var metadata = {
        url: urlmain + url,
        name: name,
        price: price,
        ref: ref,
        size: size,
        description: description,
        img: urlmain + img
      };
      console.log(metadata);
      setTimeout(function(){ resolve(); }, Math.random()*1000);
    })
  })
}

function ProcessList(list, processElement){
  return new Promise(function(resolve,reject){
    var url = list.shift();
    processElement(url).then(function(){
      if(list.length > 0) ProcessList(list, processElement).then(function() {resolve()});
      else resolve();
    })
  })
}
