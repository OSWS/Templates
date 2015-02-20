describe('cli', function() {
    var bash = function(s, a, c) {
        if (fs.existsSync(__dirname+'/'+s+'.log')) fs.unlinkSync(__dirname+'/'+s+'.log');
        return 'node '+__dirname+'/oswst.js -s '+__dirname+'/'+s+'.js -a \''+a+'\' -c \''+c+'\' -e ".log"';
    };
    
    it('mixin', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('mixin', '[2]', "{'b': 3}"), function(error, stdout, stderr) {
            setTimeout(function() {
                if (error) throw error;
                fs.readFile(__dirname+'/mixin.log', 'utf-8', function(error, result) {
                    assert.equal(result, '123');
                    done();
                });
            }, 1000);
        })
    });
    it('tag', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('tag', '[]', "{'a': 2}"), function(error, stdout, stderr) {
            setTimeout(function() {
                if (error) throw error;
                fs.readFile(__dirname+'/tag.log', 'utf-8', function(error, result) {
                    assert.equal(result, '<div>123</div>');
                    done();
                });
            }, 1000);
        })
    });
    it('data', function(done) {
        this.timeout(5000);
        require('child_process').exec(bash('data', '[]', "{'a': 3}"), function(error, stdout, stderr) {
            setTimeout(function() {
                if (error) throw error;
                fs.readFile(__dirname+'/data.log', 'utf-8', function(error, result) {
                    assert.equal(result, '123');
                    done();
                });
            }, 1000);
        })
    });
});