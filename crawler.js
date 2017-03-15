// We need this to build our post string
var https = require('https');
var fs = require('fs');
var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;

var logger = new (winston.Logger)({
transports: [
  new (winston.transports.Console)(),
  new (winston.transports.File)({ filename: './crawler.log' })
]
});

( () => {
	logger.info('process has started');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	MongoClient.connect("mongodb://localhost:27017/test", (err, db) => {
	  if(!err) {
	    logger.info('database is connected');
      	var options = {
	    	host: '112.137.129.87',
	      	port: 443,
	      	path: '/congdaotao/module/qldt/index.php?r=sinhvienLmh/admin&SinhvienLmh%5Bterm_id%5D=022&ajax=sinhvien-lmh-grid&SinhvienLmh_page=1&pageSize=100',
	      	method: 'GET'
	  	};
	    var crawler = setInterval( () => {
	    	var req = https.request(options, (res) =>
		    {
	        var output = '';
	        logger.info(options.host + ':' + res.statusCode);
	        res.setEncoding('utf8');

	        res.on('data', (chunk) => {
            logger.info("on data request");
	          output += chunk;
	        });

	        res.on('end', () => {
            logger.info("end request");
            db.collection('test').insert({updateTime: Date(), data: output});
            logger.info("data have saved");
	      	});
		    });

		    req.on('error', (err) => {
	        // res.send('error: ' + err.message);
	        console.error("Error:" + err.message);
		    });

        req.end();
	    }, 5000);
	  }
	  else {
	  	logger.error(JSON.stringify(error));
	  	return false;
	  }
	});
	return true;
})();
