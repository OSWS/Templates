describe('cli', function() {
    var bash = function(s, a, c) {
        if (fs.existsSync(__dirname+'/'+s+'.html')) fs.unlinkSync(__dirname+'/'+s+'.html');
        return 'node '+__dirname+'/oswst.js -s '+__dirname+'/'+s+'.js -a \''+a+'\' -c \''+c+'\'';
    };
    
    it('mixin', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('mixin', '[2]', '{"b": 3}'), function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/mixin.html', 'utf-8', function(error, result) {
                assert.equal(result, '123');
                done();
            });
        })
    });
    it('tag', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('tag', '[]', '{"a": 2}'), function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/tag.html', 'utf-8', function(error, result) {
                assert.equal(result, '<div>123</div>');
                done();
            });
        })
    });
    it('data', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('data', '[]', '{"a": 3}'), function(error, stdout, stderr) {
            if (error) throw error;
            fs.readFile(__dirname+'/data.html', 'utf-8', function(error, result) {
                assert.equal(result, '123');
                done();
            });
        })
    });
});