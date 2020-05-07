"use strict";
const express = require("express");
const bodyParser = require('body-parser');

module.exports = {
    name: "gateway",
    settings: {
        port: process.env.PORT || 3000,
    },
    methods: {
        initRoutes(app) {
            app.get("/temperature", this.getData);
            app.get("/set", this.postData);
        },
        getData(req, res) {
            const sensorId = req.query.id ? Number(req.query.id) : 0;
            return Promise.resolve()
                .then(() => {
                    return this.broker.call("serializer.read", { sensorId: sensorId }).then(temps => {
                        res.send(temps);
                    });
                })
                .catch(this.handleErr(res));
        },
        postData(req, res) {
            const payload = req.query.offset ? Number(req.query.offset) : 0;
            const id = req.query.id ? Number(req.query.id) : 0;
            return Promise.resolve()
            .then(() => {
                return this.broker.call('actuator.set', { offset: payload, id: id }).then(r =>
                    res.send(r)
                );
            })
            .catch(this.handleErr(res));
        },
        handleErr(res) {
            return err => {
                res.status(err.code || 500).send(err.message);
            };
        }
    },
    created() {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.app = app;
    }
};