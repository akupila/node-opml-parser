const path   = require('path');
const fs     = require('fs');
const expect = require('expect.js');
const parse  = require('./../index');

describe('Podcast OPML parser', () => {
  const fixtures = {};

  before(function(done) {
    const fixturePath = path.join(__dirname, 'fixtures');
    fs.readdir(fixturePath, (err, files) => {
      if (err) {
        return done(err);
      }

      files
        .filter(name => fs.statSync(path.join(fixturePath, name)).isFile())
        .forEach(name => {
          var fileContent;
          try {
            fileContent = fs.readFileSync(path.join(fixturePath, name)).toString();
          } catch (readError) {
            done(readError);
            return;
          }

          fixtures[name.substr(0, name.indexOf('.'))] = fileContent;
        });

      done();
    });
  });

  it('should return expected format', function(done) {
    parse(fixtures['overcast'], (err, items) => {
      if (err) {
        return done(err);
      }

      const firstItem = items[0];
      expect(firstItem).to.have.property('title');
      expect(firstItem).to.have.property('url');
      expect(firstItem).to.have.property('feedUrl');
      expect(firstItem).to.have.property('feedType');

      done();
    });
  });

  it('should parse overcast opml', function(done) {
    parse(fixtures['overcast'], (err, items) => {
      if (err) {
        return done(err);
      }

      expect(items).to.have.length(28);

      expect(items[0]).to.eql({
        title: 'Software Engineering Radio - The Podcast for Professional Software Developers',
        url: 'http://www.se-radio.net/',
        feedUrl: 'http://feeds.feedburner.com/se-radio',
        feedType: 'rss'
      });

      done();
    });
  });

  it('should ignore duplicate items', function(done) {
    parse(fixtures['duplicates'], (err, items) => {
      if (err) {
        return done(err);
      }

      expect(items).to.have.length(1);

      expect(items[0]).to.eql({
        title: 'Duplicate 1',
        url: 'http://duplicate.net/',
        feedUrl: 'http://duplicate.com/feed.xml',
        feedType: 'rss'
      });

      done();
    });
  });

  it('should return flat structure for nested items', function(done) {
    parse(fixtures['nested'], (err, items) => {
      if (err) {
        return done(err);
      }

      expect(items).to.have.length(3);

      done();
    });
  });

  it('should allow title/text/description to be used for title', function(done) {
    parse(fixtures['names'], (err, items) => {
      if (err) {
        return done(err);
      }

      expect(items[0].title).to.be('Item 1');
      expect(items[1].title).to.be('Item 2');
      expect(items[2].title).to.be('Item 3');

      done();
    });
  });

  it('should call callback with error', function(done) {
    parse('invalid xml', (err) => {
      if (err) {
        return done();
      }

      done('Error was not set');
    });
  });
});
