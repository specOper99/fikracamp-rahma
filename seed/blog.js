var Blog = require('../models/Blog');
var mongoose = require('mongoose');
const mongoConfig = require('../configs/mongo-config')
mongoose.connect(mongoConfig, { autoIndex: true, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, });

var blog =
  [
    new Blog({
      imagePath: 'https://picsum.photos/600/600',
      title: 'This is the first post',
      description: 'hsdbnfjhksdbfhjsdbfjkndsbfjkbdsflkbdljgabdslkgbdlsjkbflkjds jnlsdnldnf lkndslf hldshf ldhflj ljdshfljsdfhglkjdfshgl kjlg fh lkjdfsglkjhfds ;ldsfhglkjsdfhg lkfdsh dlkjh lkjhdsfljg hdsflhksdjlf;jufioperhoiergldsfnlkhuerglkvjnfslirpeorjflih',
    }),
    new Blog({
      imagePath: 'https://picsum.photos/600/600',
      title: 'This is the second post',
      description: 'hsdbnfjhksdbfhjsdbfjkndsbfjkbdsflkbdljgabdslkgbdlsjkbflkjds jnlsdnldnf lkndslf hldshf ldhflj ljdshfljsdfhglkjdfshgl kjlg fh lkjdfsglkjhfds ;ldsfhglkjsdfhg lkfdsh dlkjh lkjhdsfljg hdsflhksdjlf;jufioperhoiergldsfnlkhuerglkvjnfslirpeorjflih',
    }),
    new Blog({
      imagePath: 'https://picsum.photos/600/600',
      title: 'This is the third post',
      description: 'hsdbnfjhksdbfhjsdbfjkndsbfjkbdsflkbdljgabdslkgbdlsjkbflkjds jnlsdnldnf lkndslf hldshf ldhflj ljdshfljsdfhglkjdfshgl kjlg fh lkjdfsglkjhfds ;ldsfhglkjsdfhg lkfdsh dlkjh lkjhdsfljg hdsflhksdjlf;jufioperhoiergldsfnlkhuerglkvjnfslirpeorjflih',
    }),
    new Blog({
      imagePath: 'https://picsum.photos/600/600',
      title: 'This is the fourth post',
      description: 'hsdbnfjhksdbfhjsdbfjkndsbfjkbdsflkbdljgabdslkgbdlsjkbflkjds jnlsdnldnf lkndslf hldshf ldhflj ljdshfljsdfhglkjdfshgl kjlg fh lkjdfsglkjhfds ;ldsfhglkjsdfhg lkfdsh dlkjh lkjhdsfljg hdsflhksdjlf;jufioperhoiergldsfnlkhuerglkvjnfslirpeorjflih',
    }),
  ];

for (let i = 0; i < blog.length; i++) {
  blog[i].save(function (e, r) {
    if (i === blog.length - 1) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}