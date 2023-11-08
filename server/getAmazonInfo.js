import axios from "axios";
import cheerio from "cheerio";
import colors from "colors";

//this will look for the information for a given keyword.
export async function getInfo(keyword) {
  console.log("Started to scrape: " + keyword);
  //here we are looking in the US amazon.
  let url = `https://www.amazon.com/s?k=${keyword}&ref=nb_sb_noss`;
  //create a list for all scraped object
  let objects = [];

  // here we are using headers to prevent the detection from amazon that we are a bot and looks like a web browser
  await axios
    .get(url, {
      headers: {
        Accept: "text/html,*/*",
        Host: "www.amazon.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
      Pragma: "no-cache",
      TE: "Trailers",
      "Upgrade-Insecure-Requests": 1,
    })
    .then((urlRes) => {
      //after we have made the request and it got a data, we can execute the code
      const $ = cheerio.load(urlRes.data);
      // amazon site has a lot of css class and ids, because of this the const will help us to locate where we're
      const parentSelector =
        ".s-desktop-width-max.s-desktop-content.s-wide-grid-style-t1.s-opposite-dir.s-wide-grid-style.sg-row";
      const childSelector = ".a-section.a-spacing-base";
      //here we will look inside parent selector and find each child, that's a card
      $(parentSelector)
        .find(childSelector)
        .each((i, element) => {
          // Process each find in childSelector
          const link = $(element)
            .find(".a-link-normal.s-no-outline")
            .attr("href");
          //we only want pages with a clickable link
          if (link) {
            //amazon will return 1x, 2x ,2.5 x images, so we split by the ,
            const photo = $(element).find(".s-image").attr("srcset").split(",");
            const description = $(element)
              .find(
                ".a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small"
              )
              .text()
              .split("<");
            // for some reason the above description it was returning a html tag along with the text
            const stars = $(element).find(".a-icon-alt").text();
            const reviews = $(element)
              .find(".a-size-base.s-underline-text")
              .text()
              .split("$");
            console.log(link.green);
            // we transformed the photo in a array, with this we could get the 1x photo
            console.log(photo[0].bgGreen);
            // the same above happened with the description
            console.log(description[0]);
            console.log(stars.yellow);
            console.log("Reviews: " + reviews[0].bgWhite);
            console.log("------------------------\n");
            let result = {
              link: link,
              photo: photo[0],
              description: description[0],
              stars: stars,
              reviews: reviews[0],
            };
            objects.push(result);
          }
        });
    });
  return objects;
}
