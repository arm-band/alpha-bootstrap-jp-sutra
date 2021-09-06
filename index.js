const fs           = require('fs');
const sass         = require('sass');
const postcss      = require('postcss')
const autoprefixer = require('autoprefixer');

const inputfile  = `${__dirname}/src/scss/demo.scss`;
const middlefile = `${__dirname}/dist/css/demo-middle.css`;
const outputfile = `${__dirname}/dist/css/demo.css`;

sass.render(
    {
        file: inputfile,
        outFile: outputfile,
        outputStyle: 'compressed',
    },
    (err, result) => {
        if (err) {
            throw err;
        };
        fs.writeFileSync(middlefile, result.css, (error) => {
            if (error) {
                throw error;
            };
            console.log('正常に中間ファイルの書き込みが完了しました');
        });
        fs.readFile(middlefile, (error, css) => {
            if (error) {
                throw error;
            };
            postcss([
                autoprefixer
            ])
                .process(
                    css,
                    {
                        from: middlefile,
                        to: outputfile,
                    },
                )
                .then((res) => {
                    fs.writeFile(outputfile, res.css, (error) => {
                        if (error) {
                            throw error;
                        };
                        fs.unlink(middlefile, (error2) => {
                            if (error2) {
                                throw error2;
                            };
                            console.log('削除しました。');
                        });
                        console.log('正常に書き込みが完了しました');
                    });
                });
        });
    },
);