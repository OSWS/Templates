describe('cli', function() {
    var bash = function(s, a, c) { return 'node sources/cli/index.js -s '+s+' -a \''+a+'\' -c \''+c+'\''; };
    
    it('mixin', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('cli/mixin.js', '[2]', '{"b": 3}'), function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/mixin.html', 'utf-8', function(error, result) {
                assert.equal(result, '123');
                done();
            });
        })
    });
    it('tag', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('cli/tag.js', '{"a": 2}'), function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/tag.html', 'utf-8', function(error, result) {
                assert.equal(result, '<div>123</div>');
                done();
            });
        })
    });
    it('data', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('cli/data.js', '{"a": 3}'), function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/data.html', 'utf-8', function(error, result) {
                assert.equal(result, '123');
                done();
            });
        })
    });
});