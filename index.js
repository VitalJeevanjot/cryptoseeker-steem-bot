const steem = require('steem');
const config = require('./config.json')
const https = require('https');
steem.api.streamTransactions('head', (error, result) => {
  if (result.operations[0][0] === 'comment') {
    let body = result.operations[0][1].body.split(/ +/g)
    if (body.indexOf('@ibar') !== -1) {
      let price = body.indexOf('!price') // !price steem or !price btc etc.
      let to = body.indexOf('!to') // !to steem btc (steem to btc)
      let info = body.indexOf('!info') // Coin info description
      if (price !== -1) {
        var url = `https://api.coingecko.com/api/v3/coins/${body[price+1]}?localization=false`;
        var m_body = '';
        https.get(url, function(res) {
          res.on('data', function(chunk) {
            m_body += chunk;
          });
          res.on('end', function() {
            try {
              var response = JSON.parse(m_body);
              steem.broadcast.comment(config.wif, result.operations[0][1].author, result.operations[0][1].permlink, 'ibar', result.operations[0][1].permlink + '-ibar-crypto-seeker', '', '`$' + response.market_data.current_price.usd.toString() + "`\n Upvote ibar's comment to Support! \n Get list of coin [ids here](https://api.coingecko.com/api/v3/coins/list) and you will use `id` names with commands to make it work.", '', function(err, result) {
              //  console.log(err, result);
              });
            } catch (e) {
              console.log('Err' + e);
            }
          });
        }).on('error', function(e) {
          console.log("Got an error: ", e);
        });
      }
    }
  }
});
