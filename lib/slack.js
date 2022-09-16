(function () {
    const Base = require('mocha').reporters.base;
    const NodeSlack = require('node-slack');

    const Slack = (function () {
        function Slack(runner, options) {
            const slack = new NodeSlack(options.reporterOptions.hook_url);
            let passes = 0;
            let failures = 0;
            let messageOptions = {
                username: '',
                text: '',
                channel: options.reporterOptions.channel,
                icon_emoji: ''
            };

            runner.on("pass", function (test) {
                passes++;
                messageOptions = {
                    text: "PASS: " + test.fullTitle(),
                };

                if (!options.reporterOptions.minimal && !options.reporterOptions.failureOnly) {
                    slack.send(messageOptions);
                }
            });

            runner.on("fail", function (test, err) {
                failures++;
                messageOptions = {
                    text: "FAIL: " + test.fullTitle() + '\n   ' + err.message,
                };

                slack.send(messageOptions);
            });

            runner.once("end", function () {
                messageOptions = {
                    text: "Passed: " + passes + " Failed: " + failures,
                };

                if (!options.reporterOptions.failureOnly) {
                    slack.send(messageOptions);
                }
            });
        }

        return Slack;

    })();

    module.exports = Slack;

}).call(this);
