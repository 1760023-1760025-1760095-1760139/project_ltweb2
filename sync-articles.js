const Parser = require('rss-parser');
const Bluebird=require('bluebird');
const parser = new Parser();
const db=require('./services/db');
const Article=require('./services/article');

const VNEXPRESS_RSS = 'https://vnexpress.net/rss/tin-moi-nhat.rss';
const THANHNIEN_RSS='https://thanhnien.vn/rss/home.rss';
const rssList=[VNEXPRESS_RSS,THANHNIEN_RSS];
const SYNC_INTERVAL = Number(process.env.SYNC_INTERVAL || 60000);

db.sync().then(async function (){
    for (;;)    {
        console.log('Start loading news...');
        await Bluebird.each(rssList,async function(rss){
            console.log('Load RSS:', rss);
            const feed = await parser.parseURL(rss);
            await Bluebird.each(feed.items, async function (item){
                if(!item.link){
                    return;
                }

                const found=await Article.findOne({
                    where: {
                        link: item.link,
                    }
                });
                if(!found){
                    console.log('Add new article', item.link);
                    await Article.create({
                        link: item.link,
                        title: item.title,
                        content: item.contentSnippet,
                        publishedAt: new Date(item.pubDate),
                    });
                }
            });
        });
    await Bluebird.delay(SYNC_INTERVAL);
}    
}).catch(console.error);
 
