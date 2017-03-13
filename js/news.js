var myRequest = new XMLHttpRequest();
var jsonResponse
var title
var desc
var link
var img

myRequest.open("GET", "https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=lgbt&count=20&offset=0&mkt=en-us&safeSearch=Moderate");
//myRequest.setRequestHeader("Host", "api.cognitive.microsoft.com"); 
myRequest.setRequestHeader("Ocp-Apim-Subscription-Key", "5b27add4b4d44ddf91ae9a6ef1831de3"); 


myRequest.addEventListener("load", reqListener);

function reqListener () {
    jsonResponse = JSON.parse(this.responseText);
    //get the json object array
    json = jsonResponse.value;
    //get all the news
    //console.log(json[1])
    for (var i = 0; i < json.length; i++) {
        newsObject = json[i];
        addNews(newsObject);
    }
}

var news = document.getElementById("news")

function addNews(newsObject){
    date = newsObject.datePublished
    title = newsObject.name;
    desc = newsObject.description;
    link = newsObject.url;
    imgUrl = newsObject.image.thumbnail.contentUrl;
    
    var newDiv = document.createElement('div');
    newDiv.className = 'newsItem';
    var img = document.createElement("img");
    img.setAttribute("src",imgUrl);
    img.setAttribute("width",100);
    img.setAttribute("height",100);
    //img.className = "col-md-3";
    var contentDiv = document.createElement("div")
    contentDiv.className = "col-md-9 content";
    contentDiv.appendChild(img)
    //add time
    var span = document.createElement("span");
    date = date.slice(0,10) + " " + date.slice(11,19)
    span.textContent = date;
    //add title
    var h3 = document.createElement("h3")
    h3.textContent = title;
    var a = document.createElement("a")
    a.setAttribute("href",link);
    a.appendChild(h3);
    contentDiv.appendChild(a);
    contentDiv.appendChild(span);
    //add content
    var p = document.createElement("p")
    p.textContent = desc;
    contentDiv.appendChild(p)
    //add to the newsItem div
    //newDiv.appendChild(img);
    //newDiv.appendChild(contentDiv);
    //
    news.appendChild(contentDiv);

}


myRequest.send();
