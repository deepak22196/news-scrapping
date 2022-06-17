const https = require("https");
const http = require("http");
const url = "https://time.com/";

let data = "";
let json_array = [];
async function fetch() {
  // wrapping fetching operation in promise to use async await
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// function that calls fetch() and get the page source html as response
async function getData() {
  try {
    const data = await fetch();
    // using regular expressions to get the pattern and filter out the latest news section from html
    const pattern =
      /(<li)\s+(class="latest-stories__item">)\s+(<a)\s+(href="\/)([0-9]+\/).*\s+(<h3)\s+(class="latest-stories__item-headline">).*\s+(<\/a>)/gm;

    let result = data.match(pattern);

    for (i = 0; i <= 5; i++) {
      // separating the url part and title part from each single latest news
      let pattern1 = /(\/[0-9]+\/).*"/gm;
      let urlPart = result[i].match(pattern1);
      let url = urlPart[0];

      url = url.slice(0, url.length - 1);

      let pattern2 = /(>[a-zA-Z0-9]+).*</gm;
      let headingPart = result[i].match(pattern2);
      let heading = headingPart[0];
      heading = heading.slice(1, heading.length - 1);

      // putting each news link and title in object, and then pushing that object into the resultant array
      const obj = { title: heading, link: "https://time.com" + url };
      json_array.push(obj);
    }
  } catch (error) {
    console.log("following error occured while fetching:", error);
  }
}
getData();
const server = http.createServer((req, res) => {
  if (req.url === "/getTimeStories" && req.method === "GET") {
    res.end(JSON.stringify(json_array));
  }
});

server.listen(5000, () => {
  console.log("server is listening at port 5000");
});
