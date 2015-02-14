var commander = require('commander');
 
commander
.version('0.3.0')
.option('-s, --source, --input <path>', 'Template file')
.option('-t, --target, --output, --name <path>', 'Target/destination template output file')
.parse(process.argv);