const Parser = require('rss-parser');
const parser = new Parser();
 
(async () => {
 
    const feed = await parser.parseURL('https://thanhnien.vn/rss/home.rss');
  console.log(feed.title);
 
  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link);
    console.log('- Tóm tắt: ',item.contentSnippet);
  });
 
})();