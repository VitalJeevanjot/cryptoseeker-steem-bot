const steem = require('steem');
steem.api.streamTransactions('head',(error, result) => {
    if(result.operations[0][0] === 'comment')
    {
      let body = result.operations[0][1].body
      console.log(body);
    }
});
