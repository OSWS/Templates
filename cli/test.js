describe('cli', function() {
    it('mixin', function(done) {
        this.timeout(5000);
        require('child_process').exec('node cli.js -s cli/mixin.js -a \'[2]\' -c \'{"b": 3}\'', function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/mixin.html', 'utf-8', function(error, result) {
                assert.equal(result, '123');
                done();
            });
        })
    });
    it('tag', function(done) {
        this.timeout(5000);
        require('child_process').exec('node cli.js -s cli/tag.js -c \'{"a": 2}\'', function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/tag.html', 'utf-8', function(error, result) {
                assert.equal(result, '<div>123</div>');
                done();
            });
        })
    });
    it('data', function(done) {
        this.timeout(5000);
        require('child_process').exec('node cli.js -s cli/data.js -c \'{"a": 3}\'', function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/data.html', 'utf-8', function(error, result) {
                assert.equal(result, '123');
                done();
            });
        })
    });
});