describe('cli', function() {
    it('template', function(done) {
        this.timeout(5000);
        if (fs.existsSync(path.join(__dirname, 'template.log'))) fs.unlinkSync(path.join(__dirname, 'template.log'));
        require('child_process').exec(
            'node '+path.join(__dirname, 'oswst.js')+' -s '+path.join(__dirname, 'template.js') + ' -e .log',
            function(error, stdout, stderr) {
                if (error) throw error;
                fs.readFile(__dirname+'/template.log', 'utf-8', function(error, result) {
                    assert.equal(result, '<div>123</div>');
                    done();
                });
            }
        )
    });
});